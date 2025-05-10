import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function Dashboard() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [loadingData, setLoadingData] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

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

    // Only fetch dashboard data when user is available
    if (!isLoading && user) {
      fetchDashboardData();
    } else if (!isLoading && !user) {
      // If loading is done but no user found
      setLoadingData(false);
    }
  }, [user, isLoading, dispatch]);

  // Loading state for entire dashboard
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

  // If not loading and no user, display an error or redirect message
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
      <div className="w-full p-6">
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
            {/* Stats Section */}
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

            {/* Recent Activity Section */}
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

        {/* Quick Actions Section */}
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
  );
}

export default Dashboard;
