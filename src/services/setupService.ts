import { supabase } from '@/integrations/supabase/client';

export const createPOSUser = async () => {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'sujan1nepal@gmail.com',
      password: 'password',
      email_confirm: true
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }

    console.log('Auth user created:', authData.user);

    // Then create the POS user record
    const { data: posData, error: posError } = await supabase
      .from('pos_users')
      .upsert({
        auth_user_id: authData.user.id,
        full_name: 'Sujan Nepal',
        username: 'sujan1nepal@gmail.com',
        email: 'sujan1nepal@gmail.com', // <-- Added this line
        role: 'admin',
        is_active: true
      }, {
        onConflict: 'auth_user_id'
      });

    if (posError) {
      console.error('Error creating POS user:', posError);
      throw posError;
    }

    console.log('POS user created:', posData);
    return { success: true, user: authData.user };

  } catch (error) {
    console.error('Error in createPOSUser:', error);
    return { success: false, error };
  }
};
