
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Zap, X } from 'lucide-react';
import { createChargingBooking, getAvailableChargingStations } from '@/services/chargingService';

interface ChargingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChargingModal = ({ isOpen, onClose }: ChargingModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vehicleNumber: '',
    chargingStationId: '',
    startTime: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadStations();
      // Set default start time to now
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setFormData(prev => ({ ...prev, startTime: localDateTime }));
    }
  }, [isOpen]);

  const loadStations = async () => {
    try {
      const data = await getAvailableChargingStations();
      setStations(data);
    } catch (error) {
      console.error('Error loading stations:', error);
      toast({
        title: "Error",
        description: "Failed to load charging stations",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.chargingStationId) {
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
        charging_station_id: formData.chargingStationId,
        start_time: formData.startTime,
        status: 'booked'
      });

      toast({
        title: "Booking Confirmed!",
        description: "Your charging station has been booked successfully.",
      });

      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        vehicleNumber: '',
        chargingStationId: '',
        startTime: '',
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Book Charging Station
          </DialogTitle>
          <p className="text-gray-600">Reserve your EV charging slot</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <Input
                id="customerName"
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter your full name"
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="customerPhone" className="text-sm font-medium text-gray-700">
                Phone Number *
              </Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="Enter your phone number"
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="vehicleNumber" className="text-sm font-medium text-gray-700">
                Vehicle Number
              </Label>
              <Input
                id="vehicleNumber"
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                placeholder="Enter vehicle number (optional)"
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <Label htmlFor="chargingStation" className="text-sm font-medium text-gray-700">
                Charging Station *
              </Label>
              <Select value={formData.chargingStationId} onValueChange={(value) => setFormData(prev => ({ ...prev, chargingStationId: value }))}>
                <SelectTrigger className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Select a charging station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.station_id} - {station.type} ({station.power})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                Preferred Start Time *
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="mt-1 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Booking...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Book Now
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChargingModal;
