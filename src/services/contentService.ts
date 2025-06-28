import { supabase } from '@/integrations/supabase/client';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  image_url: string;
  bio: string;
  specialties: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIContentSuggestion {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  image_url?: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Add About Us interfaces and functions
export interface AboutUsContent {
  id: string;
  title: string;
  company_story: string | null;
  mission_statement: string | null;
  vision_statement: string | null;
  values: Array<{ title: string; description: string }>;
  team_description: string | null;
  hero_image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const getAboutUsContent = async (): Promise<AboutUsContent | null> => {
  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateAboutUsContent = async (id: string, content: Partial<AboutUsContent>): Promise<void> => {
  const { error } = await supabase
    .from('about_us')
    .update({
      ...content,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) throw error;
};

export const createAboutUsContent = async (content: Omit<AboutUsContent, 'id' | 'created_at' | 'updated_at'>): Promise<AboutUsContent> => {
  const { data, error } = await supabase
    .from('about_us')
    .insert(content)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Add file upload helper
export const uploadFile = async (file: File, bucket: string, path?: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = path || `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Gallery functions
export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryItem> => {
  const { data, error } = await supabase
    .from('gallery')
    .insert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateGalleryItem = async (id: string, item: Partial<GalleryItem>): Promise<void> => {
  const { error } = await supabase
    .from('gallery')
    .update({
      ...item,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Employee functions
export const getEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert(employee)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .update({
      ...employee,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// AI Content functions
export const getAIContentSuggestions = async (): Promise<AIContentSuggestion[]> => {
  const { data, error } = await supabase
    .from('ai_content_suggestions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createAIContentSuggestion = async (content: Omit<AIContentSuggestion, 'id' | 'created_at' | 'updated_at'>): Promise<AIContentSuggestion> => {
  const { data, error } = await supabase
    .from('ai_content_suggestions')
    .insert(content)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateAIContentSuggestion = async (id: string, content: Partial<AIContentSuggestion>): Promise<void> => {
  const { error } = await supabase
    .from('ai_content_suggestions')
    .update({
      ...content,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteAIContentSuggestion = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('ai_content_suggestions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Menu Category functions
export const getMenuCategories = async (): Promise<MenuCategory[]> => {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data || [];
};

export const createMenuCategory = async (category: Omit<MenuCategory, 'id' | 'created_at' | 'updated_at'>): Promise<MenuCategory> => {
  const { data, error } = await supabase
    .from('menu_categories')
    .insert(category)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateMenuCategory = async (id: string, category: Partial<MenuCategory>): Promise<void> => {
  const { error } = await supabase
    .from('menu_categories')
    .update({
      ...category,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteMenuCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Menu Item functions
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('display_order');
  
  if (error) throw error;
  return data || [];
};

export const createMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<void> => {
  const { error } = await supabase
    .from('menu_items')
    .update({
      ...item,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
