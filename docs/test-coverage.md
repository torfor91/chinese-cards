# Отчёт о покрытии тестами

## Дата: 01.10.2026
## Команда: Широков, Толоконникова
## Инструмент: Vitest 2.1.9 + @vitest/coverage-v8

## Итоговые показатели

- **Всего тестов:** 52
- **Файлов тестов:** 7
- **Общее покрытие:** 97.29%

## Покрытые функции

| Функция | Файл | Кол-во тестов | Статус |
|---|---|---|---|
| validateCard | card.js | 10 | ✅ |
| createCard | card.js | 5 | ✅ |
| assertValidCard | card.js | 4 | ✅ |
| calcNextReview | srs.js | 6 | ✅ |
| isDueForReview | srs.js | 2 | ✅ |
| getDueCards | srs.js | 1 | ✅ |
| saveCards | storage.js | 2 | ✅ |
| loadCards | storage.js | 3 | ✅ |
| clearCards | storage.js | 1 | ✅ |
| addCard | storage.js | 1 | ✅ |
| removeCard | storage.js | 1 | ✅ |
| startSession | session.js | 2 | ✅ |
| getCurrentCard | session.js | 1 | ✅ |
| answerCard | session.js | 1 | ✅ |
| isSessionFinished | session.js | 1 | ✅ |
| getStats | stats.js | 2 | ✅ |
| getProgressPercent | stats.js | 2 | ✅ |

## Непокрытые функции

- `renderCardsList`, `renderStats`, `onStartSession`, `onAnswer`, `onShowAnswer` — UI, покрытие вручную (TC-01…TC-28).
- `escapeHtml` — покрытие через ручной TC-01 (XSS).

## Фактическое покрытие

| Файл | % Stmts | % Branch | % Funcs | % Lines |
|---|---|---|---|---|
| card.js | 100 | 94.44 | 100 | 100 |
| exceptions.js | 90.32 | 100 | 75 | 90.32 |
| session.js | 98.55 | 70 | 100 | 98.55 |
| srs.js | 100 | 95.23 | 100 | 100 |
| stats.js | 100 | 91.66 | 100 | 100 |
| storage.js | 92.06 | 84.61 | 100 | 92.06 |
| **All files** | **97.29** | **89.61** | **95.23** | **97.29** |

## Оценка покрытия

- **Функции:** 17 из 17 бизнес-функций (100%).
- **Критические функции:** 100% (валидация, SRS, storage).
- **UI-функции:** покрыты вручную (28 тест-кейсов).
- **Общее покрытие кода:** 97.29%.

## Ссылки на коммиты дня 10

- Отчёт о покрытии: `9651d09`
- CI: `678c712`
- Взаимное ревью: `bf489fe`
- Дневник: `4846b18`
- Исправления после ревью: `<новый хеш>`

## Вывод

Критические бизнес-функции покрыты unit-тестами на 100%. Общее покрытие кода — 97.29%. UI-функции тестируются вручную. Технический долг закрыт: добавлены тесты для `createCard`, `assertValidCard`, дубли `require` удалены.