
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Car, Clock } from 'lucide-react';
import { getChargingStations, type ChargingStation } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';

const ChargingStations = () => {
  const { toast } = useToast();
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await getChargingStations();
        setStations(data);
      } catch (error) {
        console.error('Error loading charging stations:', error);
        toast({
          title: "Error",
          description: "Failed to load charging stations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStations();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500';
      case 'occupied':
        return 'bg-orange-500';
      case 'maintenance':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'In Use';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const getTotalPower = () => {
    return stations.reduce((total, station) => {
      const power = parseInt(station.power.replace('KW', ''));
      return total + power;
    }, 0);
  };

  const getAvailableCount = () => {
    return stations.filter(station => station.status === 'available').length;
  };

  if (isLoading) {
    return (
      <section id="charging" className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading charging stations...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="charging" className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
            <Zap className="h-4 w-4 text-emerald-600 mr-2" />
            <span className="text-emerald-800 text-sm font-medium">EV Charging</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fast Charging Stations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            State-of-the-art EV charging infrastructure with real-time availability updates
          </p>
        </div>

        {/* Real-time Status Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{getTotalPower()}KW</h3>
              <p className="text-gray-600">Total Power</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{getAvailableCount()}/{stations.length}</h3>
              <p className="text-gray-600">Available</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">~25</h3>
              <p className="text-gray-600">Avg. Time (min)</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">24/7</h3>
              <p className="text-gray-600">Available</p>
            </div>
          </div>
        </div>

        {/* Charging Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stations.map((station) => (
            <Card key={station.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {station.station_id}
                  </CardTitle>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(station.status)}`}></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Power:</span>
                  <span className="font-semibold text-gray-900">{station.power}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge variant="outline" className="text-xs">
                    {station.connector}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge 
                    className={`${getStatusColor(station.status)} text-white border-0`}
                  >
                    {getStatusText(station.status)}
                  </Badge>
                </div>

                {station.estimated_time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Est. time:</span>
                    <span className="font-semibold text-orange-600">{station.estimated_time}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Charge?</h3>
            <p className="text-lg mb-6 opacity-90">
              Simply plug in your vehicle and enjoy our premium amenities while you charge
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Step 1</h4>
                <p className="opacity-80">Connect your EV to available charging station</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Step 2</h4>
                <p className="opacity-80">Visit our restaurant while your car charges</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Step 3</h4>
                <p className="opacity-80">Receive notification when charging is complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChargingStations;
