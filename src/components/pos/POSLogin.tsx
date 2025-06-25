import React, { useState } from 'react';
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
            email: credentials.email, // <-- Added this line
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
      <div className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        {/* ...rest of your JSX */}
      </div>
    </div>
  );
};

export default POSLogin;
