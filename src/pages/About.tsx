import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAboutUsContent, type AboutUsContent } from '@/services/aboutUsService';
import { getTestimonials, type Testimonial } from '@/services/contentService';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';
import { useSEO } from '@/hooks/useSEO';
import { useTheme } from '@/contexts/ThemeContext';
import { Zap, Users, Coffee, Car, Star, ChevronLeft, ChevronRight, Quote, Home, BookOpen, Phone, MapPin, Calendar, Sun, Moon, Menu, X } from 'lucide-react';

const About = () => {
  const [content, setContent] = useState<AboutUsContent | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const backgroundImageUrl = useBackgroundImage();
  const { theme, toggleTheme } = useTheme();
  useSEO('/about');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const loadData = async () => {
    try {
      const [aboutData, testimonialsData] = await Promise.all([
        getAboutUsContent(),
        getTestimonials()
      ]);
      setContent(aboutData);
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
              <Zap className="h-6 md:h-8 w-6 md:w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                Energy Palace
              </h1>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>About Us</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            <a href="/" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </a>
            <a href="/blog" className={`${theme === 'light' ? 'hover:text-emerald-600 bg-white/20 hover:bg-white/30' : 'hover:text-emerald-400 bg-white/10 hover:bg-white/20'} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}>
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
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
              <a href="/blog" className={`flex items-center gap-3 px-6 py-3 ${theme === 'light' ? 'text-gray-800 hover:bg-white/50' : 'text-white hover:bg-white/10'} transition-colors font-medium cursor-pointer`} onClick={() => setShowMobileMenu(false)}>
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
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
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className={`text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            <span className={`${theme === 'light' ? 'bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'}`}>
              {content?.title || 'About Energy Palace'}
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
            {content?.company_story || 'Leading the way in sustainable transportation with cutting-edge EV charging technology and exceptional hospitality.'}
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {content?.mission_statement && (
            <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} text-center hover:scale-105 transition-transform duration-300`}>
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-600 mb-4">Our Mission</h3>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>{content.mission_statement}</p>
              </CardContent>
            </Card>
          )}

          {content?.vision_statement && (
            <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} text-center hover:scale-105 transition-transform duration-300`}>
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Our Vision</h3>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>{content.vision_statement}</p>
              </CardContent>
            </Card>
          )}

          {content?.values && content.values.length > 0 && (
            <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} text-center hover:scale-105 transition-transform duration-300`}>
              <CardContent className="p-6 md:p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-purple-600 mb-4">Our Values</h3>
                <div className="space-y-3">
                  {content.values.slice(0, 2).map((value, index) => (
                    <div key={index}>
                      <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{value.title}</h4>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>{value.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} text-center hover:scale-105 transition-transform duration-300`}>
            <CardContent className="p-6">
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-gradient-to-r from-emerald-100 to-blue-100' : 'bg-gradient-to-r from-emerald-100/20 to-blue-100/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Zap className="h-8 w-8 text-emerald-400" />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Innovation</h4>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Leading the way in sustainable energy solutions</p>
            </CardContent>
          </Card>
          
          <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} text-center hover:scale-105 transition-transform duration-300`}>
            <CardContent className="p-6">
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-gradient-to-r from-emerald-100 to-blue-100' : 'bg-gradient-to-r from-emerald-100/20 to-blue-100/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Car className="h-8 w-8 text-blue-400" />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Sustainability</h4>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Committed to environmental responsibility</p>
            </CardContent>
          </Card>
          
          <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} text-center hover:scale-105 transition-transform duration-300`}>
            <CardContent className="p-6">
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-gradient-to-r from-emerald-100 to-blue-100' : 'bg-gradient-to-r from-emerald-100/20 to-blue-100/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Community</h4>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Building connections and supporting the EV community</p>
            </CardContent>
          </Card>
          
          <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} text-center hover:scale-105 transition-transform duration-300`}>
            <CardContent className="p-6">
              <div className={`w-16 h-16 ${theme === 'light' ? 'bg-gradient-to-r from-emerald-100 to-blue-100' : 'bg-gradient-to-r from-emerald-100/20 to-blue-100/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Coffee className="h-8 w-8 text-yellow-400" />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Excellence</h4>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Delivering exceptional service and premium experiences</p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials Slider */}
        {testimonials.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8 md:mb-12">
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>What Our Customers Say</h2>
              <p className={`max-w-2xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                Hear from our satisfied customers about their experience at Energy Palace
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} overflow-hidden`}>
                <CardContent className="p-8 md:p-12 text-center relative">
                  <Quote className="h-12 w-12 text-emerald-400 mx-auto mb-6 opacity-50" />
                  
                  <div className="min-h-[200px] flex items-center justify-center">
                    <div className="space-y-6">
                      <p className={`text-lg md:text-xl italic leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-white/90'}`}>
                        "{testimonials[currentTestimonial]?.content}"
                      </p>
                      
                      <div className="flex items-center justify-center space-x-1 mb-4">
                        {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      <div>
                        <h4 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {testimonials[currentTestimonial]?.customer_name}
                        </h4>
                        {testimonials[currentTestimonial]?.customer_title && (
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>
                            {testimonials[currentTestimonial].customer_title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Button
                      onClick={prevTestimonial}
                      variant="outline"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 bg-white/10 border-white/20 hover:bg-white/20"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Button
                      onClick={nextTestimonial}
                      variant="outline"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0 bg-white/10 border-white/20 hover:bg-white/20"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Dots Indicator */}
              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-emerald-400 scale-125'
                        : theme === 'light' 
                          ? 'bg-gray-300 hover:bg-gray-400' 
                          : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Description */}
        {content?.team_description && (
          <div className="text-center mb-16">
            <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} max-w-4xl mx-auto`}>
              <CardContent className="p-8 md:p-12">
                <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Our Team</h3>
                <p className={`text-lg leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
                  {content.team_description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interesting Action Buttons Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <span className={`${theme === 'light' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'}`}>
                Explore More
              </span>
            </h3>
            <p className={`max-w-2xl mx-auto ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
              Discover what makes Energy Palace special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Book Charger */}
            <a href="/" className="group">
              <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} hover:border-emerald-500/50 transition-all duration-300 hover:scale-105`}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Book Charger</h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Reserve your charging station now</p>
                </CardContent>
              </Card>
            </a>

            {/* Visit Us */}
            <a href="/contacts" className="group">
              <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} hover:border-blue-500/50 transition-all duration-300 hover:scale-105`}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <MapPin className="h-8 w-8 text-blue-400" />
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Visit Us</h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Find our location and directions</p>
                </CardContent>
              </Card>
            </a>

            {/* Our Story */}
            <a href="/blog" className="group">
              <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} hover:border-purple-500/50 transition-all duration-300 hover:scale-105`}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-8 w-8 text-purple-400" />
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Our Story</h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Explore our journey in pictures</p>
                </CardContent>
              </Card>
            </a>

            {/* Make Reservation */}
            <a href="/" className="group">
              <Card className={`glass border border-white/20 backdrop-blur-xl ${theme === 'light' ? 'bg-white/50' : 'bg-gray-900/50'} hover:border-yellow-500/50 transition-all duration-300 hover:scale-105`}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Reserve Table</h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Book your dining experience</p>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass border border-white/20 rounded-2xl p-6 md:p-12 backdrop-blur-xl">
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
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
              >
                Book Charging Station
              </a>
              <a
                href="/contacts"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
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

export default About;