"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-white/60 font-medium animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
};
