import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mcqQuestions } from "../../data/ui";

const questions = mcqQuestions;

function Quiz() {
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

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    console.log("Quiz submitted with answers:", answers);
    navigate("/quiz-results", { state: { answers } });
  };

  return (
    <div className="w-screen h-[80vh]  text-white flex items-center justify-center">
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
              {currentQuestion.options.map((option, index) => (
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
              onClick={isLastQuestion ? handleSubmitQuiz : handleNextQuestion}
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
          {currentQuestion.imageUrl ? (
            <img
              src={currentQuestion.imageUrl}
              alt="Question illustration"
              className="p-8 w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-700"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
