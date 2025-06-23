
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const ReservationManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reservation Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Table Reservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Reservation management interface coming soon. Customer reservations are 
            being saved to your Supabase database when submitted through the website.
          </p>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Current Features:</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Reservations saved to Supabase database</li>
              <li>• Customer information captured</li>
              <li>• Email notifications ready for setup</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationManager;
