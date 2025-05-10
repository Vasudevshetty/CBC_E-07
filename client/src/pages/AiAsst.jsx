import { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { subjects, subjectColorMap } from "../data/subjects";

// Redux actions and thunks
import {
  sendMessage,
  getSessions,
  createSession,
  deleteSession,
  getRecommendations,
  getAutocompleteSuggestions,
  // setCurrentSession, // Not currently used but might be needed in future
  // setChatHistory,    // Not currently used but might be needed in future
  addMessageToHistory,
  clearChatHistory,
  updateSessions,
} from "../store/slices/aiAssistantSlice";

// Icons
import { FiPlus, FiChevronRight, FiChevronLeft, FiSend } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

function AiAsst() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    sessions,
    sessionsLoading,
    chatHistory,
    // Use messageLoading in loading indicators
    messageLoading,
    recommendations,
    recommendationsLoading,
    autocompleteSuggestions,
    // Use autocompleteLoading in loading indicators
    autocompleteLoading,
  } = useSelector((state) => state.aiAssistant);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // Local states
  const [message, setMessage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [completionText, setCompletionText] = useState("");
  const [showCompletions, setShowCompletions] = useState(false);
  // Load sessions on component mount
  useEffect(() => {
    dispatch(getSessions());
  }, [dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createNewSession = useCallback(() => {
    // Create a temporary session ID to return immediately
    const tempSessionId = `session-${Date.now()}`;

    // Create a new temporary session object
    const newSession = {
      id: tempSessionId,
      name: `New Study Session`,
      lastUpdated: new Date().toISOString(),
      subject: selectedSubject,
    };

    // Update sessions in Redux with temporary session
    dispatch(updateSessions([newSession, ...(sessions || [])]));

    // Clear and initialize chat history
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

    // Also call the API to create a session and update when response is received
    dispatch(createSession(user?._id || "anonymous"))
      .then((action) => {
        if (action.payload && !action.error) {
          const apiSessionId = action.payload.id || action.payload.session_id;

          // Update the URL if needed
          if (apiSessionId && apiSessionId !== tempSessionId) {
            navigate(`/ai-study-assistant/${apiSessionId}`, { replace: true });
          }
        }
      })
      .catch((err) => {
        console.error("Failed to create new session:", err);
        // We already have a temporary session, so no further action needed
      });

    return tempSessionId;
  });

  // Handle session initialization
  useEffect(() => {
    // Skip if sessions aren't loaded yet
    if (sessionsLoading || !sessions || sessions.length === 0) return;

    if (id) {
      const session = sessions.find((s) => s.id === id);
      if (session) {
        // Set subject from existing session
        setSelectedSubject(session.subject || subjects[0].id);

        // Fetch chat history if not loaded
        if (!chatHistory || chatHistory.length === 0) {
          dispatch(
            sendMessage({
              sessionId: id,
              userQuery: "", // Empty query to just get history
              subject: session.subject || subjects[0].id,
            })
          );
        }
      } else {
        // If session not found, create a new one
        const newSessionId = createNewSession();
        navigate(`/ai-study-assistant/${newSessionId}`);
      }
    } else {
      // No ID in URL, create new session
      const newSessionId = createNewSession();
      navigate(`/ai-study-assistant/${newSessionId}`);
    }
  }, [
    id,
    sessions,
    sessionsLoading,
    navigate,
    dispatch,
    chatHistory,
    createNewSession,
  ]);

  useEffect(() => {
    // Scroll to bottom when chat history updates
    scrollToBottom();
  }, [chatHistory]);

  // Load recommendations when subject changes
  useEffect(() => {
    if (selectedSubject) {
      dispatch(getRecommendations({ subject: selectedSubject }));
    }
  }, [selectedSubject, dispatch]);

  // Auto-completion effect for text input with debouncing
  useEffect(() => {
    if (!message) {
      setCompletionText("");
      setShowCompletions(false);
      return;
    }

    // Create debounced function
    const debounceTimeout = setTimeout(() => {
      // Only get suggestions if user has typed enough characters
      if (message.length > 3) {
        dispatch(
          getAutocompleteSuggestions({
            userQueryPartial: message,
            subject: selectedSubject,
          })
        );
      }
    }, 500); // 500ms delay

    // Use any available autocomplete suggestions
    if (autocompleteSuggestions && autocompleteSuggestions.length > 0) {
      const userText = message.toLowerCase();
      // Find a suggestion that starts with the user's text
      const matchingSuggestion = autocompleteSuggestions.find((suggestion) =>
        suggestion.toLowerCase().startsWith(userText)
      );

      if (matchingSuggestion) {
        setCompletionText(matchingSuggestion.substring(userText.length));
        setShowCompletions(true);
      } else {
        setCompletionText("");
        setShowCompletions(false);
      }
    } else {
      setCompletionText("");
      setShowCompletions(false);
    }

    // Cleanup timeout on component unmount or when dependencies change
    return () => clearTimeout(debounceTimeout);
  }, [message, autocompleteSuggestions, dispatch, selectedSubject]);

  // Message sending handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !id) return;

    // Add user message to chat locally
    const userMessage = { role: "user", content: trimmedMessage };
    dispatch(addMessageToHistory(userMessage));

    // Clear input field
    setMessage("");
    setCompletionText("");
    setShowCompletions(false);

    // Set loading state with steps
    const loadingSteps = [
      "Analyzing question...",
      "Searching knowledge base...",
      "Formulating response...",
    ];
    let stepIndex = 0;
    setIsLoading(true);

    const loadingInterval = setInterval(() => {
      setLoadingText(loadingSteps[stepIndex]);
      stepIndex = (stepIndex + 1) % loadingSteps.length;
    }, 800);

    // Send message to API
    dispatch(
      sendMessage({
        sessionId: id,
        userQuery: trimmedMessage,
        subject: selectedSubject,
      })
    ).then((action) => {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingText("");

      if (!action.error) {
        // Add AI response to chat
        const aiResponse = {
          role: "assistant",
          content: action.payload.response,
        };
        dispatch(addMessageToHistory(aiResponse));

        // Update session's lastUpdated time
        const updatedSessions = sessions.map((session) =>
          session.id === id
            ? { ...session, lastUpdated: new Date().toISOString() }
            : session
        );
        dispatch(updateSessions(updatedSessions));
      }
    });
  };
  const updateSessionLastUpdated = (sessionId) => {
    const updatedSessions = sessions.map((session) =>
      session.id === sessionId
        ? { ...session, lastUpdated: new Date().toISOString() }
        : session
    );
    dispatch(updateSessions(updatedSessions));
  };
  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();

    // Delete the session via API
    dispatch(deleteSession({ userId: user?._id || "anonymous", session_id: sessionId }))
      .then(() => {
        // If current session is deleted, create a new one
        if (id === sessionId) {
          const newSessionId = createNewSession();
          navigate(`/ai-study-assistant/${newSessionId}`);
        }
      })
      .catch((err) => {
        console.error("Failed to delete session:", err);
        // Fallback to local session deletion
        const updatedSessions = sessions.filter(
          (session) => session.id !== sessionId
        );
        dispatch(updateSessions(updatedSessions));

        if (id === sessionId) {
          const newSessionId = createNewSession();
          navigate(`/ai-study-assistant/${newSessionId}`);
        }
      });
  };

  const handleNewSession = () => {
    const newSessionId = createNewSession();
    navigate(`/ai-study-assistant/${newSessionId}`);
  };

  const handleSessionClick = (sessionId) => {
    navigate(`/ai-study-assistant/${sessionId}`);
  };
  const handleSuggestionClick = (suggestion) => {
    if (!id) return;

    // Add user message to chat locally
    const userMessage = { role: "user", content: suggestion };
    dispatch(addMessageToHistory(userMessage));

    // Set loading state with steps
    const loadingSteps = [
      "Analyzing question...",
      "Searching knowledge base...",
      "Formulating response...",
    ];
    let stepIndex = 0;
    setIsLoading(true);

    const loadingInterval = setInterval(() => {
      setLoadingText(loadingSteps[stepIndex]);
      stepIndex = (stepIndex + 1) % loadingSteps.length;
    }, 800);

    // Send message to API
    dispatch(
      sendMessage({
        sessionId: id,
        userQuery: suggestion,
        subject: selectedSubject,
      })
    ).then((action) => {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingText("");

      if (!action.error) {
        // Add AI response to chat
        const aiResponse = {
          role: "assistant",
          content: action.payload.response,
        };
        dispatch(addMessageToHistory(aiResponse));

        // Update session's lastUpdated time
        updateSessionLastUpdated(id);
      }
    });
  };
  const handleSubjectChange = (e) => {
    const newSubject = e.target.value;
    setSelectedSubject(newSubject);

    // Update session's subject if we have an active session
    if (id && sessions) {
      const updatedSessions = sessions.map((session) =>
        session.id === id ? { ...session, subject: newSubject } : session
      );
      dispatch(updateSessions(updatedSessions));
    }
  };

  const acceptCompletion = () => {
    if (completionText) {
      const words = message.trim().split(" ");
      const firstWord = words[0].toLowerCase();
      setMessage(firstWord + completionText);
      setCompletionText("");
      setShowCompletions(false);
      inputRef.current.focus();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "General";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar */}
      <div
        className={`h-full bg-black bg-opacity-70 flex flex-col border-r border-[#B200FF]/20 backdrop-blur-md transition-all duration-300 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        style={{
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* New Chat Button - aligned with header (72px height) */}
        <div
          className="p-4 border-b border-[#B200FF]/20"
          style={{ height: "10%", display: "flex", alignItems: "center" }}
        >
          <button
            onClick={handleNewSession}
            className="flex items-center justify-center w-full bg-gradient-to-r from-[#B200FF] to-[#9000CC] hover:from-[#A000E6] hover:to-[#7000B5] text-white rounded-md py-2 px-3 transition-all duration-300 shadow-md shadow-[#B200FF]/30 group"
          >
            <FiPlus className="text-lg group-hover:scale-110 transition-transform" />
            {!isSidebarCollapsed && (
              <span className="ml-2 font-medium">New Session</span>
            )}
          </button>
        </div>{" "}
        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B200FF]/50 scrollbar-track-transparent">
          {sessionsLoading ? (
            <div className="flex justify-center items-center h-20 text-gray-400">
              Loading sessions...
            </div>
          ) : sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className={`flex items-center justify-between p-3 cursor-pointer transition hover:bg-black hover:bg-opacity-20 ${
                  id === session.id
                    ? "bg-black bg-opacity-30 border-l-2 border-[#B200FF]"
                    : ""
                }`}
              >
                <div className="flex items-center overflow-hidden">
                  {/* Subject color indicator */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        subjectColorMap[session.subject] || "bg-gray-400"
                      } shadow-md shadow-[#B200FF]/30 ring-1 ring-white/20`}
                      style={{
                        animation:
                          id === session.id ? "pulse 2s infinite" : "none",
                        boxShadow:
                          id === session.id
                            ? "0 0 5px 2px rgba(178, 0, 255, 0.3)"
                            : "",
                      }}
                    ></div>
                  </div>

                  {!isSidebarCollapsed && (
                    <div className="ml-3 truncate">
                      <div className="text-white truncate text-sm">
                        {session.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {formatDate(session.lastUpdated)}
                      </div>
                    </div>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <RiDeleteBin6Line />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-20 text-gray-400">
              No sessions found
            </div>
          )}
        </div>
        {/* Sidebar Toggle - aligned with input bar (145px height) */}
        <div
          className="p-3 border-t border-[#B200FF]/20"
          style={{
            height: "25%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="flex items-center justify-center w-full text-gray-400 hover:text-[#B200FF] transition-all duration-300 hover:bg-black/30 py-1.5 rounded"
          >
            {isSidebarCollapsed ? (
              <div className="flex items-center">
                <FiChevronRight className="animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center">
                <FiChevronLeft />
                <span className="text-xs ml-1">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col bg-black bg-opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23b200ff' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm20 20c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundAttachment: "fixed",
        }}
      >
        {" "}
        {/* Header - 72px height */}
        <div
          className="bg-gradient-to-b from-black/95 to-black/80 p-4 border-b border-[#B200FF]/40 backdrop-blur-md shadow-lg shadow-black/40"
          style={{
            height: "10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="flex justify-between items-center w-full">
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
            <div className="text-xs font-medium bg-gradient-to-r from-[#B200FF]/20 to-[#8000CC]/20 px-4 py-1.5 rounded-full border border-[#B200FF]/40 backdrop-blur-md shadow-inner shadow-[#B200FF]/5">
              <span className="mr-1 text-[#B200FF]">Subject:</span>
              <span className="text-white font-semibold">
                {getSubjectName(selectedSubject)}
              </span>
            </div>
          </div>
        </div>
        {/* Messages Area - Flex-grow */}
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
          {" "}
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } mb-6`}
            >
              {" "}
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#B200FF]/80 to-[#8000CC]/80 flex items-center justify-center mr-2 mt-1 shadow-md shadow-[#B200FF]/30">
                  <span className="text-white text-sm font-semibold">AI</span>
                </div>
              )}{" "}
              <div
                className={`max-w-[70%] rounded-lg px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-[#B200FF] to-[#9000CC] text-white shadow-lg shadow-[#B200FF]/30 animate-fadeIn"
                    : "bg-gradient-to-b from-black/90 to-black/70 text-white border border-[#B200FF]/20 backdrop-blur-sm"
                }`}
                style={
                  msg.role === "user"
                    ? {
                        boxShadow: "0 0 15px rgba(178, 0, 255, 0.4)",
                        position: "relative",
                        transform: "translateZ(0)", // Hardware acceleration
                        borderRadius: "18px 18px 4px 18px",
                      }
                    : {
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                        borderRadius: "4px 18px 18px 18px",
                      }
                }
              >
                <div
                  className={`whitespace-pre-wrap leading-relaxed ${
                    msg.role === "assistant"
                      ? "text-gray-100"
                      : "text-white font-medium"
                  }`}
                >
                  {msg.content}
                </div>
              </div>{" "}
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#B200FF] to-[#9000CC] flex items-center justify-center ml-2 mt-1 shadow-md shadow-[#B200FF]/30 border border-white/10">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
          ))}{" "}
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#B200FF]/90 to-[#8000CC]/90 flex items-center justify-center mr-2 mt-1 shadow-lg shadow-[#B200FF]/30">
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
          )}{" "}
          <div ref={messagesEndRef} /> {/* Scroll anchor */}
        </div>
        {/* Input Area - 145px height */}
        <div
          className="border-t border-[#B200FF]/30 bg-gradient-to-t from-black to-black/80 backdrop-blur-md shadow-lg shadow-black/40"
          style={{ height: "25%", display: "flex", flexDirection: "column" }}
        >
          {/* Suggestions */}{" "}
          <div
            className="px-4 pt-3"
            style={{
              background:
                "linear-gradient(to bottom, rgba(178, 0, 255, 0.08) 0%, rgba(25, 0, 35, 0.05) 100%)",
              borderTop: "1px solid rgba(178, 0, 255, 0.15)",
            }}
          >
            {/* Add loading indicator for recommendations */}
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
            </div>{" "}
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
                    className="px-3 py-1.5 text-sm bg-gradient-to-r from-black/80 to-[#B200FF]/10 text-gray-200 rounded-md border border-[#B200FF]/30 hover:border-[#B200FF]/70 hover:text-white hover:shadow-lg hover:shadow-[#B200FF]/30 transition-all duration-300 whitespace-nowrap transform hover:translate-y-[-1px]"
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
          </div>{" "}
          {/* Message Input */}
          <div className="p-4 bg-gradient-to-b from-[#B200FF]/10 to-black/90">
            <form onSubmit={handleSubmit} className="flex items-start gap-2">
              {/* Subject dropdown */}{" "}
              <select
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="bg-gradient-to-b from-black/90 to-[#190023]/90 text-white border border-[#B200FF]/50 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B200FF]/80 min-w-[120px] transition-all duration-300 hover:border-[#B200FF]/70 font-medium cursor-pointer"
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
              {/* Input with auto-completion */}
              <div className="flex-1 relative">
                {" "}
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
                  className="w-full border bg-black/90 border-[#B200FF]/50 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B200FF]/80 text-white transition-all duration-300 hover:border-[#B200FF]/70 placeholder-gray-400/70 font-medium"
                  style={{
                    boxShadow:
                      "0 0 15px rgba(178, 0, 255, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.8)",
                    background:
                      "linear-gradient(to bottom right, rgba(25,0,30,0.9) 0%, rgba(0,0,0,0.95) 100%)",
                    letterSpacing: "0.01em",
                  }}
                />{" "}
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
                      <span className="absolute left-[8px] top-[10px] text-gray-500 pointer-events-none">
                        {message}
                        <span className="text-gray-500">{completionText}</span>
                      </span>
                      <span className="absolute right-3 top-[10px] text-xs text-gray-500 pointer-events-none bg-black bg-opacity-70 px-1.5 py-0.5 rounded">
                        Tab ↹
                      </span>
                    </>
                  )
                )}
              </div>{" "}
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
                <span className="absolute inset-0 bg-gradient-to-r from-[#B200FF]/0 via-white/20 to-[#B200FF]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// We're using the imported subjectColorMap from "../data/subjects"

export default AiAsst;
