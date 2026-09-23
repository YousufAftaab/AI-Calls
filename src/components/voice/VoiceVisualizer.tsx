'use client';

import React, { useEffect, useRef } from 'react';
import { CallState } from '@/lib/types';

interface VoiceVisualizerProps {
  state: CallState;
  audioStream?: MediaStream | null;
  isAiSpeaking?: boolean;
}

export default function VoiceVisualizer({ state, audioStream, isAiSpeaking }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<any>(null);

  useEffect(() => {
    if (!audioStream) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(audioStream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    } catch (e) {
      console.warn('Audio Context initialization skipped or not supported:', e);
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [audioStream]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isListening = state === 'LISTENING';
      const isSpeaking = state === 'SPEAKING' || isAiSpeaking;
      const isThinking = state === 'THINKING';

      // Visual waveform bars
      const numBars = 24;
      const barWidth = 4;
      const gap = 6;
      const totalWidth = numBars * (barWidth + gap) - gap;
      const startX = (width - totalWidth) / 2;

      let freqData: Uint8Array | null = null;
      if (analyserRef.current && dataArrayRef.current && isListening) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        freqData = dataArrayRef.current;
      }

      for (let i = 0; i < numBars; i++) {
        let barHeight = 6; // default min height

        if (isSpeaking) {
          // Dynamic undulating sine wave for AI speaking
          const time = Date.now() / 150;
          const wave = Math.sin(time + i * 0.4) * 0.5 + 0.5;
          barHeight = Math.max(8, wave * (height * 0.75));
        } else if (isListening) {
          if (freqData && freqData.length > 0) {
            const freqIndex = Math.floor((i / numBars) * (freqData.length / 2));
            const val = freqData[freqIndex] || 0;
            barHeight = Math.max(6, (val / 255) * (height * 0.8));
          } else {
            // Simulated user speech wave
            const time = Date.now() / 200;
            const wave = Math.sin(time + i * 0.3) * 0.5 + 0.5;
            barHeight = Math.max(6, wave * (height * 0.5));
          }
        } else if (isThinking) {
          const time = Date.now() / 250;
          const wave = Math.sin(time + i * 0.6) * 0.5 + 0.5;
          barHeight = Math.max(4, wave * (height * 0.4));
        }

        const x = startX + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        // Color styling based on state
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isSpeaking) {
          gradient.addColorStop(0, '#e07a5f'); // roseGold accent
          gradient.addColorStop(1, '#b87364');
        } else if (isListening) {
          gradient.addColorStop(0, '#10b981'); // emerald
          gradient.addColorStop(1, '#059669');
        } else if (isThinking) {
          gradient.addColorStop(0, '#f59e0b'); // amber
          gradient.addColorStop(1, '#d97706');
        } else {
          gradient.addColorStop(0, '#d2bab0'); // muted salon tone
          gradient.addColorStop(1, '#a18073');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state, isAiSpeaking]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <canvas
        ref={canvasRef}
        width={280}
        height={60}
        className="w-full max-w-[280px] h-[60px]"
      />
    </div>
  );
}
