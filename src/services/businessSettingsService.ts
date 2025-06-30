
import { supabase } from '@/integrations/supabase/client';

export interface BusinessSettings {
  contact_phone: string;
  contact_email: string;
  business_address: string;
  business_name: string;
  business_tagline: string;
  opening_hours: string;
  background_image_url?: string;
}

export const getBusinessSettings = async (): Promise<BusinessSettings> => {
  console.log('Fetching business settings...');
  
  const { data, error } = await supabase
    .from('pos_settings')
    .select('setting_key, setting_value')
    .in('setting_key', [
      'contact_phone',
      'contact_email', 
      'business_address',
      'business_name',
      'business_tagline',
      'opening_hours',
      'background_image_url'
    ]);

  if (error) {
    console.error('Error fetching business settings:', error);
    // Return default values if error
    return {
      contact_phone: '+977-1-4567890',
      contact_email: 'info@energypalace.com',
      business_address: 'Kathmandu, Nepal',
      business_name: 'Energy Palace',
      business_tagline: 'Premium EV Charging & Dining Experience',
      opening_hours: '24/7',
    };
  }

  console.log('Business settings fetched:', data);

  // Convert array to object
  const settings: Partial<BusinessSettings> = {};
  data?.forEach(setting => {
    (settings as any)[setting.setting_key] = setting.setting_value;
  });

  // Return with defaults for missing settings
  return {
    contact_phone: settings.contact_phone || '+977-1-4567890',
    contact_email: settings.contact_email || 'info@energypalace.com',
    business_address: settings.business_address || 'Kathmandu, Nepal',
    business_name: settings.business_name || 'Energy Palace',
    business_tagline: settings.business_tagline || 'Premium EV Charging & Dining Experience',
    opening_hours: settings.opening_hours || '24/7',
    background_image_url: settings.background_image_url || undefined,
  };
};
