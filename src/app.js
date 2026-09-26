// app.js — точка входа

import { createCard, validateCard } from './card.js';
import { addCard, loadCards, removeCard, saveCards } from './storage.js';
import { startSession, getCurrentCard, answerCard, isSessionFinished } from './session.js';
import { getStats, getProgressPercent } from './stats.js';

const DEBUG = true;

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
  session = startSession();
  if (session.queue.length === 0) {
    alert('Нет карточек для повторения. Добавьте карточки или подождите.');
    return;
  }
  answerShown = false;
  document.getElementById('session-empty').classList.add('hidden');
  document.getElementById('card-view').classList.remove('hidden');
  renderCard();
}

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

function onShowAnswer() {
  answerShown = true;
  document.getElementById('card-translation').classList.remove('hidden');
  document.getElementById('show-answer').classList.add('hidden');
  document.getElementById('answer-buttons').classList.remove('hidden');
}

function onAnswer(quality) {
  if (!answerShown) return;
  answerCard(session, quality);
  renderCard();
}

function finishSession() {
  alert(`Сессия завершена!\nВерно: ${session.correctCount}\nОшибок: ${session.wrongCount}`);
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
    const errors = validateCard(card);

    if (errors) {
      const box = document.getElementById('form-error');
      box.textContent = Object.values(errors).join('\n');
      box.classList.remove('hidden');
      return;
    }

    document.getElementById('form-error').classList.add('hidden');
    addCard(card);
    e.target.reset();
    renderAll();
  });
}

// ---------- Рендер ----------

function renderAll() {
  renderCardsList();
  renderStats();
}

function renderCardsList() {
  const cards = loadCards();
  const list = document.getElementById('cards-list');
  document.getElementById('cards-count').textContent = cards.length;

  if (cards.length === 0) {
    list.innerHTML = '<p style="color:#888">Пока нет карточек. Добавьте первую.</p>';
    return;
  }

  list.innerHTML = cards.map((c) => `
    <div class="card-item">
      <div class="card-item-hieroglyph">${c.hieroglyph}</div>
      <div class="card-item-info">
        <div class="card-item-translation">${c.translation}</div>
        <div class="card-item-translation">${c.pinyin || ''} · тон ${c.tone}</div>
      </div>
      <div class="card-item-actions">
        <button data-id="${c.id}" title="Удалить">×</button>
      </div>
    </div>
  `).join('');

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