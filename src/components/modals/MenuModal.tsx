import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Plus, Minus, Utensils, X, ArrowLeft, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  is_available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const MenuModal = ({ isOpen, onClose }: MenuModalProps) => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMenuItems();
    }
  }, [isOpen]);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('display_order');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    toast({
      title: "Added to Cart",
      description: `${item.name} added to your order`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prev.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.phone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        customer_name: customerInfo.name.trim(),
        customer_email: customerInfo.email.trim() || null,
        customer_phone: customerInfo.phone.trim(),
        notes: customerInfo.notes.trim() || null,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_amount: getTotalAmount(),
        status: 'pending',
        order_source: 'website'
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderData);

      if (error) throw error;

      toast({
        title: "🎉 Order Placed Successfully!",
        description: "We'll contact you shortly to confirm your order.",
      });

      // Reset form
      setCustomerInfo({ name: '', email: '', phone: '', notes: '' });
      setCart([]);
      setShowCheckout(false);
      onClose();

    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast({
        title: "Order Failed",
        description: error?.message || "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowCheckout(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] mx-auto p-0 overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50 border-0 shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showCheckout && (
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="p-2 bg-white/20 rounded-xl">
                <Utensils className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl md:text-2xl font-bold">
                  {showCheckout ? 'Checkout' : 'Our Menu'}
                </DialogTitle>
                <p className="text-rose-100 text-sm md:text-base">
                  {showCheckout ? 'Complete your order' : 'Explore our delicious offerings'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!showCheckout && cart.length > 0 && (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-white text-rose-600 text-xs font-bold">
                    {getCartItemCount()}
                  </Badge>
                </button>
              )}
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {!showCheckout ? (
          <div className="flex flex-col max-h-[calc(90vh-140px)]">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-600 mb-4"></div>
                  <p className="text-gray-600">Loading menu items...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <Utensils className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-center">No menu items available at the moment</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map((item) => {
                    const cartItem = cart.find(ci => ci.id === item.id);
                    return (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-2xl border-2 border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex gap-4">
                            {item.image_url && (
                              <img 
                                src={item.image_url} 
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-900 truncate">{item.name}</h3>
                              <p className="text-gray-500 text-sm line-clamp-2 mb-2">{item.description}</p>
                              <p className="text-rose-600 font-bold text-lg">NPR {item.price}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            {cartItem ? (
                              <div className="flex items-center justify-between bg-rose-50 rounded-xl p-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFromCart(item.id)}
                                  className="h-10 w-10 rounded-xl border-rose-200"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-bold text-lg text-gray-900">{cartItem.quantity}</span>
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(item)}
                                  className="h-10 w-10 rounded-xl bg-rose-600 hover:bg-rose-700"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => addToCart(item)}
                                className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Floating Cart Summary */}
            {cart.length > 0 && (
              <div className="p-4 md:p-6 border-t bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">{getCartItemCount()} items in cart</p>
                    <p className="text-xl font-bold text-gray-900">NPR {getTotalAmount()}</p>
                  </div>
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="h-12 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-rose-200"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Checkout
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="flex flex-col max-h-[calc(90vh-140px)]">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 mb-6 border border-rose-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-rose-600" />
                  Order Summary
                </h4>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">{item.name}</span>
                        <Badge variant="outline" className="border-rose-200">x{item.quantity}</Badge>
                      </div>
                      <span className="font-medium text-gray-900">NPR {item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-rose-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-rose-600">NPR {getTotalAmount()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-5">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-rose-600" />
                  Your Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="h-12 rounded-xl border-gray-200 focus:border-rose-500 focus:ring-rose-500 bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+977-98XXXXXXXX"
                      className="h-12 rounded-xl border-gray-200 focus:border-rose-500 focus:ring-rose-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="h-12 rounded-xl border-gray-200 focus:border-rose-500 focus:ring-rose-500 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special dietary requirements or instructions?"
                    className="rounded-xl border-gray-200 focus:border-rose-500 focus:ring-rose-500 bg-white"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 p-4 md:p-6 border-t bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCheckout(false)}
                className="flex-1 h-12 rounded-xl border-2 font-semibold"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-rose-200"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;