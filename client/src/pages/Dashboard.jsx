import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loadingData, setLoadingData] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

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
      } px-8 py-4`}
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
        <div className="bg-white h-40">
          
        </div>
      {/* Your Assessments Section */}
      <h1 className="text-white text-3xl font-semibold tracking-wide ">
        Your Assessment{" "}
      </h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assessments List */}
        <div className="space-y-4 max-h-72 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#B200FF] scrollbar-track-gray-800 bg-gray-900 p-4 rounded-lg shadow-lg">
          {[
            { id: 1, title: "React Basics Quiz", dueDate: "2025-05-12" },
            { id: 2, title: "JavaScript Fundamentals", dueDate: "2025-05-15" },
            { id: 3, title: "CSS Grid Mastery", dueDate: "2025-05-20" },
            { id: 4, title: "Node.js Essentials", dueDate: "2025-05-25" },
            {
              id: 5,
              title: "Express.js API Development",
              dueDate: "2025-05-30",
            },
            { id: 6, title: "MongoDB Basics", dueDate: "2025-06-05" },
            { id: 7, title: "React Hooks Deep Dive", dueDate: "2025-06-10" },
            {
              id: 8,
              title: "Advanced JavaScript Concepts",
              dueDate: "2025-06-15",
            },
          ].map((assessment) => (
            <Link
              to={`/assessment/${assessment.id}`}
              key={assessment.id}
              className="bg-gradient-to-r ml-4 from-[#B200FF] to-[#8A00FF] text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between"
              style={{ height: "48px", width: "26rem" }}
            >
              <div>
                <h3 className="text-lg font-bold">{assessment.title}</h3>
                <p className="text-gray-300 text-sm">
                  Due Date: {assessment.dueDate}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Progress Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-[#B200FF]/20 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#B200FF] mb-4">
            Your Progress
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Completed Courses
              </h3>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                <div
                  className="bg-gradient-to-r from-[#B200FF] to-[#8A00FF] h-3 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">In Progress</h3>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                <div
                  className="bg-gradient-to-r from-[#B200FF] to-[#8A00FF] h-3 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Achievements</h3>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                <div
                  className="bg-gradient-to-r from-[#B200FF] to-[#8A00FF] h-3 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
