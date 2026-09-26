// storage.js — работа с localStorage

const STORAGE_KEY = 'chinese-cards';

/**
 * Сохраняет массив карточек.
 * @param {Array} cards
 */
function saveCards(cards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

/**
 * Загружает карточки.
 * @returns {Array}
 */
function loadCards() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Ошибка чтения localStorage:', e);
    return [];
  }
}

/**
 * Очищает хранилище.
 */
function clearCards() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Добавляет карточку.
 * @param {Object} card
 * @returns {Array}
 */
function addCard(card) {
  const cards = loadCards();
  cards.push(card);
  saveCards(cards);
  return cards;
}

/**
 * Удаляет карточку по id.
 * @param {string} id
 * @returns {Array}
 */
function removeCard(id) {
  const cards = loadCards().filter((c) => c.id !== id);
  saveCards(cards);
  return cards;
}

export { saveCards, loadCards, clearCards, addCard, removeCard };