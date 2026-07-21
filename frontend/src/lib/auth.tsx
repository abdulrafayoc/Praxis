import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin } from './api';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  );
  const [role, setRole] = useState<string | null>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try { return jwtDecode<{role: string}>(token).role; } catch { return null; }
    }
    return null;
  });

  const login = useCallback(async (username: string, password: string) => {
    try {
      const data = await apiLogin({ email: username, password });
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        setIsAuthenticated(true);
        try {
          const decoded = jwtDecode<{role: string}>(data.access_token);
          setRole(decoded.role);
        } catch {
          setRole(null);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setRole(null);
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
