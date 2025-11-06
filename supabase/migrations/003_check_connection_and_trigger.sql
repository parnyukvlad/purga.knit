-- Проверка подключения к Supabase и триггера создания пользователя

-- 1. Проверьте, существует ли триггер
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Проверьте, существует ли функция handle_new_user
SELECT 
  routine_name, 
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';

-- 3. Проверьте, есть ли пользователи в auth.users, но нет в purgaknit_users
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at,
  pu.id as profile_id
FROM auth.users au
LEFT JOIN public.purgaknit_users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- 4. Если есть пользователи без профилей, создайте их вручную:
-- (Замените 'user-id-here' на реальный UUID из запроса выше)
/*
INSERT INTO public.purgaknit_users (id, email, full_name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', NULL) as full_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.purgaknit_users);
*/

-- 5. Проверьте RLS политики для purgaknit_users
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'purgaknit_users';

-- 6. Если триггер не существует, создайте его заново:
/*
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
*/

-- 7. Проверьте подключение к базе данных
SELECT current_database(), current_user, version();

