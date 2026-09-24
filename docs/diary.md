# Дневник практики

## День 4 — 24.09.2026

### Что сделано
1. Создана структура проекта: docs/, src/, data/, tests/.
2. Настроены стандарты кодирования (.editorconfig, docs/coding-standards.md).
3. Добавлен .gitignore.
4. Написан README.md.
5. Реализован модуль валидации карточки (src/validation.js).
6. Изменения зафиксированы в Git (6 коммитов), запушены на GitHub.

### Созданные файлы
- .editorconfig
- .gitignore
- README.md
- docs/coding-standards.md
- src/index.html
- src/app.js
- src/cards.js
- src/srs.js
- src/validation.js
- src/storage.js
- data/words.json
- tests/srs.test.js
- tests/validation.test.js

### Коммиты
1. Создана структура проекта
2. Добавлен .editorconfig
3. Добавлен .gitignore
4. Добавлены стандарты кодирования
5. Добавлен README
6. Добавлен модуль валидации карточки (validation.js)

### Проблемы и решения
- Git пушил под чужим аккаунтом (asareng7-tech) → удалил креды в Диспетчере учётных данных Windows, настроил remote под torfor91, использовал Personal Access Token.
- Ветка называлась master → переименовал в main командой `git branch -M main`.

### План на день 5
- Завершить реализацию модулей (srs.js, storage.js).
- Написать unit-тесты для validateCard().
- Проверить покрытие границ (иероглиф 0/1/10/11, тон -1/0/4/5).