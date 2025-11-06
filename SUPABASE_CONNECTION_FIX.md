# Диагностика подключения к Supabase

## Проблема: Пользователь регистрируется, но не появляется в таблице purgaknit_users

## Шаг 1: Проверьте подключение к Supabase

Выполните в Supabase SQL Editor:

```sql
-- Проверка подключения
SELECT current_database(), current_user, version();
```

Если запрос выполняется успешно, подключение работает.

## Шаг 2: Проверьте, существует ли триггер

Выполните:

```sql
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Если триггер не найден, выполните SQL из файла `supabase/migrations/003_check_connection_and_trigger.sql` (раздел 6).

## Шаг 3: Проверьте пользователей без профилей

Выполните:

```sql
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at,
  pu.id as profile_id
FROM auth.users au
LEFT JOIN public.purgaknit_users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;
```

Если есть пользователи без профилей, создайте их вручную:

```sql
INSERT INTO public.purgaknit_users (id, email, full_name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', NULL) as full_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.purgaknit_users);
```

## Шаг 4: Добавьте политику INSERT для purgaknit_users

**ВАЖНО:** Выполните этот SQL, чтобы пользователи могли создавать свои профили:

```sql
-- Удаляем политику, если она существует
DROP POLICY IF EXISTS "Users can insert their own profile" ON purgaknit_users;

-- Политика для создания профиля пользователем
CREATE POLICY "Users can insert their own profile"
  ON purgaknit_users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## Шаг 5: Пересоздайте триггер (если нужно)

Если триггер не работает, пересоздайте его:

```sql
-- Удалите старый триггер
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Пересоздайте функцию
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.purgaknit_users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создайте триггер заново
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Шаг 6: Проверьте переменные окружения

Убедитесь, что в `.env.local` указаны правильные значения:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Решение проблемы

После выполнения всех шагов:

1. Попробуйте зарегистрироваться снова
2. Проверьте, появился ли пользователь в `purgaknit_users`
3. Если нет, проверьте консоль браузера на наличие ошибок
4. Проверьте логи Supabase в Dashboard → Logs

## Альтернативное решение

Код регистрации теперь автоматически создает профиль пользователя, если триггер не сработал. Это должно решить проблему, даже если триггер не работает.

