import { useSEO } from '@/hooks/useSEO';
import { useTheme } from '@/contexts/ThemeContext';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import { Zap, Home, Info, BookOpen, Phone, Sun, Moon, Menu, X, Download, Mail } from 'lucide-react'; // Added Download, Mail
import { useState, useEffect } from 'react'; // Added useState, useEffect
import { getBusinessSettings, type BusinessSettings } from '@/services/businessSettingsService'; // For business name

const Media = () => {
  useSEO('/media'); // Hook for SEO settings
  const { theme, toggleTheme } = useTheme();
  const backgroundImageUrl = useBackgroundImage();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);

    useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getBusinessSettings();
        setBusinessSettings(settings);
      } catch (error) {
        console.error("Failed to fetch business settings for Media page:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div
      className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gradient-futuristic'} relative overflow-hidden`}
      style={backgroundImageUrl ? {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      {/* Theme overlay */}
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
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Media & Press</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            <a href="/" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <Home className="h-4 w-4" /> Home
            </a>
            <a href="/about" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <Info className="h-4 w-4" /> About
            </a>
            <a href="/blog" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <BookOpen className="h-4 w-4" /> Blog
            </a>
            <a href="/contacts" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <Phone className="h-4 w-4" /> Contact
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
                <Home className="h-4 w-4" /> Home
              </a>
              <a href="/about" className={`flex items-center gap-3 px-6 py-3 ${theme === 'light' ? 'text-gray-800 hover:bg-white/50' : 'text-white hover:bg-white/10'} transition-colors font-medium cursor-pointer`} onClick={() => setShowMobileMenu(false)}>
                <Info className="h-4 w-4" /> About
              </a>
              <a href="/blog" className={`flex items-center gap-3 px-6 py-3 ${theme === 'light' ? 'text-gray-800 hover:bg-white/50' : 'text-white hover:bg-white/10'} transition-colors font-medium cursor-pointer`} onClick={() => setShowMobileMenu(false)}>
                <BookOpen className="h-4 w-4" /> Blog
              </a>
              <a href="/contacts" className={`flex items-center gap-3 px-6 py-3 ${theme === 'light' ? 'text-gray-800 hover:bg-white/50' : 'text-white hover:bg-white/10'} transition-colors font-medium cursor-pointer`} onClick={() => setShowMobileMenu(false)}>
                <Phone className="h-4 w-4" /> Contact
              </a>
              <button
                onClick={() => { toggleTheme(); setShowMobileMenu(false); }}
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
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-16">
        <div className={`p-8 md:p-12 rounded-xl shadow-2xl glass ${theme === 'light' ? 'bg-white/70 border-gray-200' : 'bg-gray-900/70 border-white/20'} border backdrop-blur-lg`}>
          <div className="text-center mb-10">
            <h1 className={`text-4xl md:text-5xl font-black leading-tight mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <span className={`${theme === 'light' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                Media & Press Information
              </span>
            </h1>
                        <p className={`text-lg md:text-xl max-w-2xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
              Welcome to the official media page for {businessSettings?.business_name || 'Energy Palace'}. Find resources, contact information, and learn more about our story.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 pb-2 border-b ${theme === 'light' ? 'text-gray-800 border-gray-300' : 'text-white border-white/20'}`}>
                About {businessName}
              </h2>
              <p className={`text-base md:text-lg leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-white/80'}`}>
                {businessName} is a pioneering establishment located in Bhiman, Sindhuli, offering a unique blend of services including state-of-the-art EV charging facilities, a full-service restaurant, and a cozy coffee shop. We are committed to promoting sustainable travel and providing exceptional hospitality to all our guests.
                (User: This text can be made dynamic from About Us content or Business Settings if needed).
              </p>
            </section>

            <section>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 pb-2 border-b ${theme === 'light' ? 'text-gray-800 border-gray-300' : 'text-white border-white/20'}`}>
                Media Contact
              </h2>
              <p className={`text-base md:text-lg leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-white/80'}`}>
                For all media inquiries, interviews, or requests for information, please contact:
              </p>
              <div className={`mt-3 flex items-center gap-2 p-3 rounded-md ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800/50'}`}>
                <Mail className={`h-5 w-5 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <a href="mailto:media@energypalace.com.np" className={`${theme === 'light' ? 'text-emerald-700 hover:text-emerald-800' : 'text-emerald-400 hover:text-emerald-300'} font-medium`}>
                  media@energypalace.com.np  {/* Placeholder Email */}
                </a>
              </div>
               <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-white/60'}`}>
                (User: Please update this email address to your actual media contact.)
              </p>
            </section>

            <section>
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 pb-2 border-b ${theme === 'light' ? 'text-gray-800 border-gray-300' : 'text-white border-white/20'}`}>
                Logos & Brand Assets
              </h2>
              <p className={`text-base md:text-lg leading-relaxed mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-white/80'}`}>
                Download high-resolution logos and other brand assets for use in your publications.
              </p>
              <div className="flex items-center">
                {/* Placeholder for a download button or link */}
                <button
                  disabled
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300
                              ${theme === 'light'
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-300'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-500'}`}
                >
                  <Download className="h-5 w-5" />
                  Download Asset Pack (Coming Soon)
                </button>
              </div>
              <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-white/60'}`}>
                (User: Please link this to your actual press kit/logo download URL when available.)
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Media;
