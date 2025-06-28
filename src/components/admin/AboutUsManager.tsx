
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Trash2, Upload, X } from 'lucide-react';
import { getAboutUsContent, updateAboutUsContent, uploadFile, type AboutUsContent } from '@/services/contentService';

const AboutUsManager = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<AboutUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company_story: '',
    mission_statement: '',
    vision_statement: '',
    team_description: '',
    hero_image_url: '',
    values: [] as Array<{ title: string; description: string }>
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
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
          values: data.values || []
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadFile(file, 'menu-items', `about-us/${Date.now()}`);
      setFormData(prev => ({ ...prev, hero_image_url: imageUrl }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content) return;

    try {
      await updateAboutUsContent(content.id, {
        title: formData.title,
        company_story: formData.company_story,
        mission_statement: formData.mission_statement,
        vision_statement: formData.vision_statement,
        team_description: formData.team_description,
        hero_image_url: formData.hero_image_url || null,
        values: formData.values
      });

      toast({
        title: "Success",
        description: "About us content updated successfully",
      });

      await loadContent();
    } catch (error) {
      console.error('Error updating about us content:', error);
      toast({
        title: "Error",
        description: "Failed to update about us content",
        variant: "destructive",
      });
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
      values: prev.values.map((val, i) => 
        i === index ? { ...val, [field]: value } : val
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
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">About Us Management</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-emerald-600" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">About Us Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit About Us Content</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="hero_image">Hero Image</Label>
              <div className="space-y-4">
                <Input
                  id="hero_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                
                {uploading && (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 animate-spin" />
                    <span>Uploading image...</span>
                  </div>
                )}
                
                {formData.hero_image_url && (
                  <div className="relative inline-block">
                    <img 
                      src={formData.hero_image_url} 
                      alt="Hero Preview" 
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="absolute -top-2 -right-2"
                      onClick={() => setFormData(prev => ({ ...prev, hero_image_url: '' }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
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

            <div>
              <Label htmlFor="mission_statement">Mission Statement</Label>
              <Textarea
                id="mission_statement"
                value={formData.mission_statement}
                onChange={(e) => setFormData(prev => ({ ...prev, mission_statement: e.target.value }))}
                placeholder="What is your mission?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="vision_statement">Vision Statement</Label>
              <Textarea
                id="vision_statement"
                value={formData.vision_statement}
                onChange={(e) => setFormData(prev => ({ ...prev, vision_statement: e.target.value }))}
                placeholder="What is your vision?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="team_description">Team Description</Label>
              <Textarea
                id="team_description"
                value={formData.team_description}
                onChange={(e) => setFormData(prev => ({ ...prev, team_description: e.target.value }))}
                placeholder="Describe your team..."
                rows={2}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Company Values</Label>
                <Button type="button" onClick={addValue} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.values.map((value, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label htmlFor={`value_title_${index}`}>Title</Label>
                      <Input
                        id={`value_title_${index}`}
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        placeholder="Value title"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`value_desc_${index}`}>Description</Label>
                        <Input
                          id={`value_desc_${index}`}
                          value={value.description}
                          onChange={(e) => updateValue(index, 'description', e.target.value)}
                          placeholder="Value description"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeValue(index)}
                        className="mt-6"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={uploading}>
              Update About Us Content
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUsManager;
