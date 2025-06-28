
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Zap, Car, Clock, Battery, MapPin, Power } from 'lucide-react';
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
  estimated_time?: string;
}

const ChargingModal = ({ isOpen, onClose }: ChargingModalProps) => {
  const { toast } = useToast();
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
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

  const handleStationSelect = (station: ChargingStation) => {
    setSelectedStation(station);
    setFormData(prev => ({ ...prev, stationId: station.id }));
    setShowBookingForm(true);
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
      setSelectedStation(null);
      setShowBookingForm(false);
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

  const resetAndClose = () => {
    setShowBookingForm(false);
    setSelectedStation(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      vehicleNumber: '',
      stationId: '',
      startTime: new Date().toISOString().slice(0, 16),
      estimatedDuration: 30
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="glass border border-white/20 backdrop-blur-xl bg-gray-900/90 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
            <Zap className="h-6 w-6 text-emerald-400" />
            {showBookingForm ? 'Complete Booking Details' : 'Select Charging Station'}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {showBookingForm 
              ? 'Fill in your details to complete the booking.'
              : 'Choose from our available charging stations and book your preferred slot.'
            }
          </DialogDescription>
        </DialogHeader>

        {!showBookingForm ? (
          <div className="space-y-6 mt-6">
            {stations.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/70">No charging stations are currently available. Please try again later.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-white/80">We have {stations.length} charging station{stations.length !== 1 ? 's' : ''} available</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stations.map(station => (
                    <Card 
                      key={station.id} 
                      className="bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleStationSelect(station)}
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                              <Battery className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">Station {station.station_id}</h3>
                              <p className="text-emerald-400 text-sm font-medium">Available Now</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white/60 mb-1">Type</div>
                            <div className="text-sm font-semibold text-white">{station.type}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Power className="h-4 w-4 text-blue-400" />
                            <div>
                              <div className="text-xs text-white/60">Power</div>
                              <div className="text-sm font-semibold text-white">{station.power}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-purple-400" />
                            <div>
                              <div className="text-xs text-white/60">Connector</div>
                              <div className="text-sm font-semibold text-white">{station.connector}</div>
                            </div>
                          </div>
                        </div>
                        
                        {station.estimated_time && (
                          <div className="flex items-center gap-2 mb-4 p-2 bg-blue-500/10 rounded-lg">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-blue-300">Est. time: {station.estimated_time}</span>
                          </div>
                        )}
                        
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 group-hover:scale-105 transition-all duration-300">
                          <Car className="h-4 w-4 mr-2" />
                          Select This Station
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Selected Station Summary */}
            {selectedStation && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                  <Battery className="h-4 w-4" />
                  Selected Station
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Station:</span>
                    <span className="ml-2 text-white font-semibold">{selectedStation.station_id}</span>
                  </div>
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
                </div>
              </div>
            )}

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

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBookingForm(false)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Back to Stations
              </Button>
              <Button
                type="submit"
                disabled={loading}
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
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChargingModal;
