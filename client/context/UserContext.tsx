import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LoginRecord {
  timestamp: string;
  email: string;
  device: string;
  ipInfo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate: string;
  bio?: string;
  website?: string;
}

export interface UserDatabase {
  users: { [email: string]: User };
  loginHistory: LoginRecord[];
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  loginHistory: LoginRecord[];
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  getAllUsers: () => User[];
  getLoginHistory: () => LoginRecord[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Initialize database in localStorage
const initializeDatabase = (): UserDatabase => {
  const existing = localStorage.getItem('sticker_shop_db');
  if (existing) {
    return JSON.parse(existing);
  }
  return { users: {}, loginHistory: [] };
};

const saveDatabase = (db: UserDatabase) => {
  localStorage.setItem('sticker_shop_db', JSON.stringify(db));
};

const DEFAULT_USER: User = {
  id: 'USER-001',
  name: 'Alex Johnson',
  email: 'demo@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, San Francisco, CA 94102',
  joinDate: '2023-06-15',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  bio: 'Sticker enthusiast and design lover',
  website: 'https://example.com',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [db, setDb] = useState<UserDatabase>(initializeDatabase());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on mount
  useEffect(() => {
    // Initialize with demo user
    const database = initializeDatabase();
    if (!database.users['demo@example.com']) {
      database.users['demo@example.com'] = DEFAULT_USER;
      saveDatabase(database);
    }
    setDb(database);
    setIsInitialized(true);
  }, []);

  const login = (newUser: User) => {
    // Update database with user
    const updatedDb = { ...db };
    updatedDb.users[newUser.email] = newUser;

    // Add login record
    const loginRecord: LoginRecord = {
      timestamp: new Date().toISOString(),
      email: newUser.email,
      device: `${navigator.userAgent.split(' ').pop() || 'Unknown'}`,
      ipInfo: 'User IP tracking disabled for privacy',
    };
    updatedDb.loginHistory.push(loginRecord);

    // Keep only last 50 login records
    if (updatedDb.loginHistory.length > 50) {
      updatedDb.loginHistory = updatedDb.loginHistory.slice(-50);
    }

    saveDatabase(updatedDb);
    setDb(updatedDb);
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      // Update in database
      const updatedDb = { ...db };
      updatedDb.users[user.email] = updatedUser;
      saveDatabase(updatedDb);
      setDb(updatedDb);
    }
  };

  const getAllUsers = (): User[] => {
    return Object.values(db.users);
  };

  const getLoginHistory = (): LoginRecord[] => {
    if (!user) return [];
    return db.loginHistory.filter(record => record.email === user.email);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        loginHistory: getLoginHistory(),
        login,
        logout,
        updateProfile,
        getAllUsers,
        getLoginHistory,
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
