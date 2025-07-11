import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom'; // Not needed if login happens within POSLayout context

interface POSLoginPageProps {
  onLoginSuccess: () => void; // Callback to inform parent about successful login
}

const POSLoginPage: React.FC<POSLoginPageProps> = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  // const navigate = useNavigate(); // Not using navigate directly, POSLayout handles rerender
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Failed to login. Please check your credentials.');
      toast({
        title: 'Login Failed',
        description: signInError.message || 'Please check your credentials.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Login Successful',
        description: 'Welcome to the POS system!',
      });
      // setUser will be updated by onAuthStateChange in POSLayout, triggering a re-render
      // Call onLoginSuccess if needed for any immediate parent state changes, though auth listener should handle it.
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      // No navigation needed here, POSLayout will re-render due to user state change from auth listener
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-emerald-700">Energy Palace POS Login</CardTitle>
          <CardDescription>Please sign in to access the Point of Sale system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default POSLoginPage;
