import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { useTheme } from '@/contexts/ThemeContext'; // Import useTheme
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
  const { theme: globalTheme, toggleTheme } = useTheme(); // Get global theme state

  useEffect(() => {
    checkUser();

    // Force light theme for admin panel
    const originalGlobalTheme = globalTheme; // Capture theme at the time of mounting Admin
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');

    return () => {
      // On unmount, restore the original global theme preference
      document.documentElement.classList.remove('light', 'dark'); // Clear our forced theme
      // Re-apply the theme that was active globally before admin was mounted,
      // or the current global theme if it somehow changed (e.g. user used OS toggle)
      // The ThemeProvider's own useEffect will also re-evaluate based on its 'theme' state.
      // Forcing it based on 'originalGlobalTheme' is a good immediate step.
      if (originalGlobalTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('light');
      }
      // Potentially, if the ThemeProvider's theme state itself needs to be 'refreshed'
      // so its useEffect runs, that's more complex. But changing classes should suffice.
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  // If we want the admin panel to also sync if the global theme *could* be changed
  // by other means while admin is open (e.g. OS preference change, which our current
  // ThemeProvider doesn't listen to), we might add `globalTheme` to dependency array.
  // But for now, the goal is to *force* light and restore the theme that was active *before* admin.

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center admin-panel">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-800 font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

    if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 admin-panel">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Sign In
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access the admin panel
            </p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 admin-panel">
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-medium text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-700">{user.email}</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-slate-300 hover:bg-slate-50"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full min-w-max grid-cols-10 mb-6 bg-slate-100/50 p-1 rounded-xl">
                  <TabsTrigger value="dashboard" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Dashboard</TabsTrigger>
                  <TabsTrigger value="menu" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Menu</TabsTrigger>
                  <TabsTrigger value="orders" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Orders</TabsTrigger>
                  <TabsTrigger value="reservations" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Reservations</TabsTrigger>
                  <TabsTrigger value="charging" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Charging</TabsTrigger>
                  <TabsTrigger value="charging-orders" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Charging Orders</TabsTrigger>
                  <TabsTrigger value="gallery" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Gallery</TabsTrigger>
                  <TabsTrigger value="contacts" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Contacts</TabsTrigger>
                  <TabsTrigger value="about" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">About Us</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs px-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Settings</TabsTrigger>
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
    </div>
  );
};

export default Admin;
