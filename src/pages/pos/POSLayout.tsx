import React from 'react';
import { Link, Outlet, useLocation, Navigate, Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, LayoutDashboard, ShoppingCart, Zap, TrendingUp, DollarSign, Landmark, Archive, BarChartBig, Settings } from 'lucide-react';
import { type User as AuthUser } from '@supabase/supabase-js';

// Import POS Page Components
import POSDashboardPage from './POSDashboardPage';
import POSOrdersPage from './POSOrdersPage';
import POSChargingPage from './POSChargingPage';
import POSExpensesPage from './POSExpensesPage';
import POSDepositsPage from './POSDepositsPage';
import POSWithdrawalsPage from './POSWithdrawalsPage';
import POSSavingsPage from './POSSavingsPage';
import POSReportsPage from './POSReportsPage';
import POSAnalyticsPage from './POSAnalyticsPage';
import POSLoginPage from './POSLoginPage';

// Placeholder for POS Settings Page
const POSSettingsPage: React.FC = () => <div><h1 className="text-2xl font-semibold">POS Settings</h1></div>;


const posNavItems = [
  { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, element: <POSDashboardPage /> },
  { path: 'orders', label: 'Orders', icon: ShoppingCart, element: <POSOrdersPage /> },
  { path: 'charging', label: 'Charging', icon: Zap, element: <POSChargingPage /> },
  { path: 'expenses', label: 'Expenses', icon: DollarSign, element: <POSExpensesPage /> },
  { path: 'deposits', label: 'Deposits', icon: Landmark, element: <POSDepositsPage /> },
  { path: 'withdrawals', label: 'Withdrawals', icon: TrendingUp, element: <POSWithdrawalsPage /> },
  { path: 'savings', label: 'Savings', icon: Archive, element: <POSSavingsPage /> },
  { path: 'reports', label: 'Reports', icon: BarChartBig, element: <POSReportsPage /> },
  { path: 'analytics', label: 'Analytics', icon: TrendingUp, element: <POSAnalyticsPage /> },
  { path: 'settings', label: 'Settings', icon: Settings, element: <POSSettingsPage /> },
];

import { useToast } from '@/hooks/use-toast'; // Import useToast

// Define a type for your pos_users table structure from your migration
interface POSUser {
  id: string; // This is the primary key of pos_users table
  auth_user_id: string; // This is the foreign key to auth.users.id
  full_name: string;
  username: string;
  email: string;
  role: string; // user_role ENUM ('admin', 'cashier', 'waiter', etc.)
  is_active: boolean;
  // Add any other fields you might need from pos_users
}

const POSLayout: React.FC = () => {
  const location = useLocation();
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [posUser, setPosUser] = React.useState<POSUser | null>(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    setLoadingAuth(true);

    const processAuthSession = async (currentAuthUser: AuthUser | null) => {
      setAuthUser(currentAuthUser);
      if (currentAuthUser) {
        try {
          const { data: posUserData, error: posUserError } = await supabase
            .from('pos_users')
            .select('*')
            .eq('auth_user_id', currentAuthUser.id)
            .single();

          if (posUserError) {
            console.error("Error fetching POS user profile:", posUserError?.message);
            toast({ title: "Profile Error", description: "Could not load POS user profile. Ensure a POS user profile is linked to your account.", variant: "destructive"});
            setPosUser(null); // Clear posUser
            await supabase.auth.signOut(); // Sign out if no valid POS profile
            setLoadingAuth(false); // Ensure loading stops
            return;
          }

          if (posUserData && !posUserData.is_active) {
            console.warn("POS user profile is inactive:", posUserData.username);
            toast({ title: "Account Inactive", description: "Your POS account is inactive. Please contact an administrator.", variant: "destructive"});
            setPosUser(null); // Clear posUser
            await supabase.auth.signOut(); // Force sign out
            setLoadingAuth(false); // Ensure loading stops
            return;
          }
          setPosUser(posUserData as POSUser);

        } catch (e: any) {
            console.error("Exception fetching POS user profile:", e?.message);
            toast({ title: "Profile Exception", description: "An error occurred while fetching your profile.", variant: "destructive"});
            setPosUser(null); // Clear posUser
            await supabase.auth.signOut(); // Sign out on exception
            setLoadingAuth(false); // Ensure loading stops
            return;
        }
      } else {
        setPosUser(null); // No authUser, so no posUser
      }
      setLoadingAuth(false);
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      processAuthSession(session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      // When auth state changes, re-process the session which includes fetching pos_user
      setLoadingAuth(true); // Set loading before async operation
      processAuthSession(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // authUser and posUser will be set to null by the listener, setLoadingAuth will be false
  };

  const currentBasePath = location.pathname.split('/sales/')[1]?.split('/')[0] || 'dashboard';

  if (loadingAuth) {
    return <div className="flex items-center justify-center min-h-screen">Loading POS Authentication...</div>;
  }

  // If still no authUser or no posUser (e.g. profile fetch failed and user was signed out), show login.
  if (!authUser || !posUser) {
    return <POSLoginPage onLoginSuccess={() => {
        // After login page calls Supabase, onAuthStateChange will trigger processAuthSession.
        // We can set loading true here to show spinner until profile is fetched.
        setLoadingAuth(true);
    }} />;
  }

  const enrichedNavItems = posNavItems.map(item => {
    const elementWithProps = item.element && React.isValidElement(item.element)
      ? React.cloneElement(item.element as React.ReactElement<any>, { posUser })
      : item.element;
    return { ...item, element: elementWithProps };
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-2 flex flex-col">
        <div className="text-xl font-bold mb-6 text-center">EnergyPalace POS</div>
        <nav className="flex-grow">
          {enrichedNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${currentBasePath === item.path
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          {posUser && ( // Display posUser's name
            <div className="mb-2 p-2 border-t border-gray-700">
              <p className="text-sm truncate" title={posUser.email}>User: {posUser.full_name || posUser.username}</p>
              <p className="text-xs text-gray-400">Role: {posUser.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full flex items-center space-x-3 justify-start text-gray-300 hover:bg-red-600 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          {posNavItems.map(item => (
            <Route key={`route-${item.path}`} path={item.path} element={item.element} />
          ))}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default POSLayout;
