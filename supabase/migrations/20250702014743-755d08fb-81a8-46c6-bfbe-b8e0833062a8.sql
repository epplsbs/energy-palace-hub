-- Add photo_url column to contacts table if it doesn't exist
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS photo_url TEXT;