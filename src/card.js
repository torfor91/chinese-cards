// card.js — логика карточки

const MAX_HIEROGLYPH_LENGTH = 10;
const MAX_TRANSLATION_LENGTH = 100;
const MAX_PINYIN_LENGTH = 30;
const MIN_TONE = 0;
const MAX_TONE = 4;

/**
 * Создаёт объект карточки.
 * @param {string} hieroglyph
 * @param {string} translation
 * @param {string} pinyin
 * @param {number} tone
 * @returns {Object}
 */
function createCard(hieroglyph, translation, pinyin, tone) {
  return {
    id: crypto.randomUUID(),
    hieroglyph: hieroglyph.trim(),
    translation: translation.trim(),
    pinyin: pinyin ? pinyin.trim() : '',
    tone: Number(tone),
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: null,
  };
}

/**
 * Проверяет карточку на валидность.
 * @param {Object} card
 * @returns {Object|null}
 */
function validateCard(card) {
  const errors = {};

  const h = (card.hieroglyph || '').trim();
  if (!h || h.length > MAX_HIEROGLYPH_LENGTH) {
    errors.hieroglyph = `Иероглиф: от 1 до ${MAX_HIEROGLYPH_LENGTH} символов`;
  }

  const t = (card.translation || '').trim();
  if (!t || t.length > MAX_TRANSLATION_LENGTH) {
    errors.translation = `Перевод: от 1 до ${MAX_TRANSLATION_LENGTH} символов`;
  }

  const tone = Number(card.tone);
  if (!Number.isInteger(tone) || tone < MIN_TONE || tone > MAX_TONE) {
    errors.tone = `Тон: целое число от ${MIN_TONE} до ${MAX_TONE}`;
  }

  if (card.pinyin && card.pinyin.length > MAX_PINYIN_LENGTH) {
    errors.pinyin = `Пиньинь: не более ${MAX_PINYIN_LENGTH} символов`;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export { createCard, validateCard };