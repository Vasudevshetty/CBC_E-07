import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Quiz from "../components/Quizes/Quiz";

function QuizPage() {
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900">
      <div className="container mx-auto py-8 px-4 overflow-hidden flex items-center justify-center flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          Knowledge Challenge Quiz
        </h1>
        {quizStarted ? (
          <Quiz />
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
            >
              Start Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
