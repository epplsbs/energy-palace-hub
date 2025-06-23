
import { ArrowDown, Zap, Car, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToCharging = () => {
    const element = document.querySelector('#charging');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Zap className="h-4 w-4 text-emerald-400 mr-2" />
            <span className="text-white/90 text-sm font-medium">Premium EV Charging & Dining Experience</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Energy Palace
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Where sustainable energy meets exceptional hospitality. Charge your EV while enjoying premium dining 
          in our state-of-the-art facility.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <Zap className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">140KW</h3>
            <p className="text-white/70">Total Charging Power</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <Car className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">4</h3>
            <p className="text-white/70">Charging Stations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">50+</h3>
            <p className="text-white/70">Dining Seats</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={scrollToCharging}
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white border-0 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
          >
            Start Charging
          </Button>
          <Button
            onClick={() => document.querySelector('#restaurant')?.scrollIntoView({ behavior: 'smooth' })}
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
          >
            View Menu
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <button
            onClick={scrollToCharging}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ArrowDown className="h-6 w-6 mx-auto" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
