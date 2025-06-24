
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { getMenuCategories, getMenuItems, createOrder } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';
import type { MenuCategory, MenuItem } from '@/services/contentService';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const MenuModal = ({ isOpen, onClose }: MenuModalProps) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadMenuData();
    }
  }, [isOpen]);

  const loadMenuData = async () => {
    try {
      const [categoriesData, itemsData] = await Promise.all([
        getMenuCategories(),
        getMenuItems()
      ]);
      setCategories(categoriesData);
      setMenuItems(itemsData);
    } catch (error) {
      console.error('Error loading menu:', error);
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
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Our Menu</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {categories.map(category => {
              const categoryItems = menuItems.filter(item => item.category_id === category.id);
              return (
                <div key={category.id} className="space-y-4">
                  <h3 className="text-xl font-semibold text-emerald-600 border-b border-emerald-200 pb-2">
                    {category.name}
                  </h3>
                  <div className="grid gap-4">
                    {categoryItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                          <p className="text-lg font-semibold text-emerald-600 mt-2">
                            {formatPrice(Number(item.price))}
                          </p>
                        </div>
                        <Button
                          onClick={() => addToCart(item)}
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Sidebar */}
          <div className="bg-gray-50 p-4 rounded-lg h-fit">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5" />
              <h3 className="font-semibold">Your Order</h3>
              <Badge variant="secondary">{cart.length}</Badge>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">{formatPrice(Number(item.price))} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => removeFromCart(item.id)}
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <Button
                        onClick={() => addToCart(item)}
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-emerald-600">{formatPrice(getCartTotal())}</span>
                  </div>
                  <Button className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600">
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;
