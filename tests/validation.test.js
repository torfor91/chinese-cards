// validation.test.js — unit-тесты для validateCard

const { validateCard } = require('../src/validation.js');

describe('validateCard', () => {
  test('валидная карточка возвращает null', () => {
    const card = { hieroglyph: '你好', translation: 'привет', pinyin: 'nǐ hǎo', tone: 3 };
    expect(validateCard(card)).toBeNull();
  });

  test('пустой иероглиф — ошибка', () => {
    const card = { hieroglyph: '', translation: 'привет', tone: 3 };
    expect(validateCard(card).hieroglyph).toBeDefined();
  });

  test('иероглиф 11 символов — ошибка', () => {
    const card = { hieroglyph: '一'.repeat(11), translation: 'тест', tone: 1 };
    expect(validateCard(card).hieroglyph).toBeDefined();
  });

  test('тон 5 — ошибка', () => {
    const card = { hieroglyph: '好', translation: 'хорошо', tone: 5 };
    expect(validateCard(card).tone).toBeDefined();
  });

  test('тон «abc» — ошибка', () => {
    const card = { hieroglyph: '好', translation: 'хорошо', tone: 'abc' };
    expect(validateCard(card).tone).toBeDefined();
  });

  test('пустой пиньинь — валидно', () => {
    const card = { hieroglyph: '好', translation: 'хорошо', pinyin: '', tone: 3 };
    expect(validateCard(card)).toBeNull();
  });
});