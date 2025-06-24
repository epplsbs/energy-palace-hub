
import { ArrowDown, Zap, Car, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import MenuModal from './modals/MenuModal';
import ChargingStatusModal from './modals/ChargingStatusModal';
import ReservationModal from './modals/ReservationModal';

const Hero = () => {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isChargingModalOpen, setIsChargingModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const scrollToCharging = () => {
    const element = document.querySelector('#charging');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Brighter Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
          <div className="absolute inset-0 bg-white/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100/80 backdrop-blur-sm rounded-full border border-emerald-200 mb-6">
              <Zap className="h-4 w-4 text-emerald-600 mr-2" />
              <span className="text-emerald-800 text-sm font-medium">Premium EV Charging & Dining Experience</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Energy Palace
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Where sustainable energy meets exceptional hospitality. Charge your EV while enjoying premium dining 
            in our state-of-the-art facility.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <div className="flex items-center justify-center mb-3">
                <Zap className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">140KW</h3>
              <p className="text-gray-600">Total Charging Power</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <div className="flex items-center justify-center mb-3">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">4</h3>
              <p className="text-gray-600">Charging Stations</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">50+</h3>
              <p className="text-gray-600">Dining Seats</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => setIsMenuModalOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white border-0 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              View Menu
            </Button>
            <Button
              onClick={() => setIsChargingModalOpen(true)}
              variant="outline"
              size="lg"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Charging Status
            </Button>
            <Button
              onClick={() => setIsReservationModalOpen(true)}
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Make Reservation
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <button
              onClick={scrollToCharging}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowDown className="h-6 w-6 mx-auto" />
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <MenuModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
      />
      <ChargingStatusModal 
        isOpen={isChargingModalOpen} 
        onClose={() => setIsChargingModalOpen(false)} 
      />
      <ReservationModal 
        isOpen={isReservationModalOpen} 
        onClose={() => setIsReservationModalOpen(false)} 
      />
    </>
  );
};

export default Hero;
