import { describe, test, expect, beforeEach } from 'vitest';
import { getStats, getProgressPercent } from '../src/stats.js';
import { saveCards } from '../src/storage.js';

describe('stats.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('пустое хранилище — все нули', () => {
    const s = getStats();
    expect(s.total).toBe(0);
    expect(s.learned).toBe(0);
    expect(getProgressPercent()).toBe(0);
  });

  test('3 карточки — корректная статистика', () => {
    saveCards([
      { id: '1', repetitions: 3 },
      { id: '2', repetitions: 1 },
      { id: '3', repetitions: 0 },
    ]);
    const s = getStats();
    expect(s.total).toBe(3);
    expect(s.learned).toBe(1);
    expect(s.inProgress).toBe(1);
    expect(s.fresh).toBe(1);
  });

  test('процент выученных', () => {
    saveCards([
      { id: '1', repetitions: 3 },
      { id: '2', repetitions: 3 },
      { id: '3', repetitions: 0 },
      { id: '4', repetitions: 0 },
    ]);
    expect(getProgressPercent()).toBe(50);
  });

  test('все новые карточки — 0%', () => {
    saveCards([{ id: '1', repetitions: 0 }, { id: '2', repetitions: 0 }]);
    expect(getProgressPercent()).toBe(0);
  });
});