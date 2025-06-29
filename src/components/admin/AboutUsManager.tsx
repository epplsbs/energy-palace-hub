
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Info, Plus, Trash2 } from 'lucide-react';
import { 
  getAboutUsContent, 
  updateAboutUsContent, 
  createAboutUsContent,
  type AboutUsContent 
} from '@/services/aboutUsService';

const AboutUsManager = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<AboutUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company_story: '',
    mission_statement: '',
    vision_statement: '',
    team_description: '',
    hero_image_url: '',
    values: [] as Array<{ title: string; description: string }>,
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getAboutUsContent();
      if (data) {
        setContent(data);
        setFormData({
          title: data.title,
          company_story: data.company_story || '',
          mission_statement: data.mission_statement || '',
          vision_statement: data.vision_statement || '',
          team_description: data.team_description || '',
          hero_image_url: data.hero_image_url || '',
          values: Array.isArray(data.values) ? data.values : [],
          is_active: data.is_active || true,
          display_order: data.display_order || 0
        });
      }
    } catch (error) {
      console.error('Error loading about us content:', error);
      toast({
        title: "Error",
        description: "Failed to load about us content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = {
        ...formData
      };

      if (content) {
        await updateAboutUsContent(content.id, submitData);
        toast({
          title: "Content Updated",
          description: "About us content has been updated successfully.",
        });
      } else {
        await createAboutUsContent(submitData);
        toast({
          title: "Content Created",
          description: "About us content has been created successfully.",
        });
      }

      await loadData();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save about us content",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    setFormData(prev => ({
      ...prev,
      values: [...prev.values, { title: '', description: '' }]
    }));
  };

  const updateValue = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">About Us Management</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">About Us Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-emerald-600" />
            About Us Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="About Energy Palace"
                />
              </div>
              <div>
                <Label htmlFor="hero_image_url">Hero Image URL</Label>
                <Input
                  id="hero_image_url"
                  value={formData.hero_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, hero_image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company_story">Company Story</Label>
              <Textarea
                id="company_story"
                value={formData.company_story}
                onChange={(e) => setFormData(prev => ({ ...prev, company_story: e.target.value }))}
                placeholder="Tell your company's story..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="mission_statement">Mission Statement</Label>
                <Textarea
                  id="mission_statement"
                  value={formData.mission_statement}
                  onChange={(e) => setFormData(prev => ({ ...prev, mission_statement: e.target.value }))}
                  placeholder="Our mission..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="vision_statement">Vision Statement</Label>
                <Textarea
                  id="vision_statement"
                  value={formData.vision_statement}
                  onChange={(e) => setFormData(prev => ({ ...prev, vision_statement: e.target.value }))}
                  placeholder="Our vision..."
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="team_description">Team Description</Label>
              <Textarea
                id="team_description"
                value={formData.team_description}
                onChange={(e) => setFormData(prev => ({ ...prev, team_description: e.target.value }))}
                placeholder="Describe your team..."
                rows={3}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Company Values</Label>
                <Button type="button" onClick={addValue} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
              <div className="space-y-4">
                {formData.values.map((value, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Value Title</Label>
                      <Input
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        placeholder="e.g., Innovation"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={value.description}
                          onChange={(e) => updateValue(index, 'description', e.target.value)}
                          placeholder="Describe this value..."
                        />
                        <Button
                          type="button"
                          onClick={() => removeValue(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active on website</Label>
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-24"
                />
              </div>
            </div>

            <Button type="submit" disabled={saving} className="bg-emerald-500 hover:bg-emerald-600">
              {saving ? 'Saving...' : (content ? 'Update Content' : 'Create Content')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUsManager;
