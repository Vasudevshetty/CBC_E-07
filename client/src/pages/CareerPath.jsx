import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { careerGoals, qualificationLevels } from "../data/careerPathData";
import "katex/dist/katex.min.css";
import "../utils/animations.css";
import {
  getCareerPath,
  clearCareerPath,
} from "../store/slices/careerPathSlice";

function CareerPath() {
  // States
  const [selectedGoal, setSelectedGoal] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [activeTab, setActiveTab] = useState("explore");

  const dispatch = useDispatch();

  // Get user from Redux state
  const { user } = useSelector((state) => state.auth);
  const {
    careerPathData,
    loading: isLoading,
    error,
  } = useSelector((state) => state.careerPath);

  // Determine qualification level based on user profile or default to bachelor's
  const userQualification = user?.qualification || "bachelors";

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearCareerPath());
    };
  }, [dispatch]);

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedGoal) return;

    const loadingSteps = [
      "Analyzing career goals...",
      "Evaluating your qualifications...",
      "Preparing personalized suggestions...",
    ];
    let stepIndex = 0;

    const loadingInterval = setInterval(() => {
      setLoadingText(loadingSteps[stepIndex]);
      stepIndex = (stepIndex + 1) % loadingSteps.length;
    }, 800);

    // Get career goal name
    const goalName = getGoalName(selectedGoal);

    // Get qualification name
    const qualificationName = getQualificationName(userQualification);

    // Dispatch the thunk to get the career path
    dispatch(
      getCareerPath({
        goal: goalName,
        currentQualification: qualificationName,
        learnerType: "slow",
      })
    ).then(() => {
      clearInterval(loadingInterval);
      setLoadingText("");
      setShowResults(true);
    });
  };

  // Reset to input form
  const handleReset = () => {
    setShowResults(false);
    dispatch(clearCareerPath());
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

  // Get name of the user's qualification
  const getQualificationName = (qualificationId) => {
    const qualification = qualificationLevels.find(
      (q) => q.id === qualificationId
    );
    return qualification ? qualification.name : "Bachelor's Degree";
  };

  return (
    <div className="flex flex-col h-full bg-black bg-opacity-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-black/95 to-black/80 p-4 border-b border-[#B200FF]/40 backdrop-blur-md shadow-lg shadow-black/40">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="font-medium text-white text-lg flex items-center">
              <span
                className="mr-2 h-6 w-6 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full flex items-center justify-center animate-gradient"
                style={{ boxShadow: "0 0 15px rgba(178, 0, 255, 0.6)" }}
              >
                <span className="h-2.5 w-2.5 bg-white rounded-full animate-pulse"></span>
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                Career Path Advisor
              </span>
            </h1>{" "}
            <p className="text-sm text-gray-300 ml-8 animate-float">
              Get personalized career guidance based on your goals
            </p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 h-[calc(100vh-126px)] overflow-hidden">
        {!showResults ? (
          <div className="w-full h-full flex">
            {/* Left Panel - Career Selection */}
            <div className="w-3/5 pr-4">
              <div className="bg-black bg-opacity-40 border border-[#B200FF]/20 rounded-lg p-6 h-full flex flex-col">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Find Your Ideal Career Path
                </h2>

                <div className="mb-4">
                  <p className="text-gray-300">
                    Your qualification:{" "}
                    <span className="text-white font-medium">
                      {getQualificationName(userQualification)}
                    </span>
                  </p>
                </div>

                <div className="flex-1 overflow-hidden">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col h-full"
                  >
                    <div className="flex-1">
                      <label
                        htmlFor="career-goal"
                        className="block text-lg font-medium text-white mb-3"
                      >
                        What career path are you interested in? 🎯
                      </label>

                      <div className="grid grid-cols-1 gap-1">
                        {careerGoals.map((goal) => (
                          <div
                            key={goal.id}
                            onClick={() => setSelectedGoal(goal.id)}
                            className={`flex items-center p-4 border ${
                              selectedGoal === goal.id
                                ? "border-[#B200FF] bg-[#B200FF]/20"
                                : "border-gray-700 bg-black bg-opacity-60 hover:border-[#B200FF]/50"
                            } rounded-lg cursor-pointer transition-all duration-200`}
                          >
                            <span className="text-2xl mr-3">{goal.emoji}</span>
                            <span className="text-white text-lg">
                              {goal.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={!selectedGoal || isLoading}
                        className="w-full bg-[#B200FF] hover:bg-[#9900DD] text-white font-medium py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading
                          ? "Loading..."
                          : "Get Personalized Career Path"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Panel - Information */}
            <div className="w-2/5 pl-4">
              <div className="bg-black bg-opacity-40 border border-[#B200FF]/20 rounded-lg p-6 h-full flex flex-col">
                <div className="flex border-b border-gray-700 mb-4">
                  <button
                    onClick={() => setActiveTab("explore")}
                    className={`px-6 py-3 ${
                      activeTab === "explore"
                        ? "text-[#B200FF] border-b-2 border-[#B200FF] font-semibold"
                        : "text-gray-400 hover:text-gray-300"
                    } font-medium transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      Explore
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("tips")}
                    className={`px-6 py-3 ${
                      activeTab === "tips"
                        ? "text-[#B200FF] border-b-2 border-[#B200FF] font-semibold"
                        : "text-gray-400 hover:text-gray-300"
                    } font-medium transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Career Tips
                    </div>
                  </button>
                </div>

                <div className="flex-1">
                  {activeTab === "explore" ? (
                    <div className="h-full flex flex-col">
                      <h3 className="text-xl text-white font-medium mb-4 flex items-center">
                        <span className="bg-[#B200FF]/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                          <span className="text-[#B200FF]">?</span>
                        </span>
                        Why Choose a Career Path?
                      </h3>
                      <div className="space-y-4 text-gray-300">
                        <div className="bg-[#B200FF]/10 rounded-lg p-4 border-l-4 border-[#B200FF]">
                          <p className="text-white font-medium">
                            Your Profile:
                          </p>
                          <div className="flex items-center mt-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#B200FF] mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="text-white">
                              Qualification:{" "}
                              {getQualificationName(userQualification)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <span className="text-[#B200FF] mr-3 text-lg">
                            1.
                          </span>
                          <p>
                            <span className="text-white font-medium">
                              Focus Your Development
                            </span>
                            <br />A defined path helps you concentrate on skill
                            development that aligns with your professional
                            goals.
                          </p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-[#B200FF] mr-3 text-lg">
                            2.
                          </span>
                          <p>
                            <span className="text-white font-medium">
                              Personalized Guidance
                            </span>
                            <br />
                            Our system analyzes your qualification level and
                            chosen career goal to provide guidance that&apos;s
                            realistic.
                          </p>
                        </div>

                        <div className="flex items-start">
                          <span className="text-[#B200FF] mr-3 text-lg">
                            3.
                          </span>
                          <p>
                            <span className="text-white font-medium">
                              Clear Milestones
                            </span>
                            <br />
                            See what steps to take next on your professional
                            journey with actionable recommendations.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <h3 className="text-xl text-white font-medium mb-4 flex items-center">
                        <span className="bg-[#B200FF]/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                          <span className="text-[#B200FF]">💡</span>
                        </span>
                        Career Success Tips
                      </h3>
                      <div className="grid grid-cols-1 gap-4 text-gray-300">
                        <div className="bg-gradient-to-r from-[#B200FF]/5 to-transparent p-4 rounded-lg border border-[#B200FF]/20">
                          <div className="flex items-start">
                            <div className="bg-[#B200FF]/20 rounded-full p-2 mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#B200FF]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                Build Your Network
                              </p>
                              <p className="text-sm mt-1">
                                Connect with professionals in your target
                                industry through LinkedIn, events, and
                                communities.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#B200FF]/5 to-transparent p-4 rounded-lg border border-[#B200FF]/20">
                          <div className="flex items-start">
                            <div className="bg-[#B200FF]/20 rounded-full p-2 mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#B200FF]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                Develop Key Skills
                              </p>
                              <p className="text-sm mt-1">
                                Focus on both technical expertise and soft
                                skills like communication and leadership.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#B200FF]/5 to-transparent p-4 rounded-lg border border-[#B200FF]/20">
                          <div className="flex items-start">
                            <div className="bg-[#B200FF]/20 rounded-full p-2 mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#B200FF]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                Continuous Learning
                              </p>
                              <p className="text-sm mt-1">
                                Stay updated with industry trends through
                                courses, certifications, and industry
                                publications.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex">
            {/* Career Path Results */}
            <div className="w-full bg-black bg-opacity-40 border border-[#B200FF]/20 rounded-lg p-6 flex flex-col h-full">
              {/* Path Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#B200FF]/20 rounded-full blur-md"></div>
                    <span className="relative w-16 h-16 rounded-full bg-[#B200FF]/20 border border-[#B200FF]/50 flex items-center justify-center text-3xl mr-4">
                      {getGoalEmoji(selectedGoal)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-white">
                      {getGoalName(selectedGoal)}
                    </h2>
                    <div className="flex items-center text-gray-300 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-[#B200FF]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Based on: {getQualificationName(userQualification)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="bg-transparent hover:bg-gray-800 border border-[#B200FF]/40 rounded-md px-4 py-2 text-white text-sm flex items-center transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Change Career Path
                </button>
              </div>{" "}
              {/* Career Path Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {careerPathData && careerPathData.response ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-[#B200FF]/5 rounded-lg py-3 px-4 mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-[#B200FF]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-300">
                        <span className="text-white font-medium">
                          Career path suggestion
                        </span>{" "}
                        based on {getQualificationName(userQualification)}{" "}
                        qualification
                      </span>
                    </div>{" "}
                    {/* Display markdown content with scrolling */}
                    <div className="flex-1 pr-4 overflow-hidden">
                      <div className="prose prose-invert max-w-none h-full overflow-y-auto custom-scrollbar px-1">
                        <ReactMarkdown
                          className="text-white"
                          components={{
                            h1: (props) => (
                              <h1
                                className="text-3xl font-bold mt-0 mb-6 text-[#B200FF] bg-[#B200FF]/5 py-2 px-4 rounded-lg"
                                {...props}
                              />
                            ),
                            h2: (props) => (
                              <h2
                                className="text-2xl font-semibold mt-6 mb-4 text-[#B200FF]/90 border-b border-[#B200FF]/20 pb-2"
                                {...props}
                              />
                            ),
                            h3: (props) => (
                              <h3
                                className="text-xl font-medium mt-5 mb-3 text-[#B200FF]/80 flex items-center"
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
                              <ul
                                className="list-none space-y-3 mb-4"
                                {...props}
                              />
                            ),
                            ol: (props) => (
                              <ol
                                className="list-none space-y-3 mb-4 counter-reset"
                                {...props}
                              />
                            ),
                            li: (props) => (
                              <li className="flex items-start bg-[#B200FF]/5 rounded-lg p-3 border border-[#B200FF]/10">
                                <span className="text-[#B200FF] mr-3 text-xl font-bold">
                                  •
                                </span>
                                <span className="pt-0.5">{props.children}</span>
                              </li>
                            ),
                            p: (props) => (
                              <p
                                className="mb-4 text-gray-200 leading-relaxed"
                                {...props}
                              />
                            ),
                            a: (props) => (
                              <a
                                className="text-[#B200FF] hover:underline font-medium"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {careerPathData.response}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md">
                      <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-6 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-red-500/70 mx-auto mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p className="text-white text-xl mb-3">
                          Error loading career path data
                        </p>
                        <p className="text-gray-300">
                          We don&apos;t have specific recommendations for{" "}
                          {getGoalName(selectedGoal)} with{" "}
                          {getQualificationName(userQualification)}{" "}
                          qualification.
                        </p>
                      </div>
                      <button
                        onClick={handleReset}
                        className="bg-[#B200FF] hover:bg-[#9900DD] text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#B200FF]/20 to-[#8000CC]/20 rounded-full flex items-center justify-center mb-4 animate-float">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#B200FF]/40 to-[#8000CC]/40 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-white text-center text-lg animate-glow">
                      Loading career path data...
                    </p>
                    <p className="text-gray-400 text-center mt-2 text-sm">
                      Preparing your personalized suggestions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-80 border border-[#B200FF]/50 rounded-lg p-8 max-w-md w-full animated-gradient">
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[#B200FF]/20"></div>
                <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-[#B200FF] animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-[#B200FF]/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl">
                    {getGoalEmoji(selectedGoal) || "🎯"}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-white text-center">
              <div className="text-xl mb-2">{loadingText}</div>
              <div className="text-sm text-gray-300">
                Personalized for your {getQualificationName(userQualification)}{" "}
                qualification
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Apply custom styles */}{" "}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(178, 0, 255, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(178, 0, 255, 0.5);
        }
        
        @keyframes animate-gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          animation: animate-gradient 3s ease infinite;
          background-size: 200% 200%;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animated-gradient {
          background: linear-gradient(90deg, rgba(178, 0, 255, 0.1), rgba(100, 0, 255, 0.2), rgba(178, 0, 255, 0.1));
          background-size: 200% 100%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default CareerPath;
