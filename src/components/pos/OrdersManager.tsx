import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, ShoppingCart, User, Car } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useQuery } from '@tanstack/react-query';
import { fetchAllDrivers, type Driver } from '@/services/driverService';

import {
  fetchPOSCategories,
  fetchPOSMenuItems,
  submitPOSOrder,
  type POSMenuCategory,
  type POSMenuItem,
  type OrderSubmissionData,
  type CartItemForSubmit
} from '@/services/posService';

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

  const [categories, setCategories] = useState<POSMenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<POSMenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<POSMenuItem[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [ordersTabs, setOrdersTabs] = useState<Order[]>([[]]);
  const [currentOrderTabIndex, setCurrentOrderTabIndex] = useState(0);
  const [currentPaymentMode, setCurrentPaymentMode] = useState<string>('');
  const [selectedDriverIds, setSelectedDriverIds] = useState<Record<number, string>>({});

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);

  const { data: drivers } = useQuery({
    queryKey: ['approvedDrivers'],
    queryFn: async () => {
      const allDrivers = await fetchAllDrivers();
      return allDrivers.filter(d => d.status === 'approved');
    }
  });

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const fetchedCategories = await fetchPOSCategories();
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategoryId(fetchedCategories[0].id);
        }
      } catch (error) {
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
        const fetchedItems = await fetchPOSMenuItems();
        setMenuItems(fetchedItems);
      } catch (error) {
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
    setOrdersTabs([...ordersTabs, []]);
    setCurrentOrderTabIndex(ordersTabs.length);
  };

  const handleSelectOrderTab = (index: number) => {
    setCurrentOrderTabIndex(index);
  };

  const handleAddItemToCart = (item: POSMenuItem) => {
    const updatedTabs = [...ordersTabs];
    const currentOrder = [...updatedTabs[currentOrderTabIndex]];
    const existingItemIndex = currentOrder.findIndex(i => i.menu_item_id === item.id);

    if (existingItemIndex >= 0) {
      currentOrder[existingItemIndex].quantity += 1;
      currentOrder[existingItemIndex].line_total_inclusive_vat = currentOrder[existingItemIndex].quantity * currentOrder[existingItemIndex].unit_price;
    } else {
      currentOrder.push({
        menu_item_id: item.id,
        name: item.name,
        quantity: 1,
        unit_price: item.price,
        vat_rate: item.vat_rate || 0,
        vat_inclusive: item.vat_inclusive || false,
        line_vat_amount: 0,
        line_subtotal_exclusive_vat: item.price,
        line_total_inclusive_vat: item.price,
      });
    }

    updatedTabs[currentOrderTabIndex] = currentOrder;
    setOrdersTabs(updatedTabs);
  };

  const handleDriverChange = (driverId: string) => {
    setSelectedDriverIds({
      ...selectedDriverIds,
      [currentOrderTabIndex]: driverId
    });
  };

  const handleSubmitOrder = async () => {
    if (!currentPaymentMode) {
      toast({ title: "Payment Mode Required", description: "Please select a payment mode before submitting.", variant: "destructive" });
      return;
    }

    setLoadingMenuItems(true); // Reusing loading state for submission
    try {
      const items: CartItemForSubmit[] = currentOrder.map(item => ({
        menu_item_id: item.menu_item_id,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        vat_rate: item.vat_rate,
        vat_amount: item.line_vat_amount,
        total_amount: item.line_total_inclusive_vat
      }));

      const orderData: OrderSubmissionData = {
        cashier_id: posUserId,
        subtotal: currentOrder.reduce((sum, item) => sum + item.line_subtotal_exclusive_vat, 0),
        vat_amount: currentOrder.reduce((sum, item) => sum + item.line_vat_amount, 0),
        total_amount: overallTotalAmount,
        payment_method: currentPaymentMode.toLowerCase(),
        order_status: 'completed',
        payment_status: 'paid',
        driver_id: selectedDriverIds[currentOrderTabIndex] === 'none' ? null : selectedDriverIds[currentOrderTabIndex],
        items: items
      };

      const result = await submitPOSOrder(orderData);

      if (result.success) {
        toast({ title: "Success", description: `Order ${result.orderNumber} submitted successfully.` });

        // Clear current tab
        const updatedTabs = [...ordersTabs];
        updatedTabs[currentOrderTabIndex] = [];
        setOrdersTabs(updatedTabs);

        // Clear selected driver for this tab
        const updatedDrivers = { ...selectedDriverIds };
        delete updatedDrivers[currentOrderTabIndex];
        setSelectedDriverIds(updatedDrivers);

        setCurrentPaymentMode('');
      } else {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Error submitting order:", error);
      toast({ title: "Error", description: error.message || "Failed to submit order.", variant: "destructive" });
    } finally {
      setLoadingMenuItems(false);
    }
  };

  const currentOrder = ordersTabs[currentOrderTabIndex] || [];
  const overallTotalAmount = currentOrder.reduce((sum, item) => sum + item.line_total_inclusive_vat, 0);

  if (loadingCategories || loadingMenuItems) {
    return <LoadingSpinner fullPage text="Loading POS data..." />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 h-full flex flex-col bg-slate-50">
      <Card className="flex-shrink-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Point of Sale - Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Tabs value={currentOrderTabIndex.toString()} onValueChange={(val) => handleSelectOrderTab(parseInt(val))}>
              <TabsList className="overflow-x-auto whitespace-nowrap">
                {ordersTabs.map((_, index) => (
                  <TabsTrigger key={index} value={index.toString()} className="relative pr-8">
                    Order {index + 1}
                  </TabsTrigger>
                ))}
                <Button variant="ghost" size="sm" onClick={handleAddOrderTab} className="ml-2">
                  <PlusCircle className="h-4 w-4 mr-1" /> New Tab
                </Button>
              </TabsList>
            </Tabs>
          </div>

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
        <Card className="lg:col-span-2 flex flex-col shadow-md">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4">
            {filteredMenuItems.length === 0 ? (
              <EmptyState title="No Products Found" description="Try adjusting your search or category filter." icon={<Search />} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredMenuItems.map(item => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="h-auto p-2 flex flex-col items-center justify-center text-center shadow hover:shadow-md transition-shadow"
                    onClick={() => handleAddItemToCart(item)}
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
                {currentOrder.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1 border-b">
                    <span>{item.name} x {item.quantity}</span>
                    <span>Rs. {item.line_total_inclusive_vat.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  Assign Driver (Commission)
                </Label>
                <Select
                  value={selectedDriverIds[currentOrderTabIndex] || "none"}
                  onValueChange={handleDriverChange}
                >
                  <SelectTrigger className="bg-emerald-50/50 border-emerald-100">
                    <SelectValue placeholder="Select Driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Driver</SelectItem>
                    {drivers?.map(driver => (
                      <SelectItem key={driver.id} value={driver.id}>
                        <div className="flex items-center">
                          <Car className="h-3 w-3 mr-2" />
                          <span>{driver.full_name} ({driver.vehicle_number})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <SelectItem value="Fonepay">Fonepay</SelectItem>
                    <SelectItem value="Esewa">Esewa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
                onClick={handleSubmitOrder}
                disabled={currentOrder.length === 0}
              >
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
