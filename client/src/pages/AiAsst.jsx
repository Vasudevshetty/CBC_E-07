import { useState } from "react";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

function AiAsst() {
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: `Hello ${
        user?.name || "there"
      }! I'm your AI learning assistant. How can I help you today?`,
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: message };
    setChatHistory([...chatHistory, userMessage]);

    // Clear input field
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content: `I've received your message: "${message}". This is a placeholder response. In a real application, this would be handled by an AI service.`,
      };
      setChatHistory((prevChat) => [...prevChat, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Navigation Bar */}
      <NavBar />

      <div className="flex flex-1">
        {/* Sidebar - 20% */}
        <div className="w-[20%] bg-gray-900">
          <SideBar />
        </div>

        {/* Main Content - 80% */}
        <div className="w-[80%] p-6 flex flex-col">
          <h1 className="text-2xl font-semibold mb-6">AI Learning Assistant</h1>

          <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
            {/* Chat header */}
            <div className="bg-blue-600 text-white p-4">
              <h2 className="font-medium">AI Assistant</h2>
              <p className="text-sm opacity-90">
                Ask me anything about your learning journey
              </p>
            </div>

            {/* Chat messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ minHeight: "300px", maxHeight: "500px" }}
            >
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-lg mb-2">Learning Tips</h3>
              <p className="text-sm text-gray-600">
                Ask for personalized learning recommendations based on your
                goals.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-lg mb-2">Code Help</h3>
              <p className="text-sm text-gray-600">
                Get guidance with coding problems or project architecture
                questions.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-lg mb-2">Career Advice</h3>
              <p className="text-sm text-gray-600">
                Ask about industry trends, interview preparation, or career
                transitions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAsst;
