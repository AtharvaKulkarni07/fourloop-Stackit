'use client';

import { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  
  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    image: session.user.image,
    role: session.user.role,
    reputation: session.user.reputation || 0
  } : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === 'loading',
        isAuthenticated: !!session
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}