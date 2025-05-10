import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loadingData, setLoadingData] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const mockData = {
          stats: {
            completedCourses: 5,
            inProgressCourses: 2,
            achievements: 7,
          },
          recentActivity: [
            {
              id: 1,
              type: "course",
              title: "Introduction to React",
              date: "2023-04-01",
            },
            {
              id: 2,
              type: "quiz",
              title: "JavaScript Fundamentals Quiz",
              date: "2023-04-03",
            },
            {
              id: 3,
              type: "assignment",
              title: "Build a React Component",
              date: "2023-04-05",
            },
          ],
          recommendedCourses: [
            {
              id: 101,
              title: "Advanced JavaScript Concepts",
              duration: "4 hours",
              level: "Intermediate",
            },
            {
              id: 102,
              title: "React Hooks Mastery",
              duration: "3.5 hours",
              level: "Advanced",
            },
            {
              id: 103,
              title: "CSS Grid & Flexbox",
              duration: "2 hours",
              level: "Intermediate",
            },
          ],
        };

        // Simulate API delay
        setTimeout(() => {
          setDashboardData(mockData);
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
      }`}
    >
      <Toaster position="top-right" />

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back,{" "}
          <span className="text-[#B200FF]">{user?.name || "Student"}</span>!
        </h1>
        <p className="text-gray-300">
          Here&apos;s an overview of your learning journey
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div
          className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-[#B200FF]/20 shadow-lg hover:shadow-[#B200FF]/20 transition-all duration-300 hover:-translate-y-1"
          style={{
            backgroundImage:
              "radial-gradient(circle at top right, rgba(178, 0, 255, 0.1), transparent 70%)",
          }}
        >
          <h3 className="text-gray-400 font-medium mb-2">Completed Courses</h3>
          <div className="text-4xl font-bold text-white">
            {dashboardData.stats.completedCourses}
          </div>
          <div className="mt-4 h-2 w-full bg-gray-700 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-[#B200FF] to-[#8A00FF] rounded-full"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-[#B200FF]/20 shadow-lg hover:shadow-[#B200FF]/20 transition-all duration-300 hover:-translate-y-1"
          style={{
            backgroundImage:
              "radial-gradient(circle at top right, rgba(178, 0, 255, 0.1), transparent 70%)",
          }}
        >
          <h3 className="text-gray-400 font-medium mb-2">In Progress</h3>
          <div className="text-4xl font-bold text-white">
            {dashboardData.stats.inProgressCourses}
          </div>
          <div className="mt-4 h-2 w-full bg-gray-700 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-[#B200FF] to-[#8A00FF] rounded-full"
              style={{ width: "30%" }}
            ></div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-[#B200FF]/20 shadow-lg hover:shadow-[#B200FF]/20 transition-all duration-300 hover:-translate-y-1"
          style={{
            backgroundImage:
              "radial-gradient(circle at top right, rgba(178, 0, 255, 0.1), transparent 70%)",
          }}
        >
          <h3 className="text-gray-400 font-medium mb-2">Achievements</h3>
          <div className="text-4xl font-bold text-white">
            {dashboardData.stats.achievements}
          </div>
          <div className="mt-4 h-2 w-full bg-gray-700 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-[#B200FF] to-[#8A00FF] rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Recent Activity
        </h2>
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="divide-y divide-[#B200FF]/20">
            {dashboardData.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-[#B200FF]/10 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{activity.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {activity.type.charAt(0).toUpperCase() +
                        activity.type.slice(1)}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Recommended For You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.recommendedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-black bg-opacity-40 backdrop-blur-sm border border-[#B200FF]/20 rounded-xl p-5 shadow-lg hover:shadow-[#B200FF]/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <h3 className="text-white font-semibold mb-2">{course.title}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{course.duration}</span>
                <span className="bg-[#B200FF]/20 text-[#B200FF] px-2 py-1 rounded text-xs">
                  {course.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
