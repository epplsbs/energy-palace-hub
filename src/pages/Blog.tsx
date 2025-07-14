import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getGalleryItems } from "@/services/contentService";
import { useBackgroundImage } from "@/hooks/useBackgroundImage";
import { useSEO } from "@/hooks/useSEO";
import {
  Zap,
  Calendar,
  Tag,
  BookOpen,
  X,
  Home,
  Phone,
  Info,
  Menu,
  Search,
  Clock,
  MapPin,
  Share2,
  Heart,
  MessageCircle,
  Eye,
  User,
  ArrowRight,
  TrendingUp,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

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
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const backgroundImageUrl = useBackgroundImage();
  useSEO("/blog");

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [galleryItems, searchQuery, selectedCategory]);

  const fetchGalleryItems = async () => {
    try {
      const data = await getGalleryItems();
      setGalleryItems(data || []);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = galleryItems;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredItems(filtered);
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
    return text.substring(0, maxLength) + "...";
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const categories = ["All", "Events", "News", "Technology", "Community"];

  const featuredPost = filteredItems[0];
  const regularPosts = filteredItems.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Loading amazing stories...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Energy Palace Blog - Latest News & Stories from Bhiman, Sindhuli | EV
          Charging Station Nepal
        </title>
        <meta
          name="description"
          content="Discover the latest news, stories and updates from Energy Palace EV charging station in Bhiman, Sindhuli, Nepal. Read about our journey, community events, and sustainable energy initiatives."
        />
        <meta
          name="keywords"
          content="Energy Palace blog, EV charging news Nepal, Bhiman Sindhuli stories, electric vehicle charging updates, sustainable energy Nepal, Energy Palace events, EV charging station blog"
        />
        <meta name="author" content="Energy Palace" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://energypalace.com.np/blog" />

        {/* Geographic SEO */}
        <meta name="geo.region" content="NP-P3" />
        <meta name="geo.placename" content="Bhiman, Sindhuli, Nepal" />
        <meta name="geo.position" content="27.2038;85.9496" />
        <meta name="ICBM" content="27.2038, 85.9496" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Energy Palace Blog - Latest News & Stories from Nepal's Premier EV Charging Station"
        />
        <meta
          property="og:description"
          content="Read the latest updates, stories and community news from Energy Palace EV charging station in Bhiman, Sindhuli, Nepal."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://energypalace.com.np/blog" />
        <meta
          property="og:image"
          content="https://energypalace.com.np/images/blog-og.jpg"
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Energy Palace" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Energy Palace Blog - EV Charging News & Stories"
        />
        <meta
          name="twitter:description"
          content="Latest updates and stories from Energy Palace EV charging station in Bhiman, Sindhuli, Nepal."
        />
        <meta
          name="twitter:image"
          content="https://energypalace.com.np/images/blog-twitter.jpg"
        />

        {/* Additional SEO */}
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="7 days" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Energy Palace Blog",
            description:
              "Latest news, stories and updates from Energy Palace EV charging station in Bhiman, Sindhuli, Nepal",
            url: "https://energypalace.com.np/blog",
            publisher: {
              "@type": "Organization",
              name: "Energy Palace",
              logo: {
                "@type": "ImageObject",
                url: "https://energypalace.com.np/logo.png",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Bhiman",
                addressLocality: "Sindhuli",
                addressRegion: "Bagmati Province",
                postalCode: "45900",
                addressCountry: "NP",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 27.2038,
                longitude: 85.9496,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://energypalace.com.np/blog",
            },
            blogPost: filteredItems.map((item) => ({
              "@type": "BlogPosting",
              headline: item.title,
              description: item.description,
              url: `https://energypalace.com.np/blog/${item.id}`,
              datePublished: item.created_at,
              dateModified: item.created_at,
              author: {
                "@type": "Organization",
                name: "Energy Palace",
              },
              publisher: {
                "@type": "Organization",
                name: "Energy Palace",
              },
              image: item.image_url,
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-enhanced"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float-enhanced"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-float-enhanced"
            style={{ animationDelay: "6s" }}
          ></div>
        </div>

        {/* Modern header */}
        <header className="relative z-20 p-4 md:p-6 glass-card-enhanced border-b border-emerald-400/20">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="icon-container-enhanced bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gradient-animated">
                  Energy Palace Blog
                </h1>
                <p className="text-white/60 text-sm md:text-base">
                  Stories from the Future of Energy
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 text-white">
              <a
                href="/"
                className="hover:text-emerald-400 transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 font-medium"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
              <a
                href="/about"
                className="hover:text-emerald-400 transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 font-medium"
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </a>
              <a
                href="/contacts"
                className="hover:text-emerald-400 transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 font-medium"
              >
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg glass hover:bg-white/10 transition-all duration-300"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </nav>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden absolute top-full left-0 right-0 glass-card-enhanced border-t border-emerald-400/20 z-50">
              <nav className="py-4">
                <a
                  href="/"
                  className="flex items-center gap-3 px-6 py-3 text-white hover:bg-white/10 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </a>
                <a
                  href="/about"
                  className="flex items-center gap-3 px-6 py-3 text-white hover:bg-white/10 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Info className="h-4 w-4" />
                  <span>About</span>
                </a>
                <a
                  href="/contacts"
                  className="flex items-center gap-3 px-6 py-3 text-white hover:bg-white/10 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Phone className="h-4 w-4" />
                  <span>Contact</span>
                </a>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-400/30">
              <TrendingUp className="h-4 w-4" />
              Latest Stories
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 text-white">
              <span className="text-gradient-animated">Energy Palace</span>
              <br />
              <span className="text-white/80">Chronicles</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white/70 leading-relaxed">
              Discover the journey of Nepal's most advanced EV charging
              destination in Bhiman, Sindhuli. From cutting-edge technology to
              community stories, explore what makes Energy Palace special.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 glass-card-enhanced p-6 border-emerald-400/30">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search stories, events, and updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass border-emerald-400/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/50 h-12"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-white/70" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="glass border-emerald-400/30 text-white bg-transparent rounded-lg px-4 py-2 focus:border-emerald-400 focus:ring-emerald-400/50"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category.toLowerCase()}
                      className="bg-gray-900"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass-card-enhanced border-emerald-400/30 p-12 backdrop-blur-xl hover-lift-enhanced">
                <div className="icon-container-enhanced mb-6 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 mx-auto">
                  <BookOpen className="h-16 w-16 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">
                  Stories Coming Soon
                </h3>
                <p className="text-white/70 text-lg max-w-md mx-auto leading-relaxed">
                  We're curating amazing stories about our journey, community,
                  and the future of sustainable energy in Nepal. Check back soon
                  for inspiring content!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <a
                    href="/"
                    className="btn-primary-enhanced inline-flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Visit Energy Palace
                  </a>
                  <a
                    href="/contacts"
                    className="px-6 py-3 glass border border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10 transition-all duration-300 rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Share Your Story
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured Post */}
              {featuredPost && (
                <div className="glass-card-enhanced border-emerald-400/30 overflow-hidden hover-lift-enhanced">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative h-64 lg:h-full min-h-[400px]">
                      <img
                        src={featuredPost.image_url}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(
                              featuredPost.created_at,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {getReadingTime(featuredPost.description)} min read
                          </span>
                        </div>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-white/80 text-lg leading-relaxed mb-6">
                        {truncateText(featuredPost.description, 200)}
                      </p>
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => openModal(featuredPost)}
                          className="btn-primary-enhanced flex items-center gap-2"
                        >
                          <BookOpen className="h-4 w-4" />
                          Read Full Story
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-3 text-white/60">
                          <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">124</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Posts Grid */}
              {regularPosts.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="icon-container-enhanced p-2">
                      <BookOpen className="h-6 w-6 text-emerald-400" />
                    </div>
                    Latest Stories
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((item, index) => (
                      <Card
                        key={item.id}
                        className="glass-card-enhanced border-emerald-400/30 overflow-hidden hover-lift-enhanced group border-glow-enhanced"
                      >
                        <div className="relative">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-white/80 text-xs">
                              <Eye className="h-3 w-3" />
                              <span>
                                {Math.floor(Math.random() * 500) + 100}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardHeader className="p-6">
                          <div className="flex items-center gap-3 text-sm text-white/60 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {getReadingTime(item.description)} min
                              </span>
                            </div>
                          </div>
                          <CardTitle className="text-xl group-hover:text-emerald-400 transition-colors line-clamp-2 text-white leading-tight">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                          <p className="text-white/80 leading-relaxed mb-4 line-clamp-3">
                            {truncateText(item.description, 120)}
                          </p>
                          <div className="flex items-center justify-between">
                            <Button
                              onClick={() => openModal(item)}
                              variant="ghost"
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 p-0 h-auto font-semibold"
                            >
                              Read More <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                            <div className="flex items-center gap-2 text-white/50">
                              <button className="hover:text-emerald-400 transition-colors">
                                <Heart className="h-4 w-4" />
                              </button>
                              <button className="hover:text-emerald-400 transition-colors">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Newsletter Subscription */}
          <div className="mt-20 glass-card-enhanced border-emerald-400/30 p-8 md:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="icon-container-enhanced bg-gradient-to-r from-emerald-500/20 to-blue-500/20 mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500/90 text-white px-4 py-1 rounded-full text-sm font-bold border border-emerald-400/50">
                  STAY CONNECTED
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                <span className="text-gradient-animated">Stay Connected</span>
              </h3>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Get the latest updates about Energy Palace, sustainable energy
                news, and exclusive events delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 glass border-emerald-400/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/50"
                />
                <Button className="btn-primary-enhanced">Subscribe</Button>
              </div>
              <p className="text-white/50 text-sm mt-4">
                Join 500+ energy enthusiasts. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="glass-card-enhanced border-emerald-400/30 p-8 md:p-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                <span className="text-gradient-animated">
                  Experience Energy Palace
                </span>
              </h3>
              <p className="mb-8 max-w-3xl mx-auto text-white/70 text-lg leading-relaxed">
                Ready to be part of our story? Visit Nepal's most advanced EV
                charging destination and premium dining experience in the heart
                of Sindhuli.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/"
                  className="btn-primary-enhanced inline-flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Book Charging Station
                </a>
                <a
                  href="/contacts"
                  className="px-8 py-4 glass border border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10 transition-all duration-300 rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Visit Us in Bhiman
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Enhanced Read More Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden glass-card-enhanced border-emerald-400/30 text-white fixed inset-0 m-auto w-fit h-fit">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-emerald-400/20">
              <div className="flex-1">
                <DialogTitle className="text-2xl md:text-3xl font-bold text-gradient-animated mb-2">
                  {selectedPost?.title}
                </DialogTitle>
                {selectedPost && (
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(selectedPost.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {getReadingTime(selectedPost.description)} min read
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Energy Palace Team</span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={closeModal}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </Button>
            </DialogHeader>

            {selectedPost && (
              <div className="overflow-y-auto max-h-[calc(90vh-160px)] space-y-8 p-6">
                <div className="relative">
                  <img
                    src={selectedPost.image_url}
                    alt={selectedPost.title}
                    className="w-full h-64 md:h-96 object-cover rounded-xl border-glow-enhanced"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white/90">
                      <Eye className="h-4 w-4" />
                      <span>
                        {Math.floor(Math.random() * 1000) + 500} views
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="text-white/90 leading-relaxed text-lg whitespace-pre-wrap">
                    {selectedPost.description}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-emerald-400/20">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-white/70 hover:text-emerald-400 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span>Like ({Math.floor(Math.random() * 100) + 20})</span>
                    </button>
                    <button className="flex items-center gap-2 text-white/70 hover:text-emerald-400 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                  </div>
                  <div className="text-white/50 text-sm">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Bhiman, Sindhuli, Nepal
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Blog;
