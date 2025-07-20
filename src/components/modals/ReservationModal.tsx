import React, { useState } from 'react';
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
import { CalendarIcon, X, ArrowLeft } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { supabase } from '@/integrations/supabase/client';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: string;
  specialRequests: string;
}

const ReservationModal = ({ isOpen, onClose }: ReservationModalProps) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  });
  const [date, setDate] = React.useState<Date | undefined>(new Date())

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
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        special_requests: formData.specialRequests,
        status: 'pending'
      };

      const { error } = await supabase
        .from('reservations')
        .insert([reservationData]);

      if (error) throw error;

      toast({
        title: "Reservation Confirmed!",
        description: "We'll contact you shortly to confirm your reservation.",
      });

      onClose();
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        date: '',
        time: '',
        guests: '2',
        specialRequests: ''
      });
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      guests: '2',
      specialRequests: ''
    });
    onClose();
  };
  return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white/90 backdrop-blur-sm border border-white/30 shadow-2xl overflow-hidden">
                <DialogHeader>
          <div className="flex items-center justify-between px-6 pt-6">
            <DialogTitle className="text-gray-900 text-xl md:text-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              Make a Reservation
            </DialogTitle>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <form onSubmit={handleSubmit} id="reservationForm" className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customerName" className="text-gray-700">Name</Label>
              <Input type="text" id="customerName" value={formData.customerName} onChange={handleChange} required className="bg-white/70 border-gray-300 text-gray-900" />
            </div>
            <div>
              <Label htmlFor="customerEmail" className="text-gray-700">Email</Label>
              <Input type="email" id="customerEmail" value={formData.customerEmail} onChange={handleChange} required className="bg-white/70 border-gray-300 text-gray-900" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customerPhone" className="text-gray-700">Phone</Label>
              <Input type="tel" id="customerPhone" value={formData.customerPhone} onChange={handleChange} className="bg-white/70 border-gray-300 text-gray-900" />
            </div>
            <div>
              <Label htmlFor="guests" className="text-gray-700">Guests</Label>
              <Input type="number" id="guests" value={formData.guests} onChange={handleChange} min="1" required className="bg-white/70 border-gray-300 text-gray-900" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50",
                      !date && "text-muted-foreground dark:text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date)
                      setFormData(prevData => ({
                        ...prevData,
                        date: date?.toISOString().split('T')[0] || ''
                      }));
                    }}
                    disabled={(date) =>
                      date < new Date()
                    }
                    className="rounded-md border bg-white dark:bg-gray-800 dark:text-gray-50"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">Time</Label>
              <Input type="time" id="time" value={formData.time} onChange={handleChange} required className="bg-white dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700" />
            </div>
          </div>
          <div>
            <Label htmlFor="specialRequests" className="text-gray-700 dark:text-gray-300">Special Requests</Label>
            <Input
              id="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requests?"
              className="bg-white dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700"
            />
          </div>
          </form>
        </div>
        
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 dark:bg-gray-900 sticky bottom-0 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={handleClose} className="flex items-center gap-2 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="submit"
            form="reservationForm"
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
          >
            {isLoading ? 'Submitting...' : 'Submit Reservation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;
