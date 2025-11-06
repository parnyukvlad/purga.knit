# Как отключить подтверждение email в Supabase

## Проблема
Ошибка "Error sending confirmation email" появляется при регистрации, хотя подтверждение email не нужно.

## Решения

### Решение 1: Через Supabase Dashboard (если доступно)

1. Откройте **Supabase Dashboard** → ваш проект
2. Перейдите в **Authentication** → **Settings**
3. Найдите раздел **"Email Auth"** или **"Auth Settings"**
4. Найдите опцию **"Enable email confirmations"** или **"Confirm email"**
5. **Отключите** эту опцию (снимите галочку)
6. Сохраните изменения

### Решение 2: Через SQL (для self-hosted Supabase)

Выполните в Supabase SQL Editor:

```sql
-- Проверьте текущие настройки
SELECT name, value 
FROM auth.config 
WHERE name LIKE '%email%' OR name LIKE '%confirm%';

-- Если таблица auth.config существует и доступна, попробуйте:
-- UPDATE auth.config SET value = 'false' WHERE name = 'enable_email_confirmations';
```

**Внимание:** Таблица `auth.config` может быть недоступна в зависимости от версии Supabase.

### Решение 3: Через переменные окружения (для self-hosted)

Если у вас self-hosted Supabase, проверьте файл `.env` на сервере:

```env
# Отключить подтверждение email
GOTRUE_MAILER_AUTOCONFIRM=true
GOTRUE_MAILER_SECURE_EMAIL_CHANGE_ENABLED=false

# Или отключить отправку email полностью
GOTRUE_MAILER_ENABLED=false
```

После изменения перезапустите Supabase:
```bash
docker-compose restart
# или
supabase stop && supabase start
```

### Решение 4: Игнорировать ошибку (текущее решение)

Код уже настроен на игнорирование ошибок отправки email, если пользователь создан успешно. Это безопасно, так как:

1. Пользователь создается в `auth.users`
2. Профиль создается в `purgaknit_users`
3. Ошибка email не влияет на функциональность

### Решение 5: Настроить SMTP (если нужно оставить email)

Если вы хотите, чтобы email работал, но не требовал подтверждения:

1. Настройте SMTP в **Settings** → **Auth** → **SMTP Settings**
2. Используйте сервис типа SendGrid, Mailgun, или Gmail
3. Установите `GOTRUE_MAILER_AUTOCONFIRM=true` в переменных окружения

## Проверка

После применения решения:

1. Попробуйте зарегистрироваться снова
2. Проверьте консоль браузера - ошибка должна игнорироваться
3. Проверьте таблицу `auth.users` - пользователь должен быть создан
4. Проверьте таблицу `purgaknit_users` - профиль должен быть создан

## Текущее состояние

Код уже настроен на:
- ✅ Игнорирование ошибок отправки email
- ✅ Создание профиля пользователя даже при ошибке email
- ✅ Показ успеха только если пользователь и профиль созданы

Ошибка в консоли будет появляться, но регистрация будет работать корректно.

