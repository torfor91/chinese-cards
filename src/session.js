// session.js — логика сессии повторения

import { getDueCards, calcNextReview } from './srs.js';
import { loadCards, saveCards } from './storage.js';
import { SessionError } from './exceptions.js';

/**
 * Запускает сессию повторения.
 * @returns {Object} объект сессии с queue, currentIndex, correctCount, wrongCount
 * @throws {SessionError} если нет карточек, готовых к повторению
 */
function startSession() {
  const all = loadCards();
  const due = getDueCards(all);
  if (due.length === 0) {
    throw new SessionError('Нет карточек для повторения');
  }
  return {
    queue: due,
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
  };
}

/**
 * Возвращает текущую карточку сессии.
 * @param {Object} session
 * @returns {Object|null} карточка или null, если очередь пуста
 */
function getCurrentCard(session) {
  return session.queue[session.currentIndex] || null;
}

/**
 * Обрабатывает ответ пользователя, обновляет SRS-параметры карточки,
 * сохраняет изменения в localStorage и переходит к следующей.
 * Побочные эффекты: изменяет `session` и localStorage.
 * @param {Object} session - текущая сессия
 * @param {number} quality - оценка ответа 0–5
 * @returns {Object} обновлённая сессия
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
 * Проверяет, завершена ли сессия.
 * @param {Object} session
 * @returns {boolean} true, если очередь пройдена
 */
function isSessionFinished(session) {
  return session.currentIndex >= session.queue.length;
}

export { startSession, getCurrentCard, answerCard, isSessionFinished };