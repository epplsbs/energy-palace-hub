
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils } from 'lucide-react';

const MenuManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Utensils className="h-5 w-5 mr-2 text-orange-600" />
            Restaurant Menu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Menu management interface coming soon. You can currently view all menu items 
            and categories that were loaded from the database on your main website.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Current Features:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Menu items are loaded from Supabase database</li>
              <li>• Categories are dynamically displayed</li>
              <li>• Orders are saved to the database</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuManager;
