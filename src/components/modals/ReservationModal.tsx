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
import { CalendarIcon, X, ArrowLeft, Users, Mail, Phone, User, Clock, MessageSquare, CheckCircle } from "lucide-react"
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
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customerEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.date) {
      toast({
        title: "Date Required",
        description: "Please select a reservation date.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.time) {
      toast({
        title: "Time Required",
        description: "Please select a reservation time.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const reservationData = {
        customer_name: formData.customerName.trim(),
        customer_email: formData.customerEmail.trim(),
        customer_phone: formData.customerPhone.trim() || null,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests) || 2,
        special_requests: formData.specialRequests.trim() || null,
        status: 'pending'
      };

      const { error } = await supabase
        .from('reservations')
        .insert([reservationData]);

      if (error) throw error;

      toast({
        title: "🎉 Reservation Confirmed!",
        description: "We'll contact you shortly to confirm your reservation.",
      });

      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Reservation Failed",
        description: error.message || "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      guests: '2',
      specialRequests: ''
    });
    setDate(undefined);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] mx-auto p-0 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 border-0 shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl md:text-2xl font-bold">
                  Make a Reservation
                </DialogTitle>
                <p className="text-amber-100 text-sm md:text-base">
                  Book your table for a memorable dining experience
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-140px)]">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="space-y-5">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    type="text" 
                    id="customerName" 
                    value={formData.customerName} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500 bg-white text-gray-900 placeholder:text-gray-400" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    type="email" 
                    id="customerEmail" 
                    value={formData.customerEmail} 
                    onChange={handleChange} 
                    required 
                    placeholder="your@email.com"
                    className="h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500 bg-white text-gray-900 placeholder:text-gray-400" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="customerPhone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Phone <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input 
                    type="tel" 
                    id="customerPhone" 
                    value={formData.customerPhone} 
                    onChange={handleChange} 
                    placeholder="+977-98XXXXXXXX"
                    className="h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500 bg-white text-gray-900 placeholder:text-gray-400" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    Number of Guests <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    type="number" 
                    id="guests" 
                    value={formData.guests} 
                    onChange={handleChange} 
                    min="1" 
                    max="50"
                    required 
                    className="h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500 bg-white text-gray-900 placeholder:text-gray-400" 
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-900",
                          !date && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                        {date ? format(date, "PPP") : <span>Select a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate)
                          if (selectedDate) {
                            const year = selectedDate.getFullYear();
                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                            const day = String(selectedDate.getDate()).padStart(2, '0');
                            setFormData(prevData => ({
                              ...prevData,
                              date: `${year}-${month}-${day}`
                            }));
                          }
                        }}
                        disabled={(checkDate) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return checkDate < today;
                        }}
                        className="rounded-md border bg-white text-gray-900 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    Time <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    type="time" 
                    id="time" 
                    value={formData.time} 
                    onChange={handleChange} 
                    required 
                    className="h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500 bg-white text-gray-900" 
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="specialRequests" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
                </Label>
                <Input
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any dietary requirements or special occasions?"
                    className="h-12 rounded-xl border-gray-200 focus:border-amber-500 focus:ring-amber-500 bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="flex gap-3 p-4 md:p-6 border-t bg-gray-50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1 h-12 rounded-xl border-2 font-semibold"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Reservation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;