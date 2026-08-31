import React, { useState, useEffect } from 'react';

export function ResultModal({ status, guesses, puzzleDate, correctAnswer, revealedCount, totalClues }) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(status !== 'playing');

  useEffect(() => {
    if (status !== 'playing') {
      setIsOpen(true);
    }
  }, [status]);

  if (status === 'playing' || !isOpen) return null;

  const isWin = status === 'won';
  
  const generateShareText = () => {
    let grid = '';
    if (isWin) {
      if (guesses.length === 1) grid = '🟩⬜⬜';
      else if (guesses.length === 2) grid = '🟥🟩⬜';
      else if (guesses.length === 3) grid = '🟥🟥🟩';
    } else {
      grid = '🟥🟥🟥';
    }
    
    return `Overheard ${puzzleDate}\nGuesses: ${isWin ? guesses.length : 'X'}/3\nClues: ${revealedCount}/${totalClues}\n${grid}\nhttps://overheard-game.com`;
  };

  const handleShare = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
        <h2 className="modal-title">{isWin ? 'You got it!' : 'Out of guesses'}</h2>
        <p className="modal-answer">
          The relationship was: <strong>{correctAnswer}</strong>
        </p>
        <div className="modal-stats">
          <p>Guesses used: {isWin ? guesses.length : 'X'}/3</p>
          <p>Clues revealed: {revealedCount}/{totalClues}</p>
        </div>
        <button className="share-btn" onClick={handleShare}>
          {copied ? 'Copied to clipboard!' : 'Share Result'}
        </button>
      </div>
    </div>
  );
}
