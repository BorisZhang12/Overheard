import { useState, useEffect } from 'react';
import { getLocalTodayDateString, getTodayPuzzle } from '../utils/puzzleManager';
import { supabase } from '../utils/supabaseClient';

const LOCAL_STORAGE_KEY = 'overheard_save';

export function useGameState() {
  const [globalSolveCount, setGlobalSolveCount] = useState(null);
  
  const [gameState, setGameState] = useState(() => {
    const today = getLocalTodayDateString();
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) {
          // Ensure backwards compatibility if they saved before this feature was added
          if (parsed.revealedCount === undefined) {
            parsed.revealedCount = 1;
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
    
    // Fresh state for today
    return {
      date: today,
      guesses: [], // array of guessed strings
      status: 'playing', // 'playing', 'won', 'lost'
      revealedCount: 1,
    };
  });

  const puzzle = getTodayPuzzle();

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Fetch global solve count on mount
  useEffect(() => {
    const fetchSolveCount = async () => {
      try {
        const { data, error } = await supabase
          .from('daily_stats')
          .select('solve_count')
          .eq('date', puzzle.id)
          .single();
          
        if (data) {
          setGlobalSolveCount(data.solve_count);
        } else {
          setGlobalSolveCount(0);
        }
      } catch (err) {
        console.error('Error fetching global count:', err);
      }
    };
    
    fetchSolveCount();
  }, [puzzle.id]);

  const makeGuess = (guess) => {
    if (gameState.status !== 'playing') return;
    if (gameState.guesses.includes(guess)) return; // already guessed

    const newGuesses = [...gameState.guesses, guess];
    let newStatus = 'playing';

    if (guess === puzzle.correct_answer) {
      newStatus = 'won';
      
      // Increment global counter if this is the first time winning today
      // (This prevents incrementing multiple times if they refresh and somehow replay)
      setGlobalSolveCount(prev => (prev !== null ? prev + 1 : 1));
      
      supabase
        .from('daily_stats')
        .select('solve_count')
        .eq('date', puzzle.id)
        .single()
        .then(({ data }) => {
          const newCount = (data?.solve_count || 0) + 1;
          return supabase.from('daily_stats').upsert({ date: puzzle.id, solve_count: newCount });
        })
        .catch(console.error);

    } else if (newGuesses.length >= 3) {
      newStatus = 'lost';
    }

    setGameState({
      ...gameState,
      guesses: newGuesses,
      status: newStatus,
      revealedCount: newStatus !== 'playing' ? puzzle.lines.length : gameState.revealedCount,
    });
  };

  const revealNextClue = () => {
    if (gameState.status !== 'playing') return;
    setGameState(prev => ({
      ...prev,
      revealedCount: prev.revealedCount + 1
    }));
  };

  return {
    gameState,
    puzzle,
    globalSolveCount,
    makeGuess,
    revealNextClue,
  };
}
