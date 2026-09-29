import { describe, test, expect } from 'vitest';
import { calcNextReview } from '../src/srs.js';
import { validateCard } from '../src/card.js';

describe('Производительность', () => {
  test('SRS: 1000 карточек за < 100 мс', () => {
    const cards = Array.from({ length: 1000 }, (_, i) => ({
      id: 'id' + i,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
    }));

    const start = performance.now();
    cards.forEach((c) => calcNextReview(c, 5));
    const duration = performance.now() - start;

    console.log(`SRS 1000 карточек: ${duration.toFixed(2)} мс`);
    expect(duration).toBeLessThan(100);
  });

  test('Валидация: 10000 карточек за < 200 мс', () => {
    const cards = Array.from({ length: 10000 }, () => ({
      hieroglyph: '好',
      translation: 'хорошо',
      pinyin: 'hǎo',
      tone: 3,
    }));

    const start = performance.now();
    cards.forEach(validateCard);
    const duration = performance.now() - start;

    console.log(`Валидация 10000 карточек: ${duration.toFixed(2)} мс`);
    expect(duration).toBeLessThan(200);
  });

  test('JSON-сериализация 5000 карточек за < 500 мс', () => {
    const cards = Array.from({ length: 5000 }, (_, i) => ({
      id: 'id' + i,
      hieroglyph: '好',
      translation: 'хорошо' + 'x'.repeat(100),
      pinyin: 'hǎo',
      tone: 3,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: null,
    }));

    const start = performance.now();
    const json = JSON.stringify(cards);
    const parsed = JSON.parse(json);
    const duration = performance.now() - start;

    console.log(`Сериализация 5000 карточек: ${duration.toFixed(2)} мс, размер: ${(json.length / 1024 / 1024).toFixed(2)} МБ`);
    expect(parsed.length).toBe(5000);
    expect(duration).toBeLessThan(500);
  });
});