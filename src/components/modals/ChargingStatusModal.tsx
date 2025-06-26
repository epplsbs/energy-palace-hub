
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock, Battery, DollarSign, X } from 'lucide-react';

interface ChargingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: {
    id: string;
    name: string;
    type: string;
    power: string;
    status: 'available' | 'charging' | 'maintenance' | 'offline';
    connector: string;
    estimatedTime?: string;
  };
}

const ChargingStatusModal = ({ isOpen, onClose, station }: ChargingStatusModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500';
      case 'charging':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'charging':
        return 'Charging';
      case 'maintenance':
        return 'Maintenance';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto glass border-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-emerald-900/90 backdrop-blur-xl text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Charging Station Status
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Station Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold text-lg">{station.name}</span>
            </div>
            <Badge 
              className={`${getStatusColor(station.status)} text-white border-0 px-3 py-1 text-sm font-medium`}
            >
              {getStatusText(station.status)}
            </Badge>
          </div>

          {/* Station Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Type</span>
              </div>
              <p className="font-semibold text-white">{station.type}</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-gray-300">Power</span>
              </div>
              <p className="font-semibold text-white">{station.power}</p>
            </div>
          </div>

          {/* Connector Info */}
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span className="text-sm text-gray-300">Connector</span>
            </div>
            <p className="font-semibold text-white">{station.connector}</p>
          </div>

          {/* Charging Progress (if charging) */}
          {station.status === 'charging' && (
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Charging Progress</span>
              </div>
              <div className="space-y-2">
                <Progress value={65} className="h-3 bg-white/10" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">65% Complete</span>
                  <span className="text-gray-400">{station.estimatedTime || '25 min'} remaining</span>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Time (if available) */}
          {station.status === 'available' && station.estimatedTime && (
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-gray-300">Est. Charging Time</span>
              </div>
              <p className="font-semibold text-white">{station.estimatedTime}</p>
            </div>
          )}

          {/* Pricing Info */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-4 backdrop-blur-sm border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-gray-300">Pricing</span>
            </div>
            <p className="font-semibold text-white">NPR 15/kWh</p>
            <p className="text-xs text-gray-400">Peak hours: NPR 18/kWh</p>
          </div>

          {/* Action Buttons */}
          {station.status === 'available' && (
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
              >
                Start Charging Session
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10 py-3 rounded-xl transition-all duration-300"
              >
                Reserve Station
              </Button>
            </div>
          )}

          {station.status === 'charging' && (
            <Button 
              variant="destructive" 
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-3 rounded-xl transition-all duration-300"
            >
              Stop Charging
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChargingStatusModal;
