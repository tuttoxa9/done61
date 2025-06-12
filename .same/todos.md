# Интеграция Firebase в проект Done61

## Основные задачи

### 🔄 В процессе

- [ ] Протестировать отправку заявок в Firebase (нужно заполнить форму на сайте)

### ✅ Выполнено

- [x] Склонировать репозиторий
- [x] Изучить структуру проекта
- [x] Найти существующую форму заявок (ApplicationForm.tsx)
- [x] Изучить текущую Netlify функцию для отправки в Telegram
- [x] Установить Firebase SDK в проект
- [x] Настроить Firebase конфигурацию
- [x] Создать Firebase service для отправки заявок
- [x] Обновить ApplicationForm для использования Firebase
- [x] Найти и обновить все другие формы на сайте (обновлен Hero.tsx)
- [x] Запустить dev сервер для тестирования
- [x] Создать версию проекта

### 📝 Примечания

- Проект использует Vite + React + TypeScript
- Есть ShadCN UI компоненты
- Настроена двойная отправка: Firebase Firestore + Telegram
- Конфигурация Firebase уже предоставлена пользователем
- Firebase коллекция: 'unic' с полями:
  - fullName, birthDate, phone (основные данные)
  - source (источник заявки: 'main_form' или 'hero_form')
  - status (статус: 'new', 'contacted', 'hired', 'rejected')
  - createdAt (timestamp), userAgent, referrer (техническая информация)
- Если Telegram недоступен, заявка всё равно сохраняется в Firebase
