import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Navigation Bar */}
      <NavBar />

      <div className="flex flex-1">
        {/* Sidebar takes 20% */}
        <div className="w-[20%] bg-gray-900">
          <SideBar />
        </div>

        {/* Main content takes 80% */}
        <div className="w-[80%] p-6">
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">
              Here's your personalized learning dashboard. Track your progress
              and continue your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">Learning Progress</h3>
              <div className="bg-gray-100 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                65% of your learning path completed
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">Upcoming Tasks</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Complete React fundamentals module</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  <span>Practice JavaScript algorithms</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <span>Submit portfolio project</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">Recommended Skills</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  React
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Redux
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  TypeScript
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Node.js
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Express
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Completed Redux Module</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Started TypeScript Course
                  </p>
                  <p className="text-xs text-gray-500">5 days ago</p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Achieved Level 3 in JavaScript
                  </p>
                  <p className="text-xs text-gray-500">1 week ago</p>
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
