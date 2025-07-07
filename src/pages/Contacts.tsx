
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { getBusinessSettings } from '@/services/businessSettingsService';
import { Phone, Mail, MapPin, Clock, User, Building, Zap, ArrowLeft } from 'lucide-react';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import { useSEO } from '@/hooks/useSEO';
import { useTheme } from '@/contexts/ThemeContext';

interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  is_active: boolean;
  display_order: number;
  photo_url?: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [businessSettings, setBusinessSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const backgroundImageUrl = useBackgroundImage();
  const { theme } = useTheme();
  useSEO('/contacts');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsData, settingsData] = await Promise.all([
        fetchContacts(),
        getBusinessSettings()
      ]);
      setBusinessSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setContacts(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    } finally {
      setLoading(false);
    }
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
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
          </div>
        )}

        {/* Grid Pattern Overlay (only show if no background image) */}
        {!backgroundImageUrl && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        )}
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
              <p className="text-sm text-white/60">Get in Touch</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-8 text-white/80">
            <a href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </a>
            <a href="/about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="/blog" className="hover:text-emerald-400 transition-colors">Blog</a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            Ready to power your journey? Get in touch with our team for exceptional EV charging and hospitality services.
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <Card className="glass border border-white/20 backdrop-blur-xl bg-gray-900/50 text-center">
            <CardContent className="p-6 md:p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Visit Us</h3>
              <p className="text-white/70">
                {businessSettings.business_address || 'Kathmandu, Nepal'}<br />
                Premium EV Charging Station
              </p>
            </CardContent>
          </Card>

          <Card className="glass border border-white/20 backdrop-blur-xl bg-gray-900/50 text-center">
            <CardContent className="p-6 md:p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
              <p className="text-white/70">
                {businessSettings.contact_phone || '+977-1-XXXXXX'}<br />
                Available 24/7
              </p>
            </CardContent>
          </Card>

          <Card className="glass border border-white/20 backdrop-blur-xl bg-gray-900/50 text-center">
            <CardContent className="p-6 md:p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Open Hours</h3>
              <p className="text-white/70">
                24/7 Charging Available<br />
                Restaurant: 7 AM - 10 PM
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Contacts */}
        {contacts.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Team</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Meet our dedicated professionals who are here to serve you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {contacts.map((contact) => (
                <Card key={contact.id} className="glass border border-white/20 backdrop-blur-xl bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      {contact.photo_url ? (
                        <img 
                          src={contact.photo_url} 
                          alt={contact.name}
                          className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="h-10 w-10 text-emerald-400" />
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-white mb-1">{contact.name}</h3>
                      {contact.position && (
                        <p className="text-emerald-400 font-semibold text-sm mb-2">{contact.position}</p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {contact.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          <span className="text-white text-sm break-all">{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-white text-sm">{contact.phone}</span>
                        </div>
                      )}
                      {contact.department && (
                        <div className="flex items-center gap-3">
                          <Building className="h-4 w-4 text-purple-400 flex-shrink-0" />
                          <span className="text-white text-sm">{contact.department}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass border border-white/20 rounded-2xl p-6 md:p-12 backdrop-blur-xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Ready to Get Started?
              </span>
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Experience the future of EV charging with our premium services. Book your charging session or make a restaurant reservation today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
              >
                Book Charging Station
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                Make Reservation
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
