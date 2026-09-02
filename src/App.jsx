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
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    if (gameState.status !== 'playing') {
      setIsResultOpen(true);
    }
  }, [gameState.status]);

  useEffect(() => {
    if (recoveryMode) {
      setIsLoginOpen(true);
    }
  }, [recoveryMode]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left"></div>
        
        <div className="header-center">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <h1>Overheard</h1>
            <div style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.5rem', marginLeft: '1rem', alignItems: 'center' }}>
              <button 
                className="info-btn" 
                onClick={() => setIsInfoOpen(true)} 
                aria-label="How to play"
              >?</button>
              {user ? (
                <button className="auth-btn" onClick={() => signOut()}>Sign Out</button>
              ) : (
                <button className="auth-btn" onClick={() => setIsLoginOpen(true)}>Log In</button>
              )}
            </div>
          </div>
          <p className="subtitle">Read the room. Guess the relationship.</p>
          {globalSolveCount !== null && (
            <p className="global-stats">
              <strong>{globalSolveCount}</strong> {globalSolveCount === 1 ? 'person has' : 'people have'} solved Overheard today!
            </p>
          )}
        </div>
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

        {gameState.status !== 'playing' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-0.5rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setIsResultOpen(true)}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-color)',
                border: 'none',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'opacity 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.opacity = 0.9}
              onMouseOut={(e) => e.target.style.opacity = 1}
            >
              Show Stats
            </button>
          </div>
        )}
      </main>

      <ResultModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
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
