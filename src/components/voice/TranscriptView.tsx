'use client';

import React, { useEffect, useRef } from 'react';
import { Sparkles, User, Bot, Volume2, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

interface TranscriptViewProps {
  messages: ChatMessage[];
  isAiSpeaking?: boolean;
}

export default function TranscriptView({ messages, isAiSpeaking }: TranscriptViewProps) {
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiSpeaking]);

  return (
    <div className="flex flex-col h-full bg-salon-50/70 rounded-2xl border border-roseGold-200/80 overflow-hidden shadow-inner">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-roseGold-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-roseGold-600" />
          <h3 className="text-xs font-bold text-salon-950 uppercase tracking-wider">
            Live Call Conversation
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-salon-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Transcript Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[380px]">
        {messages.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-salon-500">
            <Bot className="w-8 h-8 text-roseGold-400 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium">Click &ldquo;Start Call&rdquo; to begin speaking with Annu Beauty Salon&apos;s virtual receptionist.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isAI = msg.role === 'assistant';
            const isSystem = msg.role === 'system';
            const isLastMessage = idx === messages.length - 1;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex items-center justify-center my-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>{msg.content}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {/* AI Avatar */}
                {isAI && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-roseGold-500 to-salon-800 text-white flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-amber-200" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs shadow-xs transition-all ${
                    isAI
                      ? 'bg-white text-salon-950 border border-roseGold-200/80 rounded-tl-sm'
                      : 'bg-roseGold-600 text-white rounded-tr-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className={`font-bold tracking-tight text-[11px] ${isAI ? 'text-roseGold-800' : 'text-roseGold-100'}`}>
                      {isAI ? 'AI RECEPTIONIST' : 'CUSTOMER'}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] opacity-75">
                      {isAI && isLastMessage && isAiSpeaking && (
                        <Volume2 className="w-3 h-3 text-roseGold-600 animate-pulse" />
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                  <p className="leading-relaxed font-normal whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* User Avatar */}
                {!isAI && (
                  <div className="w-8 h-8 rounded-full bg-salon-700 text-white flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-salon-200" />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={scrollEndRef} />
      </div>
    </div>
  );
}
