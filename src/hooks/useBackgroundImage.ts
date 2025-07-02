import { useState, useEffect } from 'react';
import { getBusinessSettings } from '@/services/businessSettingsService';

export const useBackgroundImage = () => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>();

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const settings = await getBusinessSettings();
        setBackgroundImageUrl(settings.background_image_url);
      } catch (error) {
        console.error('Error loading background image:', error);
      }
    };

    loadBackgroundImage();
  }, []);

  return backgroundImageUrl;
};