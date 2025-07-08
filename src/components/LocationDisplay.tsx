import { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { getBusinessSettings } from '@/services/businessSettingsService';

interface LocationInfo {
  latitude: string;
  longitude: string;
  locationName: string;
}

const LocationDisplay = () => {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationInfo();
  }, []);

  const loadLocationInfo = async () => {
    try {
      const settings = await getBusinessSettings();
      const latitude = settings.business_latitude || '27.7172';
      const longitude = settings.business_longitude || '85.3240';
      const locationName = settings.business_location_name || settings.business_address || 'Kathmandu, Nepal';

      setLocation({
        latitude,
        longitude,
        locationName
      });
    } catch (error) {
      console.error('Error loading location info:', error);
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  const openDirections = () => {
    if (location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (loading || !location) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
        <button
          onClick={openDirections}
        >
          Drive to Energy Palce
        </button>
  );
};

export default LocationDisplay;
