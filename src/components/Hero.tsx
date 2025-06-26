
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, Car, Coffee, Leaf } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-futuristic">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-sm text-white/80 mb-6">
              <Leaf className="h-4 w-4 text-emerald-400" />
              <span>Sustainable Future Starts Here</span>
            </div>
            
            <h1 className="text-responsive-3xl font-black text-white leading-tight">
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Energy Palace
              </span>
              <span className="block text-white/90 text-3xl md:text-4xl lg:text-5xl mt-2">
                Premium EV Charging & Dining
              </span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Experience the future of sustainable mobility with our cutting-edge charging stations 
              and exceptional dining experience.
            </p>
          </div>

          {/* Feature Icons */}
          <div className="flex justify-center gap-8 my-12">
            <div className="flex flex-col items-center gap-2 text-white/80">
              <div className="p-3 rounded-xl glass border border-emerald-500/30 neon-glow-green">
                <Zap className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-sm font-medium">Fast Charging</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-white/80">
              <div className="p-3 rounded-xl glass border border-blue-500/30 neon-glow">
                <Car className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-sm font-medium">All EV Types</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-white/80">
              <div className="p-3 rounded-xl glass border border-purple-500/30">
                <Coffee className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-sm font-medium">Premium Dining</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:scale-105 transition-all duration-300 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-emerald-500/25 group"
            >
              <span>Start Charging Now</span>
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Explore Menu
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">12+</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Charging Stations</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Available</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">150kW</div>
              <div className="text-white/60 text-sm uppercase tracking-wider">Max Power</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
