import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Streaks from "../components/Streaks";
import { Link } from "react-router-dom";

function CircularProgress({ percentage }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    let currentPercentage = 0;
    const interval = setInterval(() => {
      if (currentPercentage >= percentage) {
        clearInterval(interval);
      } else {
        currentPercentage += 1;
        setAnimatedPercentage(currentPercentage);
      }
    }, 20); // Adjust the speed of the animation here

    return () => clearInterval(interval);
  }, [percentage]);

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-gray-700"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-[#B200FF] stroke-current"
          strokeWidth="3"
          strokeDasharray={`${animatedPercentage}, 100`}
          fill="none"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-lg font-bold">
          {animatedPercentage}%
        </span>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loadingData, setLoadingData] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        setTimeout(() => {
          setLoadingData(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 65) {
          clearInterval(interval);
          return 65;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Loading state
  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-full bg-black bg-opacity-50">
        <ClipLoader color="#B200FF" size={50} />
        <p className="ml-4 text-white text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col bg-black bg-opacity-20 w-full transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } `}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23b200ff' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm20 20c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundAttachment: "fixed",
      }}
    >
      <Toaster position="top-right" />

      {/* Header */}
      <div
        className="bg-gradient-to-b from-black/95 to-black/80 p-4 border-b border-[#B200FF]/40 backdrop-blur-md shadow-lg shadow-black/40"
        style={{
          height: "10%", // Adjusted height
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="flex items-center">
          <div>
            <h1 className="font-medium text-white text-xl flex items-center">
              <span
                className="mr-2 h-6 w-6 bg-gradient-to-br from-[#B200FF] to-[#8000CC] rounded-full flex items-center justify-center animate-gradient"
                style={{ boxShadow: "0 0 15px rgba(178, 0, 255, 0.6)" }}
              >
                <span className="h-2.5 w-2.5 bg-white rounded-full animate-pulse"></span>
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                Dashboard Overview
              </span>
            </h1>
            <p className="text-sm text-gray-300 ml-8 animate-float">
              Welcome back, {user?.name || "Student"}! Here&apos;s your learning
              journey.
            </p>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg shadow-black/20 text-white p-6 rounded-xl my-6 mx-6 transition-all duration-300 hover:shadow-purple-500/30">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Ready for a Challenge?</h2>
            <p className="text-gray-200 mt-2">
              Head over to the assessments page to test your knowledge.
            </p>
          </div>
          <Link
            to="/assessment"
            className="bg-white text-[#B200FF] px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-200 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Go to Assessments
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#B200FF]/40 scrollbar-track-transparent">
        {/* Streaks Section */}
        <div className="mb-6">
          <Streaks />
        </div>

        {/* Quick Actions and Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Section */}
          <div className="lg:col-span-2 bg-gradient-to-br from-black/80 to-black/60 border border-indigo-500/50 p-6 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6 tracking-wide">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Explore Career Paths",
                  description: "Discover and plan your future career.",
                  link: "/career",
                  icon: "🎓",
                },
                {
                  title: "Take a Quiz",
                  description: "Test your knowledge with various quizzes.",
                  link: "/assessment",
                  icon: "❓",
                },
                {
                  title: "Revise Concepts",
                  description: "Refresh your understanding of key topics.",
                  link: "/revise",
                  icon: "📚", // Placeholder icon
                },
                {
                  title: "AI Study Assistant",
                  description: "Get help from your AI learning partner.",
                  link: "/ai-study-assistant",
                  icon: "🤖", // Placeholder icon
                },
              ].map((action) => (
                <Link
                  key={action.title}
                  to={action.link}
                  className="bg-gradient-to-r from-indigo-500/80 to-purple-500/70 text-white p-4 rounded-lg shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{action.icon}</span>
                      <h3 className="text-lg font-semibold">{action.title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {action.description}
                    </p>
                  </div>
                  <div className="mt-3 text-right">
                    <span className="text-sm font-medium bg-white text-indigo-600 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors duration-300">
                      Go
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gradient-to-br from-black/80 to-black/60 border border-[#B200FF]/30 p-6 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-[#B200FF] mb-6 tracking-wide">
              Your Progress
            </h2>
            <div className="flex flex-col items-center space-y-6">
              <CircularProgress percentage={progress} />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">
                  Overall Completion
                </h3>
                <p className="text-gray-300 mt-1">Keep up the great work!</p>
              </div>
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center bg-black/50 p-3 rounded-lg">
                  <h3 className="text-md font-medium text-white">
                    Learner Type
                  </h3>
                  <p className="text-gray-300 font-semibold bg-gradient-to-r from-[#B200FF]/30 to-[#8A00FF]/30 px-3 py-1 rounded-full text-sm">
                    Consistent Learner
                  </p>
                </div>
                <div className="flex justify-between items-center bg-black/50 p-3 rounded-lg">
                  <h3 className="text-md font-medium text-white">
                    Current Streak
                  </h3>
                  <p className="text-gray-300 font-semibold bg-gradient-to-r from-[#B200FF]/30 to-[#8A00FF]/30 px-3 py-1 rounded-full text-sm">
                    15 Days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
