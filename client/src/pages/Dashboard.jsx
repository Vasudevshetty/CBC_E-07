import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import SideBar from "../components/SideBar";
import { logoutUser } from "../store/slices/authSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [loadingData, setLoadingData] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              title: "JavaScript Fundamentals",
              date: "2023-03-28",
            },
          ],
        };

        setDashboardData(mockData);
        setLoadingData(false);
      } catch (error) {
        setLoadingData(false);
        toast.error(
          "Failed to load dashboard data: " + (error.message || "Unknown error")
        );
      }
    };

    if (!isLoading && user) {
      fetchDashboardData();
    } else if (!isLoading && !user) {
      setLoadingData(false);
    }
  }, [user, isLoading, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <ClipLoader size={50} color={"#3B82F6"} />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Not logged in
          </h2>
          <p className="mb-4 text-gray-600">
            Please log in to view your dashboard.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Top bar with user dropdown */}
      <div className="absolute top-4 right-4 bg-gray-100 border-white  rounded-full w-fit shadow-lg">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-300 transition"
        >
          <img
            src={"/default-profile.jpg"}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <span className="text-gray-700 font-medium text-sm md:text-base">
            {user?.name || "Guest"}
          </span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1">
        <div className="w-[20%] bg-gray-900">
          <SideBar />
        </div>

        <div className="w-[80%] p-6">
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

          {loadingData ? (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-center h-40">
                <ClipLoader size={35} color={"#3B82F6"} />
                <p className="ml-3 text-gray-600">Loading your stats...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Completed Courses
                  </h2>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboardData?.stats.completedCourses || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    In Progress
                  </h2>
                  <p className="text-3xl font-bold text-yellow-500">
                    {dashboardData?.stats.inProgressCourses || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Achievements
                  </h2>
                  <p className="text-3xl font-bold text-green-600">
                    {dashboardData?.stats.achievements || 0}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Recent Activity
                </h2>
                {dashboardData?.recentActivity?.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {dashboardData.recentActivity.map((activity) => (
                      <li key={activity.id} className="py-3">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-full p-2 mr-3">
                            <svg
                              className="h-4 w-4 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.type.charAt(0).toUpperCase() +
                                activity.type.slice(1)}{" "}
                              • {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No recent activity found.</p>
                )}
              </div>
            </>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition duration-200"
                onClick={() => toast.success("Feature coming soon!")}
              >
                Browse Courses
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition duration-200"
                onClick={() => toast.success("Feature coming soon!")}
              >
                Continue Learning
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition duration-200"
                onClick={() => toast.success("Feature coming soon!")}
              >
                View Certificates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
