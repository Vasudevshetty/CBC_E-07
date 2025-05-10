import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

// Create a Quiz component within the same file for simplicity
function Quiz({ questions, onComplete, quizType }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(15);

  const currentQuestion = questions[currentQuestionIndex] || { question: "Loading...", options: [] };
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Reference for handleTimeUp to avoid dependency issues
  const handleTimeUpRef = useRef(null);
  
  // Set up the ref for handleTimeUp
  useEffect(() => {
    handleTimeUpRef.current = () => {
      // Save the current answer (or null)
      if (answers[currentQuestionIndex] === null) {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = null;
        setAnswers(newAnswers);
      }

      setTimeout(() => {
        if (isLastQuestion) {
          onComplete(answers);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 1000);
    };
  }, [currentQuestionIndex, isLastQuestion, answers, onComplete]);

  useEffect(() => {
    setTimeLeft(15);
    setSelectedOption(answers[currentQuestionIndex]);
  }, [currentQuestionIndex, answers]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && handleTimeUpRef.current) {
      handleTimeUpRef.current();
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  return (
    <div className="max-w-5xl w-full h-full bg-zinc-900 rounded-lg shadow-lg overflow-hidden flex">
      {/* Question and options section */}
      <div className="w-1/2 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-4">
            <div className="bg-zinc-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
              {currentQuestionIndex + 1}
            </div>
            <h2 className="ml-3 text-white font-medium">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Timer */}
          <div className="mb-4">
            <div className="text-center text-lg font-bold text-white mb-2">
              {timeLeft}s
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{
                  width: `${(timeLeft / 15) * 100}%`,
                  transitionDuration: "1s",
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {currentQuestion.options && currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-3 rounded-lg transition-all flex items-center ${
                  selectedOption === option
                    ? "bg-green-500 text-white"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                    selectedOption === option
                      ? "bg-white text-green-500"
                      : "bg-zinc-700 text-white"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-end mt-8">
          <button
            onClick={isLastQuestion ? handleSubmit : handleNextQuestion}
            className={`text-white flex items-center ${
              !selectedOption ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selectedOption}
          >
            {isLastQuestion ? "Submit" : "Next →"}
          </button>
        </div>
      </div>

      {/* Image section */}
      <div className="w-1/2 h-full flex items-center justify-center bg-zinc-800">
        {quizType === "visual" && (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-[#B200FF] p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Video Knowledge Quiz</h3>
            <p className="text-gray-300 text-center mt-2">Testing your understanding of the video content</p>
          </div>
        )}
        {quizType === "aptitude" && (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-[#8A00FF] p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Aptitude Assessment</h3>
            <p className="text-gray-300 text-center mt-2">Testing your general problem-solving abilities</p>
          </div>
        )}
        {currentQuestion.image && (
          <img
            src={currentQuestion.image}
            alt="Question illustration"
            className="p-8 w-full h-full object-contain rounded-lg"
          />
        )}
      </div>
    </div>
  );
}

const videoUrls = [
  "https://www.youtube.com/watch?v=J1Rum2Ea48E", // Computer Networks
  "https://www.youtube.com/watch?v=yN7ypxC7838", // Machine Learning
  "https://www.youtube.com/watch?v=tSodBEAJz9Y", // Cloud Computing
  "https://www.youtube.com/watch?v=5L7TpWkHw-o", // Blockchain
  "https://www.youtube.com/watch?v=c-I5S_zTwAc", // Cybersecurity
  "https://www.youtube.com/watch?v=2siZrhPyYPI", // Artificial Intelligence
];

function Assessment() {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState("intro");
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoQuestions, setVideoQuestions] = useState([]);
  const [aptitudeQuestions, setAptitudeQuestions] = useState([]);
  const [videoAnswers, setVideoAnswers] = useState([]);
  const [learnerType, setLearnerType] = useState(null);

  // Select a random video when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * videoUrls.length);
    setSelectedVideo(videoUrls[randomIndex]);
  }, []);

  const startAssessment = () => {
    setShowModal(true);
    setCurrentPhase("video");
  };

  const handleVideoEnd = async () => {
    setLoading(true);
    try {
      // Fetch video questions
      const response = await api.post("/services/video_questions", null, {
        params: { url: selectedVideo }
      });
      setVideoQuestions(response.data.questions);
      setCurrentPhase("videoQuiz");
      setShowModal(false);
    } catch (error) {
      console.error("Error fetching video questions:", error);
      toast.error("Failed to fetch video questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVideoAnswersSubmit = async (answers) => {
    setVideoAnswers(answers);
    setLoading(true);
    
    try {
      // Fetch aptitude questions
      const response = await api.get("/services/aptitude");
      setAptitudeQuestions(response.data.questions);
      setCurrentPhase("aptitudeQuiz");
    } catch (error) {
      console.error("Error fetching aptitude questions:", error);
      toast.error("Failed to fetch aptitude questions");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAptitudeAnswersSubmit = async (answers) => {
    setLoading(true);
    
    try {
      // Calculate correct answers count
      let videoCorrect = 0;
      videoQuestions.forEach((q, i) => {
        if (videoAnswers[i] === q.correct_answer) videoCorrect++;
      });
      
      let aptitudeCorrect = 0;
      aptitudeQuestions.forEach((q, i) => {
        if (answers[i] === q.correct_answer) aptitudeCorrect++;
      });
      
      // Submit assessment results
      const response = await api.post("/services/assessment", {
        video_correct: videoCorrect, 
        aptitude_correct: aptitudeCorrect
      });
      
      setLearnerType(response.data.learner_type_assessment);
      console.log("Learner Type Assessment:", response.data.learner_type_assessment);
      
      setCurrentPhase("results");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Failed to submit assessment");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentPhase) {
      case "intro":
        return (
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
              Your Assessment Has Two Phases
            </h2>

            {/* Assessment Phases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#B200FF] mr-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-medium text-white">Video Quiz</h3>
                </div>
                <p className="text-gray-300 pl-13">
                  Watch a short educational video and answer questions about its content.
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#8A00FF] mr-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-medium text-white">Aptitude Quiz</h3>
                </div>
                <p className="text-gray-300 pl-13">
                  Complete general aptitude questions to assess your learning style.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={startAssessment}
                className="px-6 py-3 bg-gradient-to-r from-[#B200FF] to-[#8A00FF] text-white rounded-lg shadow-lg hover:shadow-xl transition-all text-lg font-medium"
              >
                Start Assessment
              </button>
            </div>
          </div>
        );
        
      case "videoQuiz":
        return (
          <Quiz 
            questions={videoQuestions} 
            onComplete={handleVideoAnswersSubmit} 
            quizType="visual"
          />
        );
        
      case "aptitudeQuiz":
        return (
          <Quiz 
            questions={aptitudeQuestions} 
            onComplete={handleAptitudeAnswersSubmit} 
            quizType="aptitude"
          />
        );
        
      case "results":
        return (
          <div className="max-w-4xl w-full p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Assessment Results
            </h1>
            <div className="text-center mb-8">
              <div className="text-2xl mb-2">Your Learning Style</div>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B200FF] to-[#8A00FF] mb-4">
                {learnerType?.toUpperCase()}
              </div>
              <p className="text-lg max-w-lg mx-auto">
                {learnerType === "fast" && "You are a quick learner who grasps concepts rapidly and excels with challenging material."}
                {learnerType === "medium" && "You learn at a steady pace with good retention when concepts are presented clearly."}
                {learnerType === "slow" && "You benefit from thorough explanations and prefer to master concepts deeply before moving on."}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-[#B200FF] to-[#8A00FF] text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center w-full text-white p-4">
      {/* Loading indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-[#B200FF] border-r-[#8A00FF] border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">
              {currentPhase === "video" ? "Loading video questions..." : 
               currentPhase === "videoQuiz" ? "Loading aptitude questions..." : 
               "Processing results..."}
            </p>
          </div>
        </div>
      )}
      
      {/* Modal for Video */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl bg-zinc-900 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white text-center">Watch the video carefully</h3>
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${selectedVideo.split('v=')[1]}?autoplay=1`}
              title="Educational Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              // For demo purposes only - replace with actual video completion detection
              onLoad={() => setTimeout(handleVideoEnd, 10000)}
            ></iframe>
            <p className="text-gray-300 text-center mt-3">You will be quizzed on the content of this video</p>
          </div>
        </div>
      )}
      
      {renderContent()}
      <Toaster position="top-center" />
    </div>
  );
}

export default Assessment;