import React from 'react';

export default function Questions({ question, questionIndex, selectedAnswer, onAnswerChange }) {
  if (!question) return null;

  return (
    <div className="p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-6">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerChange(questionIndex, option)}
            className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
              selectedAnswer === option
                ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="block text-sm sm:text-base">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}