
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type PosUser = Tables<'pos_users'>;
export type PosMenuCategory = Tables<'pos_menu_categories'>;
export type PosMenuItem = Tables<'pos_menu_items'>;
export type PosOrder = Tables<'pos_orders'>;
export type PosOrderItem = Tables<'pos_order_items'>;
export type PosExpense = Tables<'pos_expenses'>;
export type PosDeposit = Tables<'pos_deposits'>;
export type PosChargingOrder = Tables<'pos_charging_orders'>;
export type PosSetting = Tables<'pos_settings'>;

// POS Users Management
export const getPosUsers = async () => {
  const { data, error } = await supabase
    .from('pos_users')
    .select('*')
    .order('created_at');
  
  if (error) throw error;
  return data;
};

export const createPosUser = async (user: Omit<PosUser, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('pos_users')
    .insert(user)
    .select();
  
  if (error) throw error;
  return data;
};

export const updatePosUser = async (id: string, updates: Partial<PosUser>) => {
  const { data, error } = await supabase
    .from('pos_users')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

export const deletePosUser = async (id: string) => {
  const { data, error } = await supabase
    .from('pos_users')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return data;
};

// POS Menu Management
export const getPosMenuCategories = async () => {
  const { data, error } = await supabase
    .from('pos_menu_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  if (error) throw error;
  return data;
};

export const createPosMenuCategory = async (category: Omit<PosMenuCategory, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('pos_menu_categories')
    .insert(category)
    .select();
  
  if (error) throw error;
  return data;
};

export const getPosMenuItems = async () => {
  const { data, error } = await supabase
    .from('pos_menu_items')
    .select(`
      *,
      pos_menu_categories(name, type)
    `)
    .eq('is_available', true)
    .order('display_order');
  
  if (error) throw error;
  return data;
};

export const createPosMenuItem = async (item: Omit<PosMenuItem, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('pos_menu_items')
    .insert(item)
    .select();
  
  if (error) throw error;
  return data;
};

// POS Orders Management
export const getPosOrders = async (dateRange?: { start: string; end: string }) => {
  let query = supabase
    .from('pos_orders')
    .select(`
      *,
      pos_order_items(*),
      cashier:pos_users!pos_orders_cashier_id_fkey(full_name),
      waiter:pos_users!pos_orders_waiter_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false });

  if (dateRange) {
    query = query
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const createPosOrder = async (order: Omit<PosOrder, 'id' | 'created_at' | 'order_number' | 'completed_at'>) => {
  const { data, error } = await supabase
    .from('pos_orders')
    .insert({
      ...order,
      waiter_id: order.waiter_id || null,
      discount_amount: order.discount_amount || 0,
      completed_at: null
    })
    .select();
  
  if (error) throw error;
  return data;
};

export const updatePosOrder = async (id: string, updates: Partial<PosOrder>) => {
  const { data, error } = await supabase
    .from('pos_orders')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
};

// POS Order Items
export const createPosOrderItems = async (items: Omit<PosOrderItem, 'id' | 'created_at'>[]) => {
  const itemsWithNotes = items.map(item => ({
    ...item,
    notes: item.notes || null
  }));

  const { data, error } = await supabase
    .from('pos_order_items')
    .insert(itemsWithNotes)
    .select();
  
  if (error) throw error;
  return data;
};

// Expenses Management
export const getPosExpenses = async (dateRange?: { start: string; end: string }) => {
  let query = supabase
    .from('pos_expenses')
    .select(`
      *,
      creator:pos_users!pos_expenses_created_by_fkey(full_name)
    `)
    .order('expense_date', { ascending: false });

  if (dateRange) {
    query = query
      .gte('expense_date', dateRange.start)
      .lte('expense_date', dateRange.end);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const createPosExpense = async (expense: Omit<PosExpense, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('pos_expenses')
    .insert(expense)
    .select();
  
  if (error) throw error;
  return data;
};

// Deposits Management
export const getPosDeposits = async (dateRange?: { start: string; end: string }) => {
  let query = supabase
    .from('pos_deposits')
    .select(`
      *,
      depositor:pos_users!pos_deposits_deposited_by_fkey(full_name)
    `)
    .order('deposit_date', { ascending: false });

  if (dateRange) {
    query = query
      .gte('deposit_date', dateRange.start)
      .lte('deposit_date', dateRange.end);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const createPosDeposit = async (deposit: Omit<PosDeposit, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('pos_deposits')
    .insert(deposit)
    .select();
  
  if (error) throw error;
  return data;
};

// Charging Orders Management
export const getPosChargingOrders = async (dateRange?: { start: string; end: string }) => {
  let query = supabase
    .from('pos_charging_orders')
    .select(`
      *,
      charging_stations(station_id, type, power),
      creator:pos_users!pos_charging_orders_created_by_fkey(full_name)
    `)
    .order('created_at', { ascending: false });

  if (dateRange) {
    query = query
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
};

export const createPosChargingOrder = async (order: Omit<PosChargingOrder, 'id' | 'created_at' | 'order_number'>) => {
  const { data, error } = await supabase
    .from('pos_charging_orders')
    .insert(order)
    .select();
  
  if (error) throw error;
  return data;
};

// Settings Management
export const getPosSettings = async () => {
  const { data, error } = await supabase
    .from('pos_settings')
    .select('*')
    .order('setting_key');
  
  if (error) throw error;
  return data;
};

export const updatePosSetting = async (key: string, value: string) => {
  const { data, error } = await supabase
    .from('pos_settings')
    .update({ setting_value: value, updated_at: new Date().toISOString() })
    .eq('setting_key', key)
    .select();
  
  if (error) throw error;
  return data;
};

// Dashboard Analytics
export const getDashboardStats = async (dateRange?: { start: string; end: string }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Get orders stats
  let ordersQuery = supabase
    .from('pos_orders')
    .select('total_amount, payment_status, created_at')
    .eq('payment_status', 'paid');

  if (dateRange) {
    ordersQuery = ordersQuery
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);
  } else {
    ordersQuery = ordersQuery.gte('created_at', today);
  }

  const { data: orders, error: ordersError } = await ordersQuery;
  if (ordersError) throw ordersError;

  // Get expenses stats
  let expensesQuery = supabase
    .from('pos_expenses')
    .select('amount, expense_date');

  if (dateRange) {
    expensesQuery = expensesQuery
      .gte('expense_date', dateRange.start)
      .lte('expense_date', dateRange.end);
  } else {
    expensesQuery = expensesQuery.eq('expense_date', today);
  }

  const { data: expenses, error: expensesError } = await expensesQuery;
  if (expensesError) throw expensesError;

  // Get charging orders stats
  let chargingQuery = supabase
    .from('pos_charging_orders')
    .select('total_amount, payment_status, created_at')
    .eq('payment_status', 'paid');

  if (dateRange) {
    chargingQuery = chargingQuery
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);
  } else {
    chargingQuery = chargingQuery.gte('created_at', today);
  }

  const { data: chargingOrders, error: chargingError } = await chargingQuery;
  if (chargingError) throw chargingError;

  const totalRevenue = [...orders, ...chargingOrders].reduce((sum, order) => sum + Number(order.total_amount), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const profit = totalRevenue - totalExpenses;

  return {
    totalRevenue,
    totalExpenses,
    profit,
    ordersCount: orders.length,
    chargingOrdersCount: chargingOrders.length,
    expensesCount: expenses.length
  };
};
