// app.js — точка входа приложения

const DEBUG = true;

if (DEBUG) {
  console.log('Загружен модуль app.js');
}

import { startSession, getCurrentCard, answerCard, isSessionFinished } from './session.js';
import { getStats, getProgressPercent } from './stats.js';
import { loadCards } from './storage.js';

let currentSession = null;

/**
 * Инициализирует приложение.
 */
function initApp() {
  console.log('Инициализация приложения...');
  renderStats();
  document.getElementById('start-session').addEventListener('click', onStartSession);
  console.log('Приложение готово.');
}

/**
 * Запускает сессию повторения.
 */
function onStartSession() {
  currentSession = startSession();
  if (currentSession.queue.length === 0) {
    alert('Нет карточек для повторения');
    return;
  }
  renderCard();
}

/**
 * Отображает текущую карточку.
 */
function renderCard() {
  const card = getCurrentCard(currentSession);
  if (!card || isSessionFinished(currentSession)) {
    alert(`Сессия завершена. Верно: ${currentSession.correctCount}, Ошибок: ${currentSession.wrongCount}`);
    currentSession = null;
    renderStats();
    return;
  }
  document.getElementById('card-hieroglyph').textContent = card.hieroglyph;
  document.getElementById('card-translation').textContent = card.translation;
}

/**
 * Обрабатывает ответ пользователя.
 * @param {number} quality
 */
function onAnswer(quality) {
  if (!currentSession) return;
  answerCard(currentSession, quality);
  renderCard();
}

/**
 * Отображает статистику.
 */
function renderStats() {
  const stats = getStats();
  const percent = getProgressPercent();
  document.getElementById('stats').textContent =
    `Всего: ${stats.total}, выучено: ${stats.learned} (${percent}%)`;
    if (DEBUG) {
  console.table(getStats());
}
}

document.addEventListener('DOMContentLoaded', initApp);

export { initApp, onAnswer };