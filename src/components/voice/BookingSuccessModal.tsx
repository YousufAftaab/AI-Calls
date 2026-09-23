'use client';

import React from 'react';
import { CalendarCheck2, Check, Sparkles, X } from 'lucide-react';
import { Appointment } from '@/lib/types';
import Link from 'next/link';

interface BookingSuccessModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export default function BookingSuccessModal({ appointment, onClose }: BookingSuccessModalProps) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-roseGold-200 text-center relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-salon-400 hover:text-salon-700 hover:bg-salon-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <CalendarCheck2 className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3 h-3" />
          Appointment Confirmed By AI Receptionist
        </span>

        <h3 className="text-xl font-bold text-salon-950 mb-1">
          {appointment.serviceName}
        </h3>
        <p className="text-xs text-salon-600 mb-5">
          Successfully booked and synced to the salon dashboard database.
        </p>

        {/* Appointment Card */}
        <div className="bg-salon-50/90 rounded-2xl p-4 border border-roseGold-200 text-left mb-6 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-roseGold-200/60">
            <span className="text-salon-500 font-medium">Customer:</span>
            <span className="font-bold text-salon-950">{appointment.customerName}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-roseGold-200/60">
            <span className="text-salon-500 font-medium">Date & Time:</span>
            <span className="font-bold text-roseGold-800">{appointment.date} at {appointment.time}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-roseGold-200/60">
            <span className="text-salon-500 font-medium">Phone:</span>
            <span className="font-medium text-salon-800">{appointment.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-salon-500 font-medium">Status:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              {appointment.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/appointments"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-roseGold-600 hover:bg-roseGold-700 text-white text-xs font-bold tracking-wide uppercase transition-colors"
          >
            View in Appointments
          </Link>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-salon-300 hover:bg-salon-100 text-salon-800 text-xs font-semibold transition-colors"
          >
            Continue Call
          </button>
        </div>
      </div>
    </div>
  );
}
