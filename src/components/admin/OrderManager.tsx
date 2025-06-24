
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye, Calendar, User, Phone, Mail, Clock } from 'lucide-react';
import { 
  getOrders, 
  updateOrder,
  type Order 
} from '@/services/contentService';

const OrderManager = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      await loadData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-orange-500';
      case 'ready':
        return 'bg-green-500';
      case 'completed':
        return 'bg-emerald-600';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        
        <div className="flex items-center space-x-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {['pending', 'confirmed', 'preparing', 'ready'].map(status => {
          const count = orders.filter(order => order.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{status}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {filterStatus === 'all' ? 'No orders found.' : `No ${filterStatus} orders found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id.slice(-8)}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(order.status || 'pending')} text-white border-0 capitalize`}>
                          {order.status || 'pending'}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedOrder(order)}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details #{order.id.slice(-8)}</DialogTitle>
                              <DialogDescription>
                                Placed on {formatDate(order.created_at)}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Customer Info */}
                                <div>
                                  <h4 className="font-semibold mb-2">Customer Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center">
                                      <User className="h-4 w-4 mr-2" />
                                      {selectedOrder.customer_name}
                                    </div>
                                    <div className="flex items-center">
                                      <Mail className="h-4 w-4 mr-2" />
                                      {selectedOrder.customer_email}
                                    </div>
                                    <div className="flex items-center">
                                      <Phone className="h-4 w-4 mr-2" />
                                      {selectedOrder.customer_phone}
                                    </div>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                  <h4 className="font-semibold mb-2">Order Items</h4>
                                  <div className="space-y-2">
                                    {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, index: number) => (
                                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div>
                                          <span className="font-medium">{item.name}</span>
                                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                                        </div>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Notes */}
                                {selectedOrder.notes && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Special Notes</h4>
                                    <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                                      {selectedOrder.notes}
                                    </p>
                                  </div>
                                )}

                                {/* Total */}
                                <div className="border-t pt-4">
                                  <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span>${Number(selectedOrder.total_amount).toFixed(2)}</span>
                                  </div>
                                </div>

                                {/* Status Update */}
                                <div>
                                  <h4 className="font-semibold mb-2">Update Status</h4>
                                  <Select 
                                    value={selectedOrder.status || 'pending'} 
                                    onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="preparing">Preparing</SelectItem>
                                      <SelectItem value="ready">Ready</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center mb-1">
                          <User className="h-4 w-4 mr-1" />
                          <span className="font-medium">{order.customer_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{order.customer_phone}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          ${Number(order.total_amount).toFixed(2)}
                        </div>
                        <div className="text-gray-600">
                          {Array.isArray(order.items) ? order.items.length : 0} items
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Select 
                        value={order.status || 'pending'} 
                        onValueChange={(value) => handleStatusUpdate(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManager;
