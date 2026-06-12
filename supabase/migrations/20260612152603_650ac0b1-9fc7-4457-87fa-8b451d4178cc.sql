-- Link existing pos_users to their Supabase auth accounts by email
UPDATE public.pos_users p
SET auth_user_id = u.id,
    updated_at = now()
FROM auth.users u
WHERE p.auth_user_id IS NULL
  AND lower(u.email) = lower(p.email);

-- Auto-link future pos_users on insert/update when an auth user with the same email exists
CREATE OR REPLACE FUNCTION public.link_pos_user_to_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.auth_user_id IS NULL AND NEW.email IS NOT NULL THEN
    SELECT u.id INTO NEW.auth_user_id
    FROM auth.users u
    WHERE lower(u.email) = lower(NEW.email)
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_link_pos_user_to_auth ON public.pos_users;
CREATE TRIGGER trg_link_pos_user_to_auth
BEFORE INSERT OR UPDATE OF email ON public.pos_users
FOR EACH ROW EXECUTE FUNCTION public.link_pos_user_to_auth();

-- Also auto-link when a new auth user signs up matching an existing pos_users email
CREATE OR REPLACE FUNCTION public.link_auth_user_to_pos()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.pos_users
  SET auth_user_id = NEW.id, updated_at = now()
  WHERE auth_user_id IS NULL
    AND lower(email) = lower(NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_link_auth_user_to_pos ON auth.users;
CREATE TRIGGER trg_link_auth_user_to_pos
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.link_auth_user_to_pos();