import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { getBusinessSettings, type BusinessSettings } from '@/services/businessSettingsService';
import { Home, BookOpen, Phone, Info, Sun, Moon, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
}

const Navigation = ({ currentPage }: NavigationProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { data: businessSettings } = useQuery<BusinessSettings, Error>({
    queryKey: ['businessSettings'],
    queryFn: getBusinessSettings,
  });

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Media', href: '/media', icon: BookOpen },
    { name: 'Contact', href: '/contacts', icon: Phone },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-3">
          {businessSettings?.logo_url ? (
            <img
              src={businessSettings.logo_url}
              alt={businessSettings?.business_name ? `${businessSettings.business_name} Logo` : 'Logo'}
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              {businessSettings?.business_name || 'Energy Palace'}
            </h1>
            {businessSettings?.business_tagline && (
              <p className="text-sm text-white/70">
                {businessSettings.business_tagline}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === item.href
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
          
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between w-full px-4 py-3">
        <div className="flex items-center space-x-3">
          {businessSettings?.logo_url ? (
            <img
              src={businessSettings.logo_url}
              alt={businessSettings?.business_name ? `${businessSettings.business_name} Logo` : 'Logo'}
              className="h-8 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              {businessSettings?.business_name || 'Energy Palace'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
            <div className="flex justify-end p-4">
              <Button
                onClick={() => setShowMobileMenu(false)}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="px-4 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPage === item.href
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
