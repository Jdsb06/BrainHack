'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export const Header = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/focus-timer', label: 'Focus Timer' },
    { href: '/goals', label: 'Goals' },
    { href: '/ask-brainhack', label: 'Ask AI' },
    { href: '/risk-predictor', label: 'Risk Predictor' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-orange-500/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text">Brain Hack</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative ${
                  pathname === link.href ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'
                } transition-colors`}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-orange-400"
                    animate
                  />
                )}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="gradient-button px-4 py-2 rounded-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}; 