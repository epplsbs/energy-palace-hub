
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Users } from 'lucide-react';
import { createReservation } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservationModal = ({ isOpen, onClose }: ReservationModalProps) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    date: '',
    time: '',
    guests: 2,
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createReservation(formData);
      toast({
        title: "Reservation Confirmed!",
        description: "Your table has been reserved. We'll send you a confirmation email shortly.",
      });
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        date: '',
        time: '',
        guests: 2,
        special_requests: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Calendar className="h-6 w-6 text-emerald-600" />
            Make Reservation
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Full Name</Label>
            <Input
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_email">Email</Label>
            <Input
              id="customer_email"
              name="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_phone">Phone Number</Label>
            <Input
              id="customer_phone"
              name="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Number of Guests
            </Label>
            <Input
              id="guests"
              name="guests"
              type="number"
              min="1"
              max="12"
              value={formData.guests}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requests">Special Requests (Optional)</Label>
            <Textarea
              id="special_requests"
              name="special_requests"
              value={formData.special_requests}
              onChange={handleInputChange}
              placeholder="Any special dietary requirements or requests..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            {loading ? 'Creating Reservation...' : 'Confirm Reservation'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;
