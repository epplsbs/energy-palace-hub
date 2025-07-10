
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
  
  const { data, error } = await supabase
    .from('pos_charging_orders')
    .insert({
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

// For SalesTerminal: logging a completed on-site transaction
export interface PosChargingTransactionData {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  vehicle_number?: string;
  charging_station_id: string; // Should be mandatory
  total_amount: number;
  payment_mode: string;
  details?: { // To store calculation inputs like start_%, end_%, kwh_consumed etc.
    start_percentage?: number;
    end_percentage?: number;
    per_percentage_rate?: number;
    kwh_consumed?: number;
    per_kwh_rate?: number;
  };
  // order_number will be generated
  // start_time, end_time, status, payment_status will be set by the function
}

export const logPosChargingTransaction = async (transaction: PosChargingTransactionData): Promise<any> => { // Consider defining a return type
  const orderNumber = `CHG-${Date.now().toString().slice(-6)}`;
  const currentTime = new Date().toISOString();

  const { data, error } = await supabase
    .from('pos_charging_orders')
    .insert([{
      order_number: orderNumber,
      customer_name: transaction.customer_name || 'Walk-in Customer',
      customer_phone: transaction.customer_phone,
      customer_email: transaction.customer_email,
      vehicle_number: transaction.vehicle_number,
      charging_station_id: transaction.charging_station_id,
      start_time: currentTime, // For a POS transaction, start and end might be the same
      end_time: currentTime,
      status: 'completed',
      payment_status: 'paid',
      total_amount: transaction.total_amount,
      payment_mode: transaction.payment_mode,
      details: transaction.details, // Store calculation inputs
      // Ensure your table has a 'details' column of type JSONB or similar
      // Or map transaction.details fields to individual columns if they exist
    }])
    .select()
    .single();

  if (error) {
    console.error('Error logging POS charging transaction:', error);
    throw error;
  }
  console.log('POS Charging transaction logged successfully:', data);
  return data;
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
