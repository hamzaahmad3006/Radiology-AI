"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen pt-2 pb-12 px-6">
      <Navbar />
      <main className="max-w-md mx-auto mt-20">
        <Card className="p-8 space-y-8 glass shadow-2xl scale-in-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-white/60">Login to access your radiology history</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>

            <p className="text-center text-white/40 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-light-blue hover:underline font-bold">
                Sign Up
              </Link>
            </p>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Login;
