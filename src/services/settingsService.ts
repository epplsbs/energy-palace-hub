
import { supabase } from '@/integrations/supabase/client';

export interface Setting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: 'text' | 'number' | 'boolean' | 'json';
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

export const getPosSettings = async (): Promise<Setting[]> => {
  console.log('Fetching POS settings...');
  
  const { data, error } = await supabase
    .from('pos_settings')
    .select('*')
    .order('setting_key', { ascending: true });

  if (error) {
    console.error('Error fetching POS settings:', error);
    throw error;
  }

  console.log('POS settings fetched:', data);
  return data as Setting[];
};

export const updatePosSetting = async (
  settingKey: string,
  settingValue: string
): Promise<Setting> => {
  console.log('Updating POS setting:', settingKey, settingValue);
  
  const { data, error } = await supabase
    .from('pos_settings')
    .update({
      setting_value: settingValue,
      updated_at: new Date().toISOString()
    })
    .eq('setting_key', settingKey)
    .select()
    .single();

  if (error) {
    console.error('Error updating POS setting:', error);
    throw error;
  }

  console.log('POS setting updated:', data);
  return data as Setting;
};

export const createPosSetting = async (
  settingKey: string,
  settingValue: string,
  settingType: 'text' | 'number' | 'boolean' | 'json' = 'text',
  description?: string
): Promise<Setting> => {
  console.log('Creating POS setting:', settingKey, settingValue);
  
  const { data, error } = await supabase
    .from('pos_settings')
    .insert([{
      setting_key: settingKey,
      setting_value: settingValue,
      setting_type: settingType,
      description: description || null
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating POS setting:', error);
    throw error;
  }

  console.log('POS setting created:', data);
  return data as Setting;
};
