import { useState, useEffect } from 'react';
import { getLocalTodayDateString, getTodayPuzzle } from '../utils/puzzleManager';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const LOCAL_STORAGE_KEY = 'overheard_save';

export function useGameState() {
  const { user } = useAuth();
  const [globalSolveCount, setGlobalSolveCount] = useState(null);
  
  const getStorageKey = (uid) => `overheard_save_${uid}`;

  const getFreshState = () => ({
    date: getLocalTodayDateString(),
    guesses: [], // array of guessed strings
    status: 'playing', // 'playing', 'won', 'lost'
    revealedCount: 1,
  });

  const loadState = (uid) => {
    if (!uid) return getFreshState();
    
    const today = getLocalTodayDateString();
    const saved = localStorage.getItem(getStorageKey(uid));
    
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
    
    return getFreshState();
  };

  const [gameState, setGameState] = useState(() => loadState(user?.id));
  const puzzle = getTodayPuzzle();

  // Reload state if user logs in or out
  useEffect(() => {
    setGameState(loadState(user?.id));
  }, [user?.id]);

  // Save to local storage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(getStorageKey(user.id), JSON.stringify(gameState));
    }
  }, [gameState, user?.id]);

  // Save to database for authenticated users
  useEffect(() => {
    if (gameState.status !== 'playing' && user) {
      const saveResult = async () => {
        const { error } = await supabase.from('user_stats').upsert({
          user_id: user.id,
          date: gameState.date,
          guesses_used: gameState.status === 'won' ? gameState.guesses.length : 3,
          clues_revealed: gameState.revealedCount,
          won: gameState.status === 'won'
        }, { onConflict: 'user_id, date' });
        
        if (error) {
          console.error('Failed to save user stat', error);
        }
      };
      saveResult();
    }
  }, [gameState.status, user, gameState]);

  // Fetch global solve count on mount
  useEffect(() => {
    const fetchSolveCount = async () => {
      try {
        const { data, error } = await supabase
          .from('daily_stats')
          .select('solve_count')
          .eq('date', puzzle.id)
          .single();
          
        if (error) {
          console.error('Supabase Error fetching global count:', error.message, error.details);
        }
          
        if (data) {
          setGlobalSolveCount(data.solve_count);
        } else {
          setGlobalSolveCount(0);
        }
      } catch (err) {
        console.error('Network/Execution Error fetching global count:', err);
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
