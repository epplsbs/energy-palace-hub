
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Car, Coffee, ChevronRight, Phone, Mail, MapPin, Clock } from 'lucide-react';
import ChargingModal from '@/components/modals/ChargingModal';
import MenuModal from '@/components/modals/MenuModal';
import ReservationModal from '@/components/modals/ReservationModal';

const Index = () => {
  const [isChargingModalOpen, setIsChargingModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-futuristic relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Header */}
      <header className="relative z-20 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Energy Palace
              </h1>
              <p className="text-sm text-white/60">Premium EV Charging & Dining</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-white/80">
            <a href="/blog" className="hover:text-emerald-400 transition-colors">Blog</a>
            <a href="/pos" className="hover:text-emerald-400 transition-colors">POS Login</a>
            <a href="/admin" className="hover:text-emerald-400 transition-colors">Admin</a>
          </div>
        </nav>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-white/20 text-white/80 mb-8">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>Live Charging Status Available</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Charge
              </span>
              <span className="block text-white/90">
                Your Future
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of EV charging with premium dining and hospitality services.
            </p>
          </div>

          {/* Main CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Book Charger */}
            <div className="glass rounded-2xl p-8 border border-white/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 neon-glow-green group-hover:scale-110 transition-transform">
                  <Zap className="h-12 w-12 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Book Charger</h3>
                <p className="text-white/60 text-center">Reserve your charging station and get real-time updates</p>
                <Button 
                  onClick={() => setIsChargingModalOpen(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                >
                  <span>Book Now</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Menu */}
            <div className="glass rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 neon-glow group-hover:scale-110 transition-transform">
                  <Coffee className="h-12 w-12 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Menu</h3>
                <p className="text-white/60 text-center">Explore our premium dining options while you charge</p>
                <Button 
                  onClick={() => setIsMenuModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  <span>View Menu</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Reserve Now */}
            <div className="glass rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 group-hover:scale-110 transition-transform">
                  <Car className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Reserve Now</h3>
                <p className="text-white/60 text-center">Book your table for the ultimate dining experience</p>
                <Button 
                  onClick={() => setIsReservationModalOpen(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  <span>Reserve Table</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-emerald-400">12+</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Charging Ports</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-blue-400">150kW</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Max Power</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-purple-400">24/7</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Available</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-yellow-400">~30min</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Fast Charging</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Energy Palace
                </span>
              </div>
              <p className="text-white/60">
                Nepal's premier EV charging destination with luxury dining experience.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Contact Info</h4>
              <div className="space-y-2 text-white/60">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+977-1-4567890</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@energypalace.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Kathmandu, Nepal</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Operating Hours</h4>
              <div className="flex items-center space-x-2 text-white/60">
                <Clock className="h-4 w-4" />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40">
            <p>&copy; 2024 Energy Palace. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ChargingModal 
        isOpen={isChargingModalOpen} 
        onClose={() => setIsChargingModalOpen(false)} 
      />
      <MenuModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
      />
      <ReservationModal 
        isOpen={isIsReservationModalOpen} 
        onClose={() => setIsReservationModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
