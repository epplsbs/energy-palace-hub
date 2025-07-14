import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Zap, X, ArrowLeft, Clock, Power, RefreshCw } from "lucide-react";
import {
  createChargingBooking,
  getAvailableChargingStations,
} from "@/services/chargingService";
import { supabase } from "@/integrations/supabase/client";

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
}

const ChargingStationSelectorModal = ({
  isOpen,
  onClose,
}: ChargingStationSelectorModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "book">("select");
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [selectedStation, setSelectedStation] =
    useState<ChargingStation | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    vehicleNumber: "",
    startTime: "",
  });

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setSelectedStation(null);
      loadStations();
      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        vehicleNumber: "",
        startTime: "",
      });
    }
  }, [isOpen]);

  const loadStations = async () => {
    setLoading(true);
    try {
      // Get current time
      const now = new Date();

      // Get all stations regardless of status
      const { data: stations, error: stationsError } = await supabase
        .from("charging_stations")
        .select("*")
        .order("station_id");

      if (stationsError) throw stationsError;

      // Get active/booked orders with expected end times
      const { data: activeOrders, error: ordersError } = await supabase
        .from("pos_charging_orders")
        .select("charging_station_id, expected_end_time")
        .in("status", ["active", "booked"])
        .not("expected_end_time", "is", null);

      if (ordersError) throw ordersError;

      // Add availability info to stations
      const stationsWithAvailability =
        stations?.map((station) => {
          const busyOrder = activeOrders?.find(
            (order) => order.charging_station_id === station.id,
          );
          let availability = "available";
          let availableAt = null;

          if (station.status === "maintenance") {
            availability = "maintenance";
          } else if (station.status === "occupied" || busyOrder) {
            availability = "occupied";
            if (busyOrder?.expected_end_time) {
              const expectedEndTime = new Date(busyOrder.expected_end_time);
              if (now < expectedEndTime) {
                availableAt = expectedEndTime;
              } else {
                availability = "available"; // Past expected end time
              }
            }
          }

          return {
            ...station,
            availability,
            availableAt,
          };
        }) || [];

      setStations(stationsWithAvailability);
    } catch (error) {
      console.error("Error loading stations:", error);
      toast({
        title: "Error",
        description: "Failed to load charging stations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStationSelect = (station: ChargingStation) => {
    setSelectedStation(station);
    setStep("book");
    // Set default start time
    const now = new Date();
    const localDateTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);
    setFormData((prev) => ({ ...prev, startTime: localDateTime }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStation || !formData.customerName || !formData.customerPhone) {
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
        charging_station_id: selectedStation.id,
        start_time: formData.startTime,
        status: "booked",
      });

      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${selectedStation.station_id} has been confirmed.`,
      });

      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description:
          "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("select");
    setSelectedStation(null);
  };

  const handleModalClose = () => {
    setStep("select");
    setSelectedStation(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] mx-auto glass-card-enhanced border-emerald-400/30 overflow-hidden">
        <DialogHeader className="text-center pb-6 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 -m-6 p-6 mb-6 border-b border-emerald-400/20">
          <div className="mx-auto icon-container-enhanced mb-4 neon-glow-green">
            <Zap className="h-8 w-8 text-white drop-shadow-lg" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gradient-animated mb-2">
            {step === "select"
              ? "Select Charging Station"
              : `Book ${selectedStation?.station_id}`}
          </DialogTitle>
          <p className="text-white/70 text-lg">
            {step === "select"
              ? "Choose an available charging station"
              : "Complete your booking details"}
          </p>
        </DialogHeader>

        {step === "select" ? (
          // Station Selection View
          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading available stations...</p>
              </div>
            ) : stations.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No charging stations available at the moment
                </p>
                <Button
                  onClick={loadStations}
                  variant="outline"
                  className="mt-4 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stations.map((station) => (
                  <div
                    key={station.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleStationSelect(station)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900">
                        {station.station_id}
                      </h3>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <Power className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {station.power}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{station.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Connector:</span>
                        <span className="font-medium">{station.connector}</span>
                      </div>
                      {station.estimated_time && (
                        <div className="flex items-center justify-between">
                          <span>Est. Time:</span>
                          <span className="flex items-center font-medium">
                            <Clock className="h-3 w-3 mr-1" />
                            {station.estimated_time}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">
                      Select Station
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center pt-4 border-t bg-white sticky bottom-0">
              <Button onClick={handleModalClose} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // Booking Form View
          <div className="flex flex-col max-h-[calc(90vh-200px)]">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 overflow-y-auto flex-1 px-1"
            >
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Selected Station:
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Station ID:</span>
                    <span className="font-medium ml-2">
                      {selectedStation?.station_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium ml-2">
                      {selectedStation?.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Power:</span>
                    <span className="font-medium ml-2">
                      {selectedStation?.power}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Connector:</span>
                    <span className="font-medium ml-2">
                      {selectedStation?.connector}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="customerName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="customerPhone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customerPhone: e.target.value,
                      }))
                    }
                    placeholder="Enter your phone number"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="vehicleNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Vehicle Number
                  </Label>
                  <Input
                    id="vehicleNumber"
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vehicleNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter vehicle number (optional)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="startTime"
                    className="text-sm font-medium text-gray-700"
                  >
                    Preferred Start Time *
                  </Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </form>

            <div className="flex gap-3 pt-4 border-t bg-white sticky bottom-0">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Stations
              </Button>
              <Button
                onClick={handleSubmit}
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
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChargingStationSelectorModal;
