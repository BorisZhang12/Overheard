import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

export function ResultModal({ isOpen, onClose, status, guesses, puzzleDate, correctAnswer, revealedCount, totalClues }) {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      const fetchStats = async () => {
        const { data, error } = await supabase
          .from('user_stats')
          .select('clues_revealed, date')
          .eq('user_id', user.id)
          .eq('won', true);
          
        if (!error && data) {
          const distribution = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
          let foundToday = false;
          
          data.forEach(row => {
            if (row.clues_revealed >= 1 && row.clues_revealed <= 6) {
              distribution[row.clues_revealed]++;
            }
            if (row.date === puzzleDate) {
              foundToday = true;
            }
          });
          
          // Fix race condition: If the database hasn't finished saving today's win yet, add it to the chart locally
          if (!foundToday && status === 'won') {
            distribution[revealedCount]++;
          }
          
          setStats(distribution);
        }
      };
      fetchStats();
    }
  }, [isOpen, user, status, puzzleDate, revealedCount]);

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
    
    return `Overheard ${puzzleDate}\nGuesses: ${isWin ? guesses.length : 'X'}/3\nClues: ${revealedCount}/${totalClues}\n${grid}\nhttps://overheardgame.com`;
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">{isWin ? 'You got it!' : 'Out of guesses'}</h2>
        <p className="modal-answer">
          The relationship was: <strong>{correctAnswer}</strong>
        </p>
        <div className="modal-stats">
          <p>Guesses used: {isWin ? guesses.length : 'X'}/3</p>
          <p>Clues revealed: {revealedCount}/{totalClues}</p>
        </div>
        
        <div className="stats-chart-wrapper">
          {!user ? (
            <p style={{fontSize: '0.875rem', marginBottom: '1.5rem', color: 'var(--text-secondary)'}}>Log in to save and track your stats!</p>
          ) : stats && (
            <div className="stats-chart">
              <p className="chart-title">Clues Used (Wins)</p>
              <div className="chart-bars">
                {[1,2,3,4,5,6].map(clueCount => {
                  const count = stats[clueCount] || 0;
                  const maxVal = Math.max(...Object.values(stats), 1);
                  const width = Math.max((count / maxVal) * 100, 8); // min width
                  return (
                    <div key={clueCount} className="chart-row">
                      <span className="chart-label">{clueCount}</span>
                      <div className="chart-bar-container">
                        <div className={`chart-bar ${clueCount === revealedCount && status === 'won' ? 'current' : ''}`} style={{ width: `${width}%` }}>
                          <span className="chart-val">{count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <p style={{ marginTop: '0.5rem', marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Come back tomorrow for a new puzzle!
        </p>
        <button className="share-btn" onClick={handleShare}>
          {copied ? 'Copied to clipboard!' : 'Share Result'}
        </button>
      </div>
    </div>
  );
}
