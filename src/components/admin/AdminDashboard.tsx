
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Utensils, 
  Image, 
  Phone, 
  Zap, 
  ShoppingCart, 
  Calendar,
  Search,
  Settings,
  UserCheck,
  Quote
} from 'lucide-react';

const AdminDashboard = () => {
  const menuItems = [
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'about', label: 'About Us', icon: UserCheck },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'charging', label: 'Charging Stations', icon: Zap },
    { id: 'charging-orders', label: 'Charging Orders', icon: Zap },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'seo', label: 'SEO', icon: Search },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          System Online
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card 
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Manage</div>
                <p className="text-xs text-muted-foreground">Click to manage {item.label.toLowerCase()}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
