import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard,
  Menu as MenuIcon,
  ShoppingBag,
  Calendar,
  Zap,
  Battery,
  Image,
  Users,
  Info,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Shield,
  Bell,
  TrendingUp,
  Map,
} from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import MenuManager from "@/components/admin/MenuManager";
import OrderManager from "@/components/admin/OrderManager";
import ReservationManager from "@/components/admin/ReservationManager";
import ChargingStationManager from "@/components/admin/ChargingStationManager";
import ChargingOrderManager from "@/components/admin/ChargingOrderManager";
import GalleryManager from "@/components/admin/GalleryManager";
import ContactsManager from "@/components/admin/ContactsManager";
import AboutUsManager from "@/components/admin/AboutUsManager";
import BusinessSettingsManager from "@/components/admin/BusinessSettingsManager";

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const { theme: globalTheme } = useTheme();

  useEffect(() => {
    checkUser();

    // Force light theme for admin panel
    const originalGlobalTheme = globalTheme;
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");

    return () => {
      document.documentElement.classList.remove("light", "dark");
      if (originalGlobalTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    };
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the admin panel.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setSigningIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to Energy Palace Admin.",
      });
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: "Sign in failed",
        description:
          error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
            <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Admin Panel
          </h3>
          <p className="text-gray-600">Please wait while we authenticate...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Enhanced Sign In Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Energy Palace
              </h2>
              <p className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </p>
              <p className="text-gray-600 mt-2">
                Sign in to manage your business
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;
                handleSignIn(email, password);
              }}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50"
                  placeholder="admin@energypalace.com.np"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={signingIn}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {signingIn ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Sign In to Admin
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-1" />
                Secure admin access only
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Manage your EV charging station, restaurant, and business
              operations
            </p>
          </div>
        </div>
      </div>
    );
  }

  const adminTabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & Analytics",
    },
    {
      id: "menu",
      label: "Menu",
      icon: MenuIcon,
      description: "Food & Beverage Items",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      description: "Customer Orders",
    },
    {
      id: "reservations",
      label: "Reservations",
      icon: Calendar,
      description: "Table Bookings",
    },
    {
      id: "charging-stations",
      label: "Stations",
      icon: Zap,
      description: "EV Charging Points",
    },
    {
      id: "charging-orders",
      label: "Charging",
      icon: Battery,
      description: "Charging Sessions",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: Image,
      description: "Photo Management",
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: Users,
      description: "Team & Contact Info",
    },
    {
      id: "about",
      label: "About Us",
      icon: Info,
      description: "Company Information",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Business Configuration",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Energy Palace
                </h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Welcome back!
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2 h-auto p-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              {adminTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-200 hover:bg-gray-100/50"
                >
                  <tab.icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="text-xs font-semibold">{tab.label}</div>
                    <div className="text-[10px] opacity-70 hidden lg:block">
                      {tab.description}
                    </div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Enhanced Tab Content */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
            <TabsContent value="dashboard" className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                    Dashboard Overview
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Monitor your business performance and activity
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Live updates</span>
                </div>
              </div>
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="menu" className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <MenuIcon className="h-6 w-6 text-emerald-600" />
                  Menu Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your restaurant menu items and pricing
                </p>
              </div>
              <MenuManager />
            </TabsContent>

            <TabsContent value="orders" className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-emerald-600" />
                  Order Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Track and manage customer food orders
                </p>
              </div>
              <OrderManager />
            </TabsContent>

            <TabsContent value="reservations" className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                  Reservation Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Handle table reservations and dining bookings
                </p>
              </div>
              <ReservationManager />
            </TabsContent>

            <TabsContent value="charging-stations" className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-emerald-600" />
                  Charging Station Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Monitor and control EV charging stations
                </p>
              </div>
              <ChargingStationManager />
            </TabsContent>

            <TabsContent value="charging-orders" className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Battery className="h-6 w-6 text-emerald-600" />
                  Charging Session Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Track EV charging sessions and bookings
                </p>
              </div>
              <ChargingOrderManager />
            </TabsContent>

            <TabsContent value="gallery" className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Image className="h-6 w-6 text-emerald-600" />
                  Gallery Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage photos and visual content
                </p>
              </div>
              <GalleryManager />
            </TabsContent>

            <TabsContent value="contacts" className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="h-6 w-6 text-emerald-600" />
                  Contact Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage team contacts and information
                </p>
              </div>
              <ContactsManager />
            </TabsContent>

            <TabsContent value="about" className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Info className="h-6 w-6 text-emerald-600" />
                  About Us Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Update company information and story
                </p>
              </div>
              <AboutUsManager />
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Settings className="h-6 w-6 text-emerald-600" />
                  Business Settings
                </h2>
                <p className="text-gray-600 mt-1">
                  Configure business details and preferences
                </p>
              </div>
              <BusinessSettingsManager />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
