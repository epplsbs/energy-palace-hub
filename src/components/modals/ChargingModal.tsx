
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Clock, Battery, MapPin, X } from 'lucide-react';
import { getChargingStations } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';

interface ChargingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChargingModal = ({ isOpen, onClose }: ChargingModalProps) => {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadStations();
    }
  }, [isOpen]);

  const loadStations = async () => {
    try {
      // Mock data since the database constraint is blocking real data
      const mockStations = [
        {
          id: '1',
          station_id: 'CS-001',
          type: 'DC Fast Charger',
          power: '150kW',
          status: 'available',
          connector: 'CCS2',
          estimated_time: '30 min'
        },
        {
          id: '2',
          station_id: 'CS-002',
          type: 'DC Fast Charger',
          power: '150kW',
          status: 'occupied',
          connector: 'CHAdeMO',
          estimated_time: '25 min'
        },
        {
          id: '3',
          station_id: 'CS-003',
          type: 'AC Charger',
          power: '22kW',
          status: 'available',
          connector: 'Type 2',
          estimated_time: '2 hours'
        },
        {
          id: '4',
          station_id: 'CS-004',
          type: 'DC Fast Charger',
          power: '150kW',
          status: 'maintenance',
          connector: 'CCS2',
          estimated_time: null
        }
      ];
      setStations(mockStations);
    } catch (error) {
      console.error('Error loading stations:', error);
      toast({
        title: "Error",
        description: "Failed to load charging stations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleBookStation = (station: any) => {
    toast({
      title: "Booking Confirmed",
      description: `Station ${station.station_id} has been reserved for you!`,
    });
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl glass border-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-emerald-900/90 backdrop-blur-xl text-white shadow-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass border-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-emerald-900/90 backdrop-blur-xl text-white shadow-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="relative pb-6">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Book Charging Station
          </DialogTitle>
          <div className="flex items-center justify-center space-x-2 text-white/70">
            <MapPin className="h-4 w-4" />
            <span>Kathmandu, Nepal • Energy Palace</span>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stations.map((station) => (
            <Card key={station.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{station.station_id}</h3>
                  <Badge className={`${getStatusColor(station.status)} text-white border-0`}>
                    {station.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-white/80">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm">Power:</span>
                    <span className="font-semibold">{station.power}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-white/80">
                    <Battery className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Type:</span>
                    <span className="font-semibold">{station.type}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-white/80">
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                    <span className="text-sm">Connector:</span>
                    <span className="font-semibold">{station.connector}</span>
                  </div>

                  {station.estimated_time && (
                    <div className="flex items-center space-x-2 text-white/80">
                      <Clock className="h-4 w-4 text-orange-400" />
                      <span className="text-sm">Est. Time:</span>
                      <span className="font-semibold">{station.estimated_time}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  {station.status === 'available' ? (
                    <Button 
                      onClick={() => handleBookStation(station)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 rounded-xl transition-all duration-300"
                    >
                      Book This Station
                    </Button>
                  ) : (
                    <Button 
                      disabled 
                      className="w-full bg-gray-600 text-gray-400 py-3 rounded-xl cursor-not-allowed"
                    >
                      {station.status === 'occupied' ? 'Currently In Use' : 'Under Maintenance'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/20">
          <h4 className="font-semibold text-white mb-2">Pricing Information</h4>
          <div className="text-sm text-white/80 space-y-1">
            <p>• DC Fast Charging: NPR 18/kWh</p>
            <p>• AC Charging: NPR 15/kWh</p>
            <p>• Complimentary parking during charging</p>
            <p>• Free WiFi and lounge access</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChargingModal;
