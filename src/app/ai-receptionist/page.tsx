'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, PhoneOff, Sparkles, Volume2, AlertCircle, Send, Radio, Zap, Gauge } from 'lucide-react';
import VoiceVisualizer from '@/components/voice/VoiceVisualizer';
import LanguageBadge from '@/components/voice/LanguageBadge';
import QuickScenarioButtons from '@/components/voice/QuickScenarioButtons';
import TranscriptView from '@/components/voice/TranscriptView';
import HumanHandoffModal from '@/components/voice/HumanHandoffModal';
import BookingSuccessModal from '@/components/voice/BookingSuccessModal';
import VoicePersonaSelector from '@/components/voice/VoicePersonaSelector';
import { CallState, ChatMessage, LanguageCode, Appointment } from '@/lib/types';
import { VOICE_PERSONAS, VoicePersona, getStudioVoiceClip, preloadAllVoiceClips } from '@/lib/audio/voice-engine';

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export default function AiReceptionistPage() {
  const [callState, setCallState] = useState<CallState>('IDLE');
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(VOICE_PERSONAS[0]);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.15); // 1.15x Fast conversational speed
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [textInput, setTextInput] = useState('');

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const callStateRef = useRef<CallState>('IDLE');
  const latestSpokenTextRef = useRef<string>('');
  const speechSpeedRef = useRef<number>(1.15);

  messagesRef.current = messages;
  callStateRef.current = callState;
  speechSpeedRef.current = speechSpeed;

  // Stable function refs
  const startListeningFnRef = useRef<() => void>(() => {});
  const processUserSpeechFnRef = useRef<(text: string, lang?: LanguageCode) => void>(() => {});

  useEffect(() => {
    preloadAllVoiceClips();
  }, []);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  // ═══════════════════════════════════════════════════════════════
  // AUDIO PLAYBACK (Fast 1.15x - 1.25x Conversational Speed)
  // ═══════════════════════════════════════════════════════════════

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
  }, []);

  /** Play audio with adjustable fast conversational playback rate */
  const playAudioUrl = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const el = audioRef.current;
      if (!el) {
        reject(new Error('No audio element'));
        return;
      }

      el.onended = () => {
        el.onended = null;
        el.onerror = null;
        resolve();
      };
      el.onerror = () => {
        el.onended = null;
        el.onerror = null;
        reject(new Error('Audio playback error'));
      };
      el.src = url;
      el.playbackRate = speechSpeedRef.current; // Fast natural speed
      el.play().catch(reject);
    });
  }, []);

  /** Generate dynamic speech from server with 5s timeout */
  const playServerTts = useCallback(async (text: string, lang: LanguageCode): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) return false;

      const contentType = res.headers.get('Content-Type') || '';
      if (!contentType.includes('audio')) return false;

      const blob = await res.blob();
      if (blob.size < 100) return false;

      const blobUrl = URL.createObjectURL(blob);
      try {
        await playAudioUrl(blobUrl);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
      return true;
    } catch {
      return false;
    }
  }, [playAudioUrl]);

  /** Main speak function */
  const speakText = useCallback(async (text: string, lang: LanguageCode) => {
    stopAudio();
    setIsAiSpeaking(true);
    setCallState('SPEAKING');

    let played = false;

    // 1. Instant 0ms pre-cached clip
    const clipUrl = getStudioVoiceClip(text, lang);
    if (clipUrl) {
      try {
        await playAudioUrl(clipUrl);
        played = true;
      } catch {}
    }

    // 2. Server neural TTS
    if (!played) {
      played = await playServerTts(text, lang);
    }

    // 3. Fallback browser synthesis with fast rate
    if (!played && typeof window !== 'undefined' && window.speechSynthesis) {
      await new Promise<void>((resolve) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
        utterance.rate = speechSpeedRef.current;
        utterance.pitch = 1.0;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    }

    // Done speaking → resume listening immediately
    setIsAiSpeaking(false);
    if (callStateRef.current !== 'ENDED' && callStateRef.current !== 'IDLE') {
      setCallState('LISTENING');
      startListeningFnRef.current();
    }
  }, [stopAudio, playAudioUrl, playServerTts]);

  // ═══════════════════════════════════════════════════════════════
  // SPEECH RECOGNITION (Aggressive Auto-Submit on Silence)
  // ═══════════════════════════════════════════════════════════════

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    setLiveTranscript('');
    latestSpokenTextRef.current = '';
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (callStateRef.current !== 'ENDED') {
        setCallState('LISTENING');
      }
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      const currentSpeech = (final || interim || '').trim();
      if (currentSpeech) {
        latestSpokenTextRef.current = currentSpeech;
        setLiveTranscript(currentSpeech);

        // Interrupt AI speech immediately
        if (callStateRef.current === 'SPEAKING') {
          stopAudio();
          setCallState('LISTENING');
        }

        // RESET SILENCE TIMER: When user pauses for 600ms, trigger submission immediately!
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          const textToSubmit = latestSpokenTextRef.current;
          if (textToSubmit && textToSubmit.trim().length > 0) {
            try { recognition.stop(); } catch {}
            processUserSpeechFnRef.current(textToSubmit);
          }
        }, 600);
      }
    };

    recognition.onend = () => {
      const textToSubmit = latestSpokenTextRef.current.trim();
      if (textToSubmit.length > 0) {
        latestSpokenTextRef.current = '';
        setLiveTranscript('');
        processUserSpeechFnRef.current(textToSubmit);
      } else if (callStateRef.current === 'LISTENING' || callStateRef.current === 'CONNECTED') {
        setTimeout(() => {
          if (callStateRef.current === 'LISTENING' || callStateRef.current === 'CONNECTED') {
            try { recognition.start(); } catch {}
          }
        }, 200);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setTimeout(() => {
          if (callStateRef.current === 'LISTENING' || callStateRef.current === 'CONNECTED') {
            try { recognition.start(); } catch {}
          }
        }, 200);
        return;
      }
      if (event.error === 'not-allowed') {
        setErrorMessage('Microphone access was denied. Please allow mic access.');
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {}
  }, [currentLanguage, stopAudio]);

  startListeningFnRef.current = startListening;

  // ═══════════════════════════════════════════════════════════════
  // AI CHAT (Fast Turn Execution)
  // ═══════════════════════════════════════════════════════════════

  const handleProcessUserSpeech = useCallback(async (userText: string, forcedLang?: LanguageCode) => {
    const cleanText = userText.trim();
    if (!cleanText) return;

    stopListening();
    stopAudio();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: cleanText,
      timestamp,
      language: forcedLang || currentLanguage,
    }]);
    setCallState('THINKING');

    try {
      const response = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesRef.current,
          userInput: cleanText,
          callerName: 'Customer',
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || "I'd be happy to help. What service are you interested in?";
      const replyLang: LanguageCode = data.language || forcedLang || currentLanguage;
      setCurrentLanguage(replyLang);

      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: replyLang,
      }]);

      if (data.appointmentCreated) setLatestBooking(data.appointmentCreated);
      if (data.isTransfer) setShowHandoffModal(true);

      await speakText(aiReply, replyLang);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallback = "Welcome to Annu Beauty Salon! How may I assist you?";
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: 'en',
      }]);
      await speakText(fallback, 'en');
    }
  }, [currentLanguage, speakText, stopAudio, stopListening]);

  processUserSpeechFnRef.current = handleProcessUserSpeech;

  // ═══════════════════════════════════════════════════════════════
  // CALL LIFECYCLE
  // ═══════════════════════════════════════════════════════════════

  const handleStartCall = () => {
    setErrorMessage(null);
    setCallDuration(0);
    setLiveTranscript('');
    latestSpokenTextRef.current = '';
    setCallState('CONNECTED');

    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    const greeting =
      currentLanguage === 'hi'
        ? "नमस्ते! अन्नू ब्यूटी सैलून में आपका स्वागत है। मैं आपकी क्या मदद कर सकती हूँ?"
        : currentLanguage === 'te'
        ? "నమస్కారం! అన్ను బ్యూటీ సెలూన్‌కి స్వాగతం. నేను మీకు ఎలా సహాయపడగలను?"
        : "Hi! Welcome to Annu Beauty Salon. I'm your virtual receptionist. How can I help you today?";

    setMessages([{
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: currentLanguage,
    }]);

    speakText(greeting, currentLanguage);

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => setAudioStream(stream))
      .catch(() => console.warn('Mic access skipped'));
  };

  const handleEndCall = async () => {
    stopAudio();
    stopListening();

    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (audioStream) { audioStream.getTracks().forEach(t => t.stop()); setAudioStream(null); }

    const dur = callDuration;
    const msgs = [...messages];
    setCallState('ENDED');

    try {
      const langLabel = currentLanguage === 'hi' ? 'Hindi' : currentLanguage === 'te' ? 'Telugu' : 'English';
      const hasBooking = latestBooking !== null;
      const outcome = hasBooking ? 'Confirmed' : showHandoffModal ? 'Transferred to Human' : 'Inquiry Answered';

      await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerName: 'Demo Customer',
          callerPhone: '+91 90000 00000',
          durationSeconds: dur,
          durationFormatted: formatTimer(dur),
          language: langLabel,
          purpose: hasBooking ? 'Appointment Booking' : 'Service Inquiry',
          outcome,
          transcript: msgs.map(m => ({ sender: m.role === 'assistant' ? 'AI' : 'Customer', text: m.content, time: m.timestamp })),
          summary: `Call: ${formatTimer(dur)}, ${langLabel}, ${outcome}`,
          appointmentCreated: latestBooking || undefined,
        }),
      });
    } catch {}
  };

  const handleDoneSpeaking = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const text = latestSpokenTextRef.current || liveTranscript;
    if (text && text.trim()) {
      handleProcessUserSpeech(text);
    }
  };

  const handleScenarioSelect = (text: string, lang?: LanguageCode) => {
    if (lang) setCurrentLanguage(lang);

    if (callState === 'IDLE' || callState === 'ENDED') {
      setCallState('CONNECTED');
      timerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
      setMessages([]);
    }

    handleProcessUserSpeech(text, lang);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    if (callState === 'IDLE' || callState === 'ENDED') {
      handleScenarioSelect(textInput, currentLanguage);
    } else {
      handleProcessUserSpeech(textInput, currentLanguage);
    }
    setTextInput('');
  };

  const handleTestVoice = (persona: VoicePersona, lang: LanguageCode) => {
    const sample = lang === 'hi'
      ? "नमस्ते! मैं अन्नू ब्यूटी सैलून की रिसेप्शनिस्ट हूँ।"
      : lang === 'te'
      ? "నమస్కారం! నేను అన్ను బ్యూటీ సెలూన్ రిసెప్షనిస్ట్‌ని."
      : "Hi! Welcome to Annu Beauty Salon. How can I help you today?";
    speakText(sample, lang);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch {} }
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const isCallActive = callState !== 'IDLE' && callState !== 'ENDED';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-salon-50 via-white to-salon-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <audio ref={audioRef} playsInline preload="auto" className="hidden" />

      <div className="max-w-6xl mx-auto space-y-6">

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="font-bold underline text-amber-800">Dismiss</button>
          </div>
        )}

        {/* Speed & Persona Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-roseGold-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-roseGold-600" />
            <span className="text-xs font-bold text-salon-900">AI Speech Speed:</span>
            <div className="flex items-center gap-1.5">
              {[
                { label: '1.0x Normal', val: 1.0 },
                { label: '1.15x Fast', val: 1.15 },
                { label: '1.25x Ultra', val: 1.25 },
              ].map((s) => (
                <button
                  key={s.val}
                  type="button"
                  onClick={() => setSpeechSpeed(s.val)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    speechSpeed === s.val
                      ? 'bg-roseGold-600 text-white shadow-xs'
                      : 'bg-salon-50 hover:bg-salon-100 text-salon-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-salon-600 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast Turn-Taking Active (Auto-Submits in 600ms)</span>
          </div>
        </div>

        <VoicePersonaSelector
          selectedPersona={selectedPersona}
          onSelectPersona={setSelectedPersona}
          onTestVoice={handleTestVoice}
          currentLanguage={currentLanguage}
          isAiSpeaking={isAiSpeaking}
        />

        {/* Main Console */}
        <div className="bg-white rounded-3xl border border-roseGold-200/80 shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-salon-900 via-salon-950 to-roseGold-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-roseGold-900/40">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h1 className="text-base sm:text-lg font-bold tracking-tight">ANNU BEAUTY SALON</h1>
              </div>
              <p className="text-xs text-roseGold-200/90 font-medium tracking-wide">
                AI VOICE RECEPTIONIST &bull; FAST REAL-TIME SPEECH
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isCallActive && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-amber-300 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>{formatTimer(callDuration)}</span>
                </div>
              )}
              <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                callState === 'IDLE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : callState === 'SPEAKING' ? 'bg-roseGold-500/30 text-roseGold-200 border border-roseGold-400'
                : callState === 'LISTENING' ? 'bg-emerald-500 text-white animate-pulse'
                : callState === 'THINKING' ? 'bg-amber-500/30 text-amber-200 border border-amber-400'
                : 'bg-salon-800 text-salon-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  callState === 'IDLE' ? 'bg-emerald-400'
                  : callState === 'SPEAKING' ? 'bg-roseGold-300'
                  : callState === 'LISTENING' ? 'bg-white'
                  : 'bg-amber-300'
                }`} />
                <span>AI: {callState === 'IDLE' ? 'ONLINE' : callState}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-roseGold-200/70 min-h-[460px]">

            {/* Left: Voice UI */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between items-center bg-gradient-to-b from-white via-salon-50/30 to-roseGold-50/20">

              <div className="w-full flex justify-center mb-2">
                <LanguageBadge
                  currentLanguage={currentLanguage}
                  onLanguageChange={(lang) => {
                    setCurrentLanguage(lang);
                    if (isCallActive) {
                      const notice = lang === 'hi' ? "हाँ, अब मैं हिंदी में बात करूँगी।"
                        : lang === 'te' ? "అవును, ఇప్పుడు తెలుగులో మాట్లాడతాను."
                        : "Sure, switching to English.";
                      speakText(notice, lang);
                    }
                  }}
                />
              </div>

              <div className="my-auto py-4 flex flex-col items-center justify-center text-center w-full">
                {!isCallActive ? (
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={handleStartCall}
                      className="relative group p-6 rounded-full bg-gradient-to-br from-roseGold-600 via-roseGold-500 to-salon-800 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-20 h-20 rounded-full flex items-center justify-center">
                        <Mic className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-3 py-1 bg-salon-950 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-md">
                        Start Call
                      </span>
                    </button>
                    <p className="mt-6 text-xs text-salon-600 font-medium max-w-xs leading-relaxed">
                      Click <strong className="text-salon-900">Start Call</strong> to speak. Speak your question and pause — the AI receptionist responds immediately!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    {/* Animated Orb */}
                    <div className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl mb-3 ${
                      callState === 'SPEAKING' ? 'bg-gradient-to-br from-roseGold-500 to-roseGold-700 glow-rose animate-pulse'
                      : callState === 'LISTENING' ? 'bg-gradient-to-br from-emerald-500 to-teal-700 glow-emerald animate-ring-pulse'
                      : 'bg-gradient-to-br from-amber-500 to-amber-700 glow-gold'
                    }`}>
                      {callState === 'SPEAKING' ? <Volume2 className="w-12 h-12 text-white animate-bounce" />
                        : callState === 'LISTENING' ? <Mic className="w-12 h-12 text-white" />
                        : <Sparkles className="w-12 h-12 text-white animate-spin" />}
                    </div>

                    <h3 className="text-xs font-extrabold text-salon-950 uppercase tracking-widest mb-1">
                      {callState === 'SPEAKING' && <span className="text-roseGold-700">RECEPTIONIST SPEAKING...</span>}
                      {callState === 'LISTENING' && (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          LISTENING — SPEAK FREELY
                        </span>
                      )}
                      {callState === 'THINKING' && <span className="text-amber-700">PROCESSING...</span>}
                    </h3>

                    <VoiceVisualizer state={callState} audioStream={audioStream} isAiSpeaking={isAiSpeaking} />

                    {/* Live transcript + Done button */}
                    <div className="w-full mt-2 space-y-2">
                      {liveTranscript ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs text-left flex items-center justify-between gap-2 shadow-xs">
                          <div className="flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Hearing you:</span>
                            <p className="font-medium italic line-clamp-2">&ldquo;{liveTranscript}&rdquo;</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleDoneSpeaking}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold whitespace-nowrap shadow-xs"
                          >
                            Done &rarr;
                          </button>
                        </div>
                      ) : callState === 'LISTENING' && (
                        <p className="text-[11px] text-salon-500 text-center italic">Speak now... pauses auto-submit in 600ms</p>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 mt-4">
                      {isAiSpeaking && (
                        <button
                          type="button"
                          onClick={() => { stopAudio(); setCallState('LISTENING'); startListening(); }}
                          className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Mic className="w-3.5 h-3.5" /> Interrupt
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleEndCall}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <PhoneOff className="w-3.5 h-3.5" /> End Call
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full pt-3 border-t border-roseGold-100 flex items-center justify-between text-[11px] text-salon-600">
                <span>Jubilee Hills, Hyderabad</span>
                <span className="font-semibold text-roseGold-700">Tue-Sun 10am-8pm</span>
              </div>
            </div>

            {/* Right: Transcript */}
            <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-white">
              <TranscriptView messages={messages} isAiSpeaking={isAiSpeaking} />
              <form onSubmit={handleSendText} className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Or type your message here..."
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500 focus:border-transparent bg-salon-50/50"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-roseGold-600 hover:bg-roseGold-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          </div>
        </div>

        <QuickScenarioButtons onSelectScenario={handleScenarioSelect} disabled={callState === 'THINKING'} />
        <HumanHandoffModal isOpen={showHandoffModal} onClose={() => setShowHandoffModal(false)} />
        <BookingSuccessModal appointment={latestBooking} onClose={() => setLatestBooking(null)} />
      </div>
    </div>
  );
}
