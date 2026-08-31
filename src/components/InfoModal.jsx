import React from 'react';

export function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content info-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">How to Play</h2>
        
        <div className="info-rules">
          <p>Read the snippet of dialogue and try to guess the relationship between the two speakers.</p>
          
          <ul>
            <li>You are given up to <strong>6 lines of dialogue</strong> in a conversation. Reveal them line by line to build context.</li>
            <li>You have <strong>3 guesses</strong> to find the correct relationship.</li>
            <li>Wrong guesses will be crossed out.</li>
            <li>A new puzzle is released every day!</li>
          </ul>
          
          <p className="feedback-text">
            Have feedback? Let us know via <a href="https://forms.gle/sjozVc2JjEKpw5Mz6" target="_blank" rel="noopener noreferrer">this form</a> or email <a href="mailto:overheardsupport@gmail.com">overheardsupport@gmail.com</a>.
          </p>
          
          <div className="info-example">
            <p className="info-example-title">Example:</p>
            <div className="dialogue-line speaker-a">
              <span className="speaker-label">A</span>
              <p className="dialogue-text">"Did you feed the dog?"</p>
            </div>
            <div className="dialogue-line speaker-b">
              <span className="speaker-label">B</span>
              <p className="dialogue-text">"I thought you did it before you left for work."</p>
            </div>
            <p className="info-example-answer">Answer: <strong>Long-term couple</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
