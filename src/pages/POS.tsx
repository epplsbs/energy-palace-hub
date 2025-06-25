
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import POSLogin from '@/components/pos/POSLogin';
import POSDashboard from '@/components/pos/POSDashboard';

const POS = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Check if user has POS access
        const { data: posUser } = await supabase
          .from('pos_users')
          .select('*')
          .eq('auth_user_id', authUser.id)
          .eq('is_active', true)
          .single();

        if (posUser) {
          setUser({ ...authUser, posUser });
        }
      }
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <POSLogin onLogin={handleLogin} />;
  }

  return <POSDashboard user={user} onSignOut={handleSignOut} />;
};

export default POS;
