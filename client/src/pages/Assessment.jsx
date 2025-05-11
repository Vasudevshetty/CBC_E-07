import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Added
import { updateLearningType } from "../store/slices/authSlice"; // Added
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

// Create a Quiz component within the same file for simplicity
function Quiz({
  questions,
  onComplete,
  quizType,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(15);

  const currentQuestion = questions[currentQuestionIndex] || {
    question: "Loading...",
    options: [],
    image: null, // Ensure image property exists
  };
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
        if (currentQuestionIndex >= 4) {
          setCurrentQuestionIndex(0); // Reset to 0 if index exceeds 4
        } else if (isLastQuestion) {
          onComplete(answers);
        } else {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
      }, 1000);
    };
  }, [
    currentQuestionIndex,
    isLastQuestion,
    answers,
    onComplete,
    setCurrentQuestionIndex,
  ]);

  useEffect(() => {
    setTimeLeft(15);
    setSelectedOption(answers[currentQuestionIndex]);
  }, [currentQuestionIndex, quizType]);

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
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="w-full min-h-[60vh] text-white flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-2xl">No questions available for this section.</div>
      </div>
    );
  }

  return (
    // Updated to max-w-6xl and responsive padding, flex-col for mobile, md:flex-row for larger screens
    <div className="max-w-6xl w-full bg-slate-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[70vh]">
      {/* Question and options section - md:w-3/5 for larger screens */}
      <div className="md:w-3/5 p-6 sm:p-10 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <span className="text-sm text-purple-300">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <h2 className="mt-1 text-2xl sm:text-3xl text-white font-semibold">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Timer */}
          <div className="mb-8">
            <div className="text-center text-xl font-bold text-purple-300 mb-2">
              Time Left: {timeLeft}s
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${(timeLeft / 15) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            {currentQuestion.options &&
              currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full p-4 rounded-lg transition-all duration-150 ease-in-out flex items-center text-left focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-100 ${
                    selectedOption === option
                      ? "bg-purple-600 text-white ring-2 ring-purple-400"
                      : "bg-slate-700 text-slate-100 hover:bg-slate-600"
                  }`}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full mr-4 text-sm font-semibold shrink-0 ${
                      selectedOption === option
                        ? "bg-white text-purple-600"
                        : "bg-slate-600 text-slate-100"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-base">{option}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-end items-center mt-10">
          <button
            onClick={isLastQuestion ? handleSubmit : handleNextQuestion}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              !selectedOption && timeLeft > 0
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 transform hover:scale-105 active:scale-100"
            }`}
            disabled={!selectedOption && timeLeft > 0}
          >
            {isLastQuestion ? "Submit Section" : "Next Question →"}
          </button>
        </div>
      </div>

      {/* Image/Context section - md:w-2/5 for larger screens */}
      <div className="md:w-2/5 h-64 md:h-auto flex items-center justify-center bg-slate-700 bg-opacity-60 p-6">
        {currentQuestion.image ? (
          <img
            src={currentQuestion.image}
            alt="Question illustration"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        ) : quizType === "visual" ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-purple-500 p-4 rounded-full mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Video Knowledge Quiz</h3>
            <p className="text-slate-300 mt-2">
              Testing your understanding of the video content.
            </p>
          </div>
        ) : quizType === "aptitude" ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-indigo-500 p-4 rounded-full mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Aptitude Assessment</h3>
            <p className="text-slate-300 mt-2">
              Testing your general problem-solving abilities.
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg">
            No image for this question.
          </div>
        )}
      </div>
    </div>
  );
}

const video = {
  url: "https://www.youtube.com/watch?v=yN7ypxC7838",
  transcript:
    "welcome to wide world programming where we simplify programming for you with easy to understand by code videos and today I'll be giving you a brief explanation of all machine learning models so let's get started broadly speaking all machine learning models can be categorized as supervised or unsupervised we'll uncovered each one of them and what all types they have [Music] number one supervised learning it involves a series of function that map's an input to an output based on a series of example input-output pairs for example if we have a data set of two variables one being age which is the input and other being the shoe size as output we could implement a supervised learning models to predict the shoe size of a person based on their age further with supervised learning there are two sub categories one is regression and other is classification in relation model we find a target value based on independent predictors that means you can use this to find relationship between a dependent variable and an independent variable in regression models the output is continuous some of the most common types of resistant model include number one linear regression which is simply finding a line that fits the data its extensions include multiple linear regression that is finding a plane of best fit and polynomial regression that is finding a curve for best fit next one decision tree it looks something like this where each square above is called a node and the more nodes you have the more accurate your decision tree will be in general next and the third type random forest these are assemble learning techniques that builds off over decision trees and involve creating multiple decision trees using bootstrap data sets of original data and randomly selecting a subset of variables at each step of the decision tree the model then selects the mode of all the predictions of each decision trees and by relying on the majority winds model it reduces the risk of error from individual tree next neural network it is quite popular and is a multi layered model inspired by human minds like the neurons in our brain the circle represents a node the blue circle represents an input layer the black circle represents a hidden layer and the green circle represents the output layer each node in the hidden layer represents a function that input goes through ultimately leading to the output in the green circles next classification so with regression types being over now let's jump to classification so in classification the output is discrete some of the most common types of classification models include first logistic regression which is similar to linear regression but is used to model the probability of a finite number of outcomes typically two next support vector machine it is a supervised classification technique that carries an objective to find a hyper lane in n-dimensional space that can distinctly classify the data points next navies it's a classifier which acts as a probabilistic machine learning model used for classification tasks the crux of the classifier is based on the Bayes theorem coming up next decision trees random forests and neural networks these models follow the same logic as previously explained the only difference here is that the output is discrete rather than continuous now next let's jump over to unsupervised learning unlike supervised learning unsupervised learning is used to draw inferences and find patterns from input data without references to the labeled outcome two main methods used in supervised learning include clustering and dimensionality reduction clustering involves grouping of data points it's frequently used for customer segmentation fraud detection and document classification common clustering techniques include k-means clustering hierarchical clustering means shape clustering and density based clustering while each technique has different methods in finding clusters they all aim to achieve the same thing coming up next dimensionality reduction it is a process of reducing dimensions of your feature set Auto States simply reducing the number of features most dimensionality reduction techniques can be categorized as either feature elimination or feature extraction a popular method of dimensionality reduction is called principal component analysis or PCA obviously there's a ton of complexity if we dive into any particular model to help you with each I will be publishing new videos so be sure to smash that subscribe button to be notified on every upload next if this video helped you be sure to like it and share it with someone who might need it [Music]",
};

