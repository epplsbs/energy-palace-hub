
import { supabase } from '@/integrations/supabase/client';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
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
}

export interface AIContentSuggestion {
  id: string;
  title: string;
  content: string;
  content_type: string;
  keywords: string[];
  status: 'pending' | 'approved' | 'rejected';
  target_audience?: string;
  reviewed_by?: string;
  reviewed_at?: string;
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
}

export interface ChargingStation {
  id: string;
  station_id: string;
  type: string;
  power: string;
  connector: string;
  status: 'available' | 'occupied' | 'maintenance';
  estimated_time?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date: string;
  time: string;
  guests: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: any[];
  total_amount: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  order_source: string;
  created_at: string;
}

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

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
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
  if (!data) return null;
  
  return {
    ...data,
    values: Array.isArray(data.values) ? data.values as Array<{ title: string; description: string }> : []
  };
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
  return {
    ...data,
    values: Array.isArray(data.values) ? data.values as Array<{ title: string; description: string }> : []
  };
};

// File upload helper
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
    .from('gallery_items')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem> => {
  const { data, error } = await supabase
    .from('gallery_items')
    .insert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateGalleryItem = async (id: string, item: Partial<GalleryItem>): Promise<void> => {
  const { error } = await supabase
    .from('gallery_items')
    .update(item)
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('gallery_items')
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

export const createEmployee = async (employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> => {
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
    .update(employee)
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
  return (data || []).map(item => ({
    ...item,
    updated_at: item.created_at // Use created_at as fallback for updated_at
  }));
};

export const createAIContentSuggestion = async (content: Omit<AIContentSuggestion, 'id' | 'created_at' | 'updated_at'>): Promise<AIContentSuggestion> => {
  const { data, error } = await supabase
    .from('ai_content_suggestions')
    .insert({
      ...content,
      content_type: content.content_type || 'general'
    })
    .select()
    .single();
  
  if (error) throw error;
  return {
    ...data,
    updated_at: data.created_at
  };
};

export const updateAIContentSuggestion = async (id: string, content: Partial<AIContentSuggestion>): Promise<void> => {
  const { error } = await supabase
    .from('ai_content_suggestions')
    .update(content)
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

export const createMenuCategory = async (category: Omit<MenuCategory, 'id' | 'created_at'>): Promise<MenuCategory> => {
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
    .update(category)
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

export const createMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem> => {
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
    .update(item)
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

// Charging Station functions
export const getChargingStations = async (): Promise<ChargingStation[]> => {
  const { data, error } = await supabase
    .from('charging_stations')
    .select('*')
    .order('station_id');
  
  if (error) throw error;
  return (data || []).map(station => ({
    ...station,
    status: station.status as 'available' | 'occupied' | 'maintenance'
  }));
};

export const updateChargingStation = async (id: string, updates: Partial<ChargingStation>): Promise<void> => {
  const { error } = await supabase
    .from('charging_stations')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
};

// Reservation functions
export const getReservations = async (): Promise<Reservation[]> => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []).map(reservation => ({
    ...reservation,
    status: reservation.status as 'pending' | 'confirmed' | 'cancelled'
  }));
};

export const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at'>): Promise<Reservation> => {
  const { data, error } = await supabase
    .from('reservations')
    .insert(reservation)
    .select()
    .single();
  
  if (error) throw error;
  return {
    ...data,
    status: data.status as 'pending' | 'confirmed' | 'cancelled'
  };
};

export const updateReservation = async (id: string, updates: Partial<Reservation>): Promise<void> => {
  const { error } = await supabase
    .from('reservations')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
};

// Order functions
export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []).map(order => ({
    ...order,
    items: Array.isArray(order.items) ? order.items : [],
    status: order.status as 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  }));
};

export const createOrder = async (order: Omit<Order, 'id' | 'created_at'>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  
  if (error) throw error;
  return {
    ...data,
    items: Array.isArray(data.items) ? data.items : [],
    status: data.status as 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  };
};

export const updateOrder = async (id: string, updates: Partial<Order>): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
};

// Contact functions
export const getContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data || [];
};

export const createContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> => {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateContact = async (id: string, contact: Partial<Contact>): Promise<void> => {
  const { error } = await supabase
    .from('contacts')
    .update({
      ...contact,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteContact = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
