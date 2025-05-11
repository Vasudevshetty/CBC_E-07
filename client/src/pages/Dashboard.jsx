import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Streaks from "../components/Streaks";
import { Link } from "react-router-dom";
import "../utils/animations.css"; // Import the animations

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
      {/* <Toaster position="top-right" /> */}

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
        {/* Gamification Stats in Header */}
        <div className="flex items-center space-x-6 mr-4">
          {/* Coins Display */}
          <div
            className="flex items-center text-white"
            title={`Coins: ${user?.coins || 0}`}
          >
            <span className="text-yellow-400 mr-1 text-2xl transition-transform duration-200 hover:scale-125 cursor-default animate-coin-rotate">
              🪙
            </span>
            <span className="font-semibold text-lg">{user?.coins || 0}</span>
          </div>
          {/* Streak Display */}
          <div
            className="flex items-center text-white"
            title={`Streak: ${user?.dailyStreak || 0} Days`}
          >
            <span className="text-orange-400 mr-1 text-2xl cursor-default animate-fire-wave">
              🔥
            </span>
            <span className="font-semibold text-lg">
              {user?.dailyStreak || 0}
            </span>
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

        {/* Featured Content and Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Content Section */}
          <div className="lg:col-span-2 bg-gradient-to-br from-black/80 to-black/60 border border-purple-500/50 p-6 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 tracking-wide">
              Featured Content
            </h2>
            <ul className="space-y-4">
              {[
                {
                  type: "New Course",
                  title: "Introduction to Quantum Computing",
                  description: "Jump into a new learning adventure.",
                  link: "/ai-study-assistant/quantum-computing",
                  icon: "🌌",
                },
                {
                  type: "Popular Workshop",
                  title: "Mastering Python for Data Science",
                  description: "Join this in-demand workshop.",
                  link: "/ai-study-assitant/python-data-science",
                  icon: "🐍",
                },
                {
                  type: "Upcoming Webinar",
                  title: "The Future of AI in Education",
                  description: "Register now for expert insights.",
                  link: "/webinars/ai-education-future",
                  icon: "💡",
                },
                {
                  type: "Challenge",
                  title: "Data Structures Challenge",
                  description: "Test your knowledge on key data structures.",
                  link: "/challenges/data-structures",
                  icon: "💻",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="bg-black/30 p-4 rounded-lg shadow-md hover:shadow-purple-500/30 transition-shadow duration-300"
                >
                  <Link
                    to={item.link}
                    className="flex items-start space-x-4 group"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                        <span className="font-bold text-purple-400">
                          {item.type}:
                        </span>{" "}
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="ml-auto self-center">
                      <span className="text-sm font-medium bg-purple-600/70 text-white px-3 py-1 rounded-md group-hover:bg-purple-500 transition-colors duration-300">
                        Explore
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
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
                    {user?.learningType}
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
