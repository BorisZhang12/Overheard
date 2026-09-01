import React, { useEffect, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { DialogueBox } from './components/DialogueBox';
import { OptionsGrid } from './components/OptionsGrid';
import { GuessIndicators } from './components/GuessIndicators';
import { ResultModal } from './components/ResultModal';
import { InfoModal } from './components/InfoModal';
import { LoginModal } from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const { gameState, puzzle, globalSolveCount, makeGuess, revealNextClue } = useGameState();
  const { user, signOut, recoveryMode } = useAuth();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (recoveryMode) {
      setIsLoginOpen(true);
    }
  }, [recoveryMode]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-actions">
          {user ? (
            <button className="auth-btn" onClick={() => signOut()}>Sign Out</button>
          ) : (
            <button className="auth-btn" onClick={() => setIsLoginOpen(true)}>Log In</button>
          )}
          <button className="info-btn" onClick={() => setIsInfoOpen(true)} aria-label="How to play">?</button>
        </div>
        <h1>Overheard</h1>
        <p className="subtitle">Read the room. Guess the relationship.</p>
        {globalSolveCount !== null && (
          <p className="global-stats">
            <strong>{globalSolveCount}</strong> {globalSolveCount === 1 ? 'person has' : 'people have'} solved Overheard today!
          </p>
        )}
      </header>

      <main className="game-board">
        <GuessIndicators guesses={gameState.guesses} maxGuesses={3} />
        
        <DialogueBox 
          key={puzzle.id} 
          lines={puzzle.lines} 
          revealedCount={gameState.revealedCount}
          onRevealNext={revealNextClue}
        />
        
        <OptionsGrid 
          options={puzzle.options} 
          onGuess={makeGuess} 
          guesses={gameState.guesses} 
          status={gameState.status}
          correctAnswer={puzzle.correct_answer}
        />
      </main>

      <ResultModal 
        status={gameState.status} 
        guesses={gameState.guesses} 
        puzzleDate={puzzle.id} 
        correctAnswer={puzzle.correct_answer}
        revealedCount={gameState.revealedCount}
        totalClues={puzzle.lines.length}
      />
      
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Analytics />
    </div>
  );
}

export default App;
