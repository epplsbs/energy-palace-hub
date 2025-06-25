
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getPosChargingOrders } from '@/services/posService';
import { Zap } from 'lucide-react';

interface POSChargingOrdersProps {
  user: any;
}

const POSChargingOrders = ({ user }: POSChargingOrdersProps) => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getPosChargingOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading charging orders:', error);
      toast({
        title: "Error",
        description: "Failed to load charging orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading charging orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Zap className="h-6 w-6 mr-2" />
          Charging Orders
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Charging Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No charging orders found</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">#{order.order_number}</p>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">Rs. {order.total_amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POSChargingOrders;
