"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '@/constants/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      const { access_token, user: userData } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password,
        full_name: fullName
      });
      return await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
