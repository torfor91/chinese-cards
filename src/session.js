// session.js — логика сессии повторения

import { getDueCards, calcNextReview } from './srs.js';
import { loadCards, saveCards } from './storage.js';

/**
 * Запускает сессию.
 * @returns {Object}
 */
function startSession() {
  const all = loadCards();
  const due = getDueCards(all);
  return {
    queue: due,
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
  };
}

/**
 * Текущая карточка.
 * @param {Object} session
 * @returns {Object|null}
 */
function getCurrentCard(session) {
  return session.queue[session.currentIndex] || null;
}

/**
 * Обрабатывает ответ.
 * @param {Object} session
 * @param {number} quality
 * @returns {Object}
 */
function answerCard(session, quality) {
  const card = getCurrentCard(session);
  if (!card) return session;

  Object.assign(card, calcNextReview(card, quality));

  if (quality >= 3) session.correctCount += 1;
  else session.wrongCount += 1;

  const all = loadCards();
  const idx = all.findIndex((c) => c.id === card.id);
  if (idx !== -1) {
    all[idx] = card;
    saveCards(all);
  }

  session.currentIndex += 1;
  return session;
}

/**
 * Сессия завершена?
 * @param {Object} session
 * @returns {boolean}
 */
function isSessionFinished(session) {
  return session.currentIndex >= session.queue.length;
}

export { startSession, getCurrentCard, answerCard, isSessionFinished };