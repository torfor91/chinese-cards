# Схема взаимодействия модулей

app.js (точка входа)
├── session.js → srs.js (расчёт интервала)
│              → storage.js (сохранение)
├── stats.js   → storage.js (чтение)
└── card.js    → validation.js (проверка)

Поток данных:
1. Пользователь запускает сессию → session.js
2. session.js берёт карточки из storage.js
3. session.js фильтрует через srs.js (getDueCards)
4. Ответ → srs.js (calcNextReview) → storage.js (saveCards)
5. stats.js обновляет статистику