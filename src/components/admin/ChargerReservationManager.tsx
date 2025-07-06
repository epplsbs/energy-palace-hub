import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Users, Phone, Mail, MessageSquare, Trash2, Zap } from 'lucide-react';

interface ChargerReservation {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  charging_station_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  created_at: string;
  charging_stations?: {
    station_id: string;
    type: string;
    power: string;
  };
}

const ChargerReservationManager = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<ChargerReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingReservations, setUpdatingReservations] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('charger_reservations')
        .select(`
          *,
          charging_stations (
            station_id,
            type,
            power
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data?.map(item => ({
        ...item,
        status: item.status as ChargerReservation['status']
      })) || []);
    } catch (error) {
      console.error('Error loading charger reservations:', error);
      toast({
        title: "Error",
        description: "Failed to load charger reservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    setUpdatingReservations(prev => new Set(prev).add(reservationId));
    
    try {
      const { error } = await supabase
        .from('charger_reservations')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reservationId);

      if (error) throw error;
      
      // Update local state
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: newStatus as ChargerReservation['status'] }
            : reservation
        )
      );
      
      toast({
        title: "Status Updated",
        description: "Charger reservation status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to update charger reservation status",
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

  const handleDeleteReservation = async (reservationId: string) => {
    if (!confirm('Are you sure you want to delete this charger reservation?')) return;
    
    try {
      const { error } = await supabase
        .from('charger_reservations')
        .delete()
        .eq('id', reservationId);

      if (error) throw error;
      
      setReservations(prev => prev.filter(r => r.id !== reservationId));
      toast({
        title: "Success",
        description: "Charger reservation deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast({
        title: "Error",
        description: "Failed to delete charger reservation",
        variant: "destructive",
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
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-white min-h-screen">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading charger reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-white min-h-screen">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Charger Reservation Management</h2>
          <Button onClick={loadReservations} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {reservations.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No charger reservations found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="relative bg-white border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center text-gray-900">
                      <Zap className="h-5 w-5 mr-2 text-emerald-600" />
                      {reservation.customer_name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(reservation.status)} text-white border-0`}>
                        {reservation.status}
                      </Badge>
                      <Button
                        onClick={() => handleDeleteReservation(reservation.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span>{new Date(reservation.reservation_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span>{reservation.start_time} - {reservation.end_time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="text-xs">{reservation.customer_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-xs">{reservation.customer_email}</span>
                    </div>
                  </div>

                  {reservation.charging_stations && (
                    <div className="text-sm">
                      <span className="text-gray-600">Station:</span>
                      <p className="font-semibold text-gray-900">
                        {reservation.charging_stations.station_id} - {reservation.charging_stations.type} ({reservation.charging_stations.power})
                      </p>
                    </div>
                  )}

                  {reservation.special_requests && (
                    <div className="text-sm">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-600 mt-0.5" />
                        <p className="text-xs text-gray-600">{reservation.special_requests}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Update Status:
                      </label>
                      <Select
                        value={reservation.status || 'pending'}
                        onValueChange={(value) => handleStatusUpdate(reservation.id, value)}
                        disabled={updatingReservations.has(reservation.id)}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingReservations.has(reservation.id) && (
                        <p className="text-xs text-gray-500 mt-1">Updating...</p>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Created: {new Date(reservation.created_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChargerReservationManager;