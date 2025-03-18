import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id?: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  country?: string;
  kycStatus?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  signInWithWallet: (address: string, signature: string, message: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
  signInWithWallet: async () => {},
});

// Export the hook explicitly
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        setIsLoading(false);
        return;
      }
      if (session) {
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata.name || 'Unknown',
          email: session.user.email || '',
          profilePicture: session.user.user_metadata.picture || '',
          country: 'Samoa',
          kycStatus: 'unverified',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userData.id)
          .single();

        if (!existingProfile) {
          const { error: insertError } = await supabase.from('profiles').insert({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            profile_picture: userData.profilePicture,
            country: userData.country,
            kyc_status: userData.kycStatus,
          });
          if (insertError) console.error('Insert error:', insertError);
        }

        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('country, kyc_status')
          .eq('id', userData.id)
          .single();
        if (fetchError) {
          console.error('Error fetching profile:', fetchError);
        } else if (profile) {
          setUser({ ...userData, country: profile.country, kycStatus: profile.kyc_status });
        }
      }
      setIsLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata.name || 'Unknown',
          email: session.user.email || '',
          profilePicture: session.user.user_metadata.picture || '',
          country: 'Samoa',
          kycStatus: 'unverified',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userData.id)
          .single();

        if (!existingProfile) {
          const { error: insertError } = await supabase.from('profiles').insert({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            profile_picture: userData.profilePicture,
            country: userData.country,
            kyc_status: userData.kycStatus,
          });
          if (insertError) console.error('Insert error:', insertError);
        }

        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('country, kyc_status')
          .eq('id', userData.id)
          .single();
        if (fetchError) {
          console.error('Error fetching profile:', fetchError);
        } else if (profile) {
          setUser({ ...userData, country: profile.country, kycStatus: profile.kyc_status });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  const signInWithWallet = async (address: string, signature: string, message: string) => {
    // Simulate signature verification (future: use ethers.js to verify)
    console.log('Verifying wallet login:', { address, signature, message }); // Use parameters to avoid warning

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', address)
      .single();

    if (error || !data) {
      await supabase.from('profiles').insert({
        id: address,
        name: `Wallet_${address.slice(0, 6)}`,
        email: `${address}@wallet.local`,
        profile_picture: '',
        country: 'Overseas',
        kyc_status: 'unverified',
      });
    }

    const userData = {
      id: address,
      name: `Wallet_${address.slice(0, 6)}`,
      email: `${address}@wallet.local`,
      profilePicture: '',
      country: 'Overseas',
      kycStatus: 'unverified',
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, signInWithWallet }}>
      {children}
    </AuthContext.Provider>
  );
};