// storage.js — работа с localStorage

const STORAGE_KEY = 'chinese-cards';

/**
 * Сохраняет массив карточек в localStorage.
 * @param {Array} cards - массив карточек
 */
function saveCards(cards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

/**
 * Загружает карточки из localStorage.
 * @returns {Array} массив карточек или пустой массив
 */
function loadCards() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * Очищает хранилище карточек.
 */
function clearCards() {
  localStorage.removeItem(STORAGE_KEY);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { saveCards, loadCards, clearCards };
}