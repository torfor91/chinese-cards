// stats.js — статистика прогресса

import { loadCards } from './storage.js';

/**
 * Считает общую статистику по карточкам.
 * @returns {Object} всего, выучено, в процессе, новых
 */
function getStats() {
  const cards = loadCards();
  const total = cards.length;
  const learned = cards.filter((c) => c.repetitions >= 3).length;
  const inProgress = cards.filter((c) => c.repetitions > 0 && c.repetitions < 3).length;
  const fresh = cards.filter((c) => c.repetitions === 0).length;

  return { total, learned, inProgress, fresh };
}

/**
 * Считает процент выученных карточек.
 * @returns {number} процент 0–100
 */
function getProgressPercent() {
  const { total, learned } = getStats();
  if (total === 0) return 0;
  return Math.round((learned / total) * 100);
}

export { getStats, getProgressPercent };