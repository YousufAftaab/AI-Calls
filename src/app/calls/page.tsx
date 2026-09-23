'use client';

import React, { useEffect, useState } from 'react';
import { PhoneCall, Clock, Globe, Sparkles, MessageSquare, ChevronRight, X, Bot, User, CheckCircle2, PhoneForwarded, Filter } from 'lucide-react';
import { CallRecord } from '@/lib/types';
import Link from 'next/link';

export default function CallsHistoryPage() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>('ALL');

  const fetchCalls = async () => {
    try {
      const res = await fetch('/api/calls');
      const data = await res.json();
      setCalls(data.calls || []);
    } catch (e) {
      console.error('Failed to load calls:', e);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const filteredCalls = calls.filter((c) => {
    if (languageFilter === 'ALL') return true;
    return c.language.toLowerCase() === languageFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-salon-50/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-roseGold-100 text-roseGold-800 border border-roseGold-300">
                Call Telemetry & Audio Logs
              </span>
              <span className="text-xs text-salon-500">• Real Conversation Transcripts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-salon-950 tracking-tight">
              Annu Beauty Salon — Call History
            </h1>
            <p className="text-xs sm:text-sm text-salon-600">
              Inspect AI receptionist conversations, multilingual transcripts, and call outcomes.
            </p>
          </div>

          <Link
            href="/ai-receptionist"
            className="px-4 py-2.5 rounded-xl bg-roseGold-600 hover:bg-roseGold-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Start Voice Call</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-roseGold-200/80 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-salon-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Language:
            </span>
            {['ALL', 'English', 'Hindi', 'Telugu'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguageFilter(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  languageFilter === lang
                    ? 'bg-roseGold-600 text-white'
                    : 'bg-salon-50 text-salon-700 hover:bg-salon-100'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <span className="text-xs text-salon-500 font-medium">
            Total Logged: <strong>{filteredCalls.length}</strong> calls
          </span>
        </div>

        {/* Calls Table Card */}
        <div className="bg-white rounded-3xl border border-roseGold-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-salon-50/80 border-b border-roseGold-200/60 text-salon-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Caller</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Outcome</th>
                  <th className="px-6 py-4">Summary</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-roseGold-100">
                {filteredCalls.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-salon-500">
                      No calls recorded yet. Open the AI Voice Receptionist to test a call!
                    </td>
                  </tr>
                ) : (
                  filteredCalls.map((call) => (
                    <tr
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      className="hover:bg-salon-50/60 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-salon-950">{call.callerName}</div>
                        <div className="text-salon-500 font-mono text-[11px]">{call.callerPhone}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-salon-700">
                        {call.durationFormatted}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            call.language === 'Hindi'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : call.language === 'Telugu'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-roseGold-50 text-roseGold-800 border border-roseGold-200'
                          }`}
                        >
                          {call.language}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-salon-800">
                        {call.purpose}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            call.outcome === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : call.outcome === 'Transferred to Human'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-salon-100 text-salon-700'
                          }`}
                        >
                          {call.outcome}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-salon-600 max-w-xs">
                        <p className="line-clamp-1 italic text-[11px]">&ldquo;{call.summary}&rdquo;</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-roseGold-600 hover:text-roseGold-800 inline-flex items-center gap-1 font-bold text-[11px]">
                          Transcript
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Detailed Call Transcript & Metadata */}
        {selectedCall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-roseGold-200 relative flex flex-col max-h-[85vh]">
              <button
                onClick={() => setSelectedCall(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-salon-400 hover:text-salon-700 hover:bg-salon-100"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Call Overview Header */}
              <div className="pb-4 border-b border-roseGold-200/80 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-roseGold-100 text-roseGold-800">
                    Call Record #{selectedCall.id}
                  </span>
                  <span className="text-xs text-salon-500 font-mono">{selectedCall.durationFormatted} duration</span>
                </div>
                <h3 className="text-xl font-bold text-salon-950">
                  {selectedCall.callerName} &bull; {selectedCall.callerPhone}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-salon-100 text-salon-800 font-medium">
                    Language: <strong>{selectedCall.language}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-salon-100 text-salon-800 font-medium">
                    Purpose: <strong>{selectedCall.purpose}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    Outcome: {selectedCall.outcome}
                  </span>
                </div>
              </div>

              {/* Summary Banner */}
              <div className="bg-salon-50 rounded-2xl p-3.5 border border-roseGold-100 mb-4 text-xs">
                <span className="font-bold text-salon-900 block mb-0.5">AI Call Summary:</span>
                <p className="text-salon-700 italic">{selectedCall.summary}</p>
              </div>

              {/* Appointment Created Card if any */}
              {selectedCall.appointmentCreated && (
                <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200 mb-4 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-950 block">
                        Appointment Created: {selectedCall.appointmentCreated.serviceName}
                      </span>
                      <span className="text-emerald-800 text-[11px]">
                        {selectedCall.appointmentCreated.date} at {selectedCall.appointmentCreated.time}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/appointments"
                    onClick={() => setSelectedCall(null)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700"
                  >
                    View Appointment
                  </Link>
                </div>
              )}

              {/* Conversation Transcript Log */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-salon-50/40 rounded-2xl border border-roseGold-100">
                <h4 className="text-xs font-bold text-salon-900 uppercase tracking-wider mb-2">
                  Full Spoken Transcript
                </h4>
                {selectedCall.transcript.length === 0 ? (
                  <p className="text-xs text-salon-500 italic">No transcript recorded for this call.</p>
                ) : (
                  selectedCall.transcript.map((item, idx) => {
                    const isAI = item.sender === 'AI';
                    return (
                      <div key={idx} className={`flex gap-2.5 items-start ${isAI ? 'justify-start' : 'justify-end'}`}>
                        {isAI && (
                          <div className="w-6 h-6 rounded-full bg-roseGold-600 text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                            <Bot className="w-3 h-3" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-xs ${
                            isAI
                              ? 'bg-white text-salon-950 border border-roseGold-200'
                              : 'bg-roseGold-600 text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="font-bold text-[10px] uppercase opacity-75">{item.sender}</span>
                            <span className="text-[9px] opacity-75 font-mono">{item.time}</span>
                          </div>
                          <p className="leading-relaxed">{item.text}</p>
                        </div>
                        {!isAI && (
                          <div className="w-6 h-6 rounded-full bg-salon-700 text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                            <User className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedCall(null)}
                  className="px-5 py-2 rounded-xl bg-salon-900 hover:bg-salon-950 text-white text-xs font-bold"
                >
                  Close Transcript
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
