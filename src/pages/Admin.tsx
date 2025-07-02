
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
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

  useEffect(() => {
    checkUser();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Sign In
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            handleSignIn(email, password);
          }}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 hidden sm:block">Welcome, {user.email}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full min-w-max grid-cols-10 mb-6">
                <TabsTrigger value="dashboard" className="text-xs px-2">Dashboard</TabsTrigger>
                <TabsTrigger value="menu" className="text-xs px-2">Menu</TabsTrigger>
                <TabsTrigger value="orders" className="text-xs px-2">Orders</TabsTrigger>
                <TabsTrigger value="reservations" className="text-xs px-2">Reservations</TabsTrigger>
                <TabsTrigger value="charging" className="text-xs px-2">Charging</TabsTrigger>
                <TabsTrigger value="charging-orders" className="text-xs px-2">Charging Orders</TabsTrigger>
                <TabsTrigger value="gallery" className="text-xs px-2">Gallery</TabsTrigger>
                <TabsTrigger value="contacts" className="text-xs px-2">Contacts</TabsTrigger>
                <TabsTrigger value="about" className="text-xs px-2">About Us</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs px-2">Settings</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="mt-6">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="menu" className="mt-6">
              <MenuManager />
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <OrderManager />
            </TabsContent>

            <TabsContent value="reservations" className="mt-6">
              <ReservationManager />
            </TabsContent>

            <TabsContent value="charging" className="mt-6">
              <ChargingStationManager />
            </TabsContent>

            <TabsContent value="charging-orders" className="mt-6">
              <ChargingOrderManager />
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <GalleryManager />
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              <ContactsManager />
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <AboutUsManager />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <BusinessSettingsManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
