# Стандарты кодирования

## Именование

| Элемент | Стиль | Пример |
|---|---|---|
| Переменные | camelCase | cardId, reviewDate |
| Константы | UPPER_SNAKE_CASE | MAX_CARD_LENGTH, SRS_INTERVALS |
| Функции | camelCase | calcInterval, isAnswerCorrect |
| Классы | PascalCase | Card, SessionRunner |
| Файлы | kebab-case | card-service.js, srs-algorithm.js |

## Форматирование

- Отступ: 2 пробела.
- Кодировка: UTF-8.
- Перенос строки: LF.
- Точка с запятой: обязательна.
- Кавычки: одинарные.

## Комментарии

- JSDoc для всех функций.
- Комментарии к сложным участкам логики.