import { useState, useEffect, useRef } from "react";
import {
  revisionTopics,
  revisionContent,
  initialFavorites,
} from "../data/revisionData";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { FiSearch, FiPrinter, FiCopy, FiCheck } from "react-icons/fi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import "../utils/animations.css";

function Revise() {
  // Get user data from localStorage instead of Redux to simplify
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Student" };
  const [searchInput, setSearchInput] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isSearching, setIsSearching] = useState(true);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const searchInputRef = useRef(null);

  useEffect(() => {
    // Focus the search input when component mounts
    if (searchInputRef.current && isSearching) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsLoading(true);

    const loadingSteps = [
      "Finding relevant content...",
      "Organizing material...",
      "Preparing revision notes...",
    ];
    let stepIndex = 0;

    const loadingInterval = setInterval(() => {
      setLoadingText(loadingSteps[stepIndex]);
      stepIndex = (stepIndex + 1) % loadingSteps.length;
    }, 800);

    // Simulate loading delay
    setTimeout(() => {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingText("");

      // Find a matching topic or use the first topic
      const matchedTopic =
        revisionTopics.find((topic) =>
          topic.name.toLowerCase().includes(searchInput.toLowerCase())
        ) || revisionTopics[0];

      setSelectedTopic(matchedTopic.id);
      setIsSearching(false);
    }, 2000);
  };

  const handleTopicSelect = (topicId) => {
    setIsLoading(true);

    const loadingSteps = [
      "Loading topic content...",
      "Formatting notes...",
      "Almost ready...",
    ];
    let stepIndex = 0;

    const loadingInterval = setInterval(() => {
      setLoadingText(loadingSteps[stepIndex]);
      stepIndex = (stepIndex + 1) % loadingSteps.length;
    }, 800);

    // Simulate loading delay
    setTimeout(() => {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingText("");

      setSelectedTopic(topicId);
      setIsSearching(false);
    }, 1500);
  };

  const resetSearch = () => {
    setIsSearching(true);
    setSelectedTopic(null);
    setSearchInput("");
  };

  const toggleFavorite = (topicId) => {
    if (favorites.includes(topicId)) {
      setFavorites(favorites.filter((id) => id !== topicId));
    } else {
      setFavorites([...favorites, topicId]);
    }
  };

  const getTopicName = (topicId) => {
    const topic = revisionTopics.find((topic) => topic.id === topicId);
    return topic ? topic.name : "Unknown Topic";
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(revisionContent[selectedTopic])
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  const printContent = () => {
    const printWindow = window.open("", "_blank");

    const topicName = getTopicName(selectedTopic);
    const content = revisionContent[selectedTopic];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${topicName} - Revision Notes</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', system-ui, sans-serif;
              line-height: 1.6;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
              color: #333;
              background-color: #fafafa;
            }
            
            h1 { 
              color: #B200FF;
              background: linear-gradient(90deg, #B200FF 0%, #9000CC 100%);
              background-clip: text;
              -webkit-background-clip: text;
              color: transparent;
              border-bottom: 2px solid #B200FF;
              padding-bottom: 8px;
              margin-top: 0;
              font-weight: 700;
            }
            
            h2 { 
              color: #9900DD;
              font-weight: 600;
            }
            
            h3 { 
              color: #7700AA;
              font-weight: 500;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
              padding: 10px;
              background: linear-gradient(to right, rgba(178, 0, 255, 0.05), transparent);
              border-radius: 8px;
            }
            
            .logo {
              width: 30px;
              height: 30px;
              background: linear-gradient(135deg, #B200FF, #8000CC);
              border-radius: 50%;
              position: relative;
              margin-right: 10px;
              display: inline-block;
              vertical-align: middle;
            }
            
            .logo::after {
              content: '';
              width: 12px;
              height: 12px;
              background: white;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            
            .meta {
              color: #666;
              font-size: 14px;
              text-align: right;
              background-color: rgba(178, 0, 255, 0.05);
              padding: 8px 12px;
              border-radius: 8px;
            }
            
            .meta p {
              margin: 3px 0;
            }
            
            ul, ol {
              padding-left: 20px;
            }
            
            li {
              margin-bottom: 5px;
            }
            
            code {
              background-color: rgba(178, 0, 255, 0.1);
              color: #B200FF;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: Consolas, Monaco, 'Andale Mono', monospace;
            }
            
            blockquote {
              border-left: 4px solid #B200FF;
              padding-left: 15px;
              margin-left: 0;
              font-style: italic;
              color: #555;
            }
            
            a {
              color: #B200FF;
              text-decoration: none;
              border-bottom: 1px solid rgba(178, 0, 255, 0.3);
            }
            
            @media print {
              body {
                padding: 0;
                background-color: white;
              }
              
              .header {
                background: none;
              }
              
              .meta {
                background: none;
              }
              
              a {
                color: #B200FF;
                text-decoration: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1><span class="logo"></span> ${topicName}</h1>
            <div class="meta">
              <p><strong>CBC Revision Center</strong></p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
              <p>Time: ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          ${content}
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 10px;">
            Generated by CBC Revision Center | Study smarter, not harder
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
    setShowPrintModal(false);
  };

  return (
    <div
      className="flex flex-col h-full min-h-screen bg-black bg-opacity-20"
      style={{
        backgroundImage:
          "radial-gradient(circle at top center, rgba(178, 0, 255, 0.05) 0%, transparent 70%), linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.7))",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-black/90 to-[#190023]/80 p-4 border-b border-[#B200FF]/20"
        style={{
          boxShadow:
            "0 4px 15px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(178, 0, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-medium text-2xl flex items-center">
              <span
                className="mr-2 h-7 w-7 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full flex items-center justify-center animate-gradient"
                style={{ boxShadow: "0 0 15px rgba(178, 0, 255, 0.6)" }}
              >
                <span className="h-3 w-3 bg-white rounded-full animate-pulse"></span>
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100 animate-glow">
                Revision Center
              </span>
            </h1>
            <p className="text-sm text-gray-300 ml-8 animate-float">
              Master topics with comprehensive revision notes
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="w-full max-w-xl mx-auto">
              <h2 className="text-xl font-semibold mb-8 text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                  Hello {user.name}! What would you like to revise today?
                </span>
              </h2>

              {/* Search Input */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter a topic to study..."
                    className="w-full border bg-black/90 border-[#B200FF]/50 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B200FF]/80 text-white transition-all duration-300 hover:border-[#B200FF]/70 placeholder-gray-400/70 pr-10"
                    style={{
                      boxShadow:
                        "0 0 15px rgba(178, 0, 255, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.8)",
                      background:
                        "linear-gradient(to bottom right, rgba(25,0,30,0.9) 0%, rgba(0,0,0,0.95) 100%)",
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B200FF] hover:text-[#9900DD] transition-colors duration-300"
                  >
                    <FiSearch className="text-lg" />
                  </button>
                </div>
              </form>

              {/* Topic Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {revisionTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic.id)}
                    className="bg-gradient-to-br from-black/80 to-[#190023]/90 border border-[#B200FF]/30 hover:border-[#B200FF]/70 rounded-lg p-4 text-center transition-all text-white flex flex-col items-center justify-center space-y-2 hover:shadow-lg hover:shadow-[#B200FF]/30 transform hover:translate-y-[-1px] duration-300"
                    style={{
                      boxShadow:
                        "0 2px 10px rgba(178, 0, 255, 0.1), inset 0 0 15px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    <span className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                      {topic.name}
                    </span>
                    {favorites.includes(topic.id) && (
                      <AiFillStar
                        className="text-yellow-400 text-lg mt-2"
                        style={{
                          filter:
                            "drop-shadow(0 0 3px rgba(250, 204, 21, 0.7))",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Favorites Section */}
              {favorites.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <span className="flex items-center bg-black/40 px-2 py-1 rounded-full border border-yellow-400/30">
                      <AiFillStar
                        className="text-yellow-400 mr-2"
                        style={{
                          filter:
                            "drop-shadow(0 0 3px rgba(250, 204, 21, 0.7))",
                        }}
                      />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
                        Your Favorites
                      </span>
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {favorites.map((topicId) => (
                      <button
                        key={topicId}
                        onClick={() => handleTopicSelect(topicId)}
                        className="bg-gradient-to-br from-black/70 to-[#190023]/70 border border-yellow-400/40 hover:border-yellow-400/90 rounded-md px-3 py-1.5 text-white text-sm flex items-center transform hover:translate-y-[-1px] transition-all duration-300 hover:shadow-md hover:shadow-yellow-400/30"
                      >
                        <AiFillStar
                          className="text-yellow-400 mr-1.5 text-xs"
                          style={{
                            filter:
                              "drop-shadow(0 0 2px rgba(250, 204, 21, 0.7))",
                          }}
                        />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-100">
                          {getTopicName(topicId)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Topic Content */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <button
                  onClick={resetSearch}
                  className="bg-gradient-to-br from-black/80 to-[#190023]/80 hover:bg-opacity-80 border border-[#B200FF]/40 hover:border-[#B200FF]/70 rounded-md px-4 py-2 text-white text-sm transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-md hover:shadow-[#B200FF]/30 flex items-center"
                >
                  <span className="mr-1">←</span> Back to Topics
                </button>
                {selectedTopic && (
                  <h2 className="ml-4 text-lg font-medium">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                      {getTopicName(selectedTopic)}
                    </span>
                  </h2>
                )}
              </div>
              <div className="flex space-x-2">
                {selectedTopic && (
                  <>
                    <button
                      onClick={handleCopy}
                      className="flex items-center text-white bg-gradient-to-br from-black/80 to-[#190023]/80 hover:bg-opacity-80 border border-[#B200FF]/40 hover:border-[#B200FF]/70 rounded-md px-4 py-2 text-sm transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-md hover:shadow-[#B200FF]/30"
                    >
                      {copied ? (
                        <>
                          <FiCheck
                            className="mr-1.5 text-green-400"
                            style={{
                              filter:
                                "drop-shadow(0 0 2px rgba(74, 222, 128, 0.7))",
                            }}
                          />
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-100">
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <FiCopy className="mr-1.5" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center text-white bg-gradient-to-br from-black/80 to-[#190023]/80 hover:bg-opacity-80 border border-[#B200FF]/40 hover:border-[#B200FF]/70 rounded-md px-4 py-2 text-sm transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-md hover:shadow-[#B200FF]/30"
                    >
                      <FiPrinter className="mr-1.5" />
                      Print
                    </button>
                  </>
                )}
                <button
                  onClick={() => toggleFavorite(selectedTopic)}
                  className={`flex items-center text-white bg-gradient-to-br from-black/80 to-[#190023]/80 hover:bg-opacity-80 border ${
                    favorites.includes(selectedTopic)
                      ? "border-yellow-400/70 hover:border-yellow-400"
                      : "border-[#B200FF]/40 hover:border-[#B200FF]/70"
                  } rounded-md px-4 py-2 text-sm transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-md ${
                    favorites.includes(selectedTopic)
                      ? "hover:shadow-yellow-400/30"
                      : "hover:shadow-[#B200FF]/30"
                  }`}
                >
                  {favorites.includes(selectedTopic) ? (
                    <>
                      <AiFillStar
                        className="text-yellow-400 mr-1.5"
                        style={{
                          filter:
                            "drop-shadow(0 0 2px rgba(250, 204, 21, 0.7))",
                        }}
                      />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
                        Favorited
                      </span>
                    </>
                  ) : (
                    <>
                      <AiOutlineStar className="mr-1.5" />
                      Add to Favorites
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Revision Content */}
            <div
              className="bg-gradient-to-br from-black/90 to-[#190023]/30 border border-[#B200FF]/20 rounded-lg p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#B200FF]/40 scrollbar-track-transparent"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center top, rgba(178, 0, 255, 0.03) 0%, transparent 70%)",
                boxShadow:
                  "inset 0 0 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(178, 0, 255, 0.1)",
              }}
            >
              {selectedTopic && revisionContent[selectedTopic] ? (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    className="text-white animate-fadeIn"
                    components={{
                      h1: (props) => (
                        <h1
                          className="text-3xl font-bold mt-0 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#B200FF] to-[#9000CC] animate-gradient"
                          style={{
                            textShadow: "0 2px 10px rgba(178, 0, 255, 0.5)",
                          }}
                          {...props}
                        />
                      ),
                      h2: (props) => (
                        <h2
                          className="text-2xl font-semibold mt-6 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#B200FF]/90 to-[#9000CC]/90"
                          style={{
                            textShadow: "0 1px 5px rgba(178, 0, 255, 0.4)",
                          }}
                          {...props}
                        />
                      ),
                      h3: (props) => (
                        <h3
                          className="text-xl font-medium mt-5 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#B200FF]/80 to-[#9000CC]/80"
                          {...props}
                        />
                      ),
                      ul: (props) => (
                        <ul
                          className="list-disc list-inside mb-4 space-y-1"
                          {...props}
                        />
                      ),
                      ol: (props) => (
                        <ol
                          className="list-decimal list-inside mb-4 space-y-1"
                          {...props}
                        />
                      ),
                      li: (props) => (
                        <li
                          className="mb-1 transition-colors duration-300 hover:text-purple-300"
                          {...props}
                        />
                      ),
                      p: (props) => (
                        <p className="mb-4 leading-relaxed" {...props} />
                      ),
                      a: (props) => (
                        <a
                          className="text-[#B200FF] hover:text-[#9000CC] transition-colors duration-300 border-b border-[#B200FF]/30 hover:border-[#B200FF] pb-0.5"
                          {...props}
                        />
                      ),
                      blockquote: (props) => (
                        <blockquote
                          className="border-l-4 border-[#B200FF]/50 pl-4 italic my-4 bg-black/30 py-2 px-2 rounded-r"
                          style={{
                            boxShadow: "inset 0 1px 5px rgba(0,0,0,0.2)",
                          }}
                          {...props}
                        />
                      ),
                      code: (props) => (
                        <code
                          className="bg-black/50 text-[#B200FF] px-1 py-0.5 rounded border border-[#B200FF]/20"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {revisionContent[selectedTopic]}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#B200FF]/20 to-[#8000CC]/20 rounded-full flex items-center justify-center mb-4 animate-float">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#B200FF]/40 to-[#8000CC]/40 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-white text-center text-lg animate-glow">
                    No content available for this topic.
                  </p>
                  <p className="text-gray-400 text-center mt-2 text-sm">
                    Please select another topic from the menu
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-black/90 to-[#190023]/80 border border-[#B200FF]/50 rounded-lg p-8 max-w-md w-full shadow-lg shadow-[#B200FF]/20 backdrop-blur-md">
            <div className="flex items-center justify-center mb-4">
              <div
                className="w-3 h-3 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full animate-pulse mr-1"
                style={{ boxShadow: "0 0 5px rgba(178, 0, 255, 0.7)" }}
              ></div>
              <div
                className="w-3 h-3 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full animate-pulse mr-1"
                style={{
                  animationDelay: "0.2s",
                  boxShadow: "0 0 5px rgba(178, 0, 255, 0.7)",
                }}
              ></div>
              <div
                className="w-3 h-3 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full animate-pulse"
                style={{
                  animationDelay: "0.4s",
                  boxShadow: "0 0 5px rgba(178, 0, 255, 0.7)",
                }}
              ></div>
            </div>
            <div
              className="text-white text-center text-xl font-medium tracking-wide animate-glow"
              style={{ textShadow: "0 0 5px rgba(178, 0, 255, 0.5)" }}
            >
              {loadingText}
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="bg-gradient-to-b from-black/90 to-[#190023]/80 border border-[#B200FF]/50 rounded-lg p-8 max-w-md w-full shadow-lg"
            style={{ boxShadow: "0 0 30px rgba(178, 0, 255, 0.2)" }}
          >
            <h3 className="text-xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
              Print Revision Notes
            </h3>
            <p className="text-gray-300 mb-6">
              This will open your browser&apos;s print dialog to print or save
              the revision notes for{" "}
              <span className="text-[#B200FF]">
                {getTopicName(selectedTopic)}
              </span>
              .
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-white border border-gray-500 rounded-md hover:bg-gray-800/50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={printContent}
                className="px-4 py-2 text-white bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-md hover:from-[#A000E6] hover:to-[#7000B5] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#B200FF]/40"
                style={{ boxShadow: "0 0 10px rgba(178, 0, 255, 0.3)" }}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Revise;
