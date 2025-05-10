import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  subjects,
  mockSuggestions,
  autoCompleteMap,
  mockSessions,
  getMockResponse,
  getMockConversationHistory,
} from "../data/aiAssistantData";

// Icons
import { FiPlus, FiChevronRight, FiChevronLeft, FiSend } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

function AiAsst() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // States
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sessions, setSessions] = useState(mockSessions);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [completionText, setCompletionText] = useState("");
  const [showCompletions, setShowCompletions] = useState(false);

  // Effects
  useEffect(() => {
    // Initialize or load chat session
    if (id) {
      const session = sessions.find((s) => s.id === id);
      if (session) {
        setSelectedSubject(session.subject);
        setChatHistory(getMockConversationHistory(id));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  useEffect(() => {
    // Scroll to bottom when chat history updates
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    // Set suggestions based on selected subject
    setSuggestions(mockSuggestions[selectedSubject] || []);
  }, [selectedSubject]);

  // Auto-completion effect
  useEffect(() => {
    if (!message) {
      setCompletionText("");
      setShowCompletions(false);
      return;
    }

    // Find potential completions
    const words = message.trim().split(" ");
    const firstWord = words[0].toLowerCase();

    if (words.length === 1 && autoCompleteMap[firstWord]) {
      setCompletionText(
        autoCompleteMap[firstWord][0].substring(firstWord.length)
      );
      setShowCompletions(true);
    } else {
      setCompletionText("");
      setShowCompletions(false);
    }
  }, [message]);

  // Functions
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    // Add user message to chat
    const userMessage = { role: "user", content: trimmedMessage };
    setChatHistory([...chatHistory, userMessage]);

    // Clear input field
    setMessage("");
    setCompletionText("");
    setShowCompletions(false);

    // Simulate AI response with loading state
    setIsLoading(true);

    const loadingSteps = [
      "Analyzing question...",
      "Searching knowledge base...",
      "Formulating response...",
    ];
    let stepIndex = 0;

    const loadingInterval = setInterval(() => {
      setLoadingText(loadingSteps[stepIndex]);
      stepIndex = (stepIndex + 1) % loadingSteps.length;
    }, 800);

    // Simulate response delay
    setTimeout(() => {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingText("");

      const aiResponse = {
        role: "assistant",
        content: getMockResponse(trimmedMessage, selectedSubject),
      };

      setChatHistory((prevChat) => [...prevChat, aiResponse]);

      // Update session's lastUpdated
      updateSessionLastUpdated(id);
    }, 3000);
  };

  const createNewSession = () => {
    const newSessionId = `session-${uuidv4().substring(0, 8)}`;
    const newSession = {
      id: newSessionId,
      name: `New Study Session`,
      lastUpdated: new Date().toISOString(),
      subject: selectedSubject,
    };

    setSessions((prev) => [newSession, ...prev]);
    setChatHistory([
      {
        role: "assistant",
        content: `Hello ${
          user?.name || "there"
        }! I'm your AI study assistant for ${getSubjectName(
          selectedSubject
        )}. How can I help you today?`,
      },
    ]);

    return newSessionId;
  };

  const updateSessionLastUpdated = (sessionId) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, lastUpdated: new Date().toISOString() }
          : session
      )
    );
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();

    // Remove the session
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));

    // If current session is deleted, create a new one
    if (id === sessionId) {
      const newSessionId = createNewSession();
      navigate(`/ai-study-assistant/${newSessionId}`);
    }
  };

  const handleNewSession = () => {
    const newSessionId = createNewSession();
    navigate(`/ai-study-assistant/${newSessionId}`);
  };

  const handleSessionClick = (sessionId) => {
    navigate(`/ai-study-assistant/${sessionId}`);
  };

  const handleSuggestionClick = (suggestion) => {
    // Add user message to chat
    const userMessage = { role: "user", content: suggestion };
    setChatHistory([...chatHistory, userMessage]);

    // Simulate AI response
    setIsLoading(true);

    const loadingSteps = [
      "Analyzing question...",
      "Searching knowledge base...",
      "Formulating response...",
    ];
    let stepIndex = 0;

    const loadingInterval = setInterval(() => {
      setLoadingText(loadingSteps[stepIndex]);
      stepIndex = (stepIndex + 1) % loadingSteps.length;
    }, 800);

    // Simulate response delay
    setTimeout(() => {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingText("");

      const aiResponse = {
        role: "assistant",
        content: getMockResponse(suggestion, selectedSubject),
      };

      setChatHistory((prevChat) => [...prevChat, aiResponse]);

      // Update session's lastUpdated
      updateSessionLastUpdated(id);
    }, 3000);
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    // Update session's subject
    if (id) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === id ? { ...session, subject: e.target.value } : session
        )
      );
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
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B200FF]/50 scrollbar-track-transparent">
          {sessions.map((session) => (
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
          ))}
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
          {/* Suggestions */}
          <div
            className="px-4 pt-3"
            style={{
              background:
                "linear-gradient(to bottom, rgba(178, 0, 255, 0.08) 0%, rgba(25, 0, 35, 0.05) 100%)",
              borderTop: "1px solid rgba(178, 0, 255, 0.15)",
            }}
          >
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
              {suggestions.map((suggestion, index) => (
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
              ))}
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
                />
                {showCompletions && (
                  <>
                    <span className="absolute left-[8px] top-[10px] text-gray-500 pointer-events-none">
                      {message}
                      <span className="text-gray-500">{completionText}</span>
                    </span>
                    <span className="absolute right-3 top-[10px] text-xs text-gray-500 pointer-events-none bg-black bg-opacity-70 px-1.5 py-0.5 rounded">
                      Tab ↹
                    </span>
                  </>
                )}
              </div>{" "}
              <button
                type="submit"
                disabled={isLoading}
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
                <FiSend className="text-lg relative z-10 group-hover:scale-125 transition-transform" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#B200FF]/0 via-white/20 to-[#B200FF]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mapping of subject IDs to colors
const subjectColorMap = {
  math: "bg-blue-500",
  physics: "bg-purple-500",
  chemistry: "bg-green-500",
  biology: "bg-red-500",
  "computer-science": "bg-yellow-500",
  history: "bg-indigo-500",
  geography: "bg-pink-500",
  english: "bg-orange-500",
};

export default AiAsst;
