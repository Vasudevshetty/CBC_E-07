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
    <div className="flex h-full min-h-screen">
      {/* Sessions Sidebar */}
      <div
        className={`bg-black bg-opacity-40 h-full min-h-screen flex flex-col transition-all duration-300 border-r border-[#B200FF]/20 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        {/* New Chat Button */}
        <div className="p-3 border-b border-[#B200FF]/20">
          <button
            onClick={handleNewSession}
            className="flex items-center justify-center w-full bg-[#B200FF] hover:bg-[#9900DD] text-white rounded-md py-2 px-3 transition"
          >
            <FiPlus className="text-lg" />
            {!isSidebarCollapsed && <span className="ml-2">New Session</span>}
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
                <div
                  className={`w-2 h-2 rounded-full ${
                    subjectColorMap[session.subject] || "bg-gray-400"
                  }`}
                ></div>

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

        {/* Sidebar Toggle */}
        <div className="p-3 border-t border-[#B200FF]/20">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="flex items-center justify-center w-full text-gray-400 hover:text-white"
          >
            {isSidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
      </div>{" "}
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-h-screen bg-black bg-opacity-20">
        {/* Chat Header */}
        <div className="bg-black bg-opacity-40 p-4 border-b border-[#B200FF]/20 flex justify-between items-center">
          <div>
            <h2 className="font-medium text-white text-lg">
              AI Study Assistant
            </h2>
            <p className="text-sm text-gray-300">
              Your personalized learning companion
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-300 mr-2">Subject:</span>
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="bg-black bg-opacity-60 text-white border border-[#B200FF]/50 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#B200FF]"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Chat Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#B200FF #111",
            height: "calc(100vh - 220px)",
          }}
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 shadow-lg ${
                  msg.role === "user"
                    ? "bg-[#B200FF] bg-opacity-80 text-white"
                    : "bg-black bg-opacity-70 text-white border border-[#B200FF]/20"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}{" "}
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2.5 bg-black bg-opacity-70 border border-[#B200FF]/20">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse mr-1"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse mr-1"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse mr-2"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <span className="text-silver animate-glow font-medium">
                    {loadingText}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Scroll anchor */}
        </div>{" "}
        {/* Suggestions */}
        <div className="bg-black bg-opacity-40 px-4 pt-2">
          <div className="flex items-center mb-1">
            <span className="text-xs font-medium text-[#B200FF]">
              Suggested questions:
            </span>
          </div>
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-thin scrollbar-thumb-[#B200FF]/50 scrollbar-track-transparent">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm bg-black bg-opacity-60 text-gray-300 rounded-md border border-[#B200FF]/30 hover:bg-opacity-80 hover:border-[#B200FF]/70 hover:text-white hover:shadow-sm hover:shadow-[#B200FF]/30 transition-all whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        {/* Message Input */}
        <div className="p-4 border-t border-[#B200FF]/20 bg-black bg-opacity-40">
          <form onSubmit={handleSubmit} className="flex items-start gap-2">
            {/* Subject dropdown */}
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="bg-black bg-opacity-60 text-white border border-[#B200FF]/50 rounded-md px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B200FF] min-w-[120px]"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {/* Input with auto-completion */}
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
                className="w-full border bg-black bg-opacity-60 border-[#B200FF]/40 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B200FF] text-white"
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#B200FF] text-white p-2.5 rounded-md hover:bg-[#9900DD] transition disabled:bg-gray-700"
            >
              <FiSend className="text-lg" />
            </button>
          </form>
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
