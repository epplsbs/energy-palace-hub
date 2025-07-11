import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client'; // For types, actual calls via service
import { PlusCircle, Search, ShoppingCart, XCircle, Trash2, CreditCard } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

// Types based on your existing migration (supabase/migrations/20250625050233-....sql)
interface POSMenuCategory {
  id: string;
  name: string;
  display_order?: number;
  // Add other fields if needed from your pos_menu_categories schema
}

interface POSMenuItem {
  id: string;
  category_id: string;
  name: string;
  price: number; // DECIMAL(10,2)
  image_url?: string | null;
  is_available?: boolean;
  // Add other fields like description, sku, etc. if they will be displayed or used
}

interface CartItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  vat_rate?: number; // Assuming this might come from product or default
  // total_amount will be calculated
}

type Order = CartItem[];

import {
  fetchPOSCategories,
  fetchPOSMenuItems,
  submitPOSOrder,
  type POSMenuCategory,
  type POSMenuItem,
  type CartItemForSubmit, // Renamed for clarity from service
  type OrderSubmissionData
} from '@/services/posService';


// CartItem type within OrdersManager component
interface CartItem {
  menu_item_id: string; // Corresponds to POSMenuItem.id
  name: string;         // Corresponds to POSMenuItem.name
  quantity: number;
  unit_price: number;   // Corresponds to POSMenuItem.price (exclusive of VAT if vat_inclusive is false)
  vat_rate: number;     // From POSMenuItem.vat_rate or default
  vat_inclusive: boolean; // From POSMenuItem.vat_inclusive
  // Calculated fields for display and submission:
  line_vat_amount: number;
  line_subtotal_exclusive_vat: number; // price * quantity
  line_total_inclusive_vat: number;  // Total for this line
}

type Order = CartItem[];

interface OrdersManagerProps {
  posUserId: string; // This is the ID from the public.pos_users table
}

