"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LogIn, UserPlus, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function SiteHeader() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-black sticky top-0 z-40 border-b">
      <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0" style={{ maxWidth: 'calc(100% * 1.3)' }}>
        <div className="logo-container">
          <Link href="/">
            <Image
              src="/logo.png" // Replace with your actual logo path
              alt="BrainHack Logo"
              width={100} // Adjust as needed
              height={100} // Adjust as needed
            />
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-white">
          {/* Add your navigation links here */}
          {/* Example links: */}
          <Link href="/dashboard" className="text-white hover:text-gray-200">Dashboard</Link>
          <Link href="/risk-predictor" className="text-white hover:text-gray-200">Risk Predictor</Link>
          <Link href="/goals" className="text-white hover:text-gray-200">Goals</Link>
          <Link href="/focus-timer" className="text-white hover:text-gray-200">Focus Timer</Link>
          <Link href="/ask-brainhack" className="text-white hover:text-gray-200">Ask BrainHack</Link>

          {/* Authentication links */}
          {!loading && (
            <>
              {user ? (
                <button 
                  onClick={() => auth.signOut()} 
                  className="flex items-center text-white hover:text-gray-200"
                >
                  <LogOut className="mr-1" size={20} />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link href="/login" className="flex items-center text-white hover:text-gray-200">
                    <LogIn className="mr-1" size={20} />
                    <span>Login</span>
                  </Link>
                  <Link href="/signup" className="flex items-center text-white hover:text-gray-200">
                    <UserPlus className="mr-1" size={20} />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
