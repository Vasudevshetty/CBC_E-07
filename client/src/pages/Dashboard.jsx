import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Streaks from "../components/Streaks";

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
  }, []);

  // Loading state
  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#B200FF" size={50} />
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } px-8 py-2`}
    >
      <Toaster position="top-right" />

      {/* Welcome Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="typewriter">
              Welcome back, {user?.name || "Student"}!
            </span>
          </h1>
          <p className="text-gray-300">
            Here&apos;s an overview of your learning journey
          </p>
        </div>
      </div>
      <div className="h-60 py-2">
        <Streaks />
      </div>

      {/* Your Assessments and Progress Section */}
      <div className="mt-4 flex flex-wrap gap-6">
        {/* Assessments List */}
        <div className="flex-1 max-h-72 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#B200FF] scrollbar-track-gray-800 bg-gray-900 p-4 rounded-lg shadow-lg">
          <h1 className="text-white text-3xl font-semibold tracking-wide mb-4">
            Your Assessments
          </h1>
          <ul className="space-y-4">
            {[
              {
                id: 1,
                title: "React Basics Quiz",
                dueDate: "2025-05-12",
              },
              {
                id: 2,
                title: "JavaScript Fundamentals",
                dueDate: "2025-05-15",
              },
              {
                id: 3,
                title: "CSS Grid Mastery",
                dueDate: "2025-05-20",
              },
              {
                id: 4,
                title: "Node.js Essentials",
                dueDate: "2025-05-25",
              },
              {
                id: 5,
                title: "Express.js API Development",
                dueDate: "2025-05-30",
              },
              {
                id: 6,
                title: "MongoDB Basics",
                dueDate: "2025-06-05",
              },
              {
                id: 7,
                title: "React Hooks Deep Dive",
                dueDate: "2025-06-10",
              },
              {
                id: 8,
                title: "Advanced JavaScript Concepts",
                dueDate: "2025-06-15",
              },
            ].map((assessment) => (
              <li
                key={assessment.id}
                className="flex justify-between items-center bg-gradient-to-r from-[#B200FF] to-[#8A00FF] text-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <h3 className="text-lg font-bold">{assessment.title}</h3>
                  <p className="text-gray-300 text-sm">
                    Due Date: {assessment.dueDate}
                  </p>
                </div>
                <button className="bg-white text-[#B200FF] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-300 hover:cursor-pointer">
                  Start
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Progress Section */}
        <div className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 border border-[#B200FF]/20 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#B200FF] mb-4">
            Your Progress
          </h2>
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-evenly w-full">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Learner Type
                </h3>
                <p className="text-gray-300 mt-2">Consistent Learner</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Days Streak
                </h3>
                <p className="text-gray-300 mt-2">15 Days</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Progress</h3>
              <CircularProgress percentage={progress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
