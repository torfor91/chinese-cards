import { describe, test, expect, beforeEach } from 'vitest';
import { startSession, getCurrentCard, answerCard, isSessionFinished } from '../src/session.js';
import { saveCards, loadCards } from '../src/storage.js';

describe('session.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('startSession выбрасывает SessionError при пустом хранилище', () => {
    expect(() => startSession()).toThrow('Нет карточек для повторения');
  });

  test('startSession создаёт очередь', () => {
    saveCards([{ id: '1', repetitions: 0, nextReviewDate: null }]);
    const s = startSession();
    expect(s.queue.length).toBe(1);
    expect(s.currentIndex).toBe(0);
  });

  test('getCurrentCard возвращает первую карточку', () => {
    saveCards([{ id: '1', hieroglyph: '好', repetitions: 0, nextReviewDate: null }]);
    const s = startSession();
    expect(getCurrentCard(s).hieroglyph).toBe('好');
  });

  test('answerCard увеличивает currentIndex', () => {
    saveCards([{ id: '1', repetitions: 0, nextReviewDate: null, interval: 0, easeFactor: 2.5 }]);
    const s = startSession();
    answerCard(s, 5);
    expect(s.currentIndex).toBe(1);
  });

  test('isSessionFinished после ответа на все карточки', () => {
    saveCards([{ id: '1', repetitions: 0, nextReviewDate: null, interval: 0, easeFactor: 2.5 }]);
    const s = startSession();
    answerCard(s, 5);
    expect(isSessionFinished(s)).toBe(true);
  });
});