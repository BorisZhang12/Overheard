import React from 'react';

export function OptionsGrid({ options, onGuess, guesses, status, correctAnswer }) {
  return (
    <div className="options-grid">
      {options.map((option) => {
        const isGuessed = guesses.includes(option);
        const isCorrect = isGuessed && option === correctAnswer;
        const isWrong = isGuessed && option !== correctAnswer;
        
        let className = 'option-btn';
        if (isCorrect) className += ' correct';
        else if (isWrong) className += ' guessed';

        return (
          <button
            key={option}
            className={className}
            onClick={() => onGuess(option)}
            disabled={isGuessed || status !== 'playing'}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
