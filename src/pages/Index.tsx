import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Car,
  Coffee,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Info,
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
  Star,
  ChevronLeft,
  Quote,
} from "lucide-react";
import ChargingStationSelectorModal from "@/components/modals/ChargingStationSelectorModal";
import MenuModal from "@/components/modals/MenuModal";
import ReservationModal from "@/components/modals/ReservationModal";
import { useQuery } from "@tanstack/react-query";
import {
  getBusinessSettings,
  type BusinessSettings,
} from "@/services/businessSettingsService";
import {
  getAboutUsContent,
  type AboutUsContent,
} from "@/services/aboutUsService";
import {
  getTestimonials,
  type Testimonial,
} from "@/services/testimonialsService";
import { useTheme } from "@/contexts/ThemeContext";
import { useBackgroundImage } from "@/hooks/useBackgroundImage";
import { Card, CardContent } from "@/components/ui/card";
import { useSEO } from "@/hooks/useSEO";
import LocationDisplay from "@/components/LocationDisplay";

const Index = () => {
  const [isChargingModalOpen, setIsChargingModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null); // Replaced by useQuery
  const [aboutContent, setAboutContent] = useState<AboutUsContent | null>(null); // Keep for now, or convert to useQuery too
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]); // Keep for now, or convert to useQuery too
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  // const [loading, setLoading] = useState(true); // Replaced by useQuery's isLoading

  const { theme, toggleTheme } = useTheme();
  const backgroundImageUrl = useBackgroundImage();

  // Custom SEO implementation for EV charging station
  useEffect(() => {
    // Update document title
    document.title =
      "Energy Palace - EV Charging Station & Restaurant in Bhiman, Sindhuli, Nepal";

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Premium EV charging station with restaurant and coffee shop in Bhiman, Sindhuli, Nepal. Fast CCS2 & GBT charging up to 180kW, delicious local cuisine, and specialty coffee. Open 24/7 for electric vehicle drivers.",
      );
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        "EV charging station Nepal, electric vehicle charging Sindhuli, Bhiman EV charger, restaurant Sindhuli, coffee shop Nepal, fast charging CCS2 GBT, electric car charging, sustainable energy Nepal, EV Cafe Sindhuli, 24/7 charging, highway charging station, Bhiman restaurant",
      );
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute(
        "content",
        "Energy Palace - EV Charging Station & Restaurant in Bhiman, Sindhuli, Nepal",
      );
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute(
        "content",
        "Premium EV charging station with restaurant and coffee shop in Bhiman, Sindhuli, Nepal. Fast CCS2 & GBT charging up to 180kW, delicious local cuisine, and specialty coffee. Open 24/7 for electric vehicle drivers.",
      );
    }
  }, []);

  useSEO("/");

  const {
    data: businessSettings,
    isLoading: isLoadingBusinessSettings,
    error: businessSettingsError,
  } = useQuery<BusinessSettings, Error>({
    queryKey: ["businessSettings"],
    queryFn: getBusinessSettings,
    retry: 1,
    retryOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });

  // For AboutContent and Testimonials, you might want to convert them to useQuery as well for consistency
  // For now, keeping their existing useEffect-based loading.
  // A combined loading state would be: isLoadingBusinessSettings || loadingAbout || loadingTestimonials
  const [loadingCombined, setLoadingCombined] = useState(true);

  useEffect(() => {
    const loadOtherData = async () => {
      try {
        console.log("Starting to load About Us and Testimonials data...");

        // Fetch about us content with improved error handling
        const aboutData = await getAboutUsContent();
        console.log("About Us data loaded:", aboutData);

        // Fetch testimonials with improved error handling
        const testimonialsData = await getTestimonials();
        console.log("Testimonials loaded:", testimonialsData);

        setAboutContent(aboutData);
        setTestimonials(testimonialsData || []);
      } catch (error) {
        console.error("Unexpected error in loadOtherData:", error);
        setAboutContent(null);
        setTestimonials([]);
      } finally {
        setLoadingCombined(false);
      }
    };
    loadOtherData();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000); // Auto-scroll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const backgroundStyle = businessSettings?.background_image_url
    ? {
        backgroundImage: `url(${businessSettings.background_image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : {};

  return (
    <div
      className={`min-h-screen ${theme === "light" ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50" : "bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900"} relative overflow-hidden`}
      style={
        backgroundImageUrl
          ? {
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              ...backgroundStyle,
            }
          : backgroundStyle
      }
    >
      {/* Theme overlay for better readability when background image is present */}
      {(businessSettings?.background_image_url || backgroundImageUrl) && (
        <div
          className={`absolute inset-0 ${theme === "light" ? "bg-white/80" : "bg-black/60"}`}
        ></div>
      )}

      {/* Animated Background Elements (only show if no background image) */}
      {!(businessSettings?.background_image_url || backgroundImageUrl) && (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400 to-green-400 opacity-40 rounded-full blur-3xl animate-float-enhanced"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-30 rounded-full blur-3xl animate-float-enhanced"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-to-r from-green-400 to-emerald-500 opacity-20 rounded-full blur-3xl animate-float-enhanced"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-lime-400 to-green-500 opacity-35 rounded-full blur-2xl animate-float-enhanced"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-r from-emerald-300 to-teal-500 opacity-25 rounded-full blur-3xl animate-float-enhanced"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-3/4 left-3/4 w-40 h-40 bg-gradient-to-r from-green-300 to-emerald-400 opacity-20 rounded-full blur-2xl animate-float-enhanced"
            style={{ animationDelay: "5s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-gradient-to-r from-teal-300 to-green-400 opacity-15 rounded-full blur-3xl animate-float-enhanced"
            style={{ animationDelay: "6s" }}
          ></div>
        </div>
      )}

      {/* Grid Pattern Overlay (only show if no background image) */}
      {!(businessSettings?.background_image_url || backgroundImageUrl) && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      )}

      {/* Header */}
      {/* Standardized Header like About.tsx - Note: businessSettings are used for logo/name, which is fine */}
      <header className="relative z-20 p-4 md:p-6 bg-gradient-to-r from-emerald-900/15 via-green-900/15 to-teal-900/15 backdrop-blur-2xl border-b border-emerald-400/30 shadow-lg shadow-emerald-500/10">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Logo and Business Name from businessSettings - this part is good and specific to Index.tsx */}
            {businessSettings?.logo_url ? (
              <img
                src={businessSettings.logo_url}
                alt={
                  businessSettings?.business_name
                    ? `${businessSettings.business_name} Logo`
                    : "Energy Palace Logo"
                }
                className="h-10 md:h-12 w-10 md:w-12 object-contain rounded-xl" // Slightly adjusted size for consistency
              />
            ) : (
              <div className="icon-container-enhanced neon-glow-green">
                <Zap className="h-6 md:h-8 w-6 md:w-8 text-white" />
              </div>
            )}
            <div>
              {/* Site title (not H1 on homepage) */}
              <div
                className={`text-xl md:text-2xl font-bold ${theme === "light" ? "text-gradient-animated" : "text-gradient-animated"} drop-shadow-sm`}
              >
                {businessSettings?.business_name || "Energy Palace"}
              </div>
              {/* Tagline can remain if desired, or be removed for closer match to About.tsx header style */}
              <p
                className={`text-sm ${theme === "light" ? "text-gray-600" : "text-white/60"}`}
              >
                {businessSettings?.business_tagline ||
                  "EV Charging, Restaurant & Coffee Shop"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation - Standardized */}
          <div
            className={`hidden md:flex items-center space-x-6 ${theme === "light" ? "text-gray-800" : "text-white"}`}
          >
            <a
              href="/about"
              className={`${theme === "light" ? "hover:text-emerald-600 bg-white/20 hover:bg-white/30" : "hover:text-emerald-400 bg-white/10 hover:bg-white/20"} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </a>
            <a
              href="/blog"
              className={`${theme === "light" ? "hover:text-emerald-600 bg-white/20 hover:bg-white/30" : "hover:text-emerald-400 bg-white/10 hover:bg-white/20"} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}
            >
              <BookOpen className="h-4 w-4" />{" "}
              {/* Changed from Users to BookOpen for Blog */}
              <span>Blog</span>
            </a>
            <a
              href="/contacts"
              className={`${theme === "light" ? "hover:text-emerald-600 bg-white/20 hover:bg-white/30" : "hover:text-emerald-400 bg-white/10 hover:bg-white/20"} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}
            >
              <Phone className="h-4 w-4" />{" "}
              {/* Changed from Users to Phone for Contacts */}
              <span>Contact</span>
            </a>
            <a
              href="/media"
              className={`${theme === "light" ? "hover:text-emerald-600 bg-white/20 hover:bg-white/30" : "hover:text-emerald-400 bg-white/10 hover:bg-white/20"} transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer`}
            >
              <Zap className="h-4 w-4" />{" "}
              {/* Placeholder icon, can be changed */}
              <span>Media</span>
            </a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === "light" ? "bg-white/20 hover:bg-white/30" : "bg-white/10 hover:bg-white/20"} transition-all duration-300`}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button - Standardized */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`md:hidden p-2 rounded-lg ${theme === "light" ? "bg-white/20 hover:bg-white/30" : "bg-white/10 hover:bg-white/20"} transition-all duration-300`}
          >
            {showMobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>

        {/* Mobile Menu - Standardized */}
        {showMobileMenu && (
          <div
            className={`md:hidden absolute top-full left-0 right-0 ${theme === "light" ? "bg-white/95" : "bg-black/95"} backdrop-blur-md shadow-lg border-t border-white/10 z-50`}
          >
            <nav className="py-4">
              <a
                href="/about"
                className={`flex items-center gap-3 px-6 py-3 ${theme === "light" ? "text-gray-800 hover:bg-white/50" : "text-white hover:bg-white/10"} transition-colors font-medium cursor-pointer`}
                onClick={() => setShowMobileMenu(false)}
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </a>
              <a
                href="/blog"
                className={`flex items-center gap-3 px-6 py-3 ${theme === "light" ? "text-gray-800 hover:bg-white/50" : "text-white hover:bg-white/10"} transition-colors font-medium cursor-pointer`}
                onClick={() => setShowMobileMenu(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </a>
              <a
                href="/contacts"
                className={`flex items-center gap-3 px-6 py-3 ${theme === "light" ? "text-gray-800 hover:bg-white/50" : "text-white hover:bg-white/10"} transition-colors font-medium cursor-pointer`}
                onClick={() => setShowMobileMenu(false)}
              >
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </a>
              <a
                href="/media"
                className={`flex items-center gap-3 px-6 py-3 ${theme === "light" ? "text-gray-800 hover:bg-white/50" : "text-white hover:bg-white/10"} transition-colors font-medium cursor-pointer`}
                onClick={() => setShowMobileMenu(false)}
              >
                <Zap className="h-4 w-4" /> {/* Placeholder icon */}
                <span>Media</span>
              </a>
              <button
                onClick={() => {
                  toggleTheme();
                  setShowMobileMenu(false);
                }}
                className={`flex items-center w-full text-left px-6 py-3 ${theme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-white/80 hover:bg-white/10"} transition-colors`}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 mr-2" />
                ) : (
                  <Sun className="h-5 w-5 mr-2" />
                )}
                {theme === "light" ? "Dark Mode" : "Light Mode"}
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
            <div
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card-enhanced bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 ${theme === "light" ? "border-emerald-300 text-emerald-700" : "border-emerald-400/30 text-emerald-200"} mb-8 border-glow-enhanced`}
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span>Live Charging Status Available</span>
            </div>

            <h1
              className={`text-6xl md:text-8xl font-black leading-tight ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              <span className={`block text-gradient-animated text-shadow-glow`}>
                Charge
              </span>
              <span
                className={`block ${theme === "light" ? "text-gray-800" : "text-white/90"}`}
              >
                And Dine
              </span>
            </h1>

            <p
              className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${theme === "light" ? "text-gray-600" : "text-white/70"}`}
            >
              Power up your EV, savor exceptional meals at our restaurant, and
              relax with specialty coffees at our on-site coffee shop. Energy
              Palace is your complete destination.
            </p>
          </div>

          {/* Main CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Book Charger */}
            <div
              className={`glass-card-enhanced p-8 ${theme === "light" ? "bg-gradient-to-br from-white/90 to-emerald-50/90" : "bg-gradient-to-br from-emerald-900/20 to-green-900/20"} hover-lift-enhanced group`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="icon-container-enhanced neon-glow-green group-hover:scale-110 transition-transform">
                  <Zap className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
                <h3
                  className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                >
                  Book Charger
                </h3>
                <p
                  className={`text-center ${theme === "light" ? "text-gray-600" : "text-white/60"}`}
                >
                  Reserve your charging station and get real-time updates
                </p>
                <Button
                  onClick={() => setIsChargingModalOpen(true)}
                  className="w-full btn-primary-enhanced"
                >
                  <span>Book Now</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Menu */}
            <div
              className={`glass-card-enhanced p-8 ${theme === "light" ? "bg-gradient-to-br from-white/90 to-green-50/90" : "bg-gradient-to-br from-green-900/20 to-emerald-900/20"} hover-lift-enhanced group`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="icon-container-enhanced neon-glow group-hover:scale-110 transition-transform bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500">
                  <Coffee className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
                <h3
                  className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                >
                  Menu
                </h3>
                <p
                  className={`text-center ${theme === "light" ? "text-gray-600" : "text-white/60"}`}
                >
                  Discover our full restaurant menu and enjoy fresh coffee &
                  snacks from our coffee shop while your EV charges.
                </p>
                <Button
                  onClick={() => setIsMenuModalOpen(true)}
                  className="w-full btn-primary-enhanced bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:from-green-500 hover:via-emerald-600 hover:to-teal-600"
                >
                  <span>View Menu</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Reserve Now */}
            <div
              className={`glass rounded-2xl p-8 border ${theme === "light" ? "border-teal-200 bg-gradient-to-br from-white/80 to-teal-50/80" : "border-teal-400/30 bg-gradient-to-br from-teal-900/20 to-cyan-900/20"} hover:border-teal-400/70 hover:shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105 group`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 group-hover:scale-110 transition-transform shadow-lg shadow-teal-500/50">
                  <Car className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
                <h3
                  className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                >
                  Reserve Now
                </h3>
                <p
                  className={`text-center ${theme === "light" ? "text-gray-600" : "text-white/60"}`}
                >
                  Book your table for the ultimate dining experience
                </p>
                <Button
                  onClick={() => setIsReservationModalOpen(true)}
                  className="w-full bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 hover:from-teal-500 hover:via-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-teal-500/50 hover:shadow-xl"
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
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                4+
              </div>
              <div
                className={`text-sm uppercase tracking-wider ${theme === "light" ? "text-emerald-600" : "text-emerald-300"}`}
              >
                Charging Ports
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg">
                180kW
              </div>
              <div
                className={`text-sm uppercase tracking-wider ${theme === "light" ? "text-emerald-600" : "text-emerald-300"}`}
              >
                Max Power
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-lg">
                {businessSettings?.opening_hours || "24/7"}
              </div>
              <div
                className={`text-sm uppercase tracking-wider ${theme === "light" ? "text-emerald-600" : "text-emerald-300"}`}
              >
                Available
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent drop-shadow-lg">
                ~30min
              </div>
              <div
                className={`text-sm uppercase tracking-wider ${theme === "light" ? "text-emerald-600" : "text-emerald-300"}`}
              >
                Fast Charging
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* About Us Section */}
      <section
        id="about"
        className={`relative z-10 py-20 ${theme === "light" ? "bg-white/20" : "bg-black/20"} backdrop-blur-sm`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className={`text-5xl font-bold mb-6 ${theme === "light" ? "text-gray-900" : "text-white"}`}
            >
              <span
                className={`${theme === "light" ? "bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent" : "bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"}`}
              >
                {aboutContent?.title || "About Energy Palace"}
              </span>
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${theme === "light" ? "text-gray-600" : "text-white/70"}`}
            >
              {aboutContent?.company_story ||
                "Located in Bhiman, Sindhuli, Energy Palace is Nepal's premier EV charging destination. We combine state-of-the-art electric vehicle charging technology with exceptional dining and hospitality, making your journey through Nepal both sustainable and enjoyable."}
            </p>
          </div>

          {/* Location Card - Featured */}
          <div className="mb-12">
            <div className="glass-card-enhanced p-8 max-w-4xl mx-auto text-center border-emerald-400/30 hover-lift-enhanced">
              <div className="icon-container-enhanced mx-auto mb-6 neon-glow-green">
                <MapPin className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-2xl font-bold text-gradient-animated mb-4">
                Our Prime Location: Bhiman, Sindhuli
              </h3>
              <LocationDisplay />
              <p
                className={`text-lg mt-4 leading-relaxed ${theme === "light" ? "text-gray-600" : "text-white/80"}`}
              >
                Strategically positioned on Nepal's main highway, Energy Palace
                serves as the perfect pit stop for EV travelers. Our location in
                Bhiman, Sindhuli offers 24/7 accessibility, ample parking, and
                easy highway access for all electric vehicles.
              </p>
            </div>
          </div>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a href="/blog" className="block">
              <div className="glass-card-enhanced p-8 text-center hover-lift-enhanced h-full border-emerald-400/20">
                <div className="relative">
                  <div className="icon-container-enhanced mx-auto mb-6 bg-gradient-to-r from-emerald-400/20 to-teal-500/20">
                    <Zap className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/50">
                    INNOVATION
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-4 text-gradient-animated">
                  Innovation
                </h4>
                <p
                  className={`text-base leading-relaxed ${theme === "light" ? "text-gray-600" : "text-white/70"}`}
                >
                  Leading the way in sustainable energy solutions with
                  cutting-edge EV charging technology and smart grid
                  integration.
                </p>
              </div>
            </a>

            <a href="/contacts" className="block">
              <div className="glass-card-enhanced p-8 text-center hover-lift-enhanced h-full border-emerald-400/20">
                <div className="relative">
                  <div className="icon-container-enhanced mx-auto mb-6 bg-gradient-to-r from-green-400/20 to-emerald-500/20">
                    <Users className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold border border-green-400/50">
                    COMMUNITY
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-4 text-gradient-animated">
                  Community
                </h4>
                <p
                  className={`text-base leading-relaxed ${theme === "light" ? "text-gray-600" : "text-white/70"}`}
                >
                  Building strong connections and fostering a supportive EV
                  community throughout Nepal and beyond.
                </p>
              </div>
            </a>

            <a href="/about" className="block">
              <div className="glass-card-enhanced p-8 text-center hover-lift-enhanced h-full border-emerald-400/20">
                <div className="relative">
                  <div className="icon-container-enhanced mx-auto mb-6 bg-gradient-to-r from-teal-400/20 to-cyan-500/20">
                    <Coffee className="h-8 w-8 text-teal-400" />
                  </div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-teal-500/90 text-white px-3 py-1 rounded-full text-xs font-bold border border-teal-400/50">
                    EXCELLENCE
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-4 text-gradient-animated">
                  Excellence
                </h4>
                <p
                  className={`text-base leading-relaxed ${theme === "light" ? "text-gray-600" : "text-white/70"}`}
                >
                  Delivering exceptional service and premium experiences in both
                  EV charging and hospitality.
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Copied and Adapted from About.tsx */}
      {testimonials.length > 0 && !loadingCombined && (
        <section
          id="testimonials"
          className={`relative z-10 py-20 ${theme === "light" ? "bg-gray-50/50" : "bg-black/30"} backdrop-blur-sm`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                What Our Customers Say
              </h2>
              <p
                className={`text-lg md:text-xl max-w-3xl mx-auto ${theme === "light" ? "text-gray-600" : "text-white/70"}`}
              >
                Hear from our satisfied customers about their experience at
                Energy Palace.
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <Card
                className={`glass border ${theme === "light" ? "border-gray-200 bg-white/60" : "border-white/20 bg-gray-900/60"} backdrop-blur-xl overflow-hidden shadow-xl`}
              >
                <CardContent className="p-8 md:p-12 text-center relative">
                  <Quote
                    className={`h-10 w-10 md:h-12 md:w-12 mx-auto mb-6 ${theme === "light" ? "text-emerald-500" : "text-emerald-400"} opacity-75`}
                  />

                  <div className="min-h-[150px] md:min-h-[200px] flex items-center justify-center">
                    {" "}
                    {/* Adjusted min-height */}
                    <div className="space-y-4 md:space-y-6">
                      <p
                        className={`text-md md:text-xl italic leading-relaxed ${theme === "light" ? "text-gray-700" : "text-white/90"}`}
                      >
                        "{testimonials[currentTestimonial]?.content}"
                      </p>

                      <div className="flex items-center justify-center space-x-1 mb-2 md:mb-4">
                        {[
                          ...Array(
                            testimonials[currentTestimonial]?.rating || 5,
                          ),
                        ].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      <div>
                        <h4
                          className={`font-bold text-md md:text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {testimonials[currentTestimonial]?.customer_name}
                        </h4>
                        {testimonials[currentTestimonial]?.customer_title && (
                          <p
                            className={`text-sm ${theme === "light" ? "text-gray-500" : "text-white/60"}`}
                          >
                            {testimonials[currentTestimonial].customer_title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  {testimonials.length > 1 && (
                    <>
                      <div className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2">
                        <Button
                          onClick={prevTestimonial}
                          variant="outline"
                          size="icon" // Changed to icon size
                          className={`rounded-full w-8 h-8 md:w-10 md:h-10 p-0 ${theme === "light" ? "bg-white/50 hover:bg-gray-100 border-gray-300" : "bg-white/10 border-white/20 hover:bg-white/20 text-white"}`}
                        >
                          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                      </div>

                      <div className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2">
                        <Button
                          onClick={nextTestimonial}
                          variant="outline"
                          size="icon" // Changed to icon size
                          className={`rounded-full w-8 h-8 md:w-10 md:h-10 p-0 ${theme === "light" ? "bg-white/50 hover:bg-gray-100 border-gray-300" : "bg-white/10 border-white/20 hover:bg-white/20 text-white"}`}
                        >
                          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Dots Indicator */}
              {testimonials.length > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? "bg-emerald-500 scale-125"
                          : theme === "light"
                            ? "bg-gray-300 hover:bg-gray-400"
                            : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        className={`relative z-10 mt-16 border-t ${theme === "light" ? "border-gray-200 bg-white/20" : "border-white/10 bg-black/20"} backdrop-blur-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {businessSettings?.logo_url ? (
                  <img
                    src={businessSettings.logo_url}
                    alt={
                      businessSettings?.business_name
                        ? `${businessSettings.business_name} Logo`
                        : "Energy Palace Logo"
                    }
                    className="h-10 w-10 object-contain rounded-xl"
                  />
                ) : (
                  <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                )}
                <span
                  className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"}`}
                >
                  {businessSettings?.business_name || "Energy Palace"}
                </span>
              </div>
              <p
                className={`${theme === "light" ? "text-gray-600" : "text-white/60"}`}
              >
                Nepal's premier EV charging station, complete with a
                full-service restaurant and a welcoming coffee shop.
              </p>
            </div>

            <div className="space-y-4">
              <h4
                className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                Contact Info
              </h4>
              <div
                className={`space-y-2 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}
              >
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>
                    {businessSettings?.contact_phone || "+9779841426598"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>
                    {businessSettings?.contact_email ||
                      "info@energypalace.com.np"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {businessSettings?.business_address ||
                      "Bhiman, Sindhuli, Nepal"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4
                className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                Operating Hours
              </h4>
              <div
                className={`flex items-center space-x-2 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}
              >
                <Clock className="h-4 w-4" />
                <span>
                  {businessSettings?.opening_hours || "24/7 Available"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4
                className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                Quick Links
              </h4>
              <ul
                className={`space-y-2 ${theme === "light" ? "text-gray-600" : "text-white/60"}`}
              >
                <li>
                  <a
                    href="/about"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/contacts"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/media"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Media & Press
                  </a>
                </li>
                {/* Add other important links here, e.g., Terms of Service, Privacy Policy if they exist */}
              </ul>
            </div>
          </div>

          <div
            className={`border-t ${theme === "light" ? "border-gray-200" : "border-white/10"} mt-8 pt-8 text-center ${theme === "light" ? "text-gray-500" : "text-white/40"}`}
          >
            <p>
              &copy; 2024 {businessSettings?.business_name || "Energy Palace"}.
              All rights reserved.
            </p>
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
