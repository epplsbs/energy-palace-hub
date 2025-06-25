
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getDashboardStats } from '@/services/posService';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Zap, 
  Users,
  LogOut,
  BarChart3,
  Settings
} from 'lucide-react';

// Import POS components
import POSOrders from './POSOrders';
import POSChargingOrders from './POSChargingOrders';
import POSMenuManager from './POSMenuManager';
import POSExpenses from './POSExpenses';
import POSDeposits from './POSDeposits';
import POSUserManager from './POSUserManager';
import POSSettings from './POSSettings';

interface POSDashboardProps {
  user: any;
  onSignOut: () => void;
}

const POSDashboard = ({ user, onSignOut }: POSDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const stats = await getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user.posUser.role === 'admin';
  const isManager = user.posUser.role === 'manager' || isAdmin;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Energy Palace POS</h1>
              <Badge variant="outline" className="capitalize">
                {user.posUser.role}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.posUser.full_name}
              </span>
              <Button
                onClick={onSignOut}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="charging" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Charging</span>
            </TabsTrigger>
            {isManager && (
              <TabsTrigger value="menu" className="flex items-center space-x-2">
                <span className="hidden sm:inline">Menu</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="expenses" className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="deposits" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Deposits</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {/* Dashboard Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rs. {dashboardStats.totalRevenue?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">Today's earnings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(dashboardStats.ordersCount || 0) + (dashboardStats.chargingOrdersCount || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.ordersCount || 0} restaurant, {dashboardStats.chargingOrdersCount || 0} charging
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rs. {dashboardStats.totalExpenses?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">{dashboardStats.expensesCount || 0} entries</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rs. {dashboardStats.profit?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.profit >= 0 ? 'Profit' : 'Loss'} today
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab('orders')}
                    className="h-20 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span>New Order</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('charging')}
                    className="h-20 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <Zap className="h-6 w-6" />
                    <span>Charging Order</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('expenses')}
                    className="h-20 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <TrendingDown className="h-6 w-6" />
                    <span>Add Expense</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('deposits')}
                    className="h-20 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span>Add Deposit</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <POSOrders user={user} />
          </TabsContent>

          <TabsContent value="charging" className="mt-6">
            <POSChargingOrders user={user} />
          </TabsContent>

          {isManager && (
            <TabsContent value="menu" className="mt-6">
              <POSMenuManager user={user} />
            </TabsContent>
          )}

          <TabsContent value="expenses" className="mt-6">
            <POSExpenses user={user} />
          </TabsContent>

          <TabsContent value="deposits" className="mt-6">
            <POSDeposits user={user} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="mt-6">
              <POSUserManager user={user} />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="settings" className="mt-6">
              <POSSettings user={user} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default POSDashboard;
