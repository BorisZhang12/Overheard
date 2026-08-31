import React from 'react';

export function DialogueBox({ lines, revealedCount, onRevealNext }) {
  return (
    <div className="dialogue-container">
      {lines.slice(0, revealedCount).map((line, index) => (
        <div 
          key={index} 
          className={`dialogue-line ${line.speaker === 'A' ? 'speaker-a' : 'speaker-b'}`}
        >
          <span className="speaker-label">{line.speaker}</span>
          <p className="dialogue-text">{line.text}</p>
        </div>
      ))}
      
      {revealedCount < lines.length && (
        <button 
          className="dialogue-line reveal-next"
          onClick={onRevealNext}
        >
          click to reveal next sentence
        </button>
      )}
    </div>
  );
}
