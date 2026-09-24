// storage.js — работа с localStorage

const STORAGE_KEY = 'chinese-cards';
const SCHEMA_VERSION = 1;

/**
 * Сохраняет карточки в localStorage с версией схемы.
 * @param {Array} cards
 */
function saveCards(cards) {
  const payload = { version: SCHEMA_VERSION, cards };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/**
 * Загружает карточки из localStorage.
 * @returns {Array}
 */
function loadCards() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (parsed.version !== SCHEMA_VERSION) {
      console.warn('Версия схемы устарела, данные могут быть несовместимы');
    }

    return Array.isArray(parsed.cards) ? parsed.cards : [];
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
 * Добавляет карточку в хранилище.
 * @param {Object} card
 * @returns {Array} обновлённый список
 */
function addCard(card) {
  const cards = loadCards();
  cards.push(card);
  saveCards(cards);
  return cards;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { saveCards, loadCards, clearCards, addCard };
}