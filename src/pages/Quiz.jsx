import { useState } from 'react';
import { QuizCard } from '../components/QuizCard';

export const Quiz = () => {
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, selectedIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedIndex }));
  };

  const questions = [
    { id: 1, text: 'What is React?', options: ['Library', 'Framework', 'Language'] },
    // ...
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {questions.map(q => (
        <QuizCard
          key={q.id}
          question={q}
          options={q.options}
          onAnswer={handleAnswer}
        />
      ))}
    </div>
  );
};