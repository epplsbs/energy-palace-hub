
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "The Future of Electric Vehicle Charging in Nepal",
      excerpt: "Exploring how EV infrastructure is evolving in Nepal and what it means for sustainable transportation.",
      content: "Nepal is experiencing a significant shift towards electric vehicles, driven by environmental consciousness and government initiatives...",
      author: "Energy Palace Team",
      date: "2024-03-15",
      category: "Technology",
      image: "/placeholder.svg",
      readTime: "5 min read",
      views: 1250
    },
    {
      id: 2,
      title: "Premium Dining Experience While You Charge",
      excerpt: "Discover our carefully curated menu designed to make your charging time memorable and delicious.",
      content: "At Energy Palace, we believe that charging your vehicle should be more than just a necessity...",
      author: "Chef Ramesh K.",
      date: "2024-03-10",
      category: "Food & Dining",
      image: "/placeholder.svg",
      readTime: "3 min read",
      views: 890
    },
    {
      id: 3,
      title: "Sustainable Energy Solutions for a Greener Tomorrow",
      excerpt: "Learn about our commitment to renewable energy and how we're contributing to Nepal's green future.",
      content: "Sustainability is at the core of everything we do at Energy Palace. Our solar-powered charging stations...",
      author: "Dr. Priya Sharma",
      date: "2024-03-05",
      category: "Sustainability",
      image: "/placeholder.svg",
      readTime: "7 min read",
      views: 2150
    }
  ]);

  const [selectedPost, setSelectedPost] = useState(null);

  const categories = ["All", "Technology", "Food & Dining", "Sustainability", "News"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-futuristic relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Header */}
      <header className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-emerald-400 flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Energy Palace Blog
          </h1>
          
          <div></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {!selectedPost ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Stories & Insights
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Discover the latest in EV technology, sustainable energy, and premium dining experiences.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`${
                    activeCategory === category
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                      : "border-white/20 text-white hover:bg-white/10"
                  } transition-all duration-300`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="glass border-white/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-t-lg flex items-center justify-center">
                    <div className="text-6xl opacity-50">📝</div>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-white/60 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <Button 
                      onClick={() => setSelectedPost(post)}
                      className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* Single Post View */
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={() => setSelectedPost(null)}
              variant="ghost" 
              className="text-white hover:text-emerald-400 mb-8 flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Blog</span>
            </Button>

            <article className="glass border-white/20 rounded-2xl p-8">
              <header className="mb-8">
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 mb-4">
                  {selectedPost.category}
                </Badge>
                <h1 className="text-4xl font-bold text-white mb-4">{selectedPost.title}</h1>
                
                <div className="flex items-center justify-between text-white/60">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      {selectedPost.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {new Date(selectedPost.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      {selectedPost.views} views
                    </div>
                  </div>
                  <span>{selectedPost.readTime}</span>
                </div>
              </header>

              <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-8">
                <div className="text-8xl opacity-50">📝</div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  {selectedPost.content}
                </p>
                <p className="text-white/70 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </article>
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
