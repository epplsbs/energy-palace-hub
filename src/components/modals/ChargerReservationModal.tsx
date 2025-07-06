import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Zap } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { supabase } from '@/integrations/supabase/client';

interface ChargerReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  chargingStationId: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  specialRequests: string;
}

const ChargerReservationModal = ({ isOpen, onClose }: ChargerReservationModalProps) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [stations, setStations] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    chargingStationId: '',
    reservationDate: '',
    startTime: '',
    endTime: '',
    specialRequests: ''
  });
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  useEffect(() => {
    if (isOpen) {
      loadStations();
    }
  }, [isOpen]);

  const loadStations = async () => {
    try {
      const { data, error } = await supabase
        .from('charging_stations')
        .select('*')
        .order('station_id');

      if (error) throw error;
      setStations(data || []);
    } catch (error) {
      console.error('Error loading stations:', error);
      toast({
        title: "Error",
        description: "Failed to load charging stations",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const reservationData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        charging_station_id: formData.chargingStationId,
        reservation_date: formData.reservationDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        special_requests: formData.specialRequests,
        status: 'pending'
      };

      const { error } = await supabase
        .from('charger_reservations')
        .insert([reservationData]);

      if (error) throw error;

      toast({
        title: "Reservation Confirmed!",
        description: "Your charger reservation has been submitted successfully.",
      });

      onClose();
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        chargingStationId: '',
        reservationDate: '',
        startTime: '',
        endTime: '',
        specialRequests: ''
      });
    } catch (error: any) {
      console.error('Error creating charger reservation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create charger reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white dark:bg-white">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">Reserve Charging Station</DialogTitle>
          <p className="text-gray-600">Book your charging slot in advance</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName" className="text-gray-700">Name</Label>
              <Input type="text" id="customerName" value={formData.customerName} onChange={handleChange} required className="bg-white" />
            </div>
            <div>
              <Label htmlFor="customerEmail" className="text-gray-700">Email</Label>
              <Input type="email" id="customerEmail" value={formData.customerEmail} onChange={handleChange} required className="bg-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerPhone" className="text-gray-700">Phone</Label>
              <Input type="tel" id="customerPhone" value={formData.customerPhone} onChange={handleChange} className="bg-white" />
            </div>
            <div>
              <Label htmlFor="chargingStation" className="text-gray-700">Charging Station</Label>
              <Select value={formData.chargingStationId} onValueChange={(value) => setFormData(prev => ({ ...prev, chargingStationId: value }))}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a charging station" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.station_id} - {station.type} ({station.power}) - {station.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reservationDate" className="text-gray-700">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date)
                      setFormData(prevData => ({
                        ...prevData,
                        reservationDate: date?.toISOString().split('T')[0] || ''
                      }));
                    }}
                    disabled={(date) =>
                      date < new Date()
                    }
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="startTime" className="text-gray-700">Start Time</Label>
              <Input type="time" id="startTime" value={formData.startTime} onChange={handleChange} required className="bg-white" />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-gray-700">End Time</Label>
              <Input type="time" id="endTime" value={formData.endTime} onChange={handleChange} required className="bg-white" />
            </div>
          </div>
          <div>
            <Label htmlFor="specialRequests" className="text-gray-700">Special Requests</Label>
            <Input
              id="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requests?"
              className="bg-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? 'Submitting...' : 'Reserve Station'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChargerReservationModal;