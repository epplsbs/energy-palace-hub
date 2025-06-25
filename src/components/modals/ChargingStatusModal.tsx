
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
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'occupied':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'maintenance':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <Zap className="h-4 w-4" />;
      case 'occupied':
        return <Battery className="h-4 w-4" />;
      case 'maintenance':
        return <Clock className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Charging Station Status
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex items-center justify-center p-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 opacity-20 animate-pulse"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              Charging Station Status
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid gap-6 mt-6">
          {stations.map(station => (
            <div key={station.id} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Station {station.station_id}</h3>
                    <p className="text-gray-600 font-medium">{station.type} • {station.power}</p>
                  </div>
                  <Badge className={`${getStatusColor(station.status)} px-4 py-2 rounded-full font-semibold shadow-lg`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(station.status)}
                      {station.status}
                    </div>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500 font-medium mb-1">Connector Type:</p>
                    <p className="font-bold text-gray-800">{station.connector}</p>
                  </div>
                  {station.estimated_time && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-500 font-medium mb-1">Estimated Time:</p>
                      <p className="font-bold text-gray-800">{station.estimated_time}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50">
            <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
              Quick Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <Zap className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Available</p>
                  <p className="text-green-600">Ready for charging</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                <Battery className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Occupied</p>
                  <p className="text-red-600">Currently in use</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-800">Maintenance</p>
                  <p className="text-yellow-600">Temporarily unavailable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChargingStatusModal;
