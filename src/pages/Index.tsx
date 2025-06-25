
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ChargingStations from '../components/ChargingStations';
import Restaurant from '../components/Restaurant';
import Gallery from '../components/Gallery';
import Reservations from '../components/Reservations';
import Footer from '../components/Footer';
import { googleSheetsService } from '../services/googleSheetsService';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const loadInitialData = async () => {
      try {
        // Here you would load initial data from Google Sheets
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Energy Palace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ChargingStations />
        <Restaurant />
        <Gallery />
        <Reservations />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
