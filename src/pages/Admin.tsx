import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  LayoutDashboard, 
  Menu, 
  ShoppingCart, 
  Calendar, 
  Zap, 
  CreditCard,
  ImageIcon,
  MapPin,
  Info,
  Settings,
  LogOut,
  User as UserIcon,
  BarChart3,
  Bell
} from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import MenuManager from '@/components/admin/MenuManager';
import OrderManager from '@/components/admin/OrderManager';
import ReservationManager from '@/components/admin/ReservationManager';
import ChargingStationManager from '@/components/admin/ChargingStationManager';
import ChargingOrderManager from '@/components/admin/ChargingOrderManager';
import GalleryManager from '@/components/admin/GalleryManager';
import ContactsManager from '@/components/admin/ContactsManager';
import AboutUsManager from '@/components/admin/AboutUsManager';
import BusinessSettingsManager from '@/components/admin/BusinessSettingsManager';

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme: globalTheme } = useTheme();

  useEffect(() => {
    checkUser();

    // Force light theme for admin panel
    const originalGlobalTheme = globalTheme;
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');

    return () => {
      document.documentElement.classList.remove('light', 'dark');
      if (originalGlobalTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: Menu },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'charging', label: 'Charging Stations', icon: Zap },
    { id: 'charging-orders', label: 'Charging Orders', icon: CreditCard },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'contacts', label: 'Contacts', icon: MapPin },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center admin-panel">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading CMS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 admin-panel">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
              <p className="text-slate-600">Sign in to access the content management system</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;
              handleSignIn(email, password);
            }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="admin@energypalace.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 admin-panel">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-30 h-screen bg-white border-r border-slate-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EP</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">Energy Palace</h1>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-200">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-medium text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              )}
            </div>
            
            {!sidebarCollapsed && (
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="w-full mt-3 text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-slate-600">Manage your Energy Palace content</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[calc(100vh-12rem)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsContent value="dashboard" className="p-6 m-0">
                <AdminDashboard />
              </TabsContent>

              <TabsContent value="menu" className="p-6 m-0">
                <MenuManager />
              </TabsContent>

              <TabsContent value="orders" className="p-6 m-0">
                <OrderManager />
              </TabsContent>

              <TabsContent value="reservations" className="p-6 m-0">
                <ReservationManager />
              </TabsContent>

              <TabsContent value="charging" className="p-6 m-0">
                <ChargingStationManager />
              </TabsContent>

              <TabsContent value="charging-orders" className="p-6 m-0">
                <ChargingOrderManager />
              </TabsContent>

              <TabsContent value="gallery" className="p-6 m-0">
                <GalleryManager />
              </TabsContent>

              <TabsContent value="contacts" className="p-6 m-0">
                <ContactsManager />
              </TabsContent>

              <TabsContent value="about" className="p-6 m-0">
                <AboutUsManager />
              </TabsContent>

              <TabsContent value="settings" className="p-6 m-0">
                <BusinessSettingsManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
