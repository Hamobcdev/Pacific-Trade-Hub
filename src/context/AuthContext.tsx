import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id?: string;
  email: string;
  kycStatus: boolean;
  country: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  fetchUserProfile: () => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  fetchUserProfile: async () => null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Initial Session:', session, 'Error:', error);
      if (error || !session?.user) {
        console.error('Session fetch error:', error);
        setUser(null);
        return;
      }
      const profile = await fetchUserProfile(session.user.email);
      console.log('Initial Profile:', profile);
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        kycStatus: profile?.kycStatus ?? false,
        country: profile?.country ?? '',
        walletAddress: profile?.walletAddress ?? '0x316100662368a392dC79C43AF4Adad0DFb3d74ef',
      });
    };

    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event: string, session: { user: any } | null) => {
        console.log('Auth state changed:', _event, session);
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.email);
          console.log('Updated Profile:', profile);
          setUser({
            id: session.user.id,
            email: session.user.email,
            kycStatus: profile?.kycStatus ?? false,
            country: profile?.country ?? '',
            walletAddress: profile?.walletAddress ?? '0x316100662368a392dC79C43AF4Adad0DFb3d74ef',
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (email?: string): Promise<UserProfile | null> => {
    const targetEmail = email || user?.email;
    if (!targetEmail) {
      console.log('No email to fetch profile for');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('email, kyc_status, country')
      .eq('email', targetEmail)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return null;
    }

    if (data) {
      return {
        email: data.email,
        kycStatus: data.kyc_status,
        country: data.country || '',
        walletAddress: '0x316100662368a392dC79C43AF4Adad0DFb3d74ef',
      };
    }
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, fetchUserProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);