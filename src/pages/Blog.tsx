import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getGalleryItems } from '@/services/contentService';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import { useSEO } from '@/hooks/useSEO';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { getBusinessSettings, type BusinessSettings } from '@/services/businessSettingsService';
import { Zap, Calendar, Tag, BookOpen, X, Home, Phone, Info, Sun, Moon, Menu } from 'lucide-react';

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
    const backgroundImageUrl = useBackgroundImage();
  const { theme, toggleTheme } = useTheme();
  useSEO('/blog');

  const { data: businessSettings } = useQuery<BusinessSettings, Error>({
    queryKey: ['businessSettings'],
    queryFn: getBusinessSettings,
  });

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
      <div className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gradient-futuristic'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
      <div className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gradient-futuristic'} relative overflow-hidden`}
        style={backgroundImageUrl ? {
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        } : {}}
      >
        {/* Theme overlay for better readability when background image is present */}
        {backgroundImageUrl && (
          <div className={`absolute inset-0 ${theme === 'light' ? 'bg-white/80' : 'bg-black/60'}`}></div>
        )}

        {/* Animated Background Elements (only show if no background image) */}
        {!backgroundImageUrl && (
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          </div>
        )}

        {/* Grid Pattern Overlay (only show if no background image) */}
        {!backgroundImageUrl && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        )}
      {/* Header */}
      <header className="relative z-20 p-4 md:p-6 bg-black/10 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
            {businessSettings?.logo_url ? (
              <img
                src={businessSettings.logo_url}
                alt={businessSettings?.business_name ? `${businessSettings.business_name} Logo` : 'Logo'}
                className="h-8 md:h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
                <Zap className="h-6 md:h-8 w-6 md:w-8 text-white" />
              </div>
            )}
            <div>
              <h1 className={`text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                {businessSettings?.business_name || 'Energy Palace'}
              </h1>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Our Story in Pictures</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            <a href="/" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </a>
            <a href="/about" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <Info className="h-4 w-4" />
              <span>About</span>
            </a>
            <a href="/contacts" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'light' ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20'} transition-all duration-300`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`md:hidden p-2 rounded-lg ${theme === 'light' ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20'} transition-all duration-300`}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className={`md:hidden absolute top-full left-0 right-0 ${theme === 'light' ? 'bg-white/95' : 'bg-black/95'} backdrop-blur-md shadow-lg border-t border-white/10 z-50`}>
            <nav className="py-4">
              <a href="/" className={`flex items-center gap-3 px-6 py-3 ${theme === 'light' ? 'text-gray-800 hover:bg-white/50' : 'text-white hover:bg-white/10'} transition-colors font-medium cursor-pointer`} onClick={() => setShowMobileMenu(false)}>
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
              <a href="/about" className={`flex items-center gap-3 px-6 py-3 ${theme === 'light' ? 'text-gray-800 hover:bg-white/50' : 'text-white hover:bg-white/10'} transition-colors font-medium cursor-pointer`} onClick={() => setShowMobileMenu(false)}>
                <Info className="h-4 w-4" />
                <span>About</span>
              </a>
              <a href="/contacts" className={`flex items-center gap-3 px-6 py-3 ${theme === 'light' ? 'text-gray-800 hover:bg-white/50' : 'text-white hover:bg-white/10'} transition-colors font-medium cursor-pointer`} onClick={() => setShowMobileMenu(false)}>
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </a>
              <button
                onClick={() => {
                  toggleTheme();
                  setShowMobileMenu(false);
                }}
                className={`flex items-center gap-3 w-full text-left px-6 py-3 ${theme === 'light' ? 'text-gray-800 hover:bg-white/50' : 'text-white hover:bg-white/10'} transition-colors font-medium`}
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className={`text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            <span className={`${theme === 'light' ? 'bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'}`}>
              Our Journey
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
            Discover the story behind Energy Palace through our gallery. From groundbreaking ceremonies to premium facilities, witness our commitment to sustainable energy and exceptional hospitality.
          </p>
        </div>

        {galleryItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass border border-white/20 rounded-2xl p-8 md:p-12 backdrop-blur-xl">
              <Tag className="h-12 md:h-16 w-12 md:w-16 text-white/40 mx-auto mb-6" />
              <h3 className={`text-xl md:text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Coming Soon</h3>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                Our gallery is being curated. Check back soon to see our amazing journey through pictures!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {galleryItems.map((item) => (
              <Card key={item.id} className="glass border border-white/20 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden bg-gray-900/50">
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader className="bg-gray-900/80 backdrop-blur-sm p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className={`text-lg md:text-xl group-hover:text-emerald-400 transition-colors line-clamp-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-gray-900/80 backdrop-blur-sm p-4">
                  <p className={`leading-relaxed mb-4 text-sm md:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {truncateText(item.description)}
                  </p>
                  {item.description.length > 150 && (
                    <Button
                      onClick={() => openModal(item)}
                      className="w-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read More
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 md:mt-16">
          <div className="glass border border-white/20 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
            <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <span className={`${theme === 'light' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                Experience Energy Palace
              </span>
            </h3>
            <p className={`mb-6 max-w-2xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
              Ready to be part of our story? Visit us for an unforgettable EV charging and dining experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
              >
                Book Charging Station
              </a>
              <a
                href="/contacts"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Read More Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border-white/20 text-white">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-white/20">
            <div className="flex-1">
              <DialogTitle className={`text-xl md:text-2xl font-bold ${theme === 'light' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                {selectedPost?.title}
              </DialogTitle>
              {selectedPost && (
                <div className={`flex items-center gap-2 text-sm mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedPost.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <Button
              onClick={closeModal}
              variant="ghost"
              size="sm"
              className={`${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-white/60 hover:text-white'}`}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          
          {selectedPost && (
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              <div className="relative">
                <img
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className={`leading-relaxed whitespace-pre-wrap ${theme === 'light' ? 'text-gray-800' : 'text-white/90'}`}>
                  {selectedPost.description}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blog;
