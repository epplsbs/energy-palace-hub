
-- Create the user account and add to pos_users table
-- This will be executed as a one-time setup

-- Insert the user into pos_users table (assuming the auth user will be created separately)
INSERT INTO public.pos_users (
  auth_user_id,
  full_name,
  username,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder - will be updated with actual user ID
  'Sujan Nepal',
  'sujan1nepal@gmail.com',
  'admin',
  true,
  now(),
  now()
) ON CONFLICT (username) DO NOTHING;
