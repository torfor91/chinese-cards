# Chinese Cards

Приложение для изучения китайского языка с интервальным повторением (SRS, алгоритм SM-2).

## Возможности

- Добавление карточек: иероглиф, пиньинь, перевод, тон.
- Валидация полей (иероглиф 1–10, перевод 1–100, тон 0–4, пиньинь 1–30).
- Алгоритм SM-2: интервалы 1 → 6 → далее × easeFactor.
- Сессия повторения с показом перевода и оценкой ответа.
- Статистика прогресса (всего / выучено / в процессе / новых).
- Сохранение между сессиями через localStorage.
- Обработка исключений (ValidationError, StorageError, SessionError).
- Адаптивный интерфейс (320px+).

## Стек технологий

- **Frontend:** HTML, CSS, JavaScript (ES-модули).
- **Хранение:** localStorage.
- **Тесты:** Vitest 2.1.9 + @vitest/coverage-v8.
- **CI:** GitHub Actions.

## Быстрый старт

```bash
git clone https://github.com/torfor91/chinese-cards.git
cd chinese-cards
npm install