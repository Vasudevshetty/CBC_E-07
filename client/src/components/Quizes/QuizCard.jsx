import { useState, useEffect } from "react";

function QuizCard({ question, options, image, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onAnswer(null); // Automatically move to the next question if time runs out
    }
  }, [timeLeft, onAnswer]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-md">
      <div className="w-1/2">
        <h2 className="text-xl font-semibold mb-4">{question}</h2>
        <ul className="space-y-2">
          {options.map((option, index) => (
            <li
              key={index}
              className={`p-2 border rounded cursor-pointer ${
                selectedOption === option
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
        {selectedOption && (
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => onAnswer(selectedOption)}
          >
            Next
          </button>
        )}
      </div>
      <div className="w-1/2 flex justify-center">
        <img src={image} alt="Question" className="max-w-full h-auto rounded" />
      </div>
      <div className="absolute top-4 right-4 text-lg font-bold text-red-500">
        {timeLeft}s
      </div>
    </div>
  );
}

export default QuizCard;
