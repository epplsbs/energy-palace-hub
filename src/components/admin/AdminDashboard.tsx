
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@supabase/supabase-js';
import { LogOut, Settings, Users, Utensils, Zap, Image, Calendar, ShoppingCart, Store, Edit } from 'lucide-react';
import ChargingStationManager from './ChargingStationManager';
import MenuManager from './MenuManager';
import GalleryManager from './GalleryManager';
import ReservationManager from './ReservationManager';
import OrderManager from './OrderManager';
import BusinessSettingsManager from './BusinessSettingsManager';

interface AdminDashboardProps {
  user: User;
  onSignOut: () => void;
}

const AdminDashboard = ({ user, onSignOut }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleOpenPOS = () => {
    window.open('/pos', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Energy Palace Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleOpenPOS}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Store className="h-4 w-4" />
                <span>Open POS System</span>
              </Button>
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="charging" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Charging</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center space-x-2">
              <Utensils className="h-4 w-4" />
              <span>Menu</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Reservations</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Business Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Charging Stations</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Total stations</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Active items</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Photos displayed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Reservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Button 
                    onClick={handleOpenPOS}
                    className="h-20 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <Store className="h-6 w-6" />
                    <span>Open POS</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('charging')}
                    className="h-20 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <Zap className="h-6 w-6" />
                    <span>Manage Charging</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('menu')}
                    className="h-20 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <Utensils className="h-6 w-6" />
                    <span>Update Menu</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('reservations')}
                    className="h-20 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <Calendar className="h-6 w-6" />
                    <span>View Reservations</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('business')}
                    className="h-20 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <Edit className="h-6 w-6" />
                    <span>Business Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charging" className="mt-6">
            <ChargingStationManager />
          </TabsContent>

          <TabsContent value="menu" className="mt-6">
            <MenuManager />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <GalleryManager />
          </TabsContent>

          <TabsContent value="reservations" className="mt-6">
            <ReservationManager />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrderManager />
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <BusinessSettingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
