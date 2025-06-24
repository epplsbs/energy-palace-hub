
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ChargingStations from '../components/ChargingStations';
import Restaurant from '../components/Restaurant';
import Gallery from '../components/Gallery';
import Reservations from '../components/Reservations';
import AboutUs from '../components/AboutUs';
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
        <AboutUs />
      </main>
      <Footer />
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7063.479037327993!2d85.33146879166031!3d27.72532770515686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1750752690610!5m2!1sen!2snp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  );
};

export default Index;
