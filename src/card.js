// card.js — логика карточки

const MAX_HIEROGLYPH_LENGTH = 10;
const MAX_TRANSLATION_LENGTH = 100;
const MAX_PINYIN_LENGTH = 30;
const MIN_TONE = 0;
const MAX_TONE = 4;

/**
 * Создаёт объект карточки.
 * @param {string} hieroglyph - иероглиф
 * @param {string} translation - перевод
 * @param {string} pinyin - пиньинь
 * @param {number} tone - тон
 * @returns {Object} объект карточки
 */
function createCard(hieroglyph, translation, pinyin, tone) {
  return {
    id: Date.now(),
    hieroglyph: hieroglyph.trim(),
    translation: translation.trim(),
    pinyin: pinyin ? pinyin.trim() : '',
    tone,
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: null,
  };
}

/**
 * Проверяет карточку на валидность.
 * @param {Object} card - объект карточки
 * @returns {Object|null} объект с ошибками или null
 */
function validateCard(card) {
  const errors = {};

  if (!card.hieroglyph || card.hieroglyph.length < 1 || card.hieroglyph.length > MAX_HIEROGLYPH_LENGTH) {
    errors.hieroglyph = `Иероглиф должен быть от 1 до ${MAX_HIEROGLYPH_LENGTH} символов`;
  }

  if (!card.translation || card.translation.length < 1 || card.translation.length > MAX_TRANSLATION_LENGTH) {
    errors.translation = `Перевод должен быть от 1 до ${MAX_TRANSLATION_LENGTH} символов`;
  }

  if (typeof card.tone !== 'number' || !Number.isInteger(card.tone)) {
    errors.tone = 'Тон должен быть числом';
  } else if (card.tone < MIN_TONE || card.tone > MAX_TONE) {
    errors.tone = `Тон должен быть от ${MIN_TONE} до ${MAX_TONE}`;
  }

  if (card.pinyin && card.pinyin.length > MAX_PINYIN_LENGTH) {
    errors.pinyin = `Пиньинь должен быть не более ${MAX_PINYIN_LENGTH} символов`;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Сохраняет карточку в localStorage.
 * @param {Object} card - карточка
 */
function saveCard(card) {
  const cards = JSON.parse(localStorage.getItem('chinese-cards') || '[]');
  cards.push(card);
  localStorage.setItem('chinese-cards', JSON.stringify(cards));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createCard, validateCard, saveCard };
}