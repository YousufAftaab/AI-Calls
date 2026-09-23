import React from 'react';
import Link from 'next/link';
import { PhoneCall, Sparkles, CalendarCheck, LayoutDashboard, History, CheckCircle2, ShieldCheck, ArrowRight, Clock, MapPin, Phone, HeartHandshake } from 'lucide-react';
import { SALON_INFO, SALON_SERVICES, DEMO_NOTICE } from '@/lib/salon-data';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-salon-50/50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-white via-salon-50/60 to-roseGold-50/30 border-b border-roseGold-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-roseGold-100/80 border border-roseGold-300 text-roseGold-900 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-roseGold-700" />
              <span>Voice AI Receptionist Demo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-salon-950 tracking-tight leading-tight">
              Annu Beauty Salon <br />
              <span className="text-roseGold-700">Virtual AI Receptionist</span>
            </h1>

            <p className="text-sm sm:text-base text-salon-700 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of salon client care. Our voice receptionist naturally speaks{' '}
              <strong>English, Hindi, and Telugu</strong>, checks availability, books appointments, and provides seamless human handoffs.
            </p>

            {/* Main CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/ai-receptionist"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-roseGold-600 to-salon-800 hover:from-roseGold-700 hover:to-salon-900 text-white font-bold text-sm shadow-lg shadow-roseGold-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
              >
                <PhoneCall className="w-4 h-4 group-hover:animate-bounce" />
                <span>Launch Voice Receptionist</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/ai-dashboard"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-salon-100 text-salon-900 font-bold text-sm border border-roseGold-200 shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-salon-600" />
                <span>View Salon Dashboard</span>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-salon-700">
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-roseGold-200 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Natural Spoken Voice</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-roseGold-200 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>English &bull; हिंदी &bull; తెలుగు</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-roseGold-200 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Booking Engine</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-roseGold-200 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated Human Transfer</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Demo Notice Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="leading-relaxed">
            <strong>DEMO DATA DISCLAIMER:</strong> {DEMO_NOTICE} Services, prices, and salon operating hours are pre-configured examples ready for real business customization.
          </p>
        </div>
      </div>

      {/* Services Knowledge Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-roseGold-700 bg-roseGold-100 px-2.5 py-0.5 rounded-full border border-roseGold-300">
              Salon Knowledge Base
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-salon-950 mt-2">
              Featured Salon Services
            </h2>
            <p className="text-xs sm:text-sm text-salon-600">
              Inquire about any of these services during your call with the AI receptionist.
            </p>
          </div>

          <Link
            href="/ai-receptionist"
            className="text-xs font-bold text-roseGold-700 hover:text-roseGold-900 flex items-center gap-1 self-start md:self-auto"
          >
            <span>Ask AI about services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SALON_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 border border-roseGold-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-salon-100 text-salon-800">
                    {service.category}
                  </span>
                  <span className="text-xs font-bold text-roseGold-700">
                    {service.demoPrice}
                  </span>
                </div>
                <h3 className="text-base font-bold text-salon-950 mb-2">
                  {service.name}
                </h3>
                <p className="text-xs text-salon-600 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-roseGold-100 flex items-center justify-between text-xs text-salon-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-salon-400" />
                  <span>Duration: {service.durationFormatted}</span>
                </span>
                <Link
                  href="/ai-receptionist"
                  className="font-bold text-roseGold-600 hover:text-roseGold-800"
                >
                  Book via Voice &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Salon Information & Quick Specs */}
      <section className="bg-white border-t border-roseGold-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-roseGold-50 text-roseGold-700 flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-salon-950 mb-1">Working Hours</h4>
                <p className="text-xs text-salon-600">{SALON_INFO.workingHours.days}: {SALON_INFO.workingHours.hours}</p>
                <p className="text-xs text-rose-700 font-semibold mt-0.5">{SALON_INFO.workingHours.holiday}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-salon-950 mb-1">Salon Location</h4>
                <p className="text-xs text-salon-600">{SALON_INFO.address}</p>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">Demo Hyderabad Branch</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-salon-950 mb-1">Contact & Desk</h4>
                <p className="text-xs text-salon-600">Front Desk: {SALON_INFO.phone}</p>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">Automated AI Reception Available 24/7</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
