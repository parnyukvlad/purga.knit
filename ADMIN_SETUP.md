# Как создать первого администратора

## Шаг 1: Запустите миграцию для добавления роли администратора

Откройте Supabase Dashboard → SQL Editor и выполните SQL из файла:
```
supabase/migrations/002_add_admin_role.sql
```

## Шаг 2: Зарегистрируйте аккаунт администратора

1. Перейдите на сайт и зарегистрируйтесь через `/signup`
2. Запомните email, который вы использовали при регистрации

## Шаг 3: Назначьте роль администратора через SQL

Откройте Supabase Dashboard → SQL Editor и выполните следующий SQL запрос:

```sql
-- Замените 'your-email@example.com' на email, который вы использовали при регистрации
UPDATE purgaknit_users 
SET is_admin = TRUE 
WHERE email = 'your-email@example.com';
```

Или если вы знаете UUID пользователя:

```sql
-- Замените 'user-uuid-here' на UUID пользователя из auth.users
UPDATE purgaknit_users 
SET is_admin = TRUE 
WHERE id = 'user-uuid-here';
```

## Шаг 4: Проверьте доступ

1. Выйдите из аккаунта (если вы были залогинены)
2. Войдите снова через `/login`
3. Перейдите на `/admin` - теперь у вас должен быть доступ

## Как найти UUID пользователя (если нужно)

Если вы не знаете UUID пользователя, выполните этот запрос:

```sql
-- Найти пользователя по email
SELECT id, email, full_name, is_admin 
FROM purgaknit_users 
WHERE email = 'your-email@example.com';
```

Или посмотрите всех пользователей:

```sql
SELECT id, email, full_name, is_admin, created_at 
FROM purgaknit_users 
ORDER BY created_at DESC;
```

## Создание дополнительных администраторов

Чтобы назначить администратором другого пользователя, просто выполните:

```sql
UPDATE purgaknit_users 
SET is_admin = TRUE 
WHERE email = 'another-admin@example.com';
```

## Удаление прав администратора

Чтобы убрать права администратора:

```sql
UPDATE purgaknit_users 
SET is_admin = FALSE 
WHERE email = 'user-email@example.com';
```

## Важно

- **Безопасность**: Никогда не храните пароли в открытом виде
- **Первый админ**: Рекомендуется создать первого администратора сразу после развертывания
- **Резервный доступ**: Создайте хотя бы 2 администраторских аккаунта на случай потери доступа

## Проверка текущих администраторов

Чтобы посмотреть всех администраторов:

```sql
SELECT id, email, full_name, created_at 
FROM purgaknit_users 
WHERE is_admin = TRUE;
```

