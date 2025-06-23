
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getChargingStations, updateChargingStation, type ChargingStation } from '@/services/contentService';
import { Zap, RefreshCw } from 'lucide-react';

const ChargingStationManager = () => {
  const { toast } = useToast();
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStations, setUpdatingStations] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadStations();
  }, []);

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

  const handleStatusUpdate = async (stationId: string, newStatus: string) => {
    setUpdatingStations(prev => new Set(prev).add(stationId));
    
    try {
      const updates: Partial<ChargingStation> = { 
        status: newStatus as ChargingStation['status'],
        updated_at: new Date().toISOString()
      };
      
      // Clear estimated time if station becomes available
      if (newStatus === 'available') {
        updates.estimated_time = null;
      }
      
      await updateChargingStation(stationId, updates);
      
      // Update local state
      setStations(prev => 
        prev.map(station => 
          station.id === stationId 
            ? { ...station, ...updates }
            : station
        )
      );
      
      toast({
        title: "Status Updated",
        description: "Charging station status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating station:', error);
      toast({
        title: "Error",
        description: "Failed to update charging station status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStations(prev => {
        const newSet = new Set(prev);
        newSet.delete(stationId);
        return newSet;
      });
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

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading charging stations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Charging Station Management</h2>
        <Button onClick={loadStations} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stations.map((station) => (
          <Card key={station.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-emerald-600" />
                  {station.station_id}
                </CardTitle>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(station.status)}`}></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <p className="font-semibold">{station.type}</p>
                </div>
                <div>
                  <span className="text-gray-600">Power:</span>
                  <p className="font-semibold">{station.power}</p>
                </div>
                <div>
                  <span className="text-gray-600">Connector:</span>
                  <p className="font-semibold">{station.connector}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge className={`${getStatusColor(station.status)} text-white border-0 text-xs`}>
                    {station.status}
                  </Badge>
                </div>
              </div>

              {station.estimated_time && (
                <div className="text-sm">
                  <span className="text-gray-600">Estimated time:</span>
                  <p className="font-semibold text-orange-600">{station.estimated_time}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Update Status:
                </label>
                <Select
                  value={station.status}
                  onValueChange={(value) => handleStatusUpdate(station.id, value)}
                  disabled={updatingStations.has(station.id)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                {updatingStations.has(station.id) && (
                  <p className="text-xs text-gray-500 mt-1">Updating...</p>
                )}
              </div>

              <div className="text-xs text-gray-500">
                Last updated: {new Date(station.updated_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChargingStationManager;
