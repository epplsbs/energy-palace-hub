
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Car, Coffee, ChevronRight, Phone, Mail, MapPin, Clock, Users, Info, Sun, Moon, Menu, X } from 'lucide-react';
import ChargingStationSelectorModal from '@/components/modals/ChargingStationSelectorModal';
import MenuModal from '@/components/modals/MenuModal';
import ReservationModal from '@/components/modals/ReservationModal';
import { getBusinessSettings, type BusinessSettings } from '@/services/businessSettingsService';
import { getAboutUsContent, type AboutUsContent } from '@/services/aboutUsService';
import { useTheme } from '@/contexts/ThemeContext';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import { useSEO } from '@/hooks/useSEO';
import LocationDisplay from '@/components/LocationDisplay';

const Index = () => {
  const [isChargingModalOpen, setIsChargingModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutUsContent | null>(null);
  const { theme, toggleTheme } = useTheme();
  const backgroundImageUrl = useBackgroundImage();
  useSEO('/');

  useEffect(() => {
    loadSettings();
    loadAboutContent();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getBusinessSettings();
      setBusinessSettings(settings);
    } catch (error) {
      console.error('Error loading business settings:', error);
    }
  };

  const loadAboutContent = async () => {
    try {
      const content = await getAboutUsContent();
      setAboutContent(content);
    } catch (error) {
      console.error('Error loading about content:', error);
    }
  };

  const backgroundStyle = businessSettings?.background_image_url ? {
    backgroundImage: `url(${businessSettings.background_image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  } : {};

  return (
    <div 
      className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gradient-futuristic'} relative overflow-hidden`}
      style={backgroundImageUrl ? {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        ...backgroundStyle
      } : backgroundStyle}
    >
      {/* Theme overlay for better readability when background image is present */}
      {(businessSettings?.background_image_url || backgroundImageUrl) && (
        <div className={`absolute inset-0 ${theme === 'light' ? 'bg-white/80' : 'bg-black/60'}`}></div>
      )}

      {/* Animated Background Elements (only show if no background image) */}
      {!(businessSettings?.background_image_url || backgroundImageUrl) && (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
      )}

      {/* Grid Pattern Overlay (only show if no background image) */}
      {!(businessSettings?.background_image_url || backgroundImageUrl) && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      )}

      {/* Header */}
      <header className="relative z-20 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {businessSettings?.logo_url ? (
                <img 
                  src={businessSettings.logo_url} 
                  alt={businessSettings?.business_name ? `${businessSettings.business_name} Logo` : 'Energy Palace Logo'}
                  className="h-12 w-12 object-contain rounded-xl"
                />
              ) : (
                <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              )}
            <div>
              <div className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                {businessSettings?.business_name || 'Energy Palace'}
              </div>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                {businessSettings?.business_tagline || 'EV Charging, Restaurant & Coffee Shop'}
              </p>
            </div>
          </div>

          <div className={`hidden md:flex items-center space-x-8 ${theme === 'light' ? 'text-gray-700' : 'text-white/80'}`}>
            <a href="/blog" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <span>Blog</span>
            </a>
            <a href="/contacts" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Contacts</span>
            </a>
            <a 
              href="/about"
              className="hover:text-emerald-400 transition-colors flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              <span>Portfolio</span>
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className={`md:hidden absolute top-full left-0 right-0 ${theme === 'light' ? 'bg-white/95' : 'bg-black/95'} backdrop-blur-md shadow-lg border-t z-50`}>
            <nav className="py-4">
              <a href="/blog" className={`block px-6 py-3 ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'} transition-colors`}>
                Blog
              </a>
              <a href="/contacts" className={`block px-6 py-3 ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'} transition-colors`}>
                Contacts
              </a>
              <a 
                href="/about"
                className={`block px-6 py-3 ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'} transition-colors`}
                onClick={() => setShowMobileMenu(false)}
              >
                Portfolio
              </a>
              <button
                onClick={() => {
                  toggleTheme();
                  setShowMobileMenu(false);
                }}
                className={`flex items-center w-full text-left px-6 py-3 ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'} transition-colors`}
              >
                {theme === 'light' ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Content */}
          <div className="space-y-6">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full glass border ${theme === 'light' ? 'border-gray-200 text-gray-700' : 'border-white/20 text-white/80'} mb-8`}>
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>Live Charging Status Available</span>
            </div>
            
            <h1 className={`text-6xl md:text-8xl font-black leading-tight ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <span className={`block ${theme === 'light' ? 'bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'}`}>
                Charge
              </span>
              <span className={`block ${theme === 'light' ? 'text-gray-800' : 'text-white/90'}`}>
                And Dine
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
              Power up your EV, savor exceptional meals at our restaurant, and relax with specialty coffees at our on-site coffee shop. Energy Palace is your complete destination.
            </p>
          </div>

          {/* Main CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Book Charger */}
            <div className={`glass rounded-2xl p-8 border ${theme === 'light' ? 'border-gray-200 bg-white/50' : 'border-white/20'} hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 group`}>
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 neon-glow-green group-hover:scale-110 transition-transform">
                  <Zap className="h-12 w-12 text-emerald-400" />
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Book Charger</h3>
                <p className={`text-center ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Reserve your charging station and get real-time updates</p>
                <Button 
                  onClick={() => setIsChargingModalOpen(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                >
                  <span>Book Now</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
    
            {/* Menu */}
            <div className={`glass rounded-2xl p-8 border ${theme === 'light' ? 'border-gray-200 bg-white/50' : 'border-white/20'} hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group`}>
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 neon-glow group-hover:scale-110 transition-transform">
                  <Coffee className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Menu</h3>
                <p className={`text-center ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Discover our full restaurant menu and enjoy fresh coffee & snacks from our coffee shop while your EV charges.</p>
                <Button 
                  onClick={() => setIsMenuModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  <span>View Menu</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Reserve Now */}
            <div className={`glass rounded-2xl p-8 border ${theme === 'light' ? 'border-gray-200 bg-white/50' : 'border-white/20'} hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group`}>
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 group-hover:scale-110 transition-transform">
                  <Car className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Reserve Now</h3>
                <p className={`text-center ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Book your table for the ultimate dining experience</p>
                <Button 
                  onClick={() => setIsReservationModalOpen(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  <span>Reserve Table</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
  
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-emerald-400">4+</div>
              <div className={`text-sm uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Charging Ports</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-blue-400">180kW</div>
              <div className={`text-sm uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Max Power</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-purple-400">{businessSettings?.opening_hours || '24/7'}</div>
              <div className={`text-sm uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Available</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-yellow-400">~30min</div>
              <div className={`text-sm uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Fast Charging</div>
            </div>
          </div>
        </div>
      </main>

      {/* About Us Section */}
      <section id="about" className={`relative z-10 py-20 ${theme === 'light' ? 'bg-white/20' : 'bg-black/20'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <span className={`${theme === 'light' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                {aboutContent?.title || 'About Energy Palace'}
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
              {aboutContent?.company_story || 'Leading the way in sustainable transportation with cutting-edge EV charging technology and exceptional hospitality.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <a href="/blog">
              <div className={`glass rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-200 bg-white/50' : 'border-white/20'} text-center`}>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-gradient-to-r from-emerald-100 to-blue-100' : 'bg-gradient-to-r from-emerald-100/20 to-blue-100/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Zap className="h-8 w-8 text-emerald-400" />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Innovation</h4>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Leading the way in sustainable energy solutions</p>
            </div>
            </a>
            
            <div className={`glass rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-200 bg-white/50' : 'border-white/20'} text-center`}>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-gradient-to-r from-emerald-100 to-blue-100' : 'bg-gradient-to-r from-emerald-100/20 to-blue-100/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Car className="h-8 w-8 text-blue-400" />
              </div>
              <h4 className={`text-xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Our Location
              </h4>
              <LocationDisplay />
              {/* Thematic description for the card, can be adjusted if needed */}
              <p className={`text-sm mt-3 ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Accessible & Convenient Charging</p>
            </div>
           
           <a href="/contacts">  
            <div className={`glass rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-200 bg-white/50' : 'border-white/20'} text-center`}>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-gradient-to-r from-emerald-100 to-blue-100' : 'bg-gradient-to-r from-emerald-100/20 to-blue-100/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Community</h4>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Building connections and supporting the EV community</p>
            </div>
           </a>
           <a href="/about">
            <div className={`glass rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-200 bg-white/50' : 'border-white/20'} text-center`}>
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-gradient-to-r from-emerald-100 to-blue-100' : 'bg-gradient-to-r from-emerald-100/20 to-blue-100/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Coffee className="h-8 w-8 text-yellow-400" />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Excellence</h4>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Delivering exceptional service and premium experiences</p>
            </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 mt-16 border-t ${theme === 'light' ? 'border-gray-200 bg-white/20' : 'border-white/10 bg-black/20'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {businessSettings?.logo_url ? (
                  <img 
                    src={businessSettings.logo_url} 
                    alt={businessSettings?.business_name ? `${businessSettings.business_name} Logo` : 'Energy Palace Logo'}
                    className="h-10 w-10 object-contain rounded-xl"
                  />
                ) : (
                  <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                )}
                <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                  {businessSettings?.business_name || 'Energy Palace'}
                </span>
              </div>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                Nepal's premier EV charging station, complete with a full-service restaurant and a welcoming coffee shop.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Contact Info</h4>
              <div className={`space-y-2 ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{businessSettings?.contact_phone || '+9779841426598'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{businessSettings?.contact_email || 'info@energypalace.com.np'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{businessSettings?.business_address || 'Bhiman, Sindhuli, Nepal'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Operating Hours</h4>
              <div className={`flex items-center space-x-2 ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                <Clock className="h-4 w-4" />
                <span>{businessSettings?.opening_hours || '24/7 Available'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Quick Links</h4>
              <ul className={`space-y-2 ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                <li><a href="/about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="/blog" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="/contacts" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
                <li><a href="/media" className="hover:text-emerald-400 transition-colors">Media & Press</a></li>
                {/* Add other important links here, e.g., Terms of Service, Privacy Policy if they exist */}
              </ul>
            </div>
          </div>

          <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/10'} mt-8 pt-8 text-center ${theme === 'light' ? 'text-gray-500' : 'text-white/40'}`}>
            <p>&copy; 2024 {businessSettings?.business_name || 'Energy Palace'}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ChargingStationSelectorModal 
        isOpen={isChargingModalOpen} 
        onClose={() => setIsChargingModalOpen(false)} 
      />
      <MenuModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
      />
      <ReservationModal 
        isOpen={isReservationModalOpen} 
        onClose={() => setIsReservationModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
