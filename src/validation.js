// validation.js — валидация полей карточки

const MAX_HIEROGLYPH_LENGTH = 10;
const MAX_TRANSLATION_LENGTH = 100;
const MAX_PINYIN_LENGTH = 30;
const MIN_TONE = 0;
const MAX_TONE = 4;

/**
 * Проверяет длину строки в допустимых границах.
 * @param {string} value - проверяемое значение
 * @param {number} min - минимальная длина
 * @param {number} max - максимальная длина
 * @returns {boolean} true, если длина в границах
 */
function isValidLength(value, min, max) {
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * Проверяет карточку на валидность.
 * @param {Object} card - объект карточки
 * @param {string} card.hieroglyph - иероглиф (1–10 символов)
 * @param {string} card.translation - перевод (1–100 символов)
 * @param {string} [card.pinyin] - пиньинь (необязательно, 1–30 символов)
 * @param {number} card.tone - тон (целое число 0–4)
 * @returns {Object|null} объект с ошибками или null, если всё валидно
 */
function validateCard(card) {
  const errors = {};

  // Иероглиф: обязательное поле, 1–10 символов
  if (!card.hieroglyph || !isValidLength(card.hieroglyph, 1, MAX_HIEROGLYPH_LENGTH)) {
    errors.hieroglyph = `Иероглиф должен быть от 1 до ${MAX_HIEROGLYPH_LENGTH} символов`;
  }

  // Перевод: обязательное поле, 1–100 символов
  if (!card.translation || !isValidLength(card.translation, 1, MAX_TRANSLATION_LENGTH)) {
    errors.translation = `Перевод должен быть от 1 до ${MAX_TRANSLATION_LENGTH} символов`;
  }

  // Тон: обязательное поле, целое число от 0 до 4
  if (typeof card.tone !== 'number' || !Number.isInteger(card.tone)) {
    errors.tone = 'Тон должен быть числом';
  } else if (card.tone < MIN_TONE || card.tone > MAX_TONE) {
    errors.tone = `Тон должен быть от ${MIN_TONE} до ${MAX_TONE}`;
  }

  // Пиньинь: необязательное поле, но если заполнено — 1–30 символов
  if (card.pinyin && card.pinyin.trim().length > 0) {
    if (!isValidLength(card.pinyin, 1, MAX_PINYIN_LENGTH)) {
      errors.pinyin = `Пиньинь должен быть от 1 до ${MAX_PINYIN_LENGTH} символов`;
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

// Экспорт для тестов (Node.js / Vitest)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateCard, isValidLength };
}