const OrdersManager: React.FC<OrdersManagerProps> = ({ posUserId }) => {
  const { toast } = useToast();
  // const [user, setUser] = useState<any>(null); // No longer needed if posUserId is passed directly

  const [categories, setCategories] = useState<POSMenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<POSMenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<POSMenuItem[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [ordersTabs, setOrdersTabs] = useState<Order[]>([[]]); // Array of orders (carts)
  const [currentOrderTabIndex, setCurrentOrderTabIndex] = useState(0);
  const [currentPaymentMode, setCurrentPaymentMode] = useState<string>('');

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // useEffect(() => { // Not needed anymore, posUserId comes from props
  //   const getInitialUser = async () => {
  //       const { data: { user: currentUser } } = await supabase.auth.getUser();
  //       setUser(currentUser);
  //   };
  //   getInitialUser();
  // }, []);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const fetchedCategories = await fetchPOSCategories(); // Use service
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategoryId(fetchedCategories[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({ title: "Error", description: "Could not load product categories.", variant: "destructive" });
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [toast]);

  useEffect(() => {
    const loadMenuItems = async () => {
      setLoadingMenuItems(true);
      try {
        const fetchedItems = await fetchPOSMenuItems(); // Use service
        setMenuItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast({ title: "Error", description: "Could not load menu items.", variant: "destructive" });
      } finally {
        setLoadingMenuItems(false);
      }
    };
    loadMenuItems();
  }, [toast]);

  useEffect(() => {
    let items = menuItems;
    if (selectedCategoryId) {
      items = items.filter(item => item.category_id === selectedCategoryId);
    }
    if (searchTerm) {
      items = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredMenuItems(items);
  }, [menuItems, selectedCategoryId, searchTerm]);

  const handleAddOrderTab = () => {
    setOrdersTabs(prev => [...prev, []]);
    setCurrentOrderTabIndex(ordersTabs.length); // Switch to the new tab
  };

  const handleRemoveOrderTab = (indexToRemove: number) => {
    if (ordersTabs.length <= 1) {
      toast({ title: "Cannot remove last order tab", variant: "default" });
      return;
    }
    setOrdersTabs(prev => prev.filter((_, index) => index !== indexToRemove));
    if (currentOrderTabIndex >= indexToRemove && currentOrderTabIndex > 0) {
      setCurrentOrderTabIndex(prev => prev - 1);
    } else if (ordersTabs.length -1 === indexToRemove && currentOrderTabIndex === indexToRemove) {
        setCurrentOrderTabIndex(0);
    }
  };

  const handleSelectOrderTab = (index: number) => {
    setCurrentOrderTabIndex(index);
    setCurrentPaymentMode(''); // Reset payment mode when switching tabs
  };

  const handleAddItemToCart = (item: POSMenuItem) => {
    setOrdersTabs(prevTabs => {
      const newTabs = [...prevTabs];
      const currentOrder = [...newTabs[currentOrderTabIndex]];
      const existingItemIndex = currentOrder.findIndex(cartItem => cartItem.menu_item_id === item.id);

      if (existingItemIndex > -1) {
        const cartItem = currentOrder[existingItemIndex];
        cartItem.quantity += 1;

        // Recalculate line totals
        cartItem.line_subtotal_exclusive_vat = cartItem.unit_price * cartItem.quantity;
        cartItem.line_vat_amount = cartItem.line_subtotal_exclusive_vat * (cartItem.vat_rate / 100);
        cartItem.line_total_inclusive_vat = cartItem.line_subtotal_exclusive_vat + cartItem.line_vat_amount;

      } else {
        // Add new item
        const vatRate = item.vat_rate ?? 0;
        const vatInclusive = item.vat_inclusive ?? false;
        let unitPriceExVat: number;

        if (vatInclusive) {
          unitPriceExVat = item.price / (1 + vatRate / 100);
        } else {
          unitPriceExVat = item.price;
        }

        const quantity = 1;
        const lineSubtotalExVat = unitPriceExVat * quantity;
        const lineVatAmount = lineSubtotalExVat * (vatRate / 100);
        const lineTotalIncVat = lineSubtotalExVat + lineVatAmount;

        currentOrder.push({
          menu_item_id: item.id,
          name: item.name,
          quantity: quantity,
          unit_price: unitPriceExVat, // Store VAT-exclusive price
          vat_rate: vatRate,
          vat_inclusive: vatInclusive, // Store original flag for reference if needed, though calculations now use exVAT unit_price
          line_subtotal_exclusive_vat: lineSubtotalExVat,
          line_vat_amount: lineVatAmount,
          line_total_inclusive_vat: lineTotalIncVat,
        });
      }
      newTabs[currentOrderTabIndex] = currentOrder;
      return newTabs;
    });
  };

  const handleUpdateQuantity = (itemIndex: number, delta: number) => {
     setOrdersTabs(prevTabs => {
      const newTabs = [...prevTabs];
      const currentOrder = [...newTabs[currentOrderTabIndex]];
      const item = currentOrder[itemIndex];
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          currentOrder.splice(itemIndex, 1);
        } else {
          // Recalculate line totals - item.unit_price is already exVAT
          item.line_subtotal_exclusive_vat = item.unit_price * item.quantity;
          item.line_vat_amount = item.line_subtotal_exclusive_vat * (item.vat_rate / 100);
          item.line_total_inclusive_vat = item.line_subtotal_exclusive_vat + item.line_vat_amount;
        }
      }
      newTabs[currentOrderTabIndex] = currentOrder;
      return newTabs;
    });
  };

  const handleRemoveFromCart = (itemIndex: number) => {
    setOrdersTabs(prevTabs => {
      const newTabs = [...prevTabs];
      const currentOrder = [...newTabs[currentOrderTabIndex]];
      currentOrder.splice(itemIndex, 1);
      newTabs[currentOrderTabIndex] = currentOrder;
      return newTabs;
    });
  };

  const currentOrder = ordersTabs[currentOrderTabIndex] || [];

  // Calculate overall order totals
  const overallSubtotal = currentOrder.reduce((sum, item) => sum + item.line_subtotal_exclusive_vat, 0);
  const overallVatAmount = currentOrder.reduce((sum, item) => sum + item.line_vat_amount, 0);
  const overallTotalAmount = currentOrder.reduce((sum, item) => sum + item.line_total_inclusive_vat, 0);


  const handleSubmitOrder = async () => {
    if (currentOrder.length === 0) {
      toast({ title: "Cart is empty", description: "Please add items to the cart.", variant: "default" });
      return;
    }
    if (!currentPaymentMode) {
      toast({ title: "Payment mode not selected", description: "Please select a payment mode.", variant: "default" });
      return;
    }
    setSubmittingOrder(true);

    const itemsForSubmission: CartItemForSubmit[] = currentOrder.map(cartItem => ({
      menu_item_id: cartItem.menu_item_id,
      item_name: cartItem.name,
      quantity: cartItem.quantity,
      unit_price: cartItem.unit_price, // This is ex-VAT
      vat_rate: cartItem.vat_rate,
      vat_amount: cartItem.line_vat_amount,
      total_amount: cartItem.line_total_inclusive_vat, // This is line total inc-VAT
      // notes: cartItem.notes, // If you add notes to cart items
    }));

    const orderData: OrderSubmissionData = {
      cashier_id: user?.id || null, // Assuming Supabase auth user ID is the cashier ID
      items: itemsForSubmission,
      subtotal: overallSubtotal,
      vat_amount: overallVatAmount,
      total_amount: overallTotalAmount,
      payment_method: currentPaymentMode,
      order_type: 'dine_in', // Default or make this selectable later
      payment_status: 'paid', // Default or make this selectable
      order_status: 'completed', // Default for POS immediate completion
      // customer_name, customer_phone, etc. can be added via a form later
    };

    try {
      const result = await submitPOSOrder(orderData);

      if (result.success) {
        toast({ title: "Order Submitted", description: `Order #${result.orderNumber || result.orderId} created successfully.` });
        // Reset current tab
        setOrdersTabs(prevTabs => {
          const newTabs = [...prevTabs];
          newTabs[currentOrderTabIndex] = [];
          return newTabs;
        });
        setCurrentPaymentMode('');
        // Optionally, remove the tab or switch to a new one
        // if (ordersTabs.length > 1) {
        //   handleRemoveOrderTab(currentOrderTabIndex);
        // }
      } else {
        throw new Error("Order submission failed at backend.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({ title: "Order Submission Failed", description: (error as Error).message || "Could not submit order.", variant: "destructive" });
    } finally {
      setSubmittingOrder(false);
    }
  };


  if (loadingCategories || loadingMenuItems) {
    return <LoadingSpinner fullPage text="Loading POS data..." />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 h-full flex flex-col">
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-2xl">Point of Sale - Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Order Tabs */}
          <div className="mb-4">
            <Tabs value={currentOrderTabIndex.toString()} onValueChange={(val) => handleSelectOrderTab(parseInt(val))}>
              <TabsList className="overflow-x-auto whitespace-nowrap">
                {ordersTabs.map((_, index) => (
                  <TabsTrigger key={index} value={index.toString()} className="relative pr-8">
                    Order {index + 1}
                    {ordersTabs.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 h-5 w-5"
                        onClick={(e) => { e.stopPropagation(); handleRemoveOrderTab(index);}}
                      >
                        <XCircle className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                  </TabsTrigger>
                ))}
                <Button variant="ghost" size="sm" onClick={handleAddOrderTab} className="ml-2">
                  <PlusCircle className="h-4 w-4 mr-1" /> New Tab
                </Button>
              </TabsList>
            </Tabs>
          </div>

          {/* Filters: Search and Categories */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Select value={selectedCategoryId || ''} onValueChange={(value) => setSelectedCategoryId(value || null)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Products Grid */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4">
            {filteredMenuItems.length === 0 ? (
              <EmptyState title="No Products Found" description="Try adjusting your search or category filter." icon={<Search />} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMenuItems.map(item => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center justify-center text-center shadow hover:shadow-md transition-shadow"
                    onClick={() => handleAddItemToCart(item)}
                    disabled={!item.is_available}
                  >
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-full h-20 object-cover rounded-md mb-2" />
                    )}
                    <span className="text-sm font-medium truncate w-full">{item.name}</span>
                    <span className="text-xs text-emerald-600 font-semibold">Rs. {item.price.toFixed(2)}</span>
                    {!item.is_available && <span className="text-xs text-red-500">(Unavailable)</span>}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cart Section */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Cart (Order {currentOrderTabIndex + 1})</span>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between p-4 space-y-4">
            {currentOrder.length === 0 ? (
              <EmptyState title="Cart is Empty" description="Add products to get started." icon={<ShoppingCart />} className="m-auto"/>
            ) : (
              <div className="overflow-y-auto flex-grow space-y-2 pr-1">
                {currentOrder.map((cartItem, index) => (
                  <div key={`${cartItem.menu_item_id}-${index}`} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium text-sm">{cartItem.name}</p>
                      <p className="text-xs text-muted-foreground">Rs. {cartItem.unit_price.toFixed(2)} x {cartItem.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center gap-1">
                           <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(index, -1)} disabled={cartItem.quantity <= 1}>-</Button>
                           <span className="text-sm w-6 text-center tabular-nums">{cartItem.quantity}</span>
                           <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(index, 1)}>+</Button>
                        </div>
                        <span className="text-sm font-semibold w-20 text-right tabular-nums">Rs. {cartItem.line_total_inclusive_vat.toFixed(2)}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => handleRemoveFromCart(index)} title="Remove Item">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Subtotal (ex. VAT):</span>
                <span className="tabular-nums">Rs. {overallSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Total VAT:</span>
                <span className="tabular-nums">Rs. {overallVatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-xl">
                <span>Grand Total:</span>
                <span className="tabular-nums">Rs. {overallTotalAmount.toFixed(2)}</span>
              </div>

              <div>
                <Label className="mb-1.5 block text-sm font-medium">Payment Mode</Label>
                <Select value={currentPaymentMode} onValueChange={setCurrentPaymentMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Esewa">Esewa</SelectItem>
                    <SelectItem value="Fonepay">Fonepay</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
                onClick={handleSubmitOrder}
                disabled={currentOrder.length === 0 || !currentPaymentMode || submittingOrder}
              >
                {submittingOrder ? <LoadingSpinner size={20} iconClassName="text-white" /> : <CreditCard className="mr-2 h-5 w-5" />}
                Submit Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersManager;
