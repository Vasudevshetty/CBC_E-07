import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";

function Revise() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Main Content - 80% */}
      <div className="w-[80%] p-6">
        <h1 className="text-2xl font-semibold mb-6">Revision Center</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Practice Your Skills</h2>
          <p className="text-gray-600">
            Hello {user?.name}! Strengthen your knowledge with these practice
            exercises and quizzes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 p-4">
              <h3 className="font-medium text-lg text-blue-800">
                Frontend Development
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="border-b pb-3">
                <h4 className="font-medium mb-1">React Fundamentals</h4>
                <p className="text-sm text-gray-600">
                  Component lifecycle, hooks, and state management
                </p>
                <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                  Start Practice
                </button>
              </div>
              <div className="border-b pb-3">
                <h4 className="font-medium mb-1">CSS Grid & Flexbox</h4>
                <p className="text-sm text-gray-600">
                  Advanced layout techniques and responsive design
                </p>
                <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                  Start Practice
                </button>
              </div>
              <div>
                <h4 className="font-medium mb-1">JavaScript ES6+</h4>
                <p className="text-sm text-gray-600">
                  Modern JS features and patterns
                </p>
                <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                  Start Practice
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-50 p-4">
              <h3 className="font-medium text-lg text-green-800">
                Backend Development
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="border-b pb-3">
                <h4 className="font-medium mb-1">RESTful API Design</h4>
                <p className="text-sm text-gray-600">
                  API principles, endpoints, and response formats
                </p>
                <button className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                  Start Practice
                </button>
              </div>
              <div className="border-b pb-3">
                <h4 className="font-medium mb-1">Database Optimization</h4>
                <p className="text-sm text-gray-600">
                  Query optimization and indexing strategies
                </p>
                <button className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                  Start Practice
                </button>
              </div>
              <div>
                <h4 className="font-medium mb-1">Authentication & Security</h4>
                <p className="text-sm text-gray-600">
                  JWT, OAuth, and secure coding practices
                </p>
                <button className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                  Start Practice
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
            <div className="bg-purple-50 p-4">
              <h3 className="font-medium text-lg text-purple-800">
                Weekly Challenges
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h4 className="font-medium mb-1">
                    Full-Stack Challenge: Build a Mini Social Network
                  </h4>
                  <p className="text-sm text-gray-600">
                    Implement user authentication, profiles, and real-time
                    messaging
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-purple-700 font-medium bg-purple-100 px-2 py-0.5 rounded">
                      Advanced
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-xs text-gray-600">
                      5 days remaining
                    </span>
                  </div>
                </div>
                <button className="mt-3 md:mt-0 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  View Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revise;
