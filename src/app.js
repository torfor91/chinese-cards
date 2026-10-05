// app.js — точка входа

import { createCard, assertValidCard } from './card.js';
import { addCard, loadCards, removeCard } from './storage.js';
import { startSession, getCurrentCard, answerCard, isSessionFinished } from './session.js';
import { getStats, getProgressPercent } from './stats.js';

const DEBUG = localStorage.getItem('DEBUG') === 'true' || false;

let session = null;
let answerShown = false;

// ---------- Инициализация ----------

function initApp() {
  if (DEBUG) console.log('Загружен модуль app.js');

  bindNav();
  bindSession();
  bindForm();
  renderAll();
}

// ---------- Навигация ----------

function bindNav() {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ---------- Сессия ----------

function bindSession() {
  document.getElementById('start-session').addEventListener('click', onStartSession);
  document.getElementById('show-answer').addEventListener('click', onShowAnswer);
  document.getElementById('answer-buttons').addEventListener('click', (e) => {
    const q = e.target.dataset.quality;
    if (q) onAnswer(Number(q));
  });
}

function onStartSession() {
  try {
    session = startSession();
  } catch (e) {
    if (e.name === 'SessionError') {
      showSessionMessage(e.message);
      return;
    }
    showSessionMessage('Неизвестная ошибка: ' + e.message);
    return;
  }
  answerShown = false;
  document.getElementById('session-empty').classList.add('hidden');
  document.getElementById('card-view').classList.remove('hidden');
  renderCard();
}

/**
 * Показывает сообщение об ошибке сессии вместо alert.
 * @param {string} message
 */
function showSessionMessage(message) {
  const box = document.getElementById('session-message');
  if (!box) {
    alert(message);
    return;
  }
  box.textContent = message;
  box.classList.remove('hidden');
  setTimeout(() => box.classList.add('hidden'), 4000);
}

function onShowAnswer() {
  answerShown = true;
  document.getElementById('card-translation').classList.remove('hidden');
  document.getElementById('show-answer').classList.add('hidden');
  document.getElementById('answer-buttons').classList.remove('hidden');
}

/**
 * Отображает текущую карточку сессии или завершает её.
 */
function renderCard() {
  const card = getCurrentCard(session);
  if (!card || isSessionFinished(session)) {
    finishSession();
    return;
  }

  document.getElementById('card-current').textContent = session.currentIndex + 1;
  document.getElementById('card-total').textContent = session.queue.length;
  document.getElementById('card-hieroglyph').textContent = card.hieroglyph;
  document.getElementById('card-pinyin').textContent = card.pinyin || '';
  document.getElementById('card-translation').textContent = card.translation;

  answerShown = false;
  document.getElementById('card-translation').classList.add('hidden');
  document.getElementById('answer-buttons').classList.add('hidden');
  document.getElementById('show-answer').classList.remove('hidden');
}

function onAnswer(quality) {
  if (!answerShown) return;

  try {
    answerCard(session, quality);
    renderCard();
  } catch (err) {
    if (err.name === 'StorageError') {
      alert('Не удалось сохранить прогресс: ' + err.message);
    } else {
      alert('Ошибка при обработке ответа: ' + err.message);
    }
    if (DEBUG) console.error(err);
  }
}

function finishSession() {
  showSessionMessage(`Сессия завершена! Верно: ${session.correctCount}, ошибок: ${session.wrongCount}`);
  session = null;
  document.getElementById('card-view').classList.add('hidden');
  document.getElementById('session-empty').classList.remove('hidden');
  renderAll();
}

// ---------- Форма ----------

function bindForm() {
  document.getElementById('card-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const hieroglyph = document.getElementById('input-hieroglyph').value;
    const pinyin = document.getElementById('input-pinyin').value;
    const translation = document.getElementById('input-translation').value;
    const tone = document.getElementById('input-tone').value;

    const card = createCard(hieroglyph, translation, pinyin, tone);
    const errorBox = document.getElementById('form-error');

    try {
      assertValidCard(card);
      addCard(card);
      errorBox.classList.add('hidden');
      e.target.reset();
      renderAll();
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.classList.remove('hidden');
    }
  });
}

// ---------- Рендер ----------

function renderAll() {
  renderCardsList();
  renderStats();
}

/**
 * Экранирует HTML-символы в строке для безопасной вставки в innerHTML.
 * @param {string} str - исходная строка
 * @returns {string} экранированная строка
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderCardsList() {
  const cards = loadCards();
  const list = document.getElementById('cards-list');
  document.getElementById('cards-count').textContent = cards.length;

  if (cards.length === 0) {
    renderEmptyState(list);
    return;
  }

  list.innerHTML = cards.map(renderCardItem).join('');
  bindCardActions(list);
}

/**
 * Рисует пустое состояние списка карточек.
 * @param {HTMLElement} list
 */
function renderEmptyState(list) {
  list.innerHTML = '<p style="color:#888">Пока нет карточек. Добавьте первую.</p>';
}

/**
 * Возвращает HTML одного элемента карточки.
 * @param {Object} c - карточка
 * @returns {string}
 */
function renderCardItem(c) {
  return `
    <div class="card-item">
      <div class="card-item-hieroglyph">${escapeHtml(c.hieroglyph)}</div>
      <div class="card-item-info">
        <div class="card-item-translation">${escapeHtml(c.translation)}</div>
        <div class="card-item-translation">${escapeHtml(c.pinyin || '')} · тон ${escapeHtml(c.tone)}</div>
      </div>
      <div class="card-item-actions">
        <button data-id="${escapeHtml(c.id)}" title="Удалить">×</button>
      </div>
    </div>
  `;
}

/**
 * Навешивает обработчики удаления на кнопки.
 * @param {HTMLElement} list
 */
function bindCardActions(list) {
  list.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeCard(btn.dataset.id);
      renderAll();
    });
  });
}

function renderStats() {
  const s = getStats();
  const p = getProgressPercent();
  document.getElementById('stat-total').textContent = s.total;
  document.getElementById('stat-learned').textContent = s.learned;
  document.getElementById('stat-progress').textContent = s.inProgress;
  document.getElementById('stat-fresh').textContent = s.fresh;
  document.getElementById('progress-fill').style.width = p + '%';
  document.getElementById('progress-percent').textContent = p + '% выучено';

  if (DEBUG) console.table(s);
}

document.addEventListener('DOMContentLoaded', initApp);