
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Lock, Loader2, Zap } from 'lucide-react';

interface POSLoginProps {
  onLogin: (user: any) => void;
}

const POSLogin = ({ onLogin }: POSLoginProps) => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    email: 'sujan1nepal@gmail.com',
    password: 'password'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting POS login with:', credentials.email);
      
      // Check if POS user exists first
      const { data: posUser, error: posError } = await supabase
        .from('pos_users')
        .select('*')
        .eq('email', credentials.email)
        .eq('is_active', true)
        .single();

      if (posError || !posUser) {
        console.error('POS user not found:', posError);
        throw new Error('POS user not found. Please contact administrator.');
      }

      console.log('POS user found:', posUser);

      // For demo purposes, we'll simulate successful login
      // In production, you'd want proper password verification
      if (credentials.password === 'password') {
        const mockUser = {
          id: posUser.id,
          email: posUser.email,
          posUser: posUser
        };

        console.log('Login successful, calling onLogin with:', mockUser);
        onLogin(mockUser);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${posUser.full_name}!`,
        });
      } else {
        throw new Error('Invalid password');
      }

    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-futuristic flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass border border-white/20 shadow-2xl p-8 rounded-2xl backdrop-blur-xl">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                POS System
              </span>
            </h2>
            <p className="text-white/70">Access your point of sale dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 font-medium">Email Address</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl h-12"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to POS</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-white/60 text-center mb-2">Demo Credentials:</p>
            <div className="text-xs text-white/80 space-y-1">
              <div><strong>Email:</strong> sujan1nepal@gmail.com</div>
              <div><strong>Password:</strong> password</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSLogin;
