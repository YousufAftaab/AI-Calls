'use client';

import React, { useEffect, useState } from 'react';
import { PhoneForwarded, CheckCircle2, UserCheck, PhoneCall, X } from 'lucide-react';
import { SALON_INFO } from '@/lib/salon-data';

interface HumanHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HumanHandoffModal({ isOpen, onClose }: HumanHandoffModalProps) {
  const [step, setStep] = useState<'connecting' | 'complete'>('connecting');

  useEffect(() => {
    if (isOpen) {
      setStep('connecting');
      const timer = setTimeout(() => {
        setStep('complete');
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-roseGold-200 text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-salon-400 hover:text-salon-700 hover:bg-salon-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'connecting' ? (
          <div className="py-6 flex flex-col items-center">
            {/* Pulsing Transfer Ring */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-roseGold-100 flex items-center justify-center animate-ring-pulse">
                <PhoneForwarded className="w-9 h-9 text-roseGold-600 animate-bounce" />
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-roseGold-700 bg-roseGold-50 px-3 py-1 rounded-full border border-roseGold-200 mb-2">
              SIMULATED CALL TRANSFER
            </span>
            <h3 className="text-xl font-bold text-salon-950 mb-2 tracking-tight">
              CONNECTING TO SALON TEAM...
            </h3>
            <p className="text-xs text-salon-600 max-w-xs leading-relaxed">
              Routing caller to Annu Beauty Salon Front Desk Manager (Desk Line 1).
            </p>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-md animate-scaleIn">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
              HANDOFF SIMULATION
            </span>
            <h3 className="text-xl font-bold text-salon-950 mb-2 tracking-tight">
              DEMO TRANSFER COMPLETE
            </h3>
            <p className="text-xs text-salon-600 max-w-xs leading-relaxed mb-6">
              In production, the telephony SIP provider (Exotel / Twilio) will seamlessly bridge this call directly to:
            </p>

            <div className="bg-salon-50 rounded-2xl p-4 w-full border border-roseGold-200 text-left mb-6 space-y-2 text-xs">
              <div className="flex items-center justify-between text-salon-800">
                <span className="text-salon-500 font-medium">Salon Desk Number:</span>
                <span className="font-bold">{SALON_INFO.phone}</span>
              </div>
              <div className="flex items-center justify-between text-salon-800">
                <span className="text-salon-500 font-medium">Assigned Staff:</span>
                <span className="font-bold">Annu (Senior Stylist & Lead)</span>
              </div>
              <div className="flex items-center justify-between text-salon-800">
                <span className="text-salon-500 font-medium">Handoff Notes:</span>
                <span className="text-emerald-700 font-medium">Live transcript synced</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-salon-900 hover:bg-salon-950 text-white text-xs font-bold tracking-wide uppercase shadow-md transition-colors"
            >
              Resume Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
