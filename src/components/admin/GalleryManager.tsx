
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';

const GalleryManager = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Image className="h-5 w-5 mr-2 text-purple-600" />
            Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Gallery management interface coming soon. Sample gallery items have been 
            loaded into your database and are displayed on your main website.
          </p>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Current Features:</h4>
            <ul className="text-purple-800 text-sm space-y-1">
              <li>• Gallery items loaded from Supabase database</li>
              <li>• Images displayed in order</li>
              <li>• Responsive gallery layout</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryManager;
