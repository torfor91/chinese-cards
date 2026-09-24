const { validateCard, createCard } = require('../src/card.js');

describe('card.js', () => {
  describe('validateCard', () => {
    test('валидная карточка → null', () => {
      const card = { hieroglyph: '你好', translation: 'привет', pinyin: 'nǐ hǎo', tone: 3 };
      expect(validateCard(card)).toBeNull();
    });

    test('пустой иероглиф → ошибка', () => {
      const card = { hieroglyph: '', translation: 'привет', tone: 3 };
      expect(validateCard(card).hieroglyph).toBeDefined();
    });

    test('иероглиф 10 символов → валидно', () => {
      const card = { hieroglyph: '一'.repeat(10), translation: 'тест', tone: 1 };
      expect(validateCard(card)).toBeNull();
    });

    test('иероглиф 11 символов → ошибка', () => {
      const card = { hieroglyph: '一'.repeat(11), translation: 'тест', tone: 1 };
      expect(validateCard(card).hieroglyph).toBeDefined();
    });

    test('перевод 100 символов → валидно', () => {
      const card = { hieroglyph: '好', translation: 'a'.repeat(100), tone: 1 };
      expect(validateCard(card)).toBeNull();
    });

    test('перевод 101 символ → ошибка', () => {
      const card = { hieroglyph: '好', translation: 'a'.repeat(101), tone: 1 };
      expect(validateCard(card).translation).toBeDefined();
    });

    test('тон 0 → валидно', () => {
      const card = { hieroglyph: '好', translation: 'хорошо', tone: 0 };
      expect(validateCard(card)).toBeNull();
    });

    test('тон 5 → ошибка', () => {
      const card = { hieroglyph: '好', translation: 'хорошо', tone: 5 };
      expect(validateCard(card).tone).toBeDefined();
    });

    test('тон «abc» → ошибка', () => {
      const card = { hieroglyph: '好', translation: 'хорошо', tone: 'abc' };
      expect(validateCard(card).tone).toBeDefined();
    });

    test('пиньинь 31 символ → ошибка', () => {
      const card = { hieroglyph: '好', translation: 'хорошо', pinyin: 'a'.repeat(31), tone: 3 };
      expect(validateCard(card).pinyin).toBeDefined();
    });
  });

  describe('createCard', () => {
    test('создаёт карточку с id и параметрами SRS', () => {
      const card = createCard('好', 'хорошо', 'hǎo', 3);
      expect(card.id).toBeDefined();
      expect(card.hieroglyph).toBe('好');
      expect(card.easeFactor).toBe(2.5);
      expect(card.repetitions).toBe(0);
    });
  });
});