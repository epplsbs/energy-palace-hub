
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getGalleryItems } from '@/services/contentService';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import { useSEO } from '@/hooks/useSEO';
import { Zap, ArrowLeft, Calendar, Tag, BookOpen, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

const Blog = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const backgroundImageUrl = useBackgroundImage();
  useSEO('/blog');

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const data = await getGalleryItems();
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item: GalleryItem) => {
    setSelectedPost(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-futuristic flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-futuristic relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Header */}
      <header className="relative z-20 p-4 md:p-6">
        <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
              <Zap className="h-6 md:h-8 w-6 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Energy Palace
              </h1>
              <p className="text-sm text-white/60">Our Journey</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-8 text-white/80">
            <a href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </a>
            <a href="/contacts" className="hover:text-emerald-400 transition-colors">Contacts</a>
            <a href="/about" className="hover:text-emerald-400 transition-colors">About</a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>
        </div>

        {/* Hero Image */}
        {aboutContent?.hero_image_url && (
          <div className="mb-12 md:mb-20">
            <img 
              src={aboutContent.hero_image_url} 
              alt="Energy Palace"
              className="w-full h-64 md:h-96 object-cover rounded-2xl"
            />
          </div>
        )}

        {/* Company Story */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-20">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 md:p-12 text-white mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h3>
            <div className="text-base md:text-lg leading-relaxed space-y-4">
              {aboutContent?.company_story ? (
                aboutContent.company_story.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>
                    Energy Palace was born from a vision to revolutionize the EV charging experience. We recognized that 
                    charging your electric vehicle shouldn't be just about plugging in – it should be an opportunity to 
                    relax, recharge yourself, and enjoy premium amenities.
                  </p>
                  <p>
                    Founded in 2024, we've combined cutting-edge charging technology with exceptional hospitality to create 
                    a destination that serves both your vehicle and your well-being. Our state-of-the-art facility features 
                    high-speed charging stations alongside a premium restaurant and coffee shop, making every visit a 
                    delightful experience.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Company Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {companyValues.map((value, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 md:h-8 w-6 md:w-8 text-emerald-600" />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white mb-2">{value.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {aboutContent?.mission_statement && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-emerald-400 mb-4">Our Mission</h3>
                <p className="text-white/90 leading-relaxed">{aboutContent.mission_statement}</p>
              </CardContent>
            </Card>
          )}
          
          {aboutContent?.vision_statement && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-4">Our Vision</h3>
                <p className="text-white/90 leading-relaxed">{aboutContent.vision_statement}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Generated Content */}
        {aiContent.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100/20 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-purple-300 text-sm font-medium">AI Insights</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Latest Insights</h3>
              <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
                Discover the latest insights and content about Energy Palace and the EV industry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
              {aiContent.slice(0, 4).map((content) => (
                <Card key={content.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-3">{content.title}</h4>
                    <p className="text-white/70 leading-relaxed mb-4">{content.content.substring(0, 200)}...</p>
                    {content.keywords && content.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {content.keywords.slice(0, 3).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-white/30 text-white/80">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Team Section */}
        {employees.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Meet Our Team</h3>
              <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
                {aboutContent?.team_description || 'Our dedicated professionals are committed to providing exceptional service and expertise'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {employees.map((employee) => (
                <Card key={employee.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={employee.image_url} 
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 md:p-6">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-1">{employee.name}</h4>
                    <p className="text-emerald-400 font-semibold mb-3 text-sm md:text-base">{employee.designation}</p>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">{employee.bio}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {employee.specialties?.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-white/30 text-white/80">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Final Mission Statement */}
        <div className="text-center">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-12 border border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto">
              {aboutContent?.mission_statement || 
                'To accelerate the adoption of sustainable transportation by providing world-class EV charging infrastructure paired with exceptional hospitality experiences. We believe that the future of travel should be both environmentally responsible and genuinely enjoyable.'
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
