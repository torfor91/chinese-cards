const { calcNextReview, isDueForReview, getDueCards } = require('../src/srs.js');

describe('srs.js', () => {
  describe('calcNextReview', () => {
    test('первый правильный ответ → interval 1', () => {
      const result = calcNextReview({ interval: 0, easeFactor: 2.5, repetitions: 0 }, 5);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
    });

    test('второй правильный ответ → interval 6', () => {
      const result = calcNextReview({ interval: 1, easeFactor: 2.5, repetitions: 1 }, 5);
      expect(result.interval).toBe(6);
      expect(result.repetitions).toBe(2);
    });

    test('неправильный ответ → сброс', () => {
      const result = calcNextReview({ interval: 10, easeFactor: 2.5, repetitions: 5 }, 1);
      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });

    test('easeFactor не ниже 1.3', () => {
      const result = calcNextReview({ interval: 10, easeFactor: 1.3, repetitions: 5 }, 3);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    test('интервал не превышает 365', () => {
      const result = calcNextReview({ interval: 300, easeFactor: 2.5, repetitions: 10 }, 5);
      expect(result.interval).toBeLessThanOrEqual(365);
    });

    test('оценка вне диапазона → ошибка', () => {
      expect(() => calcNextReview({}, 6)).toThrow();
      expect(() => calcNextReview({}, -1)).toThrow();
    });
  });

  describe('isDueForReview', () => {
    test('новая карточка → true', () => {
      expect(isDueForReview({})).toBe(true);
    });

    test('дата в будущем → false', () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      expect(isDueForReview({ nextReviewDate: future.toISOString().slice(0, 10) })).toBe(false);
    });
  });

  describe('getDueCards', () => {
    test('фильтрует только готовые', () => {
      const cards = [
        { nextReviewDate: null },
        { nextReviewDate: '2099-01-01' },
      ];
      expect(getDueCards(cards).length).toBe(1);
    });
  });
});