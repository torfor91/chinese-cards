// srs.js — алгоритм интервального повторения (упрощённый SM-2)

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;
const FIRST_INTERVAL = 1;
const SECOND_INTERVAL = 6;

/**
 * Пересчитывает параметры повторения карточки после ответа.
 * @param {Object} card - карточка с полями interval, easeFactor, repetitions
 * @param {number} quality - оценка ответа (0–5)
 * @returns {Object} обновлённые interval, easeFactor, repetitions, nextReviewDate
 */
function calcNextReview(card, quality) {
  let { interval = 0, easeFactor = DEFAULT_EASE_FACTOR, repetitions = 0 } = card;

  if (quality < 3) {
    // Неправильный ответ — сброс
    repetitions = 0;
    interval = FIRST_INTERVAL;
  } else {
    repetitions += 1;

    if (repetitions === 1) {
      interval = FIRST_INTERVAL;
    } else if (repetitions === 2) {
      interval = SECOND_INTERVAL;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < MIN_EASE_FACTOR) {
      easeFactor = MIN_EASE_FACTOR;
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    interval,
    easeFactor,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString().slice(0, 10),
  };
}

/**
 * Проверяет, пора ли повторять карточку.
 * @param {Object} card - карточка с полем nextReviewDate
 * @returns {boolean} true, если дата повторения наступила
 */
function isDueForReview(card) {
  if (!card.nextReviewDate) return true;
  const today = new Date().toISOString().slice(0, 10);
  return card.nextReviewDate <= today;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calcNextReview, isDueForReview };
}