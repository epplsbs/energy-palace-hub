
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Save, Phone, Mail, MapPin, Building, Loader2 } from 'lucide-react';

interface BusinessSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
}

const BusinessSettingsManager = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<BusinessSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});

  const defaultSettings = [
    {
      setting_key: 'contact_phone',
      setting_value: '+977-1-4567890',
      description: 'Primary contact phone number',
      setting_type: 'text'
    },
    {
      setting_key: 'contact_email',
      setting_value: 'info@energypalace.com',
      description: 'Primary contact email address',
      setting_type: 'text'
    },
    {
      setting_key: 'business_address',
      setting_value: 'Kathmandu, Nepal',
      description: 'Business location address',
      setting_type: 'text'
    },
    {
      setting_key: 'business_name',
      setting_value: 'Energy Palace',
      description: 'Business name displayed on website',
      setting_type: 'text'
    },
    {
      setting_key: 'business_tagline',
      setting_value: 'Premium EV Charging & Dining Experience',
      description: 'Business tagline or slogan',
      setting_type: 'text'
    },
    {
      setting_key: 'opening_hours',
      setting_value: '24/7',
      description: 'Business operating hours',
      setting_type: 'text'
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Loading business settings...');
      const { data, error } = await supabase
        .from('pos_settings')
        .select('*')
        .in('setting_key', defaultSettings.map(s => s.setting_key));

      if (error) {
        console.error('Error loading settings:', error);
        throw error;
      }

      console.log('Loaded settings:', data);

      // If no settings exist, create default ones
      if (!data || data.length === 0) {
        console.log('No settings found, creating defaults...');
        await createDefaultSettings();
        return;
      }

      setSettings(data);
      
      // Initialize editing state with current values
      const editingState: Record<string, string> = {};
      data.forEach(setting => {
        editingState[setting.setting_key] = setting.setting_value || '';
      });
      setEditingSettings(editingState);

    } catch (error: any) {
      console.error('Error in loadSettings:', error);
      toast({
        title: "Error",
        description: `Failed to load business settings: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      console.log('Creating default settings...');
      const { data, error } = await supabase
        .from('pos_settings')
        .insert(defaultSettings)
        .select();

      if (error) {
        console.error('Error creating default settings:', error);
        throw error;
      }

      console.log('Created default settings:', data);
      setSettings(data || []);
      
      // Initialize editing state
      const editingState: Record<string, string> = {};
      defaultSettings.forEach(setting => {
        editingState[setting.setting_key] = setting.setting_value;
      });
      setEditingSettings(editingState);

      toast({
        title: "Success",
        description: "Default business settings created successfully",
      });

    } catch (error: any) {
      console.error('Error creating default settings:', error);
      toast({
        title: "Error",
        description: `Failed to create default settings: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const updateSetting = async (settingKey: string) => {
    setIsSaving(true);
    try {
      console.log(`Updating setting ${settingKey} with value:`, editingSettings[settingKey]);
      
      const { error } = await supabase
        .from('pos_settings')
        .update({ 
          setting_value: editingSettings[settingKey],
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey);

      if (error) {
        console.error('Error updating setting:', error);
        throw error;
      }

      // Update local state
      setSettings(prev => prev.map(setting => 
        setting.setting_key === settingKey 
          ? { ...setting, setting_value: editingSettings[settingKey] }
          : setting
      ));

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });

    } catch (error: any) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: `Failed to update setting: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSettingIcon = (key: string) => {
    switch (key) {
      case 'contact_phone':
        return <Phone className="h-5 w-5 text-blue-600" />;
      case 'contact_email':
        return <Mail className="h-5 w-5 text-green-600" />;
      case 'business_address':
        return <MapPin className="h-5 w-5 text-red-600" />;
      case 'business_name':
        return <Building className="h-5 w-5 text-purple-600" />;
      default:
        return <Edit className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSettingLabel = (key: string) => {
    switch (key) {
      case 'contact_phone':
        return 'Contact Phone';
      case 'contact_email':
        return 'Contact Email';
      case 'business_address':
        return 'Business Address';
      case 'business_name':
        return 'Business Name';
      case 'business_tagline':
        return 'Business Tagline';
      case 'opening_hours':
        return 'Opening Hours';
      default:
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Loading business settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Edit className="h-6 w-6 mr-2" />
          Business Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map(setting => (
          <Card key={setting.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {getSettingIcon(setting.setting_key)}
                {getSettingLabel(setting.setting_key)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={setting.setting_key}>Value</Label>
                {setting.setting_key === 'business_tagline' ? (
                  <Textarea
                    id={setting.setting_key}
                    value={editingSettings[setting.setting_key] || ''}
                    onChange={(e) => setEditingSettings(prev => ({
                      ...prev,
                      [setting.setting_key]: e.target.value
                    }))}
                    placeholder="Enter value"
                    rows={3}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    id={setting.setting_key}
                    value={editingSettings[setting.setting_key] || ''}
                    onChange={(e) => setEditingSettings(prev => ({
                      ...prev,
                      [setting.setting_key]: e.target.value
                    }))}
                    placeholder="Enter value"
                    className="mt-1"
                  />
                )}
              </div>
              {setting.description && (
                <p className="text-sm text-gray-600">{setting.description}</p>
              )}
              <Button 
                onClick={() => updateSetting(setting.setting_key)}
                disabled={isSaving || editingSettings[setting.setting_key] === setting.setting_value}
                size="sm"
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : 'Update'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Contact Phone:</strong> Displayed in the footer and contact sections</p>
            <p>• <strong>Contact Email:</strong> Used for customer inquiries and notifications</p>
            <p>• <strong>Business Address:</strong> Shown in location information</p>
            <p>• <strong>Business Name:</strong> Displayed as the main title throughout the website</p>
            <p>• <strong>Business Tagline:</strong> Shown in the hero section and headers</p>
            <p>• <strong>Opening Hours:</strong> Displayed in business information sections</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettingsManager;
