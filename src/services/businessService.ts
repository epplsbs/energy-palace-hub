
import { supabase } from '@/integrations/supabase/client';

export interface BusinessSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
  setting_type?: string;
  updated_at: string;
  updated_by?: string;
}

export const getBusinessSettings = async (): Promise<BusinessSetting[]> => {
  const { data, error } = await supabase
    .from('pos_settings')
    .select('*')
    .order('setting_key');
  
  if (error) throw error;
  return data || [];
};

export const updateBusinessSetting = async (key: string, value: string): Promise<void> => {
  const { error } = await supabase
    .from('pos_settings')
    .upsert({
      setting_key: key,
      setting_value: value,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'setting_key'
    });
  
  if (error) throw error;
};

export const getBusinessSetting = async (key: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('pos_settings')
    .select('setting_value')
    .eq('setting_key', key)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data?.setting_value || null;
};
