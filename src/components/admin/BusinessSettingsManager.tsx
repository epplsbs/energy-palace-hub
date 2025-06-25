
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Save, Phone, Mail, MapPin, Building } from 'lucide-react';

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
      description: 'Primary contact phone number'
    },
    {
      setting_key: 'contact_email',
      setting_value: 'info@energypalace.com',
      description: 'Primary contact email address'
    },
    {
      setting_key: 'business_address',
      setting_value: 'Kathmandu, Nepal',
      description: 'Business location address'
    },
    {
      setting_key: 'business_name',
      setting_value: 'Energy Palace',
      description: 'Business name displayed on website'
    },
    {
      setting_key: 'business_tagline',
      setting_value: 'Premium EV Charging & Dining Experience',
      description: 'Business tagline or slogan'
    },
    {
      setting_key: 'opening_hours',
      setting_value: '24/7',
      description: 'Business operating hours'
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('pos_settings')
        .select('*')
        .in('setting_key', defaultSettings.map(s => s.setting_key));

      if (error) throw error;

      // If no settings exist, create default ones
      if (!data || data.length === 0) {
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

    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load business settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('pos_settings')
        .insert(defaultSettings.map(setting => ({
          ...setting,
          setting_type: 'text'
        })))
        .select();

      if (error) throw error;

      setSettings(data || []);
      
      // Initialize editing state
      const editingState: Record<string, string> = {};
      defaultSettings.forEach(setting => {
        editingState[setting.setting_key] = setting.setting_value;
      });
      setEditingSettings(editingState);

    } catch (error) {
      console.error('Error creating default settings:', error);
      toast({
        title: "Error",
        description: "Failed to create default settings",
        variant: "destructive",
      });
    }
  };

  const updateSetting = async (settingKey: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pos_settings')
        .update({ 
          setting_value: editingSettings[settingKey],
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey);

      if (error) throw error;

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

    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
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
    return <div className="text-center py-8">Loading business settings...</div>;
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
          <Card key={setting.id}>
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
                <Save className="h-4 w-4" />
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
