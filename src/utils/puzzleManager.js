import puzzles from '../data/puzzles.json';

export function getLocalTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayPuzzle() {
  const today = getLocalTodayDateString();
  const puzzle = puzzles.find((p) => p.id === today);
  
  // For the MVP, if we run out of date-specific puzzles, just return the first one
  // so the game is always playable.
  return puzzle || puzzles[0];
}
