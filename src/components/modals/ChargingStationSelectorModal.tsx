import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Zap, X, ArrowLeft, Clock, Power, RefreshCw, User, Phone, Car, MapPin, CheckCircle } from 'lucide-react';
import { createChargingBooking, getAvailableChargingStations } from '@/services/chargingService';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface ChargingStationSelectorModalProps {
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
  estimated_time?: string;
  availability?: string;
  availableAt?: Date | null;
}

const ChargingStationSelectorModal = ({ isOpen, onClose }: ChargingStationSelectorModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'select' | 'book'>('select');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vehicleNumber: '',
    startTime: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedStation(null);
      loadStations();
      setFormData({
        customerName: '',
        customerPhone: '',
        vehicleNumber: '',
        startTime: '',
      });
    }
  }, [isOpen]);

  const loadStations = async () => {
    setLoading(true);
    try {
      const now = new Date();
      
      const { data: stations, error: stationsError } = await supabase
        .from('charging_stations')
        .select('*')
        .order('station_id');

      if (stationsError) throw stationsError;

      const { data: activeOrders, error: ordersError } = await supabase
        .from('pos_charging_orders')
        .select('charging_station_id, expected_end_time')
        .in('status', ['active', 'booked'])
        .not('expected_end_time', 'is', null);

      if (ordersError) throw ordersError;

      const stationsWithAvailability = stations?.map(station => {
        const busyOrder = activeOrders?.find(order => order.charging_station_id === station.id);
        let availability = 'available';
        let availableAt: Date | null = null;
        
        if (station.status === 'maintenance') {
          availability = 'maintenance';
        } else if (station.status === 'occupied' || busyOrder) {
          availability = 'occupied';
          if (busyOrder?.expected_end_time) {
            const expectedEndTime = new Date(busyOrder.expected_end_time);
            if (now < expectedEndTime) {
              availableAt = expectedEndTime;
            } else {
              availability = 'available';
            }
          }
        }
        
        return {
          ...station,
          availability,
          availableAt
        };
      }) || [];

      setStations(stationsWithAvailability);
    } catch (error) {
      console.error('Error loading stations:', error);
      toast({
        title: "Error",
        description: "Failed to load charging stations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStationSelect = (station: ChargingStation) => {
    if (station.availability !== 'available') {
      toast({
        title: "Station Unavailable",
        description: "This station is currently not available for booking.",
        variant: "destructive",
      });
      return;
    }
    setSelectedStation(station);
    setStep('book');
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setFormData(prev => ({ ...prev, startTime: localDateTime }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStation) {
      toast({
        title: "No Station Selected",
        description: "Please select a charging station first.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customerPhone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await createChargingBooking({
        customer_name: formData.customerName.trim(),
        customer_phone: formData.customerPhone.trim(),
        vehicle_number: formData.vehicleNumber.trim(),
        charging_station_id: selectedStation.id,
        start_time: formData.startTime,
        status: 'booked'
      });

      toast({
        title: "🎉 Booking Confirmed!",
        description: `Your booking for ${selectedStation.station_id} has been confirmed. We'll be ready for you!`,
      });

      onClose();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: error?.message || "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep('select');
    setSelectedStation(null);
  };

  const handleModalClose = () => {
    setStep('select');
    setSelectedStation(null);
    onClose();
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-emerald-500 text-white">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-amber-500 text-white">Occupied</Badge>;
      case 'maintenance':
        return <Badge className="bg-gray-500 text-white">Maintenance</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] mx-auto p-0 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-0 shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-4">
            {step === 'book' && (
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Zap className="h-6 w-6" />
                </div>
                <DialogTitle className="text-xl md:text-2xl font-bold">
                  {step === 'select' ? 'Book a Charger' : `Book ${selectedStation?.station_id}`}
                </DialogTitle>
              </div>
              <p className="text-emerald-100 text-sm md:text-base">
                {step === 'select' ? 'Select an available charging station' : 'Complete your booking details'}
              </p>
            </div>
            <button 
              onClick={handleModalClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {step === 'select' ? (
          <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
                <p className="text-gray-600">Loading charging stations...</p>
              </div>
            ) : stations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Zap className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-600 text-center mb-4">No charging stations available at the moment</p>
                <Button onClick={loadStations} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stations.map((station) => (
                  <div
                    key={station.id}
                    onClick={() => handleStationSelect(station)}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      station.availability === 'available'
                        ? 'border-emerald-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100 bg-white'
                        : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{station.station_id}</h3>
                        <p className="text-sm text-gray-500">{station.type}</p>
                      </div>
                      {getAvailabilityBadge(station.availability || station.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Power className="h-4 w-4 text-emerald-600" />
                        <span className="text-gray-700 font-medium">{station.power}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">{station.connector}</span>
                      </div>
                      {station.estimated_time && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span className="text-gray-700">{station.estimated_time}</span>
                        </div>
                      )}
                    </div>

                    {station.availability === 'available' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Select Station
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-140px)]">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {/* Selected Station Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 mb-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Zap className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedStation?.station_id}</h4>
                    <p className="text-sm text-gray-600">{selectedStation?.type} • {selectedStation?.power}</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+977-98XXXXXXXX"
                    className="h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    Vehicle Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="vehicleNumber"
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                    placeholder="BA 1 PA 1234"
                    className="h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    Preferred Start Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="flex gap-3 p-4 md:p-6 border-t bg-gray-50">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-2 font-semibold"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-200"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChargingStationSelectorModal;