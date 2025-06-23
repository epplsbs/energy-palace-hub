
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, User, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'facility' | 'events' | 'food' | 'charging';
  date: string;
  author: string;
  content?: string;
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: '1',
      title: 'Grand Opening Celebration',
      description: 'Celebrating the launch of our state-of-the-art EV charging facility',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop',
      category: 'events',
      date: '2024-01-15',
      author: 'Energy Palace Team',
      content: 'We were thrilled to welcome the community to our grand opening celebration. The event featured tours of our charging facilities, tastings from our restaurant, and demonstrations of the latest EV technology.'
    },
    {
      id: '2',
      title: 'Modern Charging Infrastructure',
      description: 'Our cutting-edge 60KW and 80KW charging stations',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=400&fit=crop',
      category: 'facility',
      date: '2024-01-10',
      author: 'Technical Team',
      content: 'Our facility features the latest in EV charging technology, with both CCS2 and GBT connectors to serve all electric vehicle types. Each station is equipped with smart monitoring and safety systems.'
    },
    {
      id: '3',
      title: 'Artisan Coffee Experience',
      description: 'Freshly roasted coffee and gourmet meals in our restaurant',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
      category: 'food',
      date: '2024-01-08',
      author: 'Culinary Team',
      content: 'Our restaurant offers a premium dining experience while you charge. From artisan coffee to fresh sandwiches and salads, every item is carefully crafted using the finest ingredients.'
    },
    {
      id: '4',
      title: 'Sustainable Energy Initiative',
      description: 'Our commitment to renewable energy and sustainability',
      image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&h=400&fit=crop',
      category: 'facility',
      date: '2024-01-05',
      author: 'Sustainability Team',
      content: 'Energy Palace is committed to sustainable practices. Our facility is powered by renewable energy sources, and we continuously work to minimize our environmental impact while providing exceptional service.'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: '🏢' },
    { id: 'facility', name: 'Facility', icon: '⚡' },
    { id: 'events', name: 'Events', icon: '🎉' },
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'charging', name: 'Charging', icon: '🔌' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'facility':
        return 'bg-blue-500';
      case 'events':
        return 'bg-purple-500';
      case 'food':
        return 'bg-orange-500';
      case 'charging':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
            <ImageIcon className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-purple-800 text-sm font-medium">Gallery & Blog</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Story in Pictures
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our facility, events, and the Energy Palace experience through our photo gallery and blog updates
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`transition-all duration-300 ${
                selectedCategory === category.id 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'hover:bg-purple-50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${getCategoryColor(item.category)} text-white border-0 capitalize`}>
                    {item.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(item.date)}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    {item.author}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                        className="hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{item.title}</DialogTitle>
                        <DialogDescription className="flex items-center space-x-4 text-base">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(item.date)}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {item.author}
                          </div>
                          <Badge className={`${getCategoryColor(item.category)} text-white border-0 capitalize`}>
                            {item.category}
                          </Badge>
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div className="aspect-video overflow-hidden rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            {item.description}
                          </p>
                          
                          {item.content && (
                            <p className="text-gray-600 leading-relaxed">
                              {item.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Follow our journey as we continue to expand and improve our services. 
              From new menu items to facility upgrades, we'll keep you informed about everything happening at Energy Palace.
            </p>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              Subscribe to Updates
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
