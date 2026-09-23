'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, PhoneCall, LayoutDashboard, CalendarCheck, History, ShieldAlert } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/ai-receptionist', label: 'AI Voice Receptionist', icon: PhoneCall, highlight: true },
    { href: '/ai-dashboard', label: 'Salon Dashboard', icon: LayoutDashboard },
    { href: '/appointments', label: 'Appointments', icon: CalendarCheck },
    { href: '/calls', label: 'Call History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-roseGold-200/60 shadow-sm">
      {/* Top Demo Notice Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-roseGold-500/10 to-amber-500/10 border-b border-amber-200/40 px-4 py-1 text-center text-xs text-amber-800 font-medium flex items-center justify-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span><strong>DEMO MODE:</strong> Annu Beauty Salon Voice AI Receptionist • English, Hindi & Telugu Voice Support</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-roseGold-500 to-salon-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-lg font-bold text-salon-950 tracking-tight flex items-center gap-1.5">
                Annu Beauty Salon
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-roseGold-100 text-roseGold-800 px-1.5 py-0.5 rounded border border-roseGold-300">
                  AI Demo
                </span>
              </span>
              <p className="text-xs text-salon-600 hidden sm:block">AI Voice Receptionist Console</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-roseGold-600 text-white shadow-sm'
                      : item.highlight
                      ? 'bg-roseGold-50 text-roseGold-800 border border-roseGold-200 hover:bg-roseGold-100'
                      : 'text-salon-700 hover:text-salon-950 hover:bg-salon-100/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-roseGold-600' : 'text-salon-500'}`} />
                  {item.label}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Action Pill */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/ai-receptionist"
              className="flex items-center gap-1.5 bg-roseGold-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Voice Console</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-roseGold-100 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${
                  isActive ? 'bg-roseGold-600 text-white' : 'text-salon-700 bg-salon-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
