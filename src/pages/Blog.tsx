
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Zap, ArrowLeft, Calendar, Tag } from 'lucide-react';

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

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
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
      <header className="relative z-20 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Energy Palace
              </h1>
              <p className="text-sm text-white/60">Our Story in Pictures</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-white/80">
            <a href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </a>
            <a href="/contacts" className="hover:text-emerald-400 transition-colors">Contacts</a>
            <a href="/admin" className="hover:text-emerald-400 transition-colors">Admin</a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Journey
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Discover the story behind Energy Palace through our gallery. From groundbreaking ceremonies to premium facilities, witness our commitment to sustainable energy and exceptional hospitality.
          </p>
        </div>

        {galleryItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass border border-white/20 rounded-2xl p-12 backdrop-blur-xl">
              <Tag className="h-16 w-16 text-white/40 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
              <p className="text-white/70">
                Our gallery is being curated. Check back soon to see our amazing journey through pictures!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <Card key={item.id} className="glass border border-white/20 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass border border-white/20 rounded-2xl p-8 backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Experience Energy Palace
              </span>
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Ready to be part of our story? Visit us for an unforgettable EV charging and dining experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
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
    </div>
  );
};

export default Blog;
