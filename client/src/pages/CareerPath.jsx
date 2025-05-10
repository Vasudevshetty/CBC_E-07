import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  careerGoals,
  qualificationLevels,
  careerSuggestions,
} from "../data/careerPathData";
import "katex/dist/katex.min.css";

function CareerPath() {
  // States
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedQualification, setSelectedQualification] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  // Refs
  const formRef = useRef(null);

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedGoal || !selectedQualification) return;

    setIsLoading(true);

    const loadingSteps = [
      "Analyzing career goals...",
      "Evaluating qualifications...",
      "Preparing personalized suggestions...",
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
      setShowResults(true);
    }, 2000);
  };

  // Reset to input form
  const handleReset = () => {
    setShowResults(false);
  };

  // Get the emoji for the selected goal
  const getGoalEmoji = (goalId) => {
    const goal = careerGoals.find((g) => g.id === goalId);
    return goal ? goal.emoji : "🎯";
  };

  // Get name of the selected goal
  const getGoalName = (goalId) => {
    const goal = careerGoals.find((g) => g.id === goalId);
    return goal ? goal.name : "Unknown Goal";
  };

  // Get name of the selected qualification
  const getQualificationName = (qualificationId) => {
    const qualification = qualificationLevels.find(
      (q) => q.id === qualificationId
    );
    return qualification ? qualification.name : "Unknown Qualification";
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-black bg-opacity-20">
      {/* Header */}
      <div className="bg-black bg-opacity-40 p-4 border-b border-[#B200FF]/20">
        <h1 className="font-medium text-white text-2xl">Career Path Advisor</h1>
        <p className="text-sm text-gray-300">
          Get personalized career guidance based on your goals and
          qualifications
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!showResults ? (
          <div className="w-full max-w-lg mx-auto bg-black bg-opacity-40 border border-[#B200FF]/20 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              Find Your Career Path
            </h2>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Career Goal Selection */}
              <div>
                <label
                  htmlFor="career-goal"
                  className="block text-lg font-medium text-white mb-2"
                >
                  What is your career goal? 🎯
                </label>
                <select
                  id="career-goal"
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="w-full bg-black bg-opacity-60 text-white border border-[#B200FF]/40 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B200FF]"
                  required
                >
                  <option value="">Select your goal</option>
                  {careerGoals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.emoji} {goal.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Qualification Selection */}
              <div>
                <label
                  htmlFor="qualification"
                  className="block text-lg font-medium text-white mb-2"
                >
                  What is your current qualification? 📚
                </label>
                <select
                  id="qualification"
                  value={selectedQualification}
                  onChange={(e) => setSelectedQualification(e.target.value)}
                  className="w-full bg-black bg-opacity-60 text-white border border-[#B200FF]/40 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B200FF]"
                  required
                >
                  <option value="">Select your qualification</option>
                  {qualificationLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedGoal || !selectedQualification}
                className="w-full bg-[#B200FF] hover:bg-[#9900DD] text-white font-medium py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Career Path Suggestions
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            {/* Path Result */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleReset}
                className="bg-black bg-opacity-60 hover:bg-opacity-80 border border-[#B200FF]/40 rounded-md px-4 py-2 text-white text-sm"
              >
                ← Back to Selection
              </button>

              <div className="flex items-center">
                <span className="text-lg text-white">
                  {getGoalEmoji(selectedGoal)} {getGoalName(selectedGoal)} |{" "}
                  {getQualificationName(selectedQualification)}
                </span>
              </div>
            </div>

            {/* Career Path Content */}
            <div className="bg-black bg-opacity-40 border border-[#B200FF]/20 rounded-lg p-6 overflow-y-auto">
              {careerSuggestions[selectedGoal] &&
              careerSuggestions[selectedGoal][selectedQualification] ? (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
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
                      h4: (props) => (
                        <h4
                          className="text-lg font-medium mt-4 mb-2 text-[#B200FF]/70"
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
                    {careerSuggestions[selectedGoal][selectedQualification]}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-white text-center py-12">
                  <p className="text-xl">
                    No suggestions available for this combination.
                  </p>
                  <p className="mt-4">
                    Please try a different goal or qualification level.
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
    </div>
  );
}

export default CareerPath;
