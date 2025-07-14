import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  ShoppingCart,
  Calendar,
  Users,
  Battery,
  DollarSign,
  Clock,
  MapPin,
  Activity,
  AlertCircle,
  CheckCircle,
  Star,
  Coffee,
  Car,
  Wifi,
  ThumbsUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalOrders: number;
  totalReservations: number;
  totalChargingSessions: number;
  activeStations: number;
  totalRevenue: number;
  avgRating: number;
  todayOrders: number;
  todayReservations: number;
  todayChargingSessions: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalReservations: 0,
    totalChargingSessions: 0,
    activeStations: 0,
    totalRevenue: 0,
    avgRating: 0,
    todayOrders: 0,
    todayReservations: 0,
    todayChargingSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration - in real app, these would be actual database queries
      const mockStats: DashboardStats = {
        totalOrders: 1247,
        totalReservations: 892,
        totalChargingSessions: 2156,
        activeStations: 8,
        totalRevenue: 2450000, // NPR
        avgRating: 4.8,
        todayOrders: 23,
        todayReservations: 15,
        todayChargingSessions: 31,
      };

      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(85420),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "emerald",
      description: "vs yesterday",
    },
    {
      title: "Active Charging Sessions",
      value: "12",
      change: "+3",
      trend: "up",
      icon: Battery,
      color: "blue",
      description: "currently charging",
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "orange",
      description: "food & beverage",
    },
    {
      title: "Today's Reservations",
      value: stats.todayReservations.toString(),
      change: "+15.1%",
      trend: "up",
      icon: Calendar,
      color: "purple",
      description: "table bookings",
    },
    {
      title: "Customer Rating",
      value: stats.avgRating.toFixed(1),
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "yellow",
      description: "average rating",
    },
    {
      title: "Station Efficiency",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Zap,
      color: "green",
      description: "uptime rate",
    },
  ];

  const quickActions = [
    {
      title: "View Orders",
      description: "Check pending food orders",
      icon: ShoppingCart,
      color: "bg-orange-500",
      action: () => {},
      badge: "5 pending",
    },
    {
      title: "Manage Stations",
      description: "Monitor charging stations",
      icon: Zap,
      color: "bg-emerald-500",
      action: () => {},
      badge: "All online",
    },
    {
      title: "Reservations",
      description: "Today's table bookings",
      icon: Calendar,
      color: "bg-blue-500",
      action: () => {},
      badge: `${stats.todayReservations} today`,
    },
    {
      title: "Customer Reviews",
      description: "Recent testimonials",
      icon: ThumbsUp,
      color: "bg-purple-500",
      action: () => {},
      badge: "3 new",
    },
  ];

  const recentActivity = [
    {
      type: "order",
      message: "New order from Ram Sharma - Dal Bhat Set",
      time: "2 minutes ago",
      icon: Coffee,
      color: "text-orange-500",
    },
    {
      type: "charging",
      message: "Tesla Model 3 started charging at Station 02",
      time: "5 minutes ago",
      icon: Car,
      color: "text-emerald-500",
    },
    {
      type: "reservation",
      message: "Table reservation for 4 people at 7:00 PM",
      time: "12 minutes ago",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      type: "charging",
      message: "Charging session completed at Station 05",
      time: "18 minutes ago",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      type: "system",
      message: "Station 03 maintenance completed",
      time: "1 hour ago",
      icon: Activity,
      color: "text-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome to Energy Palace Admin
            </h1>
            <p className="text-emerald-100">
              Monitor your EV charging station and restaurant operations
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-emerald-100">Today's Status</p>
              <p className="text-lg font-semibold">All Systems Operational</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={stat.trend === "up" ? "default" : "destructive"}
                      className={`text-xs ${stat.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={action.action}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {action.badge}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full bg-gray-100 ${activity.color}`}
                  >
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 mb-1">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <span>System Status - Bhiman, Sindhuli</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Charging Stations</h4>
              <p className="text-2xl font-bold text-green-600">8/8</p>
              <p className="text-sm text-gray-600">Online</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <Wifi className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Network</h4>
              <p className="text-2xl font-bold text-blue-600">100%</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                <Coffee className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Restaurant</h4>
              <p className="text-2xl font-bold text-orange-600">Open</p>
              <p className="text-sm text-gray-600">24/7 Service</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Staff</h4>
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-gray-600">On Duty</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
