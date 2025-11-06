-- Отключить подтверждение email в Supabase (для self-hosted или если нет UI опции)

-- Вариант 1: Через auth.config (если доступно)
-- Проверьте, существует ли таблица auth.config
SELECT * FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'config';

-- Если таблица существует, попробуйте:
-- UPDATE auth.config SET enable_email_confirmations = false;

-- Вариант 2: Изменить настройки через функцию (если доступно)
-- Это может не работать в зависимости от версии Supabase

-- Вариант 3: Использовать SMTP настройки (если нужно оставить email, но настроить SMTP)
-- Проверьте настройки SMTP в Dashboard → Settings → Auth → SMTP Settings

-- Вариант 4: Для self-hosted Supabase - проверьте .env файл на сервере
-- GOTRUE_MAILER_AUTOCONFIRM=true
-- GOTRUE_MAILER_SECURE_EMAIL_CHANGE_ENABLED=false

-- Вариант 5: Проверьте текущие настройки
SELECT 
  name, 
  value 
FROM auth.config 
WHERE name LIKE '%email%' OR name LIKE '%confirm%';

