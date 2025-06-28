
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Zap, Car, Clock, Battery } from 'lucide-react';
import { createChargingBooking, getAvailableChargingStations } from '@/services/chargingService';

interface ChargingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChargingStation {
  id: string;
  station_id: string;
  type: string;
  power: string;
  connector: string;
  status: string;
}

const ChargingModal = ({ isOpen, onClose }: ChargingModalProps) => {
  const { toast } = useToast();
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vehicleNumber: '',
    stationId: '',
    startTime: '',
    estimatedDuration: 30
  });

  useEffect(() => {
    if (isOpen) {
      fetchAvailableStations();
      // Set default start time to current time
      const now = new Date();
      const currentTime = now.toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, startTime: currentTime }));
    }
  }, [isOpen]);

  const fetchAvailableStations = async () => {
    try {
      const data = await getAvailableChargingStations();
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
      toast({
        title: "Error",
        description: "Failed to load available charging stations",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.vehicleNumber || !formData.stationId || !formData.startTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await createChargingBooking({
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        vehicle_number: formData.vehicleNumber,
        charging_station_id: formData.stationId,
        start_time: formData.startTime,
        estimated_duration: formData.estimatedDuration,
        status: 'booked'
      });

      toast({
        title: "Booking Confirmed!",
        description: `Your charging station has been booked successfully. You'll receive a confirmation shortly.`,
      });

      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        vehicleNumber: '',
        stationId: '',
        startTime: '',
        estimatedDuration: 30
      });

      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedStation = stations.find(s => s.id === formData.stationId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border border-white/20 backdrop-blur-xl bg-gray-900/90 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
            <Zap className="h-6 w-6 text-emerald-400" />
            Book Charging Station
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Reserve your preferred charging station and get ready for a seamless charging experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName" className="text-white/90">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Your full name"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerPhone" className="text-white/90">Phone Number *</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="Your phone number"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vehicleNumber" className="text-white/90">Vehicle Number *</Label>
            <Input
              id="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
              placeholder="e.g., BA 1 KHA 1234"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              required
            />
          </div>

          <div>
            <Label htmlFor="stationId" className="text-white/90">Select Charging Station *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, stationId: value }))}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Choose an available station" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                {stations.map(station => (
                  <SelectItem key={station.id} value={station.id} className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-emerald-400" />
                      <span>Station {station.station_id} - {station.power} ({station.type})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStation && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <h4 className="font-semibold text-emerald-400 mb-2">Station Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Type:</span>
                  <span className="ml-2 text-white">{selectedStation.type}</span>
                </div>
                <div>
                  <span className="text-white/60">Power:</span>
                  <span className="ml-2 text-white">{selectedStation.power}</span>
                </div>
                <div>
                  <span className="text-white/60">Connector:</span>
                  <span className="ml-2 text-white">{selectedStation.connector}</span>
                </div>
                <div>
                  <span className="text-white/60">Status:</span>
                  <span className="ml-2 text-emerald-400">Available</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-white/90">Preferred Start Time *</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="bg-white/5 border-white/20 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="estimatedDuration" className="text-white/90">Estimated Duration (minutes)</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(value) }))}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="30 minutes" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="15" className="text-white hover:bg-white/10">15 minutes</SelectItem>
                  <SelectItem value="30" className="text-white hover:bg-white/10">30 minutes</SelectItem>
                  <SelectItem value="45" className="text-white hover:bg-white/10">45 minutes</SelectItem>
                  <SelectItem value="60" className="text-white hover:bg-white/10">1 hour</SelectItem>
                  <SelectItem value="90" className="text-white hover:bg-white/10">1.5 hours</SelectItem>
                  <SelectItem value="120" className="text-white hover:bg-white/10">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || stations.length === 0}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Booking...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>Confirm Booking</span>
                </div>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>

        {stations.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/70">No charging stations are currently available. Please try again later.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChargingModal;
