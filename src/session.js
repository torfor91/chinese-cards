// session.js — логика сессии повторения

import { getDueCards, calcNextReview } from './srs.js';
import { loadCards, saveCards } from './storage.js';

/**
 * Запускает сессию повторения.
 * @returns {Object} состояние сессии
 */
function startSession() {
  const allCards = loadCards();
  if (!Array.isArray(allCards)) {
    console.warn('storage вернул не массив, сброс');
    return { queue: [], currentIndex: 0, correctCount: 0, wrongCount: 0 };
  }
  const dueCards = getDueCards(allCards);
  return {
    queue: dueCards,
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
  };
}

/**
 * Возвращает текущую карточку сессии.
 * @param {Object} session
 * @returns {Object|null}
 */
function getCurrentCard(session) {
  return session.queue[session.currentIndex] || null;
}

/**
 * Обрабатывает ответ пользователя.
 * @param {Object} session
 * @param {number} quality - оценка 0–5
 * @returns {Object} обновлённая сессия
 */
function answerCard(session, quality) {
  const card = getCurrentCard(session);
  if (!card) return session;

  const updated = calcNextReview(card, quality);
  Object.assign(card, updated);

  if (quality >= 3) {
    session.correctCount += 1;
  } else {
    session.wrongCount += 1;
  }

  const allCards = loadCards();
  const index = allCards.findIndex((c) => c.id === card.id);
  if (index !== -1) {
    allCards[index] = card;
    saveCards(allCards);
  }

  session.currentIndex += 1;
  return session;
}

/**
 * Проверяет, завершена ли сессия.
 * @param {Object} session
 * @returns {boolean}
 */
function isSessionFinished(session) {
  return session.currentIndex >= session.queue.length;
}

export { startSession, getCurrentCard, answerCard, isSessionFinished };