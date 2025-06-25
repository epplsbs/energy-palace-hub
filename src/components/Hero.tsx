
import { ArrowDown, Zap, Car, Users, Calendar, Sparkles } from 'lucide-react';
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
        {/* Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.1),transparent)]"></div>
        </div>

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="border border-cyan-500/10 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-full border border-cyan-400/30 mb-6 shadow-2xl">
              <Sparkles className="h-5 w-5 text-cyan-400 mr-3 animate-pulse" />
              <span className="text-cyan-100 font-semibold tracking-wide">Next-Gen EV Charging & Dining Experience</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
              Energy Palace
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
            Where sustainable energy meets exceptional hospitality. Experience the future of EV charging.
          </p>

          {/* Futuristic Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">140KW</h3>
                <p className="text-cyan-200 font-medium">Ultra-Fast Charging</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-emerald-400/50 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                    <Car className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">4</h3>
                <p className="text-emerald-200 font-medium">Smart Stations</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">50+</h3>
                <p className="text-purple-200 font-medium">Premium Dining</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => setIsMenuModalOpen(true)}
              size="lg"
              className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">Explore Menu</span>
            </Button>
            
            <Button
              onClick={() => setIsChargingModalOpen(true)}
              variant="outline"
              size="lg"
              className="border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-xl shadow-2xl"
            >
              Charging Status
            </Button>
            
            <Button
              onClick={() => setIsReservationModalOpen(true)}
              variant="outline"
              size="lg"
              className="border-2 border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-xl shadow-2xl"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Reserve Table
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <button
              onClick={scrollToCharging}
              className="text-cyan-400 hover:text-cyan-300 transition-colors p-3 rounded-full bg-white/5 backdrop-blur-xl border border-cyan-400/30 hover:border-cyan-400/50"
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
