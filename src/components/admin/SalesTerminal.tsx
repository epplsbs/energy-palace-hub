import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getChargingStations, type ChargingStation } from '@/services/contentService';
import { logPosChargingTransaction, type PosChargingTransactionData } from '@/services/chargingService'; // Correctly import service

// This interface is for the form's state
interface SalesTerminalFormData {
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  vehicle_number?: string;
  start_percentage?: number;
  end_percentage?: number;
  per_percentage_rate?: number;
  kwh_consumed?: number;
  per_kwh_rate?: number;
  payment_mode?: string; // Made optional to allow placeholder
  total_amount?: number; // Made optional for initial state
  charging_station_id?: string;
}

const SalesTerminal = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
  const [formData, setFormData] = useState<SalesTerminalFormData>({ // Use SalesTerminalFormData
    payment_mode: '', // Default to empty for placeholder
    total_amount: 0,
    charging_station_id: '', // Default to empty for placeholder
  });

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stations = await getChargingStations();
        setChargingStations(stations.filter(s => s.status !== 'maintenance'));
      } catch (error) {
        console.error("Error fetching charging stations:", error);
        toast({ title: "Error", description: "Could not load charging stations.", variant: "destructive" });
      }
    };
    fetchStations();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value,
    }));
  };

  const handleSelectChange = (id: keyof SalesTerminalFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const calculateTotal = useCallback(() => {
    let amountByPercentage = 0;
    if (formData.start_percentage != null && formData.end_percentage != null && formData.per_percentage_rate != null && formData.end_percentage > formData.start_percentage) {
      amountByPercentage = (formData.end_percentage - formData.start_percentage) * formData.per_percentage_rate;
    }

    let amountByKwh = 0;
    if (formData.kwh_consumed != null && formData.per_kwh_rate != null) {
      amountByKwh = formData.kwh_consumed * formData.per_kwh_rate;
    }

    const total = amountByPercentage + amountByKwh;
    setFormData(prev => ({ ...prev, total_amount: parseFloat(total.toFixed(2)) }));
  }, [formData.start_percentage, formData.end_percentage, formData.per_percentage_rate, formData.kwh_consumed, formData.per_kwh_rate]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.charging_station_id) {
      toast({ title: "Error", description: "Please select a charging station.", variant: "destructive" });
      return;
    }
    if (formData.total_amount == null || formData.total_amount <= 0 || !formData.payment_mode) {
      toast({ title: "Error", description: "Calculated amount must be greater than zero and payment mode selected.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const transactionData: PosChargingTransactionData = {
        customer_name: formData.customer_name || 'Walk-in Customer',
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        vehicle_number: formData.vehicle_number,
        charging_station_id: formData.charging_station_id,
        total_amount: formData.total_amount,
        payment_mode: formData.payment_mode,
        details: {
            start_percentage: formData.start_percentage,
            end_percentage: formData.end_percentage,
            per_percentage_rate: formData.per_percentage_rate,
            kwh_consumed: formData.kwh_consumed,
            per_kwh_rate: formData.per_kwh_rate,
        }
      };

      const result = await logPosChargingTransaction(transactionData);

      toast({
        title: "Success",
        description: `Transaction recorded successfully. Order #${result.order_number}`,
      });
      // Reset form
      setFormData({
        payment_mode: '',
        total_amount: 0,
        customer_email: '',
        customer_name: '',
        customer_phone: '',
        vehicle_number: '',
        start_percentage: undefined,
        end_percentage: undefined,
        per_percentage_rate: undefined,
        kwh_consumed: undefined,
        per_kwh_rate: undefined,
        charging_station_id: '',
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record transaction.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Receipt className="h-6 w-6 text-emerald-600" />
        <h2 className="text-2xl font-bold">Sales Terminal - New Charging Transaction</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Log New Charging Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset className="border p-4 rounded-md">
              <legend className="text-sm font-medium px-1">Customer Information</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input id="customer_name" value={formData.customer_name || ''} onChange={handleInputChange} placeholder="e.g., Walk-in" />
                </div>
                <div>
                  <Label htmlFor="customer_phone">Customer Phone</Label>
                  <Input id="customer_phone" type="tel" value={formData.customer_phone || ''} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="customer_email">Customer Email (Optional)</Label>
                  <Input id="customer_email" type="email" value={formData.customer_email || ''} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="vehicle_number">Vehicle Number (Optional)</Label>
                  <Input id="vehicle_number" value={formData.vehicle_number || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="charging_station_id">Charging Station *</Label>
                  <Select
                    onValueChange={handleSelectChange('charging_station_id')}
                    value={formData.charging_station_id || ''}
                  >
                    <SelectTrigger id="charging_station_id">
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      {chargingStations.map(station => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.station_id} ({station.type} - {station.power}) - {station.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </fieldset>

            <fieldset className="border p-4 rounded-md">
              <legend className="text-sm font-medium px-1">Charging by Percentage</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="start_percentage">Start %</Label>
                  <Input id="start_percentage" type="number" min="0" max="100" step="0.1" value={formData.start_percentage || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="end_percentage">End %</Label>
                  <Input id="end_percentage" type="number" min="0" max="100" step="0.1" value={formData.end_percentage || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="per_percentage_rate">Rate per %</Label>
                  <Input id="per_percentage_rate" type="number" min="0" step="0.01" value={formData.per_percentage_rate || ''} onChange={handleInputChange} />
                </div>
              </div>
            </fieldset>

            <fieldset className="border p-4 rounded-md">
              <legend className="text-sm font-medium px-1">Charging by kWh (Energy)</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="kwh_consumed">kWh Consumed</Label>
                  <Input id="kwh_consumed" type="number" min="0" step="0.01" value={formData.kwh_consumed || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="per_kwh_rate">Rate per kWh</Label>
                  <Input id="per_kwh_rate" type="number" min="0" step="0.01" value={formData.per_kwh_rate || ''} onChange={handleInputChange} />
                </div>
              </div>
            </fieldset>

            <div>
              <Label htmlFor="payment_mode">Payment Mode *</Label>
              <Select onValueChange={handleSelectChange('payment_mode')} value={formData.payment_mode || ''}>
                <SelectTrigger id="payment_mode">
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Esewa">Esewa</SelectItem>
                  <SelectItem value="Fonepay">Fonepay</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="total_amount">Total Amount (NPR)</Label>
              <Input id="total_amount" type="number" value={formData.total_amount ?? '0'} readOnly className="bg-gray-100 dark:bg-gray-700 font-bold text-lg" />
            </div>

            <Button type="submit" className="w-full py-3 text-base" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Record Transaction'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTerminal;
