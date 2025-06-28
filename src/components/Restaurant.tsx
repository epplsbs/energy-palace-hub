
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Coffee, Clock, Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getMenuCategories, 
  getMenuItems, 
  createOrder,
  type MenuCategory, 
  type MenuItem 
} from '@/services/contentService';

interface CartItem extends MenuItem {
  quantity: number;
  menu_categories?: { name: string } | null;
}

const Restaurant = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const [categoriesData, itemsData] = await Promise.all([
          getMenuCategories(),
          getMenuItems()
        ]);
        setCategories(categoriesData);
        setMenuItems(itemsData);
      } catch (error) {
        console.error('Error loading menu data:', error);
        toast({
          title: "Error",
          description: "Failed to load menu data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuData();
  }, [toast]);

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => {
        const category = categories.find(c => c.id === item.category_id);
        return category?.name.toLowerCase().includes(selectedCategory);
      });

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });

    toast({
      title: "Added to cart",
      description: `Rs.{item.name} has been added to your cart`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      return prevCart.reduce((acc, item) => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before ordering",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert cart items to a format that matches Json type
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        description: item.description || null,
        image_url: item.image_url || null
      }));

      await createOrder({
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        items: orderItems,
        total_amount: getTotalPrice(),
        notes: customerInfo.notes || null,
        status: 'pending',
        order_source: 'website'
      });

      toast({
        title: "Order placed successfully!",
        description: "We'll prepare your order and notify you when it's ready.",
      });

      // Reset form
      setCart([]);
      setCustomerInfo({ name: '', email: '', phone: '', notes: '' });
      setIsOrderDialogOpen(false);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <section id="restaurant" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="restaurant" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full mb-6">
            <Coffee className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-orange-800 text-sm font-medium">Restaurant & Coffee Shop</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Delicious Menu
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enjoy premium coffee and fresh meals while your EV charges
          </p>
        </div>

        {/* Menu Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto" style={{ gridTemplateColumns: `repeat(Rs.{categories.length + 1}, 1fr)` }}>
            <TabsTrigger value="all">All Items</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.name.toLowerCase()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  {item.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {item.name}
                      </CardTitle>
                      <Badge 
                        className={`Rs.{item.is_available ? 'bg-emerald-500' : 'bg-red-500'} text-white border-0 ml-2`}
                      >
                        {item.is_available ? 'Available' : 'Sold Out'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {item.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-emerald-600">
                        Rs.{Number(item.price).toFixed(2)}
                      </span>
                      <Button
                        onClick={() => addToCart(item)}
                        disabled={!item.is_available}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40">
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg rounded-full px-6 py-3">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart ({getTotalItems()}) - Rs.{getTotalPrice().toFixed(2)}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Your Order</DialogTitle>
                  <DialogDescription>
                    Review your items and complete your order
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-gray-600">Rs.{Number(item.price).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => removeFromCart(item.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            onClick={() => addToCart(item)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="font-semibold">
                          Rs.{(Number(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Special Notes</Label>
                        <Textarea
                          id="notes"
                          value={customerInfo.notes}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any special requests..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total: Rs.{getTotalPrice().toFixed(2)}</span>
                      <Button onClick={handleOrder} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        Place Order
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </section>
  );
};

export default Restaurant;
