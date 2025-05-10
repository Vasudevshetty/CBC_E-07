import { useSelector } from "react-redux";

function CareerPath() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-semibold mb-6">Career Path</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Your Career Journey</h2>
        <p className="text-gray-600">
          Welcome, {user?.name}! Here's your personalized career development
          path based on your skills and goals.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Current Skills Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="font-medium text-gray-800">Frontend Development</h4>
            <div className="mt-2 bg-gray-100 h-2 rounded-full">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Advanced (75%)</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="font-medium text-gray-800">Backend Development</h4>
            <div className="mt-2 bg-gray-100 h-2 rounded-full">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Intermediate (60%)</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="font-medium text-gray-800">Database Management</h4>
            <div className="mt-2 bg-gray-100 h-2 rounded-full">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Basic (45%)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Recommended Career Path</h3>
        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-0 w-1 bg-blue-200 h-full"></div>

          {/* Timeline items */}
          <div className="ml-8 space-y-8">
            <div className="relative">
              <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full border-4 border-white bg-blue-500"></div>
              <h4 className="text-lg font-semibold">Frontend Developer</h4>
              <p className="text-sm text-gray-500">Current Position</p>
              <p className="mt-2">
                Focus on mastering React ecosystem and state management
                solutions.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  React
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Redux
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  TypeScript
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full border-4 border-white bg-gray-300"></div>
              <h4 className="text-lg font-semibold">Full Stack Developer</h4>
              <p className="text-sm text-gray-500">Next Step</p>
              <p className="mt-2">
                Strengthen your backend skills with Node.js and database
                optimization.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  Node.js
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  Express
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  MongoDB
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full border-4 border-white bg-gray-300"></div>
              <h4 className="text-lg font-semibold">
                Senior Full Stack Developer
              </h4>
              <p className="text-sm text-gray-500">Future Goal</p>
              <p className="mt-2">
                Focus on system architecture, performance optimization, and
                mentoring.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  System Design
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  Team Leadership
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  Cloud Services
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerPath;
