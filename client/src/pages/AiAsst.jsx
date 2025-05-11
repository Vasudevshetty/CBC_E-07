import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { subjects } from "../data/subjects";
import ReactMarkdown from "react-markdown"; // Import react-markdown

// Redux actions and thunks
import {
  sendMessage,
  getRecommendations,
  getAutocompleteSuggestions,
  addMessageToHistory,
  clearChatHistory,
} from "../store/slices/aiAssistantSlice";

// Icons
import { FiSend } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri"; // Added import for delete icon

function AiAsst() {
  const { id } = useParams(); // id from URL, might be an existing session
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    chatHistory,
    messageLoading,
    recommendations,
    recommendationsLoading,
    autocompleteSuggestions,
    autocompleteLoading,
  } = useSelector((state) => state.aiAssistant);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [completionText, setCompletionText] = useState("");
  const [showCompletions, setShowCompletions] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(id || null);
  const autoApplySuggestionTimeoutRef = useRef(null); // Ref for auto-apply timeout

  useEffect(() => {
    if (id && id !== currentSessionId) {
      setCurrentSessionId(id);
    }
  }, [id, currentSessionId]);

  const getSubjectName = useCallback((subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "General";
  }, []); // subjects is from import, so it's stable.

  const acceptCompletion = useCallback(() => {
    // Wrapped in useCallback
    if (completionText) {
      setMessage((prevMessage) => prevMessage + completionText);
      setCompletionText("");
      setShowCompletions(false);
      if (inputRef.current) {
        // Ensure inputRef.current is not null
        inputRef.current.focus();
      }
      if (autoApplySuggestionTimeoutRef.current) {
        // Clear auto-apply timer
        clearTimeout(autoApplySuggestionTimeoutRef.current);
        autoApplySuggestionTimeoutRef.current = null;
      }
    }
  }, [completionText]); // Added completionText as dependency

  // Session initialization and chat history loading
  useEffect(() => {
    if (currentSessionId) {
      // Check if chat history is empty or belongs to a different session
      if (
        !chatHistory ||
        chatHistory.length === 0 ||
        (chatHistory.length > 0 &&
          (!chatHistory[0].sessionId ||
            chatHistory[0].sessionId !== currentSessionId))
      ) {
        dispatch(clearChatHistory()); // Clear previous session's chat
        dispatch(
          sendMessage({
            sessionId: currentSessionId,
            userQuery: "",
            subject: selectedSubject,
          })
        ).then((action) => {
          if (action.payload && action.payload.subject) {
            setSelectedSubject(action.payload.subject);
          }
          // If history is empty after "send message" (which fetches history)
          // then add a welcome message.
          if (
            action.payload &&
            action.payload.chatHistory &&
            action.payload.chatHistory.length === 0
          ) {
            dispatch(
              addMessageToHistory({
                role: "assistant",
                content: `Welcome back to your session on ${getSubjectName(
                  selectedSubject
                )}! Ask me anything.`,
                sessionId: currentSessionId,
              })
            );
          }
        });
      }
    } else {
      // No active session, clear any existing chat history and add welcome message
      dispatch(clearChatHistory());
      dispatch(
        addMessageToHistory({
          role: "assistant",
          content: `Hello ${
            user?.name || "there"
          }! I'm your AI study assistant for ${getSubjectName(
            selectedSubject
          )}. How can I help you today?`,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSessionId, dispatch, user?.name, getSubjectName]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (selectedSubject) {
      dispatch(getRecommendations({ subject: selectedSubject }));
    }
  }, [selectedSubject, dispatch]);

  useEffect(() => {
    if (!message) {
      setCompletionText("");
      setShowCompletions(false);
      if (autoApplySuggestionTimeoutRef.current) {
        // Clear auto-apply timer
        clearTimeout(autoApplySuggestionTimeoutRef.current);
        autoApplySuggestionTimeoutRef.current = null;
      }
      return;
    }

    // Clear previous auto-apply timer when message changes
    if (autoApplySuggestionTimeoutRef.current) {
      clearTimeout(autoApplySuggestionTimeoutRef.current);
      autoApplySuggestionTimeoutRef.current = null;
    }

    const debounceTimeout = setTimeout(() => {
      if (message.length > 3) {
        dispatch(
          getAutocompleteSuggestions({
            userQueryPartial: message,
            subject: selectedSubject,
          })
        );
      }
    }, 1500); // Increased debounce time to 1500ms

    if (autocompleteSuggestions && autocompleteSuggestions.length > 0) {
      const userText = message.toLowerCase();
      const matchingSuggestion = autocompleteSuggestions.find((suggestion) =>
        suggestion.toLowerCase().startsWith(userText)
      );

      if (matchingSuggestion) {
        const remainingCompletion = matchingSuggestion.substring(
          userText.length
        );
        setCompletionText(remainingCompletion);
        setShowCompletions(true);

        // Set up auto-apply timer if there's a completion
        if (remainingCompletion) {
          autoApplySuggestionTimeoutRef.current = setTimeout(() => {
            acceptCompletion();
          }, 2000); // Auto-apply after 2 seconds of pause
        }
      } else {
        setCompletionText("");
        setShowCompletions(false);
      }
    } else {
      setCompletionText("");
      setShowCompletions(false);
    }

    return () => {
      clearTimeout(debounceTimeout);
      if (autoApplySuggestionTimeoutRef.current) {
        // Clear auto-apply timer on cleanup
        clearTimeout(autoApplySuggestionTimeoutRef.current);
        autoApplySuggestionTimeoutRef.current = null;
      }
    };
  }, [
    message,
    autocompleteSuggestions,
    dispatch,
    selectedSubject,
    acceptCompletion,
  ]); // Added acceptCompletion to dependencies

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const userMessage = {
      role: "user",
      content: trimmedMessage,
      sessionId: currentSessionId,
    };
    dispatch(addMessageToHistory(userMessage));
    setMessage("");
    setCompletionText("");
    setShowCompletions(false);
    if (autoApplySuggestionTimeoutRef.current) {
      // Clear auto-apply timer
      clearTimeout(autoApplySuggestionTimeoutRef.current);
      autoApplySuggestionTimeoutRef.current = null;
    }

    const loadingSteps = [
      "Analyzing question...",
      "Searching knowledge base...",
      "Formulating response...",
    ];
    let stepIndex = 0;
    setIsLoading(true);
    setLoadingText(loadingSteps[stepIndex]);

    const loadingInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % loadingSteps.length;
      setLoadingText(loadingSteps[stepIndex]);
    }, 800);

    dispatch(
      sendMessage({
        sessionId: currentSessionId,
        userQuery: trimmedMessage,
        subject: selectedSubject,
      })
    ).then((action) => {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingText("");
      if (!action.error && action.payload) {
        if (
          action.payload.sessionId &&
          action.payload.sessionId !== currentSessionId
        ) {
          setCurrentSessionId(action.payload.sessionId);
          navigate(`/ai-study-assistant/${action.payload.sessionId}`, {
            replace: true,
          });
        }
        // REMOVE Streaming logic block
        // if (action.payload.chatHistory && userQueryForStreamCheck) { ... }
      } else {
        dispatch(
          addMessageToHistory({
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            sessionId: currentSessionId,
          })
        );
      }
    });
  };

  const handleSuggestionClick = (suggestion) => {
    const userMessage = {
      role: "user",
      content: suggestion,
      sessionId: currentSessionId,
    };
    dispatch(addMessageToHistory(userMessage));
    setMessage("");
    setCompletionText("");
    setShowCompletions(false);
    if (autoApplySuggestionTimeoutRef.current) {
      // Clear auto-apply timer
      clearTimeout(autoApplySuggestionTimeoutRef.current);
      autoApplySuggestionTimeoutRef.current = null;
    }

    const loadingSteps = [
      "Analyzing question...",
      "Searching knowledge base...",
      "Formulating response...",
    ];
    let stepIndex = 0;
    setIsLoading(true);
    setLoadingText(loadingSteps[stepIndex]);

    const loadingInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % loadingSteps.length;
      setLoadingText(loadingSteps[stepIndex]);
    }, 800);

    dispatch(
      sendMessage({
        sessionId: currentSessionId,
        userQuery: suggestion,
        subject: selectedSubject,
      })
    ).then((action) => {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingText("");
      if (!action.error && action.payload) {
        if (
          action.payload.sessionId &&
          action.payload.sessionId !== currentSessionId
        ) {
          setCurrentSessionId(action.payload.sessionId);
          navigate(`/ai-study-assistant/${action.payload.sessionId}`, {
            replace: true,
          });
        }
        // REMOVE Streaming logic block
        // if (action.payload.chatHistory && userQueryForStreamCheck) { ... }
      } else {
        dispatch(
          addMessageToHistory({
            role: "assistant",
            content: "Sorry, I encountered an error processing your request.",
            sessionId: currentSessionId,
          })
        );
      }
    });
  };

  const handleSubjectChange = (e) => {
    const newSubject = e.target.value;
    setSelectedSubject(newSubject);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearChat = () => {
    dispatch(clearChatHistory());
    setMessage("");
    setCompletionText("");
    setShowCompletions(false);
    if (autoApplySuggestionTimeoutRef.current) {
      // Clear auto-apply timer
      clearTimeout(autoApplySuggestionTimeoutRef.current);
      autoApplySuggestionTimeoutRef.current = null;
    }
    setCurrentSessionId(null);
    navigate("/ai-study-assistant", { replace: true });
    dispatch(
      addMessageToHistory({
        role: "assistant",
        content: `Chat cleared. Hello ${
          user?.name || "there"
        }! How can I help you with ${getSubjectName(selectedSubject)}?`,
      })
    );
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Main Content Area - Adjusted width to full */}
      <div
        className="flex-1 flex flex-col bg-black bg-opacity-20 w-full"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23b200ff' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm20 20c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Header */}
        <div
          className="bg-gradient-to-b from-black/95 to-black/80 p-4 border-b border-[#B200FF]/40 backdrop-blur-md shadow-lg shadow-black/40"
          style={{
            height: "10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-center">
            <div>
              <h2 className="font-medium text-white text-lg flex items-center">
                <span
                  className="mr-2 h-6 w-6 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full flex items-center justify-center animate-gradient"
                  style={{ boxShadow: "0 0 15px rgba(178, 0, 255, 0.6)" }}
                >
                  <span className="h-2.5 w-2.5 bg-white rounded-full animate-pulse"></span>
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                  AI Study Assistant
                </span>
              </h2>
              <p className="text-sm text-gray-300 ml-8 animate-float">
                Your personalized learning companion
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-xs font-medium bg-gradient-to-r from-[#B200FF]/20 to-[#8000CC]/20 px-4 py-1.5 rounded-full border border-[#B200FF]/40 backdrop-blur-md shadow-inner shadow-[#B200FF]/5 mr-4">
              <span className="mr-1 text-[#B200FF]">Subject:</span>
              <span className="text-white font-semibold">
                {getSubjectName(selectedSubject)}
              </span>
            </div>
            <button
              onClick={handleClearChat}
              className="text-gray-300 hover:text-red-500 p-2 rounded-md transition-all duration-300 focus:outline-none"
              title="Clear Chat" // Added title for accessibility
            >
              <RiDeleteBin6Line size={24} />{" "}
              {/* Icon instead of text, adjusted size */}
            </button>
          </div>
        </div>
        {/* Messages Area */}
        <div
          className="h-[65%] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#B200FF]/40 scrollbar-track-transparent"
          style={{
            overflowY: "auto",
            scrollBehavior: "smooth",
            paddingBottom: "30px",
            backgroundImage:
              "radial-gradient(circle at center top, rgba(178, 0, 255, 0.03) 0%, transparent 70%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {chatHistory.map((msg) => {
            // Define the core content element
            const messageCoreContent = (
              <div
                className={`whitespace-pre-wrap leading-relaxed ${
                  msg.role === "assistant"
                    ? "text-gray-100 prose prose-sm prose-invert max-w-none" // Added prose classes for markdown
                    : "text-white font-medium"
                }`}
                style={
                  msg.role === "user"
                    ? { textShadow: "0 0 6px rgba(255, 255, 255, 0.6)" }
                    : { textShadow: "0 0 6px rgba(230, 200, 255, 0.5)" }
                }
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            );

            return (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } mb-6`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#B200FF]/80 to-[#8000CC]/80 flex items-center justify-center mr-2 mt-1 shadow-md shadow-[#B200FF]/30 flex-shrink-0">
                    <span className="text-white text-sm font-semibold">AI</span>
                  </div>
                )}

                {/* Simplified message bubble rendering */}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#B200FF] to-[#9000CC] text-white shadow-lg shadow-[#B200FF]/30 animate-fadeIn"
                      : "bg-gradient-to-b from-black/90 to-black/70 text-white border border-[#B200FF]/20 backdrop-blur-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? {
                          boxShadow:
                            "0 0 20px rgba(178, 0, 255, 0.5), 0 0 35px rgba(178, 0, 255, 0.3)",
                          position: "relative",
                          transform: "translateZ(0)",
                          borderRadius: "18px 18px 4px 18px",
                        }
                      : {
                          boxShadow:
                            "0 0 15px rgba(178, 0, 255, 0.25), 0 0 25px rgba(178, 0, 255, 0.15), 0 2px 10px rgba(0,0,0,0.2)",
                          position: "relative",
                          borderRadius: "4px 18px 18px 18px",
                        }
                  }
                >
                  {messageCoreContent}
                </div>

                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#B200FF] to-[#9000CC] flex items-center justify-center ml-2 mt-1 shadow-md shadow-[#B200FF]/30 border border-white/10 flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#B200FF]/90 to-[#8000CC]/90 flex items-center justify-center mr-2 mt-1 shadow-lg shadow-[#B200FF]/30 flex-shrink-0">
                <span className="text-white text-sm font-semibold">AI</span>
              </div>
              <div className="max-w-[70%] rounded-lg px-4 py-3 bg-gradient-to-b from-black/90 to-black/70 border border-[#B200FF]/30 backdrop-blur-sm shadow-md">
                <div className="flex items-center">
                  <div className="flex mr-3">
                    <div
                      className="w-2 h-2 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full animate-pulse mr-1"
                      style={{ boxShadow: "0 0 5px rgba(178, 0, 255, 0.7)" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full animate-pulse mr-1"
                      style={{
                        animationDelay: "0.2s",
                        boxShadow: "0 0 5px rgba(178, 0, 255, 0.7)",
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full animate-pulse"
                      style={{
                        animationDelay: "0.4s",
                        boxShadow: "0 0 5px rgba(178, 0, 255, 0.7)",
                      }}
                    ></div>
                  </div>
                  <span
                    className="text-white animate-glow font-medium tracking-wide"
                    style={{ textShadow: "0 0 5px rgba(178, 0, 255, 0.5)" }}
                  >
                    {loadingText}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Scroll anchor */}
        </div>
        {/* Input Area */}
        <div
          className="border-t border-[#B200FF]/30 bg-gradient-to-t from-black to-black/80 backdrop-blur-md shadow-lg shadow-black/40"
          style={{ height: "25%", display: "flex", flexDirection: "column" }}
        >
          {/* Suggestions */}
          <div
            className="px-4 pt-3"
            style={{
              background:
                "linear-gradient(to bottom, rgba(178, 0, 255, 0.08) 0%, rgba(25, 0, 35, 0.05) 100%)",
              borderTop: "1px solid rgba(178, 0, 255, 0.15)",
            }}
          >
            {recommendationsLoading && (
              <div className="flex items-center mb-2 text-gray-400">
                <div className="w-2 h-2 bg-[#B200FF] rounded-full animate-pulse mr-1"></div>
                <div
                  className="w-2 h-2 bg-[#B200FF] rounded-full animate-pulse mr-1"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#B200FF] rounded-full animate-pulse mr-1"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <span className="ml-2 text-xs">Loading suggestions...</span>
              </div>
            )}
            <div className="flex items-center mb-2">
              <div className="flex items-center bg-black/40 px-2 py-1 rounded-full">
                <svg
                  className="w-3 h-3 mr-1 text-[#B200FF]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="text-xs font-medium text-[#B200FF] flex items-center">
                  Suggested questions
                </span>
              </div>
            </div>
            <div className="flex overflow-x-auto space-x-2 pb-3 scrollbar-thin scrollbar-thumb-[#B200FF]/50 scrollbar-track-transparent">
              {recommendationsLoading ? (
                <div className="px-3 py-1.5 text-sm bg-black/80 text-gray-400 rounded-md border border-[#B200FF]/30">
                  Loading suggestions...
                </div>
              ) : recommendations && recommendations.length > 0 ? (
                recommendations.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-sm bg-gradient-to-r from-black/80 to-[#B200FF]/10 text-gray-200 rounded-md border border-[#B200FF]/30 hover:border-[#B200FF]/70 hover:text-white hover:shadow-lg hover:shadow-[#B200FF]/30 transition-all duration-300 whitespace-nowrap" // Removed transform hover:translate-y-[-1px]
                    style={{
                      boxShadow: "0 2px 4px rgba(178, 0, 255, 0.1)",
                    }}
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                <div className="px-3 py-1.5 text-sm bg-black/80 text-gray-400 rounded-md border border-[#B200FF]/30">
                  No suggestions available
                </div>
              )}
            </div>
          </div>
          {/* Message Input */}
          <div className="p-4 bg-gradient-to-b from-[#B200FF]/10 to-black/90">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              {" "}
              {/* Changed items-start to items-center */}
              <select
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="h-12 bg-gradient-to-b from-black/90 to-[#190023]/90 text-white border border-[#B200FF]/50 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B200FF]/80 min-w-[120px] transition-all duration-300 hover:border-[#B200FF]/70 font-medium cursor-pointer" // Added h-12, changed py-2.5 to py-3
                style={{
                  boxShadow:
                    "0 0 15px rgba(178, 0, 255, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.8)",
                }}
              >
                {subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                    className="bg-black"
                  >
                    {subject.name}
                  </option>
                ))}
              </select>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Tab" && completionText) {
                      e.preventDefault();
                      acceptCompletion();
                    }
                  }}
                  placeholder="Ask any question..."
                  className="h-12 w-full border bg-black/90 border-[#B200FF]/50 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B200FF]/80 text-white transition-all duration-300 hover:border-[#B200FF]/70 placeholder-gray-400/70 font-medium" // Added h-12
                  style={{
                    boxShadow:
                      "0 0 15px rgba(178, 0, 255, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.8)",
                    background:
                      "linear-gradient(to bottom right, rgba(25,0,30,0.9) 0%, rgba(0,0,0,0.95) 100%)",
                    letterSpacing: "0.01em",
                  }}
                />
                {autocompleteLoading && message.length > 3 ? (
                  <span className="absolute right-3 top-[10px] text-xs text-gray-400 pointer-events-none bg-black bg-opacity-70 px-2 py-0.5 rounded flex items-center">
                    <div className="w-1.5 h-1.5 bg-[#B200FF] rounded-full animate-pulse mr-1"></div>
                    <div
                      className="w-1.5 h-1.5 bg-[#B200FF] rounded-full animate-pulse mr-1"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-[#B200FF] rounded-full animate-pulse mr-1"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </span>
                ) : (
                  showCompletions && (
                    <>
                      <span className="absolute left-[16px] top-[13px] text-gray-500 pointer-events-none pr-10">
                        <span className="opacity-0">{message}</span>
                        <span>{completionText}</span>
                      </span>
                      <span className="absolute right-3 top-[10px] text-xs text-gray-500 pointer-events-none bg-black bg-opacity-70 px-1.5 py-0.5 rounded">
                        Tab ↹
                      </span>
                    </>
                  )
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || messageLoading}
                className="bg-gradient-to-br from-[#B200FF] to-[#8000CC] text-white p-3 rounded-md hover:from-[#A000E6] hover:to-[#7000B5] transition-all duration-300 disabled:bg-gray-700 hover:shadow-lg hover:shadow-[#B200FF]/40 relative overflow-hidden group glow-effect ml-2"
                style={{
                  boxShadow: "0 0 20px rgba(178, 0, 255, 0.3)",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                }}
              >
                {messageLoading ? (
                  <div className="flex items-center justify-center">
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce mr-0.5"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce mr-0.5"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                ) : (
                  <FiSend className="text-lg relative z-10 group-hover:scale-125 transition-transform" />
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-[#B200FF]/0 via-white/20 to-[#B200FF]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAsst;
