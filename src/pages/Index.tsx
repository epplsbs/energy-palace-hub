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
    // eslint-disable-next-line
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,white,transparent_80%)] pointer-events-none"></div>
      )}

      {/* Header */}
      <header className="relative z-20 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {businessSettings?.logo_url ? (
              <img 
                src={businessSettings.logo_url} 
                alt="Logo" 
                className="h-12 w-12 object-contain rounded-xl"
              />
            ) : (
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
                <Zap className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                {businessSettings?.business_name || 'Energy Palace'}
              </h1>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                {businessSettings?.business_tagline || 'Premium EV Charging & Dining'}
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
      {/* ... rest of your code remains unchanged ... */}

      {/* Modals */}
      <ChargingStationSelectorModal 
        isOpen={isChargingModalOpen} 
        onClose={() => setIsChargingModalOpen(false)} 
      />
      <MenuModal 
        isOpen={isMenuModalOpen}
