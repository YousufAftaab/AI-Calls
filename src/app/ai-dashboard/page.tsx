'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PhoneCall, CalendarCheck, CheckCircle, PhoneForwarded, Clock, Sparkles, TrendingUp, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
import { Appointment, CallRecord } from '@/lib/types';
import { SALON_INFO } from '@/lib/salon-data';

export default function AiDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [apptRes, callRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/calls'),
      ]);
      const apptData = await apptRes.json();
      const callData = await callRes.json();
      setAppointments(apptData.appointments || []);
      setCalls(callData.calls || []);
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalCalls = calls.length;
  const confirmedBookings = appointments.filter((a) => a.status === 'Confirmed').length;
  const humanTransfers = calls.filter((c) => c.outcome === 'Transferred to Human' || c.purpose === 'Human Handoff').length;
  const conversionRate = totalCalls > 0 ? Math.round((confirmedBookings / totalCalls) * 100) : 0;

  // Language breakdown
  const englishCalls = calls.filter((c) => c.language === 'English').length;
  const hindiCalls = calls.filter((c) => c.language === 'Hindi').length;
  const teluguCalls = calls.filter((c) => c.language === 'Telugu').length;

  return (
    <div className="min-h-screen bg-salon-50/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-roseGold-100 text-roseGold-800 border border-roseGold-300">
                Salon Operations
              </span>
              <span className="text-xs text-salon-500">• Live Demo Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-salon-950 tracking-tight">
              Annu Beauty Salon — AI Receptionist Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-salon-600">
              Real-time monitoring of AI voice interactions, customer inquiries, and appointment bookings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl border border-roseGold-200 bg-white hover:bg-salon-50 text-salon-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/ai-receptionist"
              className="px-4 py-2.5 rounded-xl bg-roseGold-600 hover:bg-roseGold-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Test AI Voice Call</span>
            </Link>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Calls Today */}
          <div className="bg-white rounded-2xl p-5 border border-roseGold-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-salon-600">Total Calls Today</span>
              <div className="p-2 rounded-xl bg-roseGold-50 text-roseGold-700">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-salon-950">{totalCalls}</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Live
              </span>
            </div>
            <p className="text-[11px] text-salon-500 mt-2">All incoming voice conversations logged</p>
          </div>

          {/* Bookings Created */}
          <div className="bg-white rounded-2xl p-5 border border-roseGold-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-salon-600">Confirmed Bookings</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-salon-950">{confirmedBookings}</span>
              <span className="text-xs font-medium text-emerald-700">Appointments</span>
            </div>
            <p className="text-[11px] text-salon-500 mt-2">Booked directly via AI Receptionist</p>
          </div>

          {/* Booking Conversion Rate */}
          <div className="bg-white rounded-2xl p-5 border border-roseGold-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-salon-600">AI Conversion Rate</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-salon-950">{conversionRate}%</span>
              <span className="text-xs font-medium text-amber-700">Call to Book</span>
            </div>
            <p className="text-[11px] text-salon-500 mt-2">High-intent caller conversion</p>
          </div>

          {/* Human Transfers */}
          <div className="bg-white rounded-2xl p-5 border border-roseGold-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-salon-600">Human Handoffs</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <PhoneForwarded className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-salon-950">{humanTransfers}</span>
              <span className="text-xs font-medium text-purple-700">Transfers</span>
            </div>
            <p className="text-[11px] text-salon-500 mt-2">Escalated to salon staff</p>
          </div>
        </div>

        {/* Middle Section: Multilingual Breakdown & Quick Salon Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Multilingual Voice Distribution */}
          <div className="bg-white rounded-2xl p-5 border border-roseGold-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-salon-950 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Language Distribution</span>
              <span className="text-[10px] text-roseGold-600 font-bold">English • Hindi • Telugu</span>
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-salon-700 mb-1">
                  <span>English Calls</span>
                  <span className="font-bold">{englishCalls} calls</span>
                </div>
                <div className="w-full h-2 rounded-full bg-salon-100 overflow-hidden">
                  <div
                    className="h-full bg-roseGold-600 rounded-full"
                    style={{ width: `${totalCalls > 0 ? (englishCalls / totalCalls) * 100 : 33}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-salon-700 mb-1">
                  <span>Hindi Calls (हिंदी)</span>
                  <span className="font-bold">{hindiCalls} calls</span>
                </div>
                <div className="w-full h-2 rounded-full bg-salon-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${totalCalls > 0 ? (hindiCalls / totalCalls) * 100 : 33}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-salon-700 mb-1">
                  <span>Telugu Calls (తెలుగు)</span>
                  <span className="font-bold">{teluguCalls} calls</span>
                </div>
                <div className="w-full h-2 rounded-full bg-salon-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${totalCalls > 0 ? (teluguCalls / totalCalls) * 100 : 33}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-salon-50 border border-roseGold-100 text-[11px] text-salon-600">
              The AI automatically matches whichever language the customer begins speaking.
            </div>
          </div>

          {/* Salon Branch Status */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-roseGold-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-salon-950 uppercase tracking-wider mb-3">
                Branch Operational Profile (Demo)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-salon-50 border border-roseGold-100">
                  <span className="text-salon-500 block mb-1">Working Hours</span>
                  <strong className="text-salon-950 font-semibold">{SALON_INFO.workingHours.hours}</strong>
                  <p className="text-[10px] text-roseGold-700 mt-0.5">{SALON_INFO.workingHours.days}</p>
                </div>
                <div className="p-3 rounded-xl bg-salon-50 border border-roseGold-100">
                  <span className="text-salon-500 block mb-1">Weekly Off</span>
                  <strong className="text-rose-700 font-semibold">{SALON_INFO.workingHours.holiday}</strong>
                  <p className="text-[10px] text-salon-500 mt-0.5">Automated AI Notice</p>
                </div>
                <div className="p-3 rounded-xl bg-salon-50 border border-roseGold-100">
                  <span className="text-salon-500 block mb-1">Lead Stylist</span>
                  <strong className="text-salon-950 font-semibold">Annu & Team</strong>
                  <p className="text-[10px] text-salon-500 mt-0.5">Jubilee Hills Center</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-roseGold-100 text-xs">
              <span className="text-salon-600">Demo Telephony Adapter:</span>
              <span className="font-semibold text-roseGold-700 bg-roseGold-50 px-2.5 py-1 rounded-md border border-roseGold-200">
                MockTelephonyProvider (Exotel Ready)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Bookings Table & Recent Calls Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Appointments */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-roseGold-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-salon-950 uppercase tracking-wider flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-roseGold-600" />
                <span>Upcoming Appointments</span>
              </h3>
              <Link href="/appointments" className="text-xs font-bold text-roseGold-700 hover:text-roseGold-900 flex items-center gap-0.5">
                <span>View All ({appointments.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-roseGold-100">
              {appointments.slice(0, 4).map((apt) => (
                <div key={apt.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-salon-950">{apt.customerName}</h4>
                    <p className="text-salon-600 text-[11px]">{apt.serviceName}</p>
                    <span className="text-[10px] text-salon-400">{apt.phone}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-roseGold-800 block">{apt.date}</span>
                    <span className="text-salon-600 text-[11px]">{apt.time}</span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent AI Calls */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-roseGold-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-salon-950 uppercase tracking-wider flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-roseGold-600" />
                <span>Recent AI Calls</span>
              </h3>
              <Link href="/calls" className="text-xs font-bold text-roseGold-700 hover:text-roseGold-900 flex items-center gap-0.5">
                <span>Call Logs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-roseGold-100">
              {calls.slice(0, 4).map((c) => (
                <div key={c.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-salon-950">{c.callerName}</span>
                    <span className="font-mono text-[11px] text-salon-500">{c.durationFormatted}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-salon-600">
                    <span>{c.purpose}</span>
                    <span className="font-semibold text-roseGold-700">{c.language}</span>
                  </div>
                  <p className="text-[11px] text-salon-500 italic line-clamp-1">
                    &ldquo;{c.summary}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
