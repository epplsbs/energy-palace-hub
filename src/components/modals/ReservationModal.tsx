import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X, ArrowLeft } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: "",
  });
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
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
        status: "pending",
      };

      const { error } = await supabase
        .from("reservations")
        .insert([reservationData]);

      if (error) throw error;

      toast({
        title: "Reservation Confirmed!",
        description: "We'll contact you shortly to confirm your reservation.",
      });

      onClose();
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        date: "",
        time: "",
        guests: "2",
        specialRequests: "",
      });
    } catch (error: any) {
      console.error("Error creating reservation:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      date: "",
      time: "",
      guests: "2",
      specialRequests: "",
    });
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] glass-card-enhanced border-emerald-400/30 overflow-hidden fixed inset-0 m-auto w-fit h-fit">
        <DialogHeader className="bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 -m-6 p-6 mb-6 border-b border-emerald-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="icon-container-enhanced neon-glow-green">
                <Calendar className="h-6 w-6 text-white drop-shadow-lg" />
              </div>
              <DialogTitle className="text-gradient-animated text-xl md:text-2xl font-bold">
                Make a Reservation
              </DialogTitle>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white border-emerald-400/30 hover:bg-emerald-400/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-white/70 text-lg mt-2">
            Reserve your table for the ultimate dining experience
          </p>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <form
            onSubmit={handleSubmit}
            id="reservationForm"
            className="grid gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="customerName"
                  className="text-white/90 font-semibold"
                >
                  Full Name *
                </Label>
                <Input
                  type="text"
                  id="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="glass border-emerald-400/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/50"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="customerEmail"
                  className="text-white/90 font-semibold"
                >
                  Email Address *
                </Label>
                <Input
                  type="email"
                  id="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  className="glass border-emerald-400/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/50"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="customerPhone"
                  className="text-white/90 font-semibold"
                >
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="glass border-emerald-400/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/50"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-white/90 font-semibold">
                  Number of Guests *
                </Label>
                <Input
                  type="number"
                  id="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  min="1"
                  required
                  className="glass border-emerald-400/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/50"
                  placeholder="How many guests?"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white/90 font-semibold">
                  Reservation Date *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal glass border-emerald-400/30 text-white hover:bg-emerald-400/10",
                        !date && "text-white/50",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 glass border-emerald-400/30 shadow-xl z-[100] max-h-96 overflow-auto"
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    avoidCollisions={true}
                    collisionPadding={20}
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date);
                        setFormData((prevData) => ({
                          ...prevData,
                          date: date?.toISOString().split("T")[0] || "",
                        }));
                      }}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border border-emerald-400/20 bg-gray-900/95 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-white/90 font-semibold">
                  Preferred Time *
                </Label>
                <Input
                  type="time"
                  id="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="glass border-emerald-400/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="specialRequests"
                className="text-white/90 font-semibold"
              >
                Special Requests
              </Label>
              <Input
                id="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any special dietary requirements or requests?"
                className="glass border-emerald-400/30 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/50"
              />
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 dark:bg-gray-900 sticky bottom-0 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex items-center gap-2 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            form="reservationForm"
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
          >
            {isLoading ? "Submitting..." : "Submit Reservation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;
