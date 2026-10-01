import { describe, test, expect } from 'vitest';
import { validateCard, createCard, assertValidCard } from '../src/card.js';

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

    test('триммит пробелы в полях', () => {
      const card = createCard('  好  ', '  хорошо  ', '  hǎo  ', 3);
      expect(card.hieroglyph).toBe('好');
      expect(card.translation).toBe('хорошо');
      expect(card.pinyin).toBe('hǎo');
    });

    test('приводит tone к числу', () => {
      const card = createCard('好', 'хорошо', 'hǎo', '3');
      expect(card.tone).toBe(3);
      expect(typeof card.tone).toBe('number');
    });

    test('пустой pinyin → пустая строка', () => {
      const card = createCard('好', 'хорошо', '', 3);
      expect(card.pinyin).toBe('');
    });

    test('id уникален для двух карточек', () => {
      const a = createCard('好', 'хорошо', 'hǎo', 3);
      const b = createCard('好', 'хорошо', 'hǎo', 3);
      expect(a.id).not.toBe(b.id);
    });
  });

  describe('assertValidCard', () => {
    test('валидная карточка — не выбрасывает', () => {
      const card = { hieroglyph: '好', translation: 'хорошо', pinyin: 'hǎo', tone: 3 };
      expect(() => assertValidCard(card)).not.toThrow();
    });

    test('пустой иероглиф — выбрасывает ValidationError', () => {
      const card = { hieroglyph: '', translation: 'хорошо', tone: 3 };
      expect(() => assertValidCard(card)).toThrow('Иероглиф');
    });

    test('тон 5 — выбрасывает ValidationError', () => {
      const card = { hieroglyph: '好', translation: 'хорошо', tone: 5 };
      expect(() => assertValidCard(card)).toThrow('Тон');
    });

    test('ошибка имеет name ValidationError и code VALIDATION_ERROR', () => {
      const card = { hieroglyph: '', translation: 'хорошо', tone: 3 };
      try {
        assertValidCard(card);
        throw new Error('Должно было выбросить');
      } catch (e) {
        expect(e.name).toBe('ValidationError');
        expect(e.code).toBe('VALIDATION_ERROR');
      }
    });
  });
});