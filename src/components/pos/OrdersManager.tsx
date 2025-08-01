import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Removed TabsContent for now
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, ShoppingCart, XCircle, CreditCard, Trash2 } from 'lucide-react'; // Added Trash2
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

import {
  fetchPOSCategories,
  fetchPOSMenuItems,
  // submitPOSOrder, // Will add back later
  type POSMenuCategory, // Ensure this matches the one in posService.ts if not re-declared
  type POSMenuItem,   // Ensure this matches the one in posService.ts if not re-declared
  // type CartItemForSubmit,
  // type OrderSubmissionData
} from '@/services/posService';

// CartItem type within OrdersManager component
interface CartItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
  vat_inclusive: boolean;
  line_vat_amount: number;
  line_subtotal_exclusive_vat: number;
  line_total_inclusive_vat: number;
}

type Order = CartItem[];

interface OrdersManagerProps {
  posUserId: string;
}

const OrdersManager: React.FC<OrdersManagerProps> = ({ posUserId }) => {
  const { toast } = useToast();
  console.log("OrdersManager mounted. Received posUserId:", posUserId);

  const [categories, setCategories] = useState<POSMenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<POSMenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<POSMenuItem[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [ordersTabs, setOrdersTabs] = useState<Order[]>([[]]);
  const [currentOrderTabIndex, setCurrentOrderTabIndex] = useState(0);
  const [currentPaymentMode, setCurrentPaymentMode] = useState<string>('');

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false); // Will use later

  // Fetch Categories
  useEffect(() => {
    console.log("OrdersManager: useEffect for fetching categories triggered.");
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const fetchedCategories = await fetchPOSCategories();
        console.log("OrdersManager: Fetched Categories:", fetchedCategories);
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategoryId(fetchedCategories[0].id);
          console.log("OrdersManager: Default selected category ID:", fetchedCategories[0].id);
        } else {
          console.log("OrdersManager: No categories fetched.");
        }
      } catch (error) {
        console.error("OrdersManager: Error fetching categories:", error);
        toast({ title: "Error", description: "Could not load product categories.", variant: "destructive" });
      } finally {
        setLoadingCategories(false);
        console.log("OrdersManager: Finished loading categories.");
      }
    };
    loadCategories();
  }, [toast]);

  // Fetch Menu Items
  useEffect(() => {
    console.log("OrdersManager: useEffect for fetching menu items triggered.");
    const loadMenuItems = async () => {
      setLoadingMenuItems(true);
      try {
        const fetchedItems = await fetchPOSMenuItems();
        console.log("OrdersManager: Fetched Menu Items:", fetchedItems);
        setMenuItems(fetchedItems);
      } catch (error) {
        console.error("OrdersManager: Error fetching menu items:", error);
        toast({ title: "Error", description: "Could not load menu items.", variant: "destructive" });
      } finally {
        setLoadingMenuItems(false);
        console.log("OrdersManager: Finished loading menu items.");
      }
    };
    loadMenuItems();
  }, [toast]);

  // Filter Menu Items
  useEffect(() => {
    console.log("OrdersManager: useEffect for filtering menu items triggered. SelectedCategory:", selectedCategoryId, "SearchTerm:", searchTerm);
    let items = menuItems;
    if (selectedCategoryId) {
      items = items.filter(item => item.category_id === selectedCategoryId);
    }
    if (searchTerm) {
      items = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredMenuItems(items);
    console.log("OrdersManager: Filtered menu items count:", items.length);
  }, [menuItems, selectedCategoryId, searchTerm]);


  // --- Placeholder functions for handlers - to be restored later ---
  const handleAddOrderTab = () => console.log("Add Order Tab clicked");
  const handleRemoveOrderTab = (index: number) => console.log("Remove Order Tab clicked for index:", index);
  const handleSelectOrderTab = (index: number) => {
    console.log("Select Order Tab clicked for index:", index);
    setCurrentOrderTabIndex(index); // Basic functionality
  }
  const handleAddItemToCart = (item: POSMenuItem) => console.log("Add to cart clicked for item:", item.name);
  const handleUpdateQuantity = (itemIndex: number, delta: number) => console.log("Update quantity for item index:", itemIndex, "Delta:", delta);
  const handleRemoveFromCart = (itemIndex: number) => console.log("Remove from cart for item index:", itemIndex);
  const handleSubmitOrder = async () => console.log("Submit order clicked");
  // --- End of placeholder functions ---

  const currentOrder = ordersTabs[currentOrderTabIndex] || [];
  const overallTotalAmount = 0; // Placeholder

  if (loadingCategories || loadingMenuItems) {
    return <LoadingSpinner fullPage text="Loading POS data..." />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 h-full flex flex-col bg-slate-50"> {/* Added bg for visibility */}
      <Card className="flex-shrink-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Point of Sale - Orders (Restored Iteration 1)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Order Tabs */}
          <div className="mb-4">
            <Tabs value={currentOrderTabIndex.toString()} onValueChange={(val) => handleSelectOrderTab(parseInt(val))}>
              <TabsList className="overflow-x-auto whitespace-nowrap">
                {ordersTabs.map((_, index) => (
                  <TabsTrigger key={index} value={index.toString()} className="relative pr-8">
                    Order {index + 1}
                    {/* Remove tab button will be added back later */}
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
        <Card className="lg:col-span-2 flex flex-col shadow-md">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4">
            {loadingMenuItems ? <LoadingSpinner text="Loading products..."/> :
             filteredMenuItems.length === 0 ? (
              <EmptyState title="No Products Found" description="Try adjusting your search or category filter." icon={<Search />} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredMenuItems.map(item => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="h-auto p-2 flex flex-col items-center justify-center text-center shadow hover:shadow-md transition-shadow"
                    onClick={() => handleAddItemToCart(item)} // Placeholder
                    disabled={!item.is_available}
                  >
                    <span className="text-xs font-medium truncate w-full">{item.name}</span>
                    <span className="text-xs text-emerald-600">Rs. {item.price?.toFixed(2)}</span>
                    {!item.is_available && <span className="text-xs text-red-500">(N/A)</span>}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cart Section */}
        <Card className="flex flex-col shadow-md">
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
                <p className="text-sm text-muted-foreground">Cart items will show here...</p>
                {/* Cart item rendering will be restored next */}
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
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
                    {/* Other payment modes */}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
                onClick={handleSubmitOrder} // Placeholder
                disabled={true} // Disabled for now
              >
                Submit Order (Placeholder)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersManager;
