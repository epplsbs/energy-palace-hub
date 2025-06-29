
import { supabase } from '@/integrations/supabase/client';

export interface AboutUsContent {
  id: string;
  title: string;
  company_story: string | null;
  mission_statement: string | null;
  vision_statement: string | null;
  values: Array<{ title: string; description: string }>;
  team_description: string | null;
  hero_image_url: string | null;
  created_at: string;
  updated_at: string;
  display_order: number | null;
  is_active: boolean | null;
}

export const getAboutUsContent = async (): Promise<AboutUsContent | null> => {
  console.log('Fetching About Us content...');
  
  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching About Us content:', error);
    return null;
  }

  console.log('About Us content fetched:', data);
  return data as AboutUsContent;
};

export const updateAboutUsContent = async (
  id: string,
  updates: Partial<Omit<AboutUsContent, 'id' | 'created_at' | 'updated_at'>>
): Promise<AboutUsContent> => {
  console.log('Updating About Us content:', id, updates);
  
  const { data, error } = await supabase
    .from('about_us')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating About Us content:', error);
    throw error;
  }

  console.log('About Us content updated:', data);
  return data as AboutUsContent;
};

export const createAboutUsContent = async (
  content: Omit<AboutUsContent, 'id' | 'created_at' | 'updated_at'>
): Promise<AboutUsContent> => {
  console.log('Creating About Us content:', content);
  
  const { data, error } = await supabase
    .from('about_us')
    .insert([content])
    .select()
    .single();

  if (error) {
    console.error('Error creating About Us content:', error);
    throw error;
  }

  console.log('About Us content created:', data);
  return data as AboutUsContent;
};
