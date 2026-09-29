import { describe, test, expect, beforeEach } from 'vitest';
import { saveCards, loadCards, clearCards, addCard, removeCard } from '../src/storage.js';

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('loadCards возвращает [] при пустом localStorage', () => {
    expect(loadCards()).toEqual([]);
  });

  test('saveCards + loadCards — данные сохраняются', () => {
    const cards = [{ id: '1', hieroglyph: '好' }];
    saveCards(cards);
    expect(loadCards()).toEqual(cards);
  });

  test('loadCards возвращает [] при битом JSON', () => {
    localStorage.setItem('chinese-cards', 'xxx');
    expect(loadCards()).toEqual([]);
  });

  test('addCard добавляет карточку', () => {
    const card = { id: '1', hieroglyph: '好' };
    addCard(card);
    expect(loadCards().length).toBe(1);
    expect(loadCards()[0].id).toBe('1');
  });

  test('removeCard удаляет по id', () => {
    saveCards([{ id: '1' }, { id: '2' }]);
    removeCard('1');
    expect(loadCards().length).toBe(1);
    expect(loadCards()[0].id).toBe('2');
  });

  test('clearCards очищает хранилище', () => {
    saveCards([{ id: '1' }]);
    clearCards();
    expect(loadCards()).toEqual([]);
  });
});