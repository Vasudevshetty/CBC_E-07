import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Quiz({ questions }) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(15);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    setTimeLeft(15);
    setSelectedOption(answers[currentQuestionIndex]);
  }, [currentQuestionIndex]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleTimeUp = () => {
    if (answers[currentQuestionIndex] === null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = null;
      setAnswers(newAnswers);
    }

    setTimeout(() => {
      if (isLastQuestion) {
        handleSubmitQuiz();
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 1000);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleSubmitQuiz = () => {
    console.log("Quiz submitted with answers:", answers);
    navigate("/dashboard", { state: { answers } });
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="w-screen min-h-screen text-white flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 p-4 sm:p-8">
        <div className="text-2xl">No questions available for the quiz.</div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen text-white flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full bg-slate-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Question and options section */}
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
              {currentQuestion.options.map((option, index) => (
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
          <div className="flex justify-between items-center mt-10">
            <div>
              {/* Potentially add a previous button or other info here */}
            </div>
            <button
              onClick={isLastQuestion ? handleSubmitQuiz : handleNextQuestion}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                !selectedOption && timeLeft > 0
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 transform hover:scale-105 active:scale-100"
              }`}
              disabled={!selectedOption && timeLeft > 0}
            >
              {isLastQuestion ? "Submit Quiz" : "Next Question →"}
            </button>
          </div>
        </div>

        {/* Image section */}
        <div className="md:w-2/5 h-64 md:h-auto flex items-center justify-center bg-slate-700 bg-opacity-60 p-6">
          {currentQuestion.image ? (
            <img
              src={currentQuestion.image}
              alt="Question illustration"
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg">
              No image for this question.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
