
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type ChargingStation = Tables<'charging_stations'>;
export type MenuCategory = Tables<'menu_categories'>;
export type MenuItem = Tables<'menu_items'>;
export type GalleryItem = Tables<'gallery_items'>;
export type Employee = Tables<'employees'>;
export type Reservation = Tables<'reservations'>;
export type Order = Tables<'orders'>;

// Charging Stations
export const getChargingStations = async () => {
  const { data, error } = await supabase
    .from('charging_stations')
    .select('*')
    .order('station_id');
  
  if (error) throw error;
  return data;
};

export const updateChargingStation = async (id: string, updates: Partial<ChargingStation>) => {
  const { data, error } = await supabase
    .from('charging_stations')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

// Menu Management
export const getMenuCategories = async () => {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data;
};

export const getMenuItems = async () => {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      menu_categories(name)
    `)
    .eq('is_available', true)
    .order('display_order');
  
  if (error) throw error;
  return data;
};

export const getMenuItemsByCategory = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_available', true)
    .order('display_order');
  
  if (error) throw error;
  return data;
};

export const createMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert(item)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteMenuItem = async (id: string) => {
  const { data, error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

// Gallery
export const getGalleryItems = async () => {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data;
};

export const createGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('gallery_items')
    .insert(item)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
  const { data, error } = await supabase
    .from('gallery_items')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteGalleryItem = async (id: string) => {
  const { data, error } = await supabase
    .from('gallery_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

// Employees
export const getEmployees = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data;
};

export const updateEmployee = async (id: string, updates: Partial<Employee>) => {
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

export const createEmployee = async (employee: Omit<Employee, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('employees')
    .insert(employee)
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteEmployee = async (id: string) => {
  const { data, error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

// Reservations
export const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('reservations')
    .insert(reservation)
    .select();
  
  if (error) throw error;
  return data;
};

export const getReservations = async () => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateReservation = async (id: string, updates: Partial<Reservation>) => {
  const { data, error } = await supabase
    .from('reservations')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteReservation = async (id: string) => {
  const { data, error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

// Orders
export const createOrder = async (order: Omit<Order, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select();
  
  if (error) throw error;
  return data;
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateOrder = async (id: string, updates: Partial<Order>) => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteOrder = async (id: string) => {
  const { data, error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

// Contacts Management
export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data;
};

export const createContact = async (contact: {
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  department?: string;
  display_order?: number;
}) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateContact = async (id: string, updates: {
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  department?: string;
  is_active?: boolean;
  display_order?: number;
}) => {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteContact = async (id: string) => {
  const { data, error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

// SEO Settings Management
export const getSEOSettings = async () => {
  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .eq('is_active', true)
    .order('page_path');
  
  if (error) throw error;
  return data;
};

export const createSEOSetting = async (setting: {
  page_path: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots_directives?: string;
  schema_markup?: any;
}) => {
  const { data, error } = await supabase
    .from('seo_settings')
    .insert(setting)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateSEOSetting = async (id: string, updates: {
  page_path?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots_directives?: string;
  schema_markup?: any;
  is_active?: boolean;
}) => {
  const { data, error } = await supabase
    .from('seo_settings')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

// AI Content Suggestions
export const getAIContentSuggestions = async () => {
  const { data, error } = await supabase
    .from('ai_content_suggestions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createAIContentSuggestion = async (suggestion: {
  content_type: string;
  title: string;
  content: string;
  keywords?: string[];
  target_audience?: string;
}) => {
  const { data, error } = await supabase
    .from('ai_content_suggestions')
    .insert(suggestion)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateAIContentSuggestion = async (id: string, updates: {
  content_type?: string;
  title?: string;
  content?: string;
  keywords?: string[];
  target_audience?: string;
  status?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}) => {
  const { data, error } = await supabase
    .from('ai_content_suggestions')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};
