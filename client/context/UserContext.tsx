import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 'USER-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, San Francisco, CA 94102',
  joinDate: '2023-06-15',
  avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&h=150&fit=crop',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
