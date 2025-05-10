import { useState } from "react";
import { Link } from "react-router-dom";

function Assessment() {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleStartVideo = () => {
    setShowModal(true);
  };

  const handleVideoEnd = () => {
    setStep(2);
    setShowModal(false);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center w-full text-white">
      <div className="max-w-4xl w-full p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Assessment Instructions
        </h1>

        {/* Rules Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Rules to Follow</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>
              Ensure a stable internet connection throughout the assessment.
            </li>
            <li>Do not refresh or close the browser during the assessment.</li>
            <li>Complete the video before proceeding to the quiz.</li>
            <li>Once the quiz starts, it must be completed in one sitting.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          To Take Test Follow These 2 Steps
        </h2>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                step >= 1 ? "bg-[#B200FF]" : "bg-gray-700"
              }`}
            >
              <span className="text-white font-bold">1</span>
            </div>
            <span
              className={`text-lg font-medium ${
                step >= 1 ? "text-white" : "text-gray-500"
              }`}
            >
              Watch Video
            </span>
          </div>
          <div className="flex-grow h-1 bg-gray-700 mx-4">
            <div
              className={`h-1 bg-gradient-to-r from-[#B200FF] to-[#8A00FF] transition-all duration-500 ${
                step >= 2 ? "w-full" : "w-1/2"
              }`}
            ></div>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                step >= 2 ? "bg-[#B200FF]" : "bg-gray-700"
              }`}
            >
              <span className="text-white font-bold">2</span>
            </div>
            <span
              className={`text-lg font-medium ${
                step >= 2 ? "text-white" : "text-gray-500"
              }`}
            >
              Start Quiz
            </span>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="flex flex-col items-center">
            <button
              onClick={handleStartVideo}
              className="px-6 py-3 bg-gradient-to-r from-[#B200FF] to-[#8A00FF] text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Step 1: Watch Video
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4">
              You have completed the video. Click below to start the quiz.
            </p>
            <Link to="/quiz" className="px-6 py-3 bg-gradient-to-r from-[#B200FF] to-[#8A00FF] text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
              Start Step 2: Take Quiz
            </Link>
          </div>
        )}
      </div>

      {/* Modal for Video */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/aBSwyRtSLnc?autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setTimeout(handleVideoEnd, 10000)}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assessment;
