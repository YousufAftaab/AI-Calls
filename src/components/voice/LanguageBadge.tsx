'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { LanguageCode } from '@/lib/types';

interface LanguageBadgeProps {
  currentLanguage: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export default function LanguageBadge({ currentLanguage, onLanguageChange }: LanguageBadgeProps) {
  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  ];

  return (
    <div className="flex items-center gap-2 bg-salon-100/80 p-1.5 rounded-full border border-roseGold-200/80 shadow-inner">
      <div className="flex items-center gap-1 pl-2 pr-1 text-xs font-medium text-salon-700">
        <Globe className="w-3.5 h-3.5 text-roseGold-600" />
        <span className="hidden sm:inline">Voice Engine:</span>
      </div>
      <div className="flex items-center gap-1">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLanguageChange && onLanguageChange(lang.code)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-roseGold-600 text-white shadow-sm scale-105'
                  : 'text-salon-800 hover:bg-white/80 hover:text-salon-950'
              }`}
            >
              <span>{lang.native}</span>
              <span className="opacity-75 text-[10px] ml-1">({lang.code.toUpperCase()})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
