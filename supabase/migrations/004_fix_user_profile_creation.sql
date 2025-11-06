-- Добавить политику INSERT для purgaknit_users
-- Это позволит пользователям создавать свои профили

CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
  ON purgaknit_users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Пересоздать триггер с улучшенной обработкой ошибок
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Создать профили для существующих пользователей без профилей
INSERT INTO public.purgaknit_users (id, email, full_name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', NULL) as full_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.purgaknit_users)
ON CONFLICT (id) DO NOTHING;

