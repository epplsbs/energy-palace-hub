
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Lock, Loader2 } from 'lucide-react';

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
      console.log('Attempting to sign in with:', credentials.email);
      
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('Auth successful:', authData.user);

      // Get POS user profile
      const { data: posUser, error: posError } = await supabase
        .from('pos_users')
        .select('*')
        .eq('auth_user_id', authData.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (posError) {
        console.error('POS user query error:', posError);
        throw posError;
      }

      if (!posUser) {
        console.log('No POS user found, creating one...');
        // Create POS user if doesn't exist
        const { data: newPosUser, error: createError } = await supabase
          .from('pos_users')
          .insert({
            auth_user_id: authData.user.id,
            full_name: 'Sujan Nepal',
            username: credentials.email,
            role: 'admin',
            is_active: true
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating POS user:', createError);
          throw createError;
        }

        console.log('POS user created:', newPosUser);
        toast({
          title: "Login Successful",
          description: `Welcome, ${newPosUser.full_name}! POS user created.`,
        });

        onLogin({ ...authData.user, posUser: newPosUser });
      } else {
        console.log('POS user found:', posUser);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${posUser.full_name}!`,
        });

        onLogin({ ...authData.user, posUser });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]"></div>
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Energy Palace POS
          </CardTitle>
          <p className="text-gray-300 mt-2">Sign in to access the system</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-400/20">
            <p className="text-sm text-blue-200 font-medium">Default Credentials:</p>
            <p className="text-xs text-blue-300 mt-1">Email: sujan1nepal@gmail.com</p>
            <p className="text-xs text-blue-300">Password: password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POSLogin;
