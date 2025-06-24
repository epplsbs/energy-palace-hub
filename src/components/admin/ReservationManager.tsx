
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getReservations, updateReservation, type Reservation } from '@/services/contentService';
import { Calendar, Clock, Users, Phone, Mail, MessageSquare } from 'lucide-react';

const ReservationManager = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingReservations, setUpdatingReservations] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast({
        title: "Error",
        description: "Failed to load reservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    setUpdatingReservations(prev => new Set(prev).add(reservationId));
    
    try {
      await updateReservation(reservationId, { 
        status: newStatus as Reservation['status']
      });
      
      // Update local state
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: newStatus as Reservation['status'] }
            : reservation
        )
      );
      
      toast({
        title: "Status Updated",
        description: "Reservation status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive",
      });
    } finally {
      setUpdatingReservations(prev => {
        const newSet = new Set(prev);
        newSet.delete(reservationId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reservation Management</h2>
        <Button onClick={loadReservations} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reservations found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
                    {reservation.customer_name}
                  </CardTitle>
                  <Badge className={`${getStatusColor(reservation.status)} text-white border-0`}>
                    {reservation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span>{new Date(reservation.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>{reservation.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span>{reservation.guests} guests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-xs">{reservation.customer_phone}</span>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-xs">{reservation.customer_email}</span>
                  </div>
                </div>

                {reservation.special_requests && (
                  <div className="text-sm">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-600 mt-0.5" />
                      <p className="text-xs text-gray-600">{reservation.special_requests}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Update Status:
                  </label>
                  <Select
                    value={reservation.status || 'pending'}
                    onValueChange={(value) => handleStatusUpdate(reservation.id, value)}
                    disabled={updatingReservations.has(reservation.id)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {updatingReservations.has(reservation.id) && (
                    <p className="text-xs text-gray-500 mt-1">Updating...</p>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Submitted: {new Date(reservation.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationManager;
