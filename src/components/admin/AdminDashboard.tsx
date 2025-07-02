
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Utensils, 
  Image, 
  Users, 
  Phone, 
  Zap, 
  ShoppingCart, 
  Calendar,
  Search,
  Settings,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import MenuManager from './MenuManager';
import GalleryManager from './GalleryManager';
import ContactsManager from './ContactsManager';
import ChargingStationManager from './ChargingStationManager';
import ChargingOrderManager from './ChargingOrderManager';
import OrderManager from './OrderManager';
import ReservationManager from './ReservationManager';
import BusinessSettingsManager from './BusinessSettingsManager';
import SEOManager from './SEOManager';
import AboutUsManager from './AboutUsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'about', label: 'About Us', icon: UserCheck },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'charging', label: 'Charging Stations', icon: Zap },
    { id: 'charging-orders', label: 'Charging Orders', icon: Zap },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'seo', label: 'SEO', icon: Search },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'about':
        return <AboutUsManager />;
      case 'contacts':
        return <ContactsManager />;
      case 'charging':
        return <ChargingStationManager />;
      case 'charging-orders':
        return <ChargingOrderManager />;
      case 'orders':
        return <OrderManager />;
      case 'reservations':
        return <ReservationManager />;
      case 'settings':
        return <BusinessSettingsManager />;
      case 'seo':
        return <SEOManager />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                System Online
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {menuItems.slice(1).map((item) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => setActiveTab(item.id)}
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
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">
            {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>
        
        {/* Content area */}
        <div className="h-full overflow-y-auto">
          <div className="p-4 lg:p-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
