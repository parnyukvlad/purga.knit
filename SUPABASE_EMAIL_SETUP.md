# Настройка Supabase для отключения подтверждения email

Чтобы исправить ошибку "Error sending confirmation email", нужно отключить требование подтверждения email в Supabase.

## Инструкция:

1. **Откройте Supabase Dashboard**
   - Перейдите на https://supabase.com/dashboard
   - Выберите ваш проект

2. **Перейдите в настройки Authentication**
   - В левом меню выберите **Authentication**
   - Затем перейдите в **Providers**
   - Или напрямую: **Authentication** → **Settings**

3. **Отключите подтверждение email**
   - Найдите раздел **"Email Auth"** или **"Email"**
   - Найдите опцию **"Enable email confirmations"** или **"Confirm email"**
   - **Отключите** эту опцию (снимите галочку)
   - Сохраните изменения

4. **Альтернативный способ (через SQL)**
   Если вы не можете найти эту опцию в интерфейсе, выполните SQL запрос:

   ```sql
   -- Отключить подтверждение email для новых пользователей
   UPDATE auth.config 
   SET enable_signup = true,
       enable_email_confirmations = false;
   ```

   Или через Supabase Dashboard:
   - **Authentication** → **Settings** → **Auth Settings**
   - Найдите **"Enable email confirmations"**
   - Установите в **false**

5. **Проверьте настройки SMTP (опционально)**
   Если вы хотите оставить подтверждение email, но настроить отправку писем:
   - **Authentication** → **Email Templates**
   - Настройте SMTP в **Settings** → **Auth** → **SMTP Settings**

## После настройки:

После отключения подтверждения email:
- Пользователи смогут регистрироваться без подтверждения email
- Они сразу получат доступ к аккаунту после регистрации
- Ошибка "Error sending confirmation email" больше не будет появляться

## Важно для продакшена:

В продакшене рекомендуется:
- Настроить SMTP для отправки реальных email
- Включить подтверждение email для безопасности
- Использовать реальный email сервис (SendGrid, Mailgun, и т.д.)

Для разработки и тестирования можно оставить подтверждение отключенным.

