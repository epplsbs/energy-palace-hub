import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Save, Phone, Mail, MapPin, Building, Loader2, Clock, Tag, Image, Upload, Settings, Globe } from 'lucide-react';

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
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

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
    },
    {
      setting_key: 'background_image_url',
      setting_value: '',
      description: 'Background image URL for homepage'
    },
    {
      setting_key: 'logo_url',
      setting_value: '',
      description: 'Website logo URL'
    },
    {
      setting_key: 'business_latitude',
      setting_value: '27.7172',
      description: 'Business location latitude coordinate'
    },
    {
      setting_key: 'business_longitude',
      setting_value: '85.3240',
      description: 'Business location longitude coordinate'
    },
    {
      setting_key: 'business_location_name',
      setting_value: 'Kathmandu, Nepal',
      description: 'Business location display name'
    },
    {
      setting_key: 'email_from_address',
      setting_value: 'noreply@energypalace.com',
      description: 'Email sender address for order confirmations'
    },
    {
      setting_key: 'email_from_name',
      setting_value: 'Energy Palace',
      description: 'Email sender name for order confirmations'
    },
    {
      setting_key: 'email_smtp_host',
      setting_value: '',
      description: 'SMTP server host for email delivery'
    },
    {
      setting_key: 'email_smtp_port',
      setting_value: '587',
      description: 'SMTP server port'
    },
    {
      setting_key: 'email_smtp_user',
      setting_value: '',
      description: 'SMTP username'
    },
    {
      setting_key: 'email_smtp_password',
      setting_value: '',
      description: 'SMTP password'
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
        // Initialize with defaults if no settings exist
        await initializeDefaultSettings();
        return;
      }

      console.log('Loaded settings:', data);

      // Merge with defaults for any missing settings
      const settingsToUse = defaultSettings.map(defaultSetting => {
        const existingSetting = data?.find(s => s.setting_key === defaultSetting.setting_key);
        return existingSetting || {
          id: crypto.randomUUID(),
          setting_key: defaultSetting.setting_key,
          setting_value: defaultSetting.setting_value,
          description: defaultSetting.description
        };
      });
      
      setSettings(settingsToUse);
      
      // Initialize editing state
      const editingState: Record<string, string> = {};
      settingsToUse.forEach(setting => {
        editingState[setting.setting_key] = setting.setting_value || '';
      });
      setEditingSettings(editingState);

    } catch (error: any) {
      console.error('Error in loadSettings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultSettings = async () => {
    try {
      const settingsToInsert = defaultSettings.map(setting => ({
        setting_key: setting.setting_key,
        setting_value: setting.setting_value,
        description: setting.description,
        setting_type: 'text'
      }));

      const { data, error } = await supabase
        .from('pos_settings')
        .insert(settingsToInsert)
        .select();

      if (error) throw error;

      setSettings(data.map(setting => ({
        id: setting.id,
        setting_key: setting.setting_key,
        setting_value: setting.setting_value,
        description: setting.description
      })));

      const editingState: Record<string, string> = {};
      data.forEach(setting => {
        editingState[setting.setting_key] = setting.setting_value || '';
      });
      setEditingSettings(editingState);

    } catch (error: any) {
      console.error('Error initializing settings:', error);
      toast({
        title: "Error",
        description: "Failed to initialize settings",
        variant: "destructive",
      });
    }
  };

  const updateSetting = async (settingKey: string) => {
    if (!editingSettings[settingKey] && settingKey !== 'background_image_url') {
      toast({
        title: "Error",
        description: "Please enter a value before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log(`Updating setting ${settingKey} with value:`, editingSettings[settingKey]);
      
      const { data, error } = await supabase
        .from('pos_settings')
        .upsert({
          setting_key: settingKey,
          setting_value: editingSettings[settingKey],
          description: defaultSettings.find(s => s.setting_key === settingKey)?.description,
          setting_type: 'text',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        })
        .select();

      if (error) {
        console.error('Error saving setting:', error);
        throw error;
      }

      console.log('Setting saved successfully:', data);

      // Update local state
      setSettings(prev => prev.map(setting => 
        setting.setting_key === settingKey 
          ? { ...setting, setting_value: editingSettings[settingKey] }
          : setting
      ));

      // Invalidate the businessSettings query to refetch on other pages
      queryClient.invalidateQueries({ queryKey: ['businessSettings'] });

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });

    } catch (error: any) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File, settingKey: string) => {
    if (!file) return;

    setUploading(prev => ({ ...prev, [settingKey]: true }));
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${settingKey}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('public_assets')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public_assets')
        .getPublicUrl(fileName);

      setEditingSettings(prev => ({
        ...prev,
        [settingKey]: publicUrl
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [settingKey]: false }));
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
      case 'business_tagline':
        return <Tag className="h-5 w-5 text-pink-600" />;
      case 'opening_hours':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'background_image_url':
        return <Image className="h-5 w-5 text-cyan-600" />;
      case 'logo_url':
        return <Image className="h-5 w-5 text-indigo-600" />;
      case 'business_latitude':
        return <MapPin className="h-5 w-5 text-red-600" />;
      case 'business_longitude':
        return <MapPin className="h-5 w-5 text-red-600" />;
      case 'business_location_name':
        return <MapPin className="h-5 w-5 text-red-600" />;
      case 'email_from_address':
        return <Mail className="h-5 w-5 text-green-600" />;
      case 'email_from_name':
        return <Settings className="h-5 w-5 text-blue-600" />;
      case 'email_smtp_host':
        return <Globe className="h-5 w-5 text-purple-600" />;
      case 'email_smtp_port':
        return <Settings className="h-5 w-5 text-orange-600" />;
      case 'email_smtp_user':
        return <Settings className="h-5 w-5 text-cyan-600" />;
      case 'email_smtp_password':
        return <Settings className="h-5 w-5 text-red-600" />;
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
      case 'background_image_url':
        return 'Background Image URL';
      case 'logo_url':
        return 'Logo URL';
      case 'business_latitude':
        return 'Location Latitude';
      case 'business_longitude':
        return 'Location Longitude';
      case 'business_location_name':
        return 'Location Name';
      case 'email_from_address':
        return 'Email From Address';
      case 'email_from_name':
        return 'Email From Name';
      case 'email_smtp_host':
        return 'SMTP Host';
      case 'email_smtp_port':
        return 'SMTP Port';
      case 'email_smtp_user':
        return 'SMTP Username';
      case 'email_smtp_password':
        return 'SMTP Password';
      default:
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const testSMTPConnection = async () => {
    try {
      const testEmailData = {
        type: 'test',
        customerName: 'Test User',
        customerEmail: editingSettings.email_from_address || 'test@example.com',
        orderDetails: {
          message: 'This is a test email to verify SMTP configuration.'
        }
      };

      const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
        body: testEmailData
      });

      if (error) throw error;

      toast({
        title: "SMTP Test Successful",
        description: "Test email sent successfully. Check your inbox.",
      });
    } catch (error: any) {
      console.error('SMTP test error:', error);
      toast({
        title: "SMTP Test Failed",
        description: error.message || "Failed to send test email. Please check your SMTP settings.",
        variant: "destructive",
      });
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
    <div className="space-y-6 bg-white dark:bg-white min-h-screen">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-2xl font-bold flex items-center text-gray-900">
          <Edit className="h-6 w-6 mr-2" />
          Business Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {settings.map(setting => (
          <Card key={setting.setting_key} className="hover:shadow-lg transition-shadow border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                {getSettingIcon(setting.setting_key)}
                {getSettingLabel(setting.setting_key)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={setting.setting_key} className="text-gray-700 font-medium">Value</Label>
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
                    className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                ) : (setting.setting_key === 'background_image_url' || setting.setting_key === 'logo_url') ? (
                  <div className="space-y-2">
                    <Input
                      id={setting.setting_key}
                      value={editingSettings[setting.setting_key] || ''}
                      onChange={(e) => setEditingSettings(prev => ({
                        ...prev,
                        [setting.setting_key]: e.target.value
                      }))}
                      placeholder="https://example.com/image.jpg or upload below"
                      className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, setting.setting_key);
                        }}
                        className="hidden"
                        id={`file-${setting.setting_key}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`file-${setting.setting_key}`)?.click()}
                        disabled={uploading[setting.setting_key]}
                        className="flex items-center gap-2"
                      >
                        {uploading[setting.setting_key] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {uploading[setting.setting_key] ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    </div>
                    {editingSettings[setting.setting_key] && (
                      <div className="mt-2">
                        <img 
                          src={editingSettings[setting.setting_key]} 
                          alt="Preview" 
                          className="max-w-32 max-h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                 ) : (setting.setting_key === 'email_smtp_password') ? (
                   <Input
                     id={setting.setting_key}
                     type="password"
                     value={editingSettings[setting.setting_key] || ''}
                     onChange={(e) => setEditingSettings(prev => ({
                       ...prev,
                       [setting.setting_key]: e.target.value
                     }))}
                     placeholder="Enter password"
                     className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
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
                    className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                )}
              </div>
              {setting.description && (
                <p className="text-sm text-gray-600">{setting.description}</p>
              )}
              <div className="flex items-center">
                <Button 
                  onClick={() => updateSetting(setting.setting_key)}
                  disabled={isSaving || editingSettings[setting.setting_key] === setting.setting_value}
                  size="sm"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSaving ? 'Saving...' : 'Update'}
                </Button>
                {setting.setting_key === 'email_smtp_password' && (
                  <Button
                    onClick={testSMTPConnection}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 ml-2"
                  >
                    Test SMTP
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-200 bg-white m-6">
        <CardHeader>
          <CardTitle className="text-gray-900">Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Contact Phone:</strong> Displayed in the footer and contact sections</p>
            <p>• <strong>Contact Email:</strong> Used for customer inquiries and notifications</p>
            <p>• <strong>Business Address:</strong> Shown in location information</p>
            <p>• <strong>Business Name:</strong> Displayed as the main title throughout the website</p>
            <p>• <strong>Business Tagline:</strong> Shown in the hero section and headers</p>
            <p>• <strong>Opening Hours:</strong> Displayed in business information sections</p>
            <p>• <strong>Background Image URL:</strong> Sets the homepage background image (leave empty for default animated background)</p>
            <p>• <strong>Logo URL:</strong> Website logo displayed in headers and navigation</p>
            <p>• <strong>Location Latitude:</strong> GPS latitude coordinate for map integration</p>
            <p>• <strong>Location Longitude:</strong> GPS longitude coordinate for map integration</p>
            <p>• <strong>Location Name:</strong> Display name for business location</p>
            <p>• <strong>Email From Address:</strong> Email address used to send order confirmations</p>
            <p>• <strong>Email From Name:</strong> Name displayed as sender for order confirmations</p>
            <p>• <strong>SMTP Host:</strong> Email server hostname (e.g., smtp.gmail.com)</p>
            <p>• <strong>SMTP Port:</strong> Email server port (usually 587 for TLS or 465 for SSL)</p>
            <p>• <strong>SMTP Username:</strong> Username for email server authentication</p>
            <p>• <strong>SMTP Password:</strong> Password for email server authentication</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettingsManager;