// src/components/QuizCard.jsx
import { useState } from 'react';

export const QuizCard = ({ question, options, onAnswer, isAnswered = false }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (optionIndex) => {
    if (isAnswered) return;
    setSelected(optionIndex);
    if (onAnswer) onAnswer(question.id, optionIndex);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
      <div className="space-y-2">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full text-left p-3 rounded border transition-colors ${
              selected === idx
                ? 'bg-blue-100 border-blue-500'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};