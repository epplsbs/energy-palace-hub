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

const POSLayout: React.FC = () => {
  const location = useLocation();
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);

  React.useEffect(() => {
    const fetchInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthUser(session?.user ?? null);
      setLoadingAuth(false);
    };

    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthUser(session?.user ?? null);
      // If login happens, loading might need to be reset or handled too
      // but for now, this ensures user state is updated.
      if (event === "SIGNED_IN") {
        setLoadingAuth(false);
      }
      if (event === "SIGNED_OUT") {
        setLoadingAuth(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // AuthUser will be set to null by the listener, triggering re-render
  };

  const currentBasePath = location.pathname.split('/sales/')[1]?.split('/')[0] || 'dashboard';

  if (loadingAuth) {
    return <div className="flex items-center justify-center min-h-screen">Loading POS Authentication...</div>;
  }

  const handleLoginSuccess = () => {
    // This callback might not be strictly necessary if onAuthStateChange is robustly
    // updating authUser and setLoadingAuth.
    // Forcing a re-check or state update if needed.
    setLoadingAuth(true); // Briefly set loading to ensure re-check of user
    supabase.auth.getSession().then(({ data: { session } }) => {
        setAuthUser(session?.user ?? null);
        setLoadingAuth(false);
    });
  };

  if (!authUser) {
    return <POSLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-2 flex flex-col">
        <div className="text-xl font-bold mb-6 text-center">EnergyPalace POS</div>
        <nav className="flex-grow">
          {posNavItems.map((item) => (
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
          {authUser && (
            <div className="mb-2 p-2 border-t border-gray-700">
              <p className="text-sm truncate" title={authUser.email}>User: {authUser.email}</p>
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
