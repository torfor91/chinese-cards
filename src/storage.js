// storage.js — работа с localStorage

const STORAGE_KEY = 'chinese-cards';

/**
 * Сохраняет массив карточек.
 * @param {Array} cards
 */
import { StorageError } from './exceptions.js';

function saveCards(cards) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      throw new StorageError('Хранилище переполнено. Удалите старые карточки.');
    }
    throw new StorageError('Не удалось сохранить данные: ' + e.message);
  }
}

function loadCards() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Битый JSON в localStorage, сброс:', e);
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