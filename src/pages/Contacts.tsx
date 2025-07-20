import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { getBusinessSettings } from '@/services/businessSettingsService';
import { Phone, Mail, MapPin, Clock, User, Building, Zap, Home, BookOpen, Info, Sun, Moon, Menu, X, Car, Navigation } from 'lucide-react';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import { useSEO } from '@/hooks/useSEO';
import { useTheme } from '@/contexts/ThemeContext';
import GoogleMapEmbed from '../components/GoogleMapEmbed'; // Import the map component
import SubmitReviewForm from '@/components/forms/SubmitReviewForm'; // Import the review form

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const backgroundImageUrl = useBackgroundImage();
  const { theme, toggleTheme } = useTheme();
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
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Get in Touch</p>
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
            <a href="/blog" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
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
              <a href="/blog" className={`flex items-center gap-3 px-6 py-3 ${theme === 'light' ? 'text-gray-800 hover:bg-white/50' : 'text-white hover:bg-white/10'} transition-colors font-medium cursor-pointer`} onClick={() => setShowMobileMenu(false)}>
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
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
              Contact Energy Palace
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
            Ready to power your journey? Get in touch with our team for exceptional EV charging and hospitality services.
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          <Card className="glass border border-white/20 backdrop-blur-xl bg-gray-900/50 text-center">
            <CardContent className="p-6 md:p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Visit Us</h3>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
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
              <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Call Us</h3>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
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
              <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Open Hours</h3>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                {businessSettings.opening_hours || '24/7 Available'}<br />
                {/* Consider making restaurant hours dynamic if they differ and are managed in CMS */}
                Restaurant: 7 AM - 10 PM (Example)
              </p>
            </CardContent>
          </Card>

          <Card className="glass border border-white/20 backdrop-blur-xl bg-gray-900/50 text-center">
            <CardContent className="p-6 md:p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Email Us</h3>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                {businessSettings.contact_email || 'info@energypalace.com.np'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Google Map Placeholder */}
        <div className="mb-12 md:mb-16">
          <div className="text-center mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Find Us On Map</h2>
          </div>
                    <Card className="glass border border-white/20 backdrop-blur-xl bg-gray-900/50">
            <CardContent className="p-6 md:p-8 relative">
              <GoogleMapEmbed
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""} // Pass explicitly or ensure component handles undefined gracefully
                lat={parseFloat(businessSettings?.business_latitude || '27.7172')}
                lng={parseFloat(businessSettings?.business_longitude || '85.3240')}
                zoom={16}
                businessName={businessSettings?.business_name || "Energy Palace"}
                businessAddress={businessSettings?.business_address || "Bhiman, Sindhuli, Bagmati, Nepal"}
                businessLogoUrl={businessSettings?.logo_url || "https://energypalace.com.np/logo.png"} // Default placeholder
              />

              {/* Drive to Energy Palace Button */}
              <div className="absolute top-8 right-8 z-10">
                <button
                  onClick={() => {
                    const lat = parseFloat(businessSettings?.business_latitude || '27.7172');
                    const lng = parseFloat(businessSettings?.business_longitude || '85.3240');
                    const businessName = businessSettings?.business_name || 'Energy Palace';

                    // Open Google Maps with directions from current location
                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
                    window.open(mapsUrl, '_blank');
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    theme === 'light'
                      ? 'bg-white/90 hover:bg-white text-gray-900 border border-gray-200/50'
                      : 'bg-gray-900/90 hover:bg-gray-800/90 text-white border border-white/20'
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-emerald-600" />
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="hidden sm:inline">Drive to {businessSettings?.business_name || 'Energy Palace'}</span>
                  <span className="sm:hidden">Directions</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Contacts */}
        {contacts.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Our Team</h2>
              <p className={`max-w-2xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
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
                      <h3 className={`text-lg font-bold mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{contact.name}</h3>
                      {contact.position && (
                        <p className="text-emerald-400 font-semibold text-sm mb-2">{contact.position}</p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {contact.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          <span className={`text-sm break-all ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>{contact.phone}</span>
                        </div>
                      )}
                      {contact.department && (
                        <div className="flex items-center gap-3">
                          <Building className="h-4 w-4 text-purple-400 flex-shrink-0" />
                          <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>{contact.department}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Submit Review Form Section */}
        <div className="mb-12 md:mb-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Leave Us a Review</h2>
            <p className={`max-w-2xl mx-auto mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
              We'd love to hear about your experience at Energy Palace!
            </p>
          </div>
          <Card className={`glass border ${theme === 'light' ? 'border-gray-200 bg-white/70' : 'border-white/20 bg-gray-900/70'} backdrop-blur-lg max-w-2xl mx-auto shadow-xl`}>
            <CardContent className="p-6 md:p-8">
              <SubmitReviewForm />
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass border border-white/20 rounded-2xl p-6 md:p-12 backdrop-blur-xl">
            <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <span className={`${theme === 'light' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                Ready to Get Started?
              </span>
            </h3>
            <p className={`mb-6 max-w-2xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
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
