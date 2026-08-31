import React from 'react';

export function GuessIndicators({ guesses, maxGuesses = 3 }) {
  const indicators = [];
  for (let i = 0; i < maxGuesses; i++) {
    const isUsed = i < guesses.length;
    indicators.push(
      <div 
        key={i} 
        className={`indicator-dot ${isUsed ? 'used' : 'available'}`}
      />
    );
  }

  return (
    <div className="guess-indicators-container">
      <span className="guesses-label">Guesses remaining: {maxGuesses - guesses.length}</span>
      <div className="guess-indicators">
        {indicators}
      </div>
    </div>
  );
}
