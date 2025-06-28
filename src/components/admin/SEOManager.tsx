
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Globe, Brain, Sparkles, Target, TrendingUp } from 'lucide-react';

interface SEOSetting {
  id: string;
  page_path: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  robots_directives: string;
  schema_markup: any;
  is_active: boolean;
}

interface ContentSuggestion {
  id: string;
  content_type: string;
  title: string;
  content: string;
  keywords: string[];
  target_audience: string;
  status: string;
  created_at: string;
}

const SEOManager = () => {
  const { toast } = useToast();
  const [seoSettings, setSeoSettings] = useState<SEOSetting[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('seo-settings');
  const [editingPage, setEditingPage] = useState<SEOSetting | null>(null);
  const [formData, setFormData] = useState({
    page_path: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    robots_directives: 'index,follow'
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingContent, setGeneratingContent] = useState(false);

  useEffect(() => {
    fetchSEOSettings();
    fetchContentSuggestions();
  }, []);

  const fetchSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_path');

      if (error) throw error;
      setSeoSettings(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch SEO settings",
        variant: "destructive",
      });
    }
  };

  const fetchContentSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_content_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContentSuggestions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch content suggestions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSEOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPage) {
        const { error } = await supabase
          .from('seo_settings')
          .update(formData)
          .eq('id', editingPage.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "SEO settings updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('seo_settings')
          .insert(formData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "SEO settings created successfully",
        });
      }

      setFormData({
        page_path: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_title: '',
        og_description: '',
        og_image: '',
        canonical_url: '',
        robots_directives: 'index,follow'
      });
      setEditingPage(null);
      fetchSEOSettings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seoSetting: SEOSetting) => {
    setEditingPage(seoSetting);
    setFormData({
      page_path: seoSetting.page_path,
      meta_title: seoSetting.meta_title || '',
      meta_description: seoSetting.meta_description || '',
      meta_keywords: seoSetting.meta_keywords || '',
      og_title: seoSetting.og_title || '',
      og_description: seoSetting.og_description || '',
      og_image: seoSetting.og_image || '',
      canonical_url: seoSetting.canonical_url || '',
      robots_directives: seoSetting.robots_directives || 'index,follow'
    });
  };

  const generateAIContent = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for AI content generation",
        variant: "destructive",
      });
      return;
    }

    setGeneratingContent(true);
    try {
      // Simulate AI content generation (you can integrate with actual AI service)
      const suggestions = [
        {
          content_type: 'blog',
          title: `${aiPrompt} - Comprehensive Guide`,
          content: `This is AI-generated content about ${aiPrompt}. In this comprehensive guide, we'll explore various aspects of ${aiPrompt} and its impact on the EV charging industry.`,
          keywords: aiPrompt.split(' ').concat(['EV charging', 'Nepal', 'sustainable energy']),
          target_audience: 'EV enthusiasts and tech-savvy consumers',
          status: 'pending'
        },
        {
          content_type: 'seo',
          title: `${aiPrompt} - SEO Optimized Content`,
          content: `Meta description: Discover everything about ${aiPrompt} at Energy Palace. Leading EV charging solutions in Nepal with premium dining experience.`,
          keywords: aiPrompt.split(' ').concat(['Energy Palace', 'EV charging Nepal']),
          target_audience: 'Search engine users',
          status: 'pending'
        }
      ];

      for (const suggestion of suggestions) {
        await supabase
          .from('ai_content_suggestions')
          .insert(suggestion);
      }

      toast({
        title: "Success",
        description: "AI content suggestions generated successfully",
      });
      
      setAiPrompt('');
      fetchContentSuggestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate AI content",
        variant: "destructive",
      });
    } finally {
      setGeneratingContent(false);
    }
  };

  const updateSuggestionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('ai_content_suggestions')
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Content suggestion ${status}`,
      });
      
      fetchContentSuggestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading && seoSettings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-6 w-6 text-emerald-600" />
        <h2 className="text-2xl font-bold">SEO & AI Optimization</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="seo-settings">SEO Settings</TabsTrigger>
          <TabsTrigger value="ai-content">AI Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="seo-settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {editingPage ? 'Edit SEO Settings' : 'Add New SEO Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSEOSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="page_path">Page Path *</Label>
                    <Input
                      id="page_path"
                      value={formData.page_path}
                      onChange={(e) => setFormData(prev => ({ ...prev, page_path: e.target.value }))}
                      placeholder="/about-us"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="robots_directives">Robots Directives</Label>
                    <Input
                      id="robots_directives"
                      value={formData.robots_directives}
                      onChange={(e) => setFormData(prev => ({ ...prev, robots_directives: e.target.value }))}
                      placeholder="index,follow"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="Page Title - Energy Palace"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="Describe your page in 150-160 characters"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="og_title">Open Graph Title</Label>
                    <Input
                      id="og_title"
                      value={formData.og_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                      placeholder="Social media title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="og_image">Open Graph Image URL</Label>
                    <Input
                      id="og_image"
                      value={formData.og_image}
                      onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="og_description">Open Graph Description</Label>
                  <Textarea
                    id="og_description"
                    value={formData.og_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                    placeholder="Social media description"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="canonical_url">Canonical URL</Label>
                  <Input
                    id="canonical_url"
                    value={formData.canonical_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                    placeholder="https://energypalace.com/page"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {editingPage ? 'Update' : 'Create'} SEO Settings
                  </Button>
                  {editingPage && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditingPage(null);
                        setFormData({
                          page_path: '',
                          meta_title: '',
                          meta_description: '',
                          meta_keywords: '',
                          og_title: '',
                          og_description: '',
                          og_image: '',
                          canonical_url: '',
                          robots_directives: 'index,follow'
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {seoSettings.map((setting) => (
              <Card key={setting.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{setting.page_path}</h3>
                      <p className="text-sm text-gray-600 mt-1">{setting.meta_title}</p>
                      <p className="text-xs text-gray-500 mt-1">{setting.meta_description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(setting)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ai-prompt">Content Prompt</Label>
                  <Textarea
                    id="ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Enter a topic or keyword for AI content generation (e.g., 'sustainable energy in Nepal')"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={generateAIContent}
                  disabled={generatingContent}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generatingContent ? 'Generating...' : 'Generate AI Content'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {contentSuggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {suggestion.content_type.toUpperCase()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            suggestion.status === 'approved' ? 'bg-green-100 text-green-800' :
                            suggestion.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {suggestion.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-semibold mt-2">{suggestion.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{suggestion.content}</p>
                        {suggestion.keywords && suggestion.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {suggestion.keywords.map((keyword, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {suggestion.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateSuggestionStatus(suggestion.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateSuggestionStatus(suggestion.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seoSettings.length}</div>
                <p className="text-xs text-muted-foreground">SEO optimized pages</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Suggestions</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentSuggestions.length}</div>
                <p className="text-xs text-muted-foreground">Generated content pieces</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Overall SEO health</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SEO Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Meta Descriptions</h4>
                    <p className="text-sm text-gray-600">Add meta descriptions to improve click-through rates from search results.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Image Alt Text</h4>
                    <p className="text-sm text-gray-600">Ensure all images have descriptive alt text for better accessibility and SEO.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Local SEO</h4>
                    <p className="text-sm text-gray-600">Optimize for local search queries related to EV charging in Nepal.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOManager;
