
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Driver = Database['public']['Tables']['drivers']['Row'];
export type DriverInsert = Database['public']['Tables']['drivers']['Insert'];
export type DriverUpdate = Database['public']['Tables']['drivers']['Update'];
export type DriverCommission = Database['public']['Tables']['driver_commissions']['Row'];

export const fetchPublicDrivers = async (): Promise<any[]> => {
  // Use the public view to get driver data
  const { data, error } = await supabase
    .from('public_support_partners' as any)
    .select('*')
    .order('tier', { ascending: false });

  if (error) {
    console.error('Error fetching public drivers:', error);
    throw error;
  }
  return data || [];
};

export const fetchDriverById = async (id: string): Promise<Driver> => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching driver by id:', error);
    throw error;
  }
  return data;
};

export const updateDriver = async (id: string, driverData: DriverUpdate): Promise<Driver> => {
  const { data, error } = await supabase
    .from('drivers')
    .update({ ...driverData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating driver:', error);
    throw error;
  }
  return data;
};

export const fetchPublicDriverById = async (id: string): Promise<any> => {
  const { data, error } = await supabase
    .from('public_support_partners' as any)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching public driver by id:', error);
    throw error;
  }
  return data;
};

export const fetchAllDrivers = async (): Promise<Driver[]> => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all drivers:', error);
    throw error;
  }
  return data || [];
};

export const registerDriver = async (driverData: DriverInsert): Promise<Driver> => {
  const { data, error } = await supabase
    .from('drivers')
    .insert(driverData)
    .select()
    .single();

  if (error) {
    console.error('Error registering driver:', error);
    throw error;
  }
  return data;
};

export const updateDriverStatus = async (id: string, status: 'approved' | 'rejected'): Promise<Driver> => {
  const { data, error } = await supabase
    .from('drivers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating driver status:', error);
    throw error;
  }
  return data;
};

export const fetchDriverCommissions = async (driverId: string): Promise<DriverCommission[]> => {
  const { data, error } = await supabase
    .from('driver_commissions')
    .select('*')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching driver commissions:', error);
    throw error;
  }
  return data || [];
};

export const uploadDriverAsset = async (file: File, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('driver_assets')
    .upload(path, file, { upsert: true });

  if (error) {
    console.error('Error uploading driver asset:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('driver_assets')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const fetchLeaderboard = async (): Promise<Driver[]> => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('status', 'approved')
    .order('total_sales_amount', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
  return data || [];
};
