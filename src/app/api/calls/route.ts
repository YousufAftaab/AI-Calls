import { NextRequest, NextResponse } from 'next/server';
import { getStoredCalls, setStoredCalls } from '@/lib/storage';
import { CallRecord } from '@/lib/types';

export async function GET() {
  const calls = getStoredCalls();
  return NextResponse.json({ calls });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = getStoredCalls();

    const newCall: CallRecord = {
      id: `call-${Date.now().toString().slice(-6)}`,
      callerName: body.callerName || 'Demo Customer',
      callerPhone: body.callerPhone || '+91 90000 00000',
      durationSeconds: body.durationSeconds || 30,
      durationFormatted: body.durationFormatted || '00:30',
      language: body.language || 'English',
      purpose: body.purpose || 'Appointment Booking',
      outcome: body.outcome || 'Confirmed',
      transcript: body.transcript || [],
      summary: body.summary || 'Demo voice conversation with Annu Beauty Salon AI Receptionist.',
      appointmentCreated: body.appointmentCreated,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newCall, ...current];
    setStoredCalls(updated);

    return NextResponse.json({ call: newCall }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record call' }, { status: 500 });
  }
}
