import { supabase } from "@/integrations/supabase/client";

export interface BusinessSettings {
  contact_phone: string;
  contact_email: string;
  business_address: string;
  business_name: string;
  business_tagline: string;
  opening_hours: string;
  background_image_url?: string;
  logo_url?: string;
  business_latitude?: string;
  business_longitude?: string;
  business_location_name?: string;
}

// Default business settings to use when database is unavailable
const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  contact_phone: "+977-47-520001",
  contact_email: "info@energypalace.com.np",
  business_address: "Bhiman, Sindhuli, Bagmati Province, Nepal",
  business_name: "Energy Palace",
  business_tagline: "Premium EV Charging & Dining Experience",
  opening_hours: "24/7",
  business_latitude: "27.2038",
  business_longitude: "85.9496",
  business_location_name: "Bhiman, Sindhuli, Nepal",
};

export const getBusinessSettings = async (): Promise<BusinessSettings> => {
  console.log("Fetching business settings...");

  try {
    const { data, error } = await supabase
      .from("pos_settings")
      .select("setting_key, setting_value")
      .in("setting_key", [
        "contact_phone",
        "contact_email",
        "business_address",
        "business_name",
        "business_tagline",
        "opening_hours",
        "background_image_url",
        "logo_url",
        "business_latitude",
        "business_longitude",
        "business_location_name",
      ]);

    if (error) {
      console.warn("Database error fetching business settings:", error.message);
      console.log("Using default business settings due to database error");
      return DEFAULT_BUSINESS_SETTINGS;
    }

    if (!data || data.length === 0) {
      console.log("No business settings found in database, using defaults");
      return DEFAULT_BUSINESS_SETTINGS;
    }

    console.log("Business settings fetched successfully:", data);

    // Convert array to object
    const settings: Partial<BusinessSettings> = {};
    data.forEach((setting) => {
      (settings as any)[setting.setting_key] = setting.setting_value;
    });

    // Return with defaults for missing settings
    return {
      contact_phone:
        settings.contact_phone || DEFAULT_BUSINESS_SETTINGS.contact_phone,
      contact_email:
        settings.contact_email || DEFAULT_BUSINESS_SETTINGS.contact_email,
      business_address:
        settings.business_address || DEFAULT_BUSINESS_SETTINGS.business_address,
      business_name:
        settings.business_name || DEFAULT_BUSINESS_SETTINGS.business_name,
      business_tagline:
        settings.business_tagline || DEFAULT_BUSINESS_SETTINGS.business_tagline,
      opening_hours:
        settings.opening_hours || DEFAULT_BUSINESS_SETTINGS.opening_hours,
      background_image_url: settings.background_image_url || undefined,
      logo_url: settings.logo_url || undefined,
      business_latitude:
        settings.business_latitude ||
        DEFAULT_BUSINESS_SETTINGS.business_latitude,
      business_longitude:
        settings.business_longitude ||
        DEFAULT_BUSINESS_SETTINGS.business_longitude,
      business_location_name:
        settings.business_location_name ||
        DEFAULT_BUSINESS_SETTINGS.business_location_name,
    };
  } catch (error) {
    console.error(
      "Network or connection error fetching business settings:",
      error,
    );
    console.log("Using default business settings due to connection error");
    return DEFAULT_BUSINESS_SETTINGS;
  }
};
