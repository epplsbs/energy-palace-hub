
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getPosSettings } from '@/services/posService';
import { Settings } from 'lucide-react';

interface POSSettingsProps {
  user: any;
}

const POSSettings = ({ user }: POSSettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getPosSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Settings className="h-6 w-6 mr-2" />
          System Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map(setting => (
          <Card key={setting.id}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">
                {setting.setting_key.replace(/_/g, ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor={setting.setting_key}>Value</Label>
                  <Input
                    id={setting.setting_key}
                    value={setting.setting_value || ''}
                    placeholder="Enter value"
                  />
                </div>
                {setting.description && (
                  <p className="text-sm text-gray-600">{setting.description}</p>
                )}
                <Button size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default POSSettings;
