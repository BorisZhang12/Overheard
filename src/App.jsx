import React from 'react';
import { useGameState } from './hooks/useGameState';
import { DialogueBox } from './components/DialogueBox';
import { OptionsGrid } from './components/OptionsGrid';
import { GuessIndicators } from './components/GuessIndicators';
import { ResultModal } from './components/ResultModal';
import { InfoModal } from './components/InfoModal';

function App() {
  const { gameState, puzzle, globalSolveCount, makeGuess, revealNextClue, resetGame } = useGameState();
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);

  return (
    <div className="app-container">
      <header className="app-header">
        <button className="info-btn" onClick={() => setIsInfoOpen(true)} aria-label="How to play">?</button>
        <h1>Overheard</h1>
        <p className="subtitle">Read the room. Guess the relationship.</p>
        {globalSolveCount !== null && (
          <p className="global-stats">
            <strong>{globalSolveCount}</strong> {globalSolveCount === 1 ? 'person has' : 'people have'} solved Overheard today!
          </p>
        )}
        <div style={{ marginTop: '0.5rem' }}>
          <button className="reset-btn" onClick={resetGame}>Test: Reset Game</button>
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
    </div>
  );
}

export default App;
