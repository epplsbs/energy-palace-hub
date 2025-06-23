
interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
}

interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  prepTime: string;
  available: boolean;
}

interface ChargingStationData {
  id: string;
  type: string;
  power: string;
  status: 'available' | 'occupied' | 'maintenance';
  connector: string;
  estimatedTime?: string;
}

interface OrderData {
  timestamp: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
}

interface ReservationData {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  occasion?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface GalleryItemData {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  author: string;
  content?: string;
}

interface EmployeeData {
  id: string;
  name: string;
  designation: string;
  image: string;
  bio: string;
  specialties: string[];
}

class GoogleSheetsService {
  private config: GoogleSheetsConfig | null = null;

  // Initialize the service with API credentials
  init(config: GoogleSheetsConfig) {
    this.config = config;
  }

  // Check if service is initialized
  private isInitialized(): boolean {
    return this.config !== null;
  }

  // Generic method to fetch data from a specific sheet
  private async fetchSheetData(sheetName: string): Promise<any[]> {
    if (!this.isInitialized()) {
      console.warn('Google Sheets service not initialized');
      return [];
    }

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.config!.spreadsheetId}/values/${sheetName}?key=${this.config!.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error(`Error fetching data from ${sheetName}:`, error);
      return [];
    }
  }

  // Generic method to append data to a specific sheet
  private async appendToSheet(sheetName: string, values: any[]): Promise<boolean> {
    if (!this.isInitialized()) {
      console.warn('Google Sheets service not initialized');
      return false;
    }

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.config!.spreadsheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED&key=${this.config!.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [values]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Error appending data to ${sheetName}:`, error);
      return false;
    }
  }

  // Menu Items Management
  async getMenuItems(): Promise<MenuItemData[]> {
    const data = await this.fetchSheetData('MenuItems');
    if (data.length === 0) return [];

    // Skip header row and transform data
    return data.slice(1).map((row, index) => ({
      id: row[0] || `item-${index}`,
      name: row[1] || '',
      description: row[2] || '',
      price: parseFloat(row[3]) || 0,
      category: row[4] || 'food',
      image: row[5] || '',
      rating: parseFloat(row[6]) || 0,
      prepTime: row[7] || '10 min',
      available: row[8]?.toLowerCase() === 'true'
    }));
  }

  async addMenuItem(item: Omit<MenuItemData, 'id'>): Promise<boolean> {
    const values = [
      Date.now().toString(), // Generate ID
      item.name,
      item.description,
      item.price,
      item.category,
      item.image,
      item.rating,
      item.prepTime,
      item.available
    ];
    return this.appendToSheet('MenuItems', values);
  }

  // Charging Stations Management
  async getChargingStations(): Promise<ChargingStationData[]> {
    const data = await this.fetchSheetData('ChargingStations');
    if (data.length === 0) return [];

    return data.slice(1).map(row => ({
      id: row[0] || '',
      type: row[1] || '',
      power: row[2] || '',
      status: row[3] as 'available' | 'occupied' | 'maintenance' || 'available',
      connector: row[4] || '',
      estimatedTime: row[5] || undefined
    }));
  }

  async updateChargingStationStatus(stationId: string, status: string, estimatedTime?: string): Promise<boolean> {
    // In a real implementation, you would use the Google Sheets API to update specific cells
    // For now, we'll log the update
    console.log(`Updating station ${stationId} status to ${status}`, { estimatedTime });
    return true;
  }

  // Orders Management
  async submitOrder(order: OrderData): Promise<boolean> {
    const values = [
      order.timestamp,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      JSON.stringify(order.items),
      order.total,
      order.notes || '',
      order.status
    ];
    return this.appendToSheet('Orders', values);
  }

  async getOrders(): Promise<OrderData[]> {
    const data = await this.fetchSheetData('Orders');
    if (data.length === 0) return [];

    return data.slice(1).map(row => ({
      timestamp: row[0] || '',
      customerName: row[1] || '',
      customerEmail: row[2] || '',
      customerPhone: row[3] || '',
      items: JSON.parse(row[4] || '[]'),
      total: parseFloat(row[5]) || 0,
      notes: row[6] || '',
      status: row[7] as 'pending' | 'preparing' | 'ready' | 'completed' || 'pending'
    }));
  }

  // Reservations Management
  async submitReservation(reservation: ReservationData): Promise<boolean> {
    const values = [
      reservation.timestamp,
      reservation.name,
      reservation.email,
      reservation.phone,
      reservation.date,
      reservation.time,
      reservation.guests,
      reservation.occasion || '',
      reservation.specialRequests || '',
      reservation.status
    ];
    return this.appendToSheet('Reservations', values);
  }

  async getReservations(): Promise<ReservationData[]> {
    const data = await this.fetchSheetData('Reservations');
    if (data.length === 0) return [];

    return data.slice(1).map(row => ({
      timestamp: row[0] || '',
      name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      date: row[4] || '',
      time: row[5] || '',
      guests: row[6] || '',
      occasion: row[7] || '',
      specialRequests: row[8] || '',
      status: row[9] as 'pending' | 'confirmed' | 'cancelled' || 'pending'
    }));
  }

  // Gallery Management
  async getGalleryItems(): Promise<GalleryItemData[]> {
    const data = await this.fetchSheetData('Gallery');
    if (data.length === 0) return [];

    return data.slice(1).map((row, index) => ({
      id: row[0] || `gallery-${index}`,
      title: row[1] || '',
      description: row[2] || '',
      image: row[3] || '',
      category: row[4] || 'facility',
      date: row[5] || '',
      author: row[6] || '',
      content: row[7] || ''
    }));
  }

  async addGalleryItem(item: Omit<GalleryItemData, 'id'>): Promise<boolean> {
    const values = [
      Date.now().toString(),
      item.title,
      item.description,
      item.image,
      item.category,
      item.date,
      item.author,
      item.content || ''
    ];
    return this.appendToSheet('Gallery', values);
  }

  // Employee Management
  async getEmployees(): Promise<EmployeeData[]> {
    const data = await this.fetchSheetData('Employees');
    if (data.length === 0) return [];

    return data.slice(1).map((row, index) => ({
      id: row[0] || `employee-${index}`,
      name: row[1] || '',
      designation: row[2] || '',
      image: row[3] || '',
      bio: row[4] || '',
      specialties: row[5] ? row[5].split(',').map((s: string) => s.trim()) : []
    }));
  }

  async addEmployee(employee: Omit<EmployeeData, 'id'>): Promise<boolean> {
    const values = [
      Date.now().toString(),
      employee.name,
      employee.designation,
      employee.image,
      employee.bio,
      employee.specialties.join(', ')
    ];
    return this.appendToSheet('Employees', values);
  }
}

// Create and export a singleton instance
export const googleSheetsService = new GoogleSheetsService();

// Export types for use in components
export type {
  MenuItemData,
  ChargingStationData,
  OrderData,
  ReservationData,
  GalleryItemData,
  EmployeeData
};
