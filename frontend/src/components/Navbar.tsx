import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  onHomeClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHomeClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="relative px-6 py-2 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-8 py-3 shadow-lg border border-white/5">
        <Link href="/" className="flex items-center group" onClick={onHomeClick}>
          <div className="relative h-16 w-auto flex items-center justify-start group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="RadiologyAI Logo"
              className="h-full w-auto object-contain object-left scale-300 origin-left"
            />
          </div>
        </Link>
        <div className="flex items-center gap-10">
          {user && (
            <>
              <Link
                href="/"
                onClick={onHomeClick}
                className="text-white/70 hover:text-light-blue transition-colors font-medium text-sm tracking-wide"
              >
                Home
              </Link>
              <Link
                href="/history"
                className="text-white/70 hover:text-light-blue transition-colors font-medium text-sm tracking-wide"
              >
                History
              </Link>
            </>
          )}
          
          {user ? (
            <div className="flex items-center gap-6">
              <span className="text-white/60 text-sm font-medium">
                Hi, <span className="text-light-blue">{user.full_name.split(' ')[0]}</span>
              </span>
              <button 
                onClick={logout}
                className="text-white/40 hover:text-red-400 text-sm transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-white/70 hover:text-light-blue text-sm font-medium">
                Login
              </Link>
              <Link href="/signup">
                <button className="bg-primary/20 hover:bg-primary/30 text-light-blue px-6 py-2.5 rounded-xl transition-all border border-blue-500/30 font-bold text-sm shadow-lg shadow-blue-500/10">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
