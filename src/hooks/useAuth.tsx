'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  nombre: string;
  email: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  idioma_principal?: string;
  idioma_objetivo?: string;
  nivel_idioma?: string;
  intereses?: string[];
  pais?: string;
  edad?: number;
  preferencia_genero?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (nombre: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setAuthData: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay datos de autenticación en localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    console.log("🔐 useAuth - useEffect triggered");
    console.log("🔐 useAuth - storedToken:", storedToken ? storedToken.substring(0, 20) + '...' : 'none');
    console.log("🔐 useAuth - storedUser:", storedUser ? 'exists' : 'none');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("🔐 useAuth - Setting auth data:", { 
          userId: parsedUser.id, 
          email: parsedUser.email,
          tokenPreview: storedToken.substring(0, 20) + '...'
        });
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ useAuth - Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log("🔐 useAuth - No stored auth data found");
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("🔐 useAuth - Login successful:", { 
          userId: data.user?.id, 
          email: data.user?.email,
          tokenPreview: data.token ? data.token.substring(0, 20) + '...' : 'none'
        });
        
        // Usar setAuthData para consistencia
        setAuthData(data.token, data.user);
        
        console.log("🔐 useAuth - Auth data set after login");
        
        return { success: true };
      } else {
        console.log("❌ useAuth - Login failed:", data.error);
        return { success: false, error: data.error || 'Error en el login' };
      }
    } catch {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const register = async (nombre: string, email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Error en el registro' };
      }
    } catch {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const setAuthData = (token: string, user: User) => {
    console.log("🔐 useAuth - setAuthData called:", { 
      userId: user.id, 
      email: user.email,
      tokenPreview: token.substring(0, 20) + '...'
    });
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    console.log("🔐 useAuth - Auth data saved to localStorage");
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    setAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
