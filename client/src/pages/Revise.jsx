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
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 { 
              color: #B200FF;
              border-bottom: 2px solid #B200FF;
              padding-bottom: 8px;
            }
            h2 { color: #9900DD; }
            h3 { color: #7700AA; }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .meta {
              color: #666;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${topicName}</h1>
            <div class="meta">
              <p>Printed from CBC Revision Center</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          ${content}
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
    <div className="flex flex-col h-full min-h-screen bg-black bg-opacity-20">
      {/* Header */}
      <div className="bg-black bg-opacity-40 p-4 border-b border-[#B200FF]/20">
        <h1 className="font-medium text-white text-2xl">Revision Center</h1>
        <p className="text-sm text-gray-300">
          Master topics with comprehensive revision notes
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="w-full max-w-xl mx-auto">
              <h2 className="text-xl font-semibold text-white mb-8 text-center">
                Hello {user.name}! What would you like to revise today?
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
                    className="w-full bg-black bg-opacity-60 text-white border border-[#B200FF]/40 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B200FF] pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B200FF] hover:text-[#9900DD]"
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
                    className="bg-black bg-opacity-60 border border-[#B200FF]/30 hover:border-[#B200FF]/70 rounded-lg p-4 text-center transition-all text-white flex flex-col items-center justify-center space-y-2 hover:bg-black hover:bg-opacity-80"
                  >
                    <span className="text-lg">{topic.name}</span>
                    {favorites.includes(topic.id) && (
                      <AiFillStar className="text-yellow-400 text-lg mt-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Favorites Section */}
              {favorites.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <AiFillStar className="text-yellow-400 mr-2" /> Your
                    Favorites
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {favorites.map((topicId) => (
                      <button
                        key={topicId}
                        onClick={() => handleTopicSelect(topicId)}
                        className="bg-black bg-opacity-80 border border-yellow-400/50 hover:border-yellow-400 rounded-md px-3 py-1.5 text-white text-sm flex items-center"
                      >
                        <AiFillStar className="text-yellow-400 mr-1.5 text-xs" />
                        {getTopicName(topicId)}
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
                  className="bg-black bg-opacity-60 hover:bg-opacity-80 border border-[#B200FF]/40 rounded-md px-4 py-2 text-white text-sm"
                >
                  ← Back to Topics
                </button>
                {selectedTopic && (
                  <h2 className="ml-4 text-lg font-medium text-white">
                    {getTopicName(selectedTopic)}
                  </h2>
                )}
              </div>
              <div className="flex space-x-2">
                {selectedTopic && (
                  <>
                    <button
                      onClick={handleCopy}
                      className="flex items-center text-white bg-black bg-opacity-60 hover:bg-opacity-80 border border-[#B200FF]/40 rounded-md px-4 py-2 text-sm"
                    >
                      {copied ? (
                        <>
                          <FiCheck className="mr-1.5 text-green-400" />
                          Copied!
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
                      className="flex items-center text-white bg-black bg-opacity-60 hover:bg-opacity-80 border border-[#B200FF]/40 rounded-md px-4 py-2 text-sm"
                    >
                      <FiPrinter className="mr-1.5" />
                      Print
                    </button>
                  </>
                )}
                <button
                  onClick={() => toggleFavorite(selectedTopic)}
                  className={`flex items-center text-white bg-black bg-opacity-60 hover:bg-opacity-80 border ${
                    favorites.includes(selectedTopic)
                      ? "border-yellow-400"
                      : "border-[#B200FF]/40"
                  } rounded-md px-4 py-2 text-sm transition-all duration-300`}
                >
                  {favorites.includes(selectedTopic) ? (
                    <>
                      <AiFillStar className="text-yellow-400 mr-1.5" />
                      Favorited
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
            <div className="bg-black bg-opacity-40 border border-[#B200FF]/20 rounded-lg p-6 overflow-y-auto flex-1">
              {selectedTopic && revisionContent[selectedTopic] ? (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    className="text-white"
                    components={{
                      h1: (props) => (
                        <h1
                          className="text-3xl font-bold mt-0 mb-6 text-[#B200FF]"
                          {...props}
                        />
                      ),
                      h2: (props) => (
                        <h2
                          className="text-2xl font-semibold mt-6 mb-4 text-[#B200FF]/90"
                          {...props}
                        />
                      ),
                      h3: (props) => (
                        <h3
                          className="text-xl font-medium mt-5 mb-3 text-[#B200FF]/80"
                          {...props}
                        />
                      ),
                      ul: (props) => (
                        <ul className="list-disc list-inside mb-4" {...props} />
                      ),
                      ol: (props) => (
                        <ol
                          className="list-decimal list-inside mb-4"
                          {...props}
                        />
                      ),
                      li: (props) => <li className="mb-1" {...props} />,
                      p: (props) => <p className="mb-4" {...props} />,
                      a: (props) => (
                        <a
                          className="text-[#B200FF] hover:underline"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {revisionContent[selectedTopic]}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-white text-center">
                  No content available for this topic.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-80 border border-[#B200FF]/50 rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-[#B200FF] rounded-full animate-pulse mr-1"></div>
              <div
                className="w-3 h-3 bg-[#B200FF] rounded-full animate-pulse mr-1"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-[#B200FF] rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <div className="text-white text-center text-xl">{loadingText}</div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-80 border border-[#B200FF]/50 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl text-white font-medium mb-4">
              Print Revision Notes
            </h3>
            <p className="text-gray-300 mb-6">
              This will open your browser&apos;s print dialog to print or save
              the revision notes for {getTopicName(selectedTopic)}.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-white border border-gray-500 rounded-md hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={printContent}
                className="px-4 py-2 text-white bg-[#B200FF] rounded-md hover:bg-[#9900DD]"
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
