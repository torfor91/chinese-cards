// stats.js — статистика прогресса

import { loadCards } from './storage.js';

/**
 * Общая статистика.
 * @returns {Object}
 */
function getStats() {
  const cards = loadCards();
  const total = cards.length;
  const learned = cards.filter((c) => (c.repetitions || 0) >= 3).length;
  const inProgress = cards.filter((c) => (c.repetitions || 0) > 0 && (c.repetitions || 0) < 3).length;
  const fresh = cards.filter((c) => (c.repetitions || 0) === 0).length;
  return { total, learned, inProgress, fresh };
}

/**
 * Процент выученных.
 * @returns {number}
 */
function getProgressPercent() {
  const { total, learned } = getStats();
  if (total === 0) return 0;
  return Math.round((learned / total) * 100);
}

export { getStats, getProgressPercent };