import React, { useEffect, useRef } from 'react';

interface GoogleMapEmbedProps {
  apiKey: string;
  lat: number;
  lng: number;
  zoom?: number;
  mapId?: string; // For advanced map styling if needed
  businessName?: string;
  businessAddress?: string;
  businessLogoUrl?: string; // URL for a small logo in the infowindow
}

const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  apiKey,
  lat,
  lng,
  zoom = 15,
  mapId,
  businessName = "Energy Palace",
  businessAddress = "Bhiman, Sindhuli, Bagmati, Nepal",
  businessLogoUrl = "https://energypalace.com.np/logo.png" // Placeholder - User should update
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const isMapLoaded = useRef(false); // To prevent multiple script loads / map initializations
  const scriptAdded = useRef(false); // To track if script has been appended

  useEffect(() => {
    const GOOGLE_MAPS_API_KEY = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API Key is missing. Please provide it via props or VITE_GOOGLE_MAPS_API_KEY environment variable.");
      if (mapRef.current) {
        mapRef.current.innerHTML = '<p style="text-align:center; padding: 20px;">Map could not be loaded. API Key missing.</p>';
      }
      return;
    }

    // Define initMap within useEffect or ensure it's stable if defined outside
    const initMap = () => {
      if (window.google && window.google.maps && mapRef.current && !isMapLoaded.current) {
        const mapOptions: google.maps.MapOptions = {
          center: { lat, lng },
          zoom,
          mapId,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: businessName,
        });

        const infoWindowContent = `
          <div style="padding: 5px; max-width: 250px;">
            ${businessLogoUrl ? `<img src="${businessLogoUrl}" alt="${businessName} Logo" style="width: 50px; height: auto; margin-bottom: 5px; border-radius: 4px;">` : ''}
            <h6 style="margin: 0 0 5px 0; font-weight: bold; font-size: 1.1em;">${businessName}</h6>
            <p style="margin: 0; font-size: 0.9em;">${businessAddress}</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}"
              target="_blank"
              rel="noopener noreferrer"
              style="color: #1a73e8; text-decoration: none; font-size: 0.9em; margin-top: 5px; display: inline-block;"
            >
              View on Google Maps
            </a>
          </div>
        `;

        const infowindow = new window.google.maps.InfoWindow({
          content: infoWindowContent,
        });

        marker.addListener('click', () => {
          infowindow.open(map, marker);
        });

        isMapLoaded.current = true;
      } else if (!mapRef.current) {
        console.error("mapRef not available for initMap.");
      } else if (isMapLoaded.current) {
        // console.log("Map already initialized.");
      } else {
         console.error("Google Maps API not loaded for initMap.");
      }
    };

    // Make initMap globally accessible for the callback
    // Using a unique name to avoid conflicts if multiple maps are on the page
    const uniqueCallbackName = `initMapGlobal_${Math.random().toString(36).substr(2, 9)}`;
    (window as any)[uniqueCallbackName] = initMap;

    if (!scriptAdded.current) { // Only add script if not already added
      if (window.google && window.google.maps) {
        // If script is already loaded (e.g., by another instance or manually)
         if (!isMapLoaded.current) initMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=${uniqueCallbackName}`;
        script.async = true;
        script.defer = true;

        document.head.appendChild(script);
        scriptAdded.current = true; // Mark script as added

        script.onerror = () => {
          console.error("Google Maps script could not be loaded.");
           if (mapRef.current) {
            mapRef.current.innerHTML = '<p style="text-align:center; padding: 20px;">Error loading Google Maps.</p>';
          }
        };
      }
    } else if (window.google && window.google.maps && !isMapLoaded.current) {
        // If script was added by this component but map not yet initialized (e.g. fast re-render)
        initMap();
    }

    // Cleanup function
    return () => {
      // Remove the global callback, but be cautious about removing the script
      // if other map instances might need it.
      delete (window as any)[uniqueCallbackName];
      // If this component is the sole manager of this script, you might consider removing it:
      // const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
      // if (existingScript) document.head.removeChild(existingScript);
      // isMapLoaded.current = false; // Reset if map should re-init on next mount
      // scriptAdded.current = false; // Reset if script should be re-added
    };
  }, [apiKey, lat, lng, zoom, mapId, businessName, businessAddress, businessLogoUrl]);

  const mapGlobalStyles = `
    #gmap_canvas img {
      max-width: none !important;
      background: none !important;
    }
  `;

  return (
    <>
      <style>{mapGlobalStyles}</style>
      <div ref={mapRef} style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }} id="gmap_canvas_container">
        <noscript>
          <p style={{textAlign: 'center', padding: '20px'}}>Please enable JavaScript to view the map.</p>
        </noscript>
      </div>
    </>
  );
};

export default GoogleMapEmbed;
