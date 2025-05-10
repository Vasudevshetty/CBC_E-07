import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Welcome to Career Builder
        </h1>

        <p className="text-lg text-gray-600 mb-8 text-center">
          Your platform for personalized career growth and skills development
        </p>

        {isAuthenticated ? (
          <div className="space-y-6">
            <div className="text-center bg-blue-50 p-4 rounded-lg">
              <p className="text-xl font-semibold mb-2">
                Welcome back, {user?.name}!
              </p>
              <p className="text-gray-600">Continue your learning journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition duration-200 flex flex-col items-center"
              >
                <span className="text-xl font-semibold mb-1">Dashboard</span>
                <span className="text-sm">View your progress</span>
              </Link>

              <Link
                to="/career"
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition duration-200 flex flex-col items-center"
              >
                <span className="text-xl font-semibold mb-1">Career Path</span>
                <span className="text-sm">Plan your career growth</span>
              </Link>

              <Link
                to="/revise"
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition duration-200 flex flex-col items-center"
              >
                <span className="text-xl font-semibold mb-1">Revise</span>
                <span className="text-sm">Practice your skills</span>
              </Link>

              <Link
                to="/ai-asst"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg text-center transition duration-200 flex flex-col items-center"
              >
                <span className="text-xl font-semibold mb-1">AI Assistant</span>
                <span className="text-sm">Get personalized help</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-center text-gray-700">
              Join our platform to access personalized learning paths, skill
              assessments, and AI-powered career guidance
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition duration-200"
              >
                Register
              </Link>
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Why Choose Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Personalized Learning
                  </h3>
                  <p className="text-gray-600">
                    Custom learning paths based on your career goals and current
                    skills
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    AI-Powered Guidance
                  </h3>
                  <p className="text-gray-600">
                    Get intelligent recommendations for skills to develop
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Practice Resources
                  </h3>
                  <p className="text-gray-600">
                    Access a library of resources to strengthen your skills
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
