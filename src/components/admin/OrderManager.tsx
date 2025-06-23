
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

const OrderManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
            Restaurant Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Order management interface coming soon. Customer orders from the restaurant 
            menu are being saved to your Supabase database.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Current Features:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Orders saved to Supabase database</li>
              <li>• Customer and order details captured</li>
              <li>• Order items stored as JSON</li>
              <li>• Order status tracking ready</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManager;
