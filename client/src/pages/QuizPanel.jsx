import SideBar from "../components/SideBar";
import { mcqQuestions } from "../data/ui";
import QuizCard from "../components/Quizes/QuizCard";
import { useState } from "react";

function QuizPanel() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (selectedOption) => {
    setAnswers([
      ...answers,
      {
        questionId: mcqQuestions[currentQuestionIndex].id,
        answer: selectedOption,
      },
    ]);
    if (currentQuestionIndex < mcqQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Quiz Completed! Submitting your answers...");
      console.log(answers);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full p-6">
      <h1 className="text-2xl font-semibold mb-6">Quiz Panel</h1>
      <QuizCard
        question={mcqQuestions[currentQuestionIndex].question}
        options={mcqQuestions[currentQuestionIndex].options}
        image={mcqQuestions[currentQuestionIndex].image}
        onAnswer={handleAnswer}
      />
    </div>
  );
}

export default QuizPanel;
