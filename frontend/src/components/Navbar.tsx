'use client';

import Link from 'next/link';
import { Award } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-brand-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Aryan Certificate Portal
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/verify"
              className="text-slate-700 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Verify
            </Link>
            <Link
              href="/admin"
              className="text-slate-700 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Admin
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
