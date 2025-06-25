
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Battery, Clock, Car, X } from 'lucide-react';
import { getChargingStations } from '@/services/contentService';
import type { ChargingStation } from '@/services/contentService';

interface ChargingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChargingStatusModal = ({ isOpen, onClose }: ChargingStatusModalProps) => {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadStations();
    }
  }, [isOpen]);

  const loadStations = async () => {
    try {
      const data = await getChargingStations();
      setStations(data);
    } catch (error) {
      console.error('Error loading charging stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <Zap className="h-4 w-4 text-green-600" />;
      case 'occupied':
        return <Battery className="h-4 w-4 text-red-600" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Car className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Charging Station Status</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-emerald-600" />
              Charging Station Status
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid gap-4">
          {stations.map(station => (
            <div key={station.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Station {station.station_id}</h3>
                  <p className="text-sm text-gray-600">{station.type} • {station.power}</p>
                </div>
                <Badge className={getStatusColor(station.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(station.status)}
                    {station.status}
                  </div>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Connector Type:</p>
                  <p className="font-medium">{station.connector}</p>
                </div>
                {station.estimated_time && (
                  <div>
                    <p className="text-gray-600">Estimated Time:</p>
                    <p className="font-medium">{station.estimated_time}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold text-emerald-800 mb-2">Quick Guide</h4>
          <div className="space-y-1 text-sm text-emerald-700">
            <p>• <span className="font-medium">Available:</span> Ready for charging</p>
            <p>• <span className="font-medium">Occupied:</span> Currently in use</p>
            <p>• <span className="font-medium">Maintenance:</span> Temporarily unavailable</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChargingStatusModal;
