'use client';

import React from 'react';
import { CalendarCheck, HelpCircle, Clock, RotateCcw, XCircle, UserCheck, Languages } from 'lucide-react';

interface QuickScenarioButtonsProps {
  onSelectScenario: (scenarioText: string, language?: 'en' | 'hi' | 'te') => void;
  disabled?: boolean;
}

export default function QuickScenarioButtons({ onSelectScenario, disabled }: QuickScenarioButtonsProps) {
  const scenarios = [
    {
      id: 'book-bridal',
      title: 'Book Bridal Makeup',
      speech: 'Hi, I want to book a bridal makeup appointment for Sunday at 11 AM.',
      icon: CalendarCheck,
      badge: 'English',
      color: 'border-roseGold-300 hover:border-roseGold-500 bg-roseGold-50/50 hover:bg-roseGold-100/70',
      lang: 'en' as const,
    },
    {
      id: 'ask-services',
      title: 'Ask About Services & Rates',
      speech: 'What services and packages do you offer for skincare and hair spa?',
      icon: HelpCircle,
      badge: 'English',
      color: 'border-amber-200 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-100/70',
      lang: 'en' as const,
    },
    {
      id: 'ask-hours',
      title: 'Ask Hours & Location',
      speech: 'Where is Annu Beauty Salon located and what are your opening hours on weekends?',
      icon: Clock,
      badge: 'English',
      color: 'border-salon-300 hover:border-salon-500 bg-salon-100/50 hover:bg-salon-200/70',
      lang: 'en' as const,
    },
    {
      id: 'human-handoff',
      title: 'Request Human Transfer',
      speech: 'I want to talk to someone from the salon team please.',
      icon: UserCheck,
      badge: 'Handoff',
      color: 'border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-100/70',
      lang: 'en' as const,
    },
    {
      id: 'hindi-booking',
      title: 'Hindi: मुझे ब्राइडल मेकअप बुक करना है',
      speech: 'नमस्ते! मुझे रविवार सुबह 11 बजे ब्राइडल मेकअप बुक करना है।',
      icon: Languages,
      badge: 'हिंदी Hindi',
      color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/70',
      lang: 'hi' as const,
    },
    {
      id: 'telugu-booking',
      title: 'Telugu: నాకు అపాయింట్‌మెంట్ బుక్ చేయాలి',
      speech: 'నమస్కారం! నాకు ఆదివారం ఉదయం 11 గంటలకు బ్రైడల్ మేకప్ అపాయింట్‌మెంట్ కావాలి.',
      icon: Languages,
      badge: 'తెలుగు Telugu',
      color: 'border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-100/70',
      lang: 'te' as const,
    },
    {
      id: 'whatsapp-calling-test',
      title: 'WhatsApp Voice Call: Hair Spa',
      speech: 'Hi, I saw Annu Beauty Salon on WhatsApp and want to know about your hair spa and keratin treatments.',
      icon: HelpCircle,
      badge: 'WhatsApp Call',
      color: 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/60 hover:bg-emerald-100/80',
      lang: 'en' as const,
    },
    {
      id: 'reschedule',
      title: 'Reschedule Appointment',
      speech: 'I need to reschedule my facial appointment to next Tuesday at 3 PM.',
      icon: RotateCcw,
      badge: 'Modify',
      color: 'border-salon-200 hover:border-salon-400 bg-salon-50 hover:bg-salon-100',
      lang: 'en' as const,
    },
    {
      id: 'cancel',
      title: 'Cancel Appointment',
      speech: 'Can you please cancel my upcoming appointment?',
      icon: XCircle,
      badge: 'Cancel',
      color: 'border-red-200 hover:border-red-400 bg-red-50/40 hover:bg-red-100/60',
      lang: 'en' as const,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-roseGold-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-salon-950 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-roseGold-600"></span>
          AI Test Scenarios (1-Click Demonstration)
        </h3>
        <span className="text-xs text-salon-500">Click to speak directly to AI</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectScenario(sc.speech, sc.lang)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between group disabled:opacity-50 disabled:cursor-not-allowed ${sc.color}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-white shadow-xs group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-salon-800" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-salon-800 border border-salon-200">
                  {sc.badge}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-salon-950 mb-0.5 leading-snug line-clamp-1">{sc.title}</h4>
                <p className="text-[11px] text-salon-600 line-clamp-2 leading-relaxed italic">
                  &ldquo;{sc.speech}&rdquo;
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
