import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Clock, User, Car, Zap, Eye, CheckCircle, XCircle, Calendar, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ChargingOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  vehicle_number: string;
  charging_station_id: string;
  start_time: string;
  end_time?: string;
  expected_end_time?: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  charging_stations?: {
    station_id: string;
    type: string;
    power: string;
  };
}

const ChargingOrderManager = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<ChargingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpectedEnd, setEditingExpectedEnd] = useState<string | null>(null);
  const [expectedEndTime, setExpectedEndTime] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('pos_charging_orders')
        .select(`
          *,
          charging_stations (
            station_id,
            type,
            power
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch charging orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, additionalData?: any) => {
    try {
      const updateData = { status: newStatus, ...additionalData };
      const { error } = await supabase
        .from('pos_charging_orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStartCharging = (orderId: string) => {
    setEditingExpectedEnd(orderId);
    // Set default expected end time to 2 hours from now
    const defaultEndTime = new Date();
    defaultEndTime.setHours(defaultEndTime.getHours() + 2);
    const localDateTime = new Date(defaultEndTime.getTime() - defaultEndTime.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setExpectedEndTime(localDateTime);
  };

  const confirmStartCharging = async (orderId: string) => {
    if (!expectedEndTime) {
      toast({
        title: "Missing Information",
        description: "Please set an expected end time",
        variant: "destructive",
      });
      return;
    }

    await updateOrderStatus(orderId, 'active', {
      start_time: new Date().toISOString(),
      expected_end_time: expectedEndTime
    });
    setEditingExpectedEnd(null);
    setExpectedEndTime('');
  };

  const sendConfirmationEmail = async (orderId: string, type: 'charging' | 'reservation') => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          type: 'charging',
          customerName: order.customer_name,
          customerEmail: order.customer_phone, // Assuming phone for now, should be email
          orderDetails: {
            orderNumber: order.order_number,
            stationId: order.charging_stations?.station_id,
            vehicleNumber: order.vehicle_number,
            startTime: order.start_time,
            expectedEndTime: order.expected_end_time,
            totalAmount: order.total_amount
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "Charging confirmation email sent successfully",
      });
    } catch (error) {
      console.error('Email error:', error);
      toast({
        title: "Email Failed",
        description: "Failed to send confirmation email",
        variant: "destructive",
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('pos_charging_orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Charging order deleted successfully",
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Charging Orders</h2>
        <div className="flex gap-2">
          <Button onClick={fetchOrders} variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No charging orders found</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.order_number}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()} at{' '}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.customer_phone}</p>
                    </div>
                  </div>
                  
                  {order.vehicle_number && (
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">Vehicle</p>
                        <p className="text-sm text-gray-600">{order.vehicle_number}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.charging_stations && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="font-medium">{order.charging_stations.station_id}</p>
                        <p className="text-sm text-gray-600">
                          {order.charging_stations.type} - {order.charging_stations.power}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {order.expected_end_time && (
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="font-medium">Expected End Time</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.expected_end_time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {editingExpectedEnd === order.id && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <Label htmlFor="expectedEndTime" className="text-sm font-medium">
                      Expected End Time
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="expectedEndTime"
                        type="datetime-local"
                        value={expectedEndTime}
                        onChange={(e) => setExpectedEndTime(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => confirmStartCharging(order.id)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Confirm Start
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingExpectedEnd(null);
                          setExpectedEndTime('');
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-lg font-bold">NPR {Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {order.status === 'booked' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartCharging(order.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {order.status === 'active' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    {order.status === 'booked' && (
                      <Button
                        size="sm"
                        onClick={() => sendConfirmationEmail(order.id, 'charging')}
                        variant="outline"
                        className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                      >
                        Send Email
                      </Button>
                    )}
                    {(order.status === 'booked' || order.status === 'active') && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                    {(order.status === 'cancelled' || order.status === 'completed') && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ChargingOrderManager;