
import { supabase } from '@/integrations/supabase/client';

export interface ChargingBooking {
  id?: string;
  customer_name: string;
  customer_phone: string;
  vehicle_number: string;
  charging_station_id: string;
  start_time: string;
  status: 'booked' | 'active' | 'completed' | 'cancelled';
  total_amount?: number;
  created_at?: string;
  order_number?: string;
}

export const createChargingBooking = async (booking: Omit<ChargingBooking, 'id' | 'created_at' | 'order_number'>): Promise<ChargingBooking> => {
  console.log('Creating charging booking:', booking);
  
  // Generate order number first
  const { data: orderNumberData, error: orderNumberError } = await supabase
    .rpc('generate_charging_order_number');
  
  if (orderNumberError) {
    console.error('Error generating order number:', orderNumberError);
    throw orderNumberError;
  }
  
  const { data, error } = await supabase
    .from('pos_charging_orders')
    .insert({
      order_number: orderNumberData,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      vehicle_number: booking.vehicle_number,
      charging_station_id: booking.charging_station_id,
      start_time: booking.start_time,
      status: booking.status,
      rate_per_unit: 15,
      total_amount: 0,
      payment_status: 'pending'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating charging booking:', error);
    throw error;
  }
  
  console.log('Charging booking created successfully:', data);
  
  // Update charging station status
  if (booking.charging_station_id) {
    await supabase
      .from('charging_stations')
      .update({ status: 'occupied' })
      .eq('id', booking.charging_station_id);
  }
  
  return {
    id: data.id,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone || '',
    vehicle_number: data.vehicle_number || '',
    charging_station_id: data.charging_station_id || '',
    start_time: data.start_time || '',
    status: data.status as 'booked' | 'active' | 'completed' | 'cancelled',
    total_amount: data.total_amount,
    created_at: data.created_at,
    order_number: data.order_number
  };
};

export const getAvailableChargingStations = async () => {
  console.log('Fetching available charging stations...');
  
  const { data, error } = await supabase
    .from('charging_stations')
    .select('*')
    .eq('status', 'available')
    .order('station_id');
  
  if (error) {
    console.error('Error fetching charging stations:', error);
    throw error;
  }
  
  console.log('Available charging stations:', data);
  return data || [];
};

export const getChargingBookings = async () => {
  console.log('Fetching charging bookings...');
  
  const { data, error } = await supabase
    .from('pos_charging_orders')
    .select(`
      *,
      charging_stations (
        station_id,
        type,
        power
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching charging bookings:', error);
    throw error;
  }
  
  console.log('Charging bookings:', data);
  return data || [];
};
