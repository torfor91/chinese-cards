// srs.js — алгоритм интервального повторения (SM-2)

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;
const FIRST_INTERVAL = 1;
const SECOND_INTERVAL = 6;
const MAX_INTERVAL = 365;

/**
 * Пересчитывает параметры повторения.
 * @param {Object} card
 * @param {number} quality 0–5
 * @returns {Object}
 */
function calcNextReview(card, quality) {
  if (quality < 0 || quality > 5) {
    throw new Error('Оценка должна быть от 0 до 5');
  }

  let interval = card.interval || 0;
  let easeFactor = card.easeFactor || DEFAULT_EASE_FACTOR;
  let repetitions = card.repetitions || 0;

  if (quality < 3) {
    repetitions = 0;
    interval = FIRST_INTERVAL;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = FIRST_INTERVAL;
    else if (repetitions === 2) interval = SECOND_INTERVAL;
    else interval = Math.round(interval * easeFactor);

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < MIN_EASE_FACTOR) easeFactor = MIN_EASE_FACTOR;
  }

  if (interval > MAX_INTERVAL) interval = MAX_INTERVAL;

  const next = new Date();
  next.setDate(next.getDate() + interval);

  return {
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    repetitions,
    nextReviewDate: next.toISOString().slice(0, 10),
  };
}

/**
 * Пора ли повторять карточку.
 * @param {Object} card
 * @returns {boolean}
 */
function isDueForReview(card) {
  if (!card.nextReviewDate) return true;
  const today = new Date().toISOString().slice(0, 10);
  return card.nextReviewDate <= today;
}

/**
 * Фильтрует карточки, готовые к повторению.
 * @param {Array} cards
 * @returns {Array}
 */
function getDueCards(cards) {
  return cards.filter(isDueForReview);
}

export { calcNextReview, isDueForReview, getDueCards };