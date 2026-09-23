'use client';

import React, { useState } from 'react';
import { UserCheck, Sparkles, Volume2, Key, Sliders, CheckCircle2 } from 'lucide-react';
import { VOICE_PERSONAS, VoicePersona } from '@/lib/audio/voice-engine';
import { LanguageCode } from '@/lib/types';

interface VoicePersonaSelectorProps {
  selectedPersona: VoicePersona;
  onSelectPersona: (persona: VoicePersona) => void;
  onTestVoice: (persona: VoicePersona, lang: LanguageCode) => void;
  currentLanguage: LanguageCode;
  isAiSpeaking: boolean;
}

export default function VoicePersonaSelector({
  selectedPersona,
  onSelectPersona,
  onTestVoice,
  currentLanguage,
  isAiSpeaking,
}: VoicePersonaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-4 border border-roseGold-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-roseGold-100 text-roseGold-700 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-salon-950">
                Voice Tone: {selectedPersona.name}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Natural Human Cadence
              </span>
            </div>
            <p className="text-[11px] text-salon-500">{selectedPersona.style}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isAiSpeaking}
            onClick={() => onTestVoice(selectedPersona, currentLanguage)}
            className="px-3 py-1.5 rounded-xl border border-roseGold-300 bg-roseGold-50/60 hover:bg-roseGold-100 text-roseGold-900 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Listen to sample greeting in selected voice"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isAiSpeaking ? 'animate-pulse text-roseGold-600' : ''}`} />
            <span>Test Voice</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl border border-salon-200 hover:bg-salon-50 text-salon-700 transition-colors"
            title="Configure human voice persona"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-roseGold-100 space-y-3 animate-fadeIn">
          <div className="text-xs font-bold text-salon-800 uppercase tracking-wider">
            Select Receptionist Voice Personality:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {VOICE_PERSONAS.map((p) => {
              const isSelected = p.id === selectedPersona.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectPersona(p);
                    onTestVoice(p, currentLanguage);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-roseGold-600 bg-roseGold-50/70 shadow-xs'
                      : 'border-salon-200 hover:border-roseGold-300 bg-salon-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-salon-950">{p.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-roseGold-600" />}
                  </div>
                  <p className="text-[11px] text-salon-600 leading-snug">{p.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