function Assessment() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Added
  const [currentPhase, setCurrentPhase] = useState("intro");
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoQuestions, setVideoQuestions] = useState([]);
  const [aptitudeQuestions, setAptitudeQuestions] = useState([]);
  const [videoAnswers, setVideoAnswers] = useState([]);
  const [learnerType, setLearnerType] = useState(null);
  const resetIndexRef = useRef(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    setSelectedVideo(video.url);
  }, []);

  const startAssessment = () => {
    setShowModal(true);
    setCurrentPhase("video");
  };

  const handleVideoEnd = async () => {
    setLoading(true);
    try {
      // Fetch video questions
      const response = await api.post(
        "/services/video_questions_transcript",
        null,
        {
          params: { transcript: video.transcript },
        }
      );
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
      setCurrentQuestionIndex(0);
      setAptitudeQuestions(response.data.questions);
      setCurrentPhase("aptitudeQuiz");

      // Reset the question index for aptitude quiz
      if (resetIndexRef.current) {
        resetIndexRef.current();
      }
    } catch (error) {
      console.error("Error fetching aptitude questions:", error);
      toast.error("Failed to fetch aptitude questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAptitudeAnswersSubmit = async (answers) => {
    console.log("Submitting aptitude answers:", answers); // Debugging log
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

      console.log("Video correct answers:", videoCorrect); // Debugging log
      console.log("Aptitude correct answers:", aptitudeCorrect); // Debugging log

      // Submit assessment results
      const response = await api.post(
        "/services/assessment",
        {},
        {
          params: {
            video_correct: videoCorrect,
            aptitude_correct: aptitudeCorrect,
          },
        }
      );

      console.log("Assessment submission response:", response.data); // Debugging log
      const newLearnerType = response.data.learner_type_assessment;
      setLearnerType(newLearnerType);

      // Update learningType in backend and Redux store
      if (newLearnerType) {
        dispatch(updateLearningType({ learningType: newLearnerType }))
          .unwrap()
          .then(() => {
            toast.success("Learning type updated successfully!");
          })
          .catch((error) => {
            console.error("Failed to update learning type:", error);
            toast.error(error.message || "Failed to update learning type.");
          });
      }

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
          // Updated to use consistent card styling
          <div className="max-w-4xl w-full p-6 sm:p-10 bg-slate-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-white">
              Assessment Instructions
            </h1>

            {/* Rules Section */}
            <div className="mb-8 p-6 bg-slate-700 bg-opacity-50 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-300">Rules to Follow</h2>
              <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-slate-200">
                <li>
                  Ensure a stable internet connection throughout the assessment.
                </li>
                <li>
                  Do not refresh or close the browser during the assessment.
                </li>
                <li>Complete the video before proceeding to the quiz.</li>
                <li>
                  Once the quiz starts, it must be completed in one sitting.
                </li>
              </ul>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center text-white">
              Your Assessment Has Two Phases
            </h2>

            {/* Assessment Phases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-slate-700 bg-opacity-50 p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 mr-4 shrink-0">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-xl font-medium text-white">Video Quiz</h3>
                </div>
                <p className="text-slate-300 pl-14 text-sm sm:text-base">
                  Watch a short educational video and answer questions about its
                  content.
                </p>
              </div>

              <div className="bg-slate-700 bg-opacity-50 p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 mr-4 shrink-0">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-xl font-medium text-white">
                    Aptitude Quiz
                  </h3>
                </div>
                <p className="text-slate-300 pl-14 text-sm sm:text-base">
                  Complete general aptitude questions to assess your learning
                  style.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={startAssessment}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all text-lg font-medium transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800"
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
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
        );

      case "aptitudeQuiz":
        return (
          <Quiz
            questions={aptitudeQuestions}
            onComplete={handleAptitudeAnswersSubmit}
            quizType="aptitude"
            onResetIndex={(reset) => (resetIndexRef.current = reset)}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
        );

      case "results":
        return (
          // Updated to use consistent card styling
          <div className="max-w-4xl w-full p-6 sm:p-10 bg-slate-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-white">
              Assessment Results
            </h1>
            <div className="text-center mb-10">
              <div className="text-xl sm:text-2xl mb-2 text-purple-300">Your Learning Style is</div>
              <div className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-6">
                {learnerType?.toUpperCase() || "Calculating..."}
              </div>
              <p className="text-base sm:text-lg max-w-md mx-auto text-slate-200">
                {learnerType === "fast" &&
                  "You are a quick learner who grasps concepts rapidly and excels with challenging material."}
                {learnerType === "medium" &&
                  "You learn at a steady pace with good retention when concepts are presented clearly."}
                {learnerType === "slow" &&
                  "You benefit from thorough explanations and prefer to master concepts deeply before moving on."}
                {!learnerType && "Your results are being processed."}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800"
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
    // Updated main background and added font-sans
    <div className="bg-gradient-to-br from-slate-900 to-purple-900 min-h-screen flex flex-col items-center justify-center w-full text-white p-4 sm:p-8 font-sans">
      {/* Loading indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg flex flex-col items-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-t-purple-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">
              {currentPhase === "video"
                ? "Loading video questions..."
                : currentPhase === "videoQuiz" // Corrected this phase check
                ? "Loading aptitude questions..."
                : "Processing results..."}
            </p>
          </div>
        </div>
      )}

      {/* Modal for Video */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-3xl bg-slate-800 p-6 rounded-xl shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white text-center">
              Watch the video carefully
            </h3>
            <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${
                  selectedVideo.split("v=")[1]?.split("&")[0] // Robust splitting for URL
                }?autoplay=1&modestbranding=1&rel=0`}
                title="Educational Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => {
                  // Ensure handleVideoEnd is called only once and after video has a chance to load
                  // The timeout here is a placeholder for actual video end detection if possible
                  // For robust solution, YouTube IFrame API would be needed
                  console.log("Video iframe loaded. Setting timeout for handleVideoEnd.");
                  const videoDurationApproximation = 10000; // Placeholder, ideally get from video metadata
                  setTimeout(handleVideoEnd, videoDurationApproximation); 
                }}
              ></iframe>
            </div>
            <p className="text-slate-300 text-center mt-4 text-sm sm:text-base">
              You will be quizzed on the content of this video.
            </p>
          </div>
        </div>
      )}

      {renderContent()}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#334155', // slate-700
            color: '#f1f5f9', // slate-100
          },
          success: {
            iconTheme: {
              primary: '#a855f7', // purple-500
              secondary: '#f1f5f9',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#f1f5f9',
            },
          },
        }}
      />
    </div>
  );
}

export default Assessment;
