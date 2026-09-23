import { NextRequest, NextResponse } from 'next/server';
import { ultravoxWhatsAppProvider } from '@/lib/providers/ultravox-whatsapp-provider';
import { AI_SYSTEM_PROMPT } from '@/lib/salon-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language = 'en', callerPhone = '+91 90000 00000' } = body;

    const session = await ultravoxWhatsAppProvider.createCallSession({
      systemPrompt: AI_SYSTEM_PROMPT,
      languageHint: language,
      model: 'fixie-ai/ultravox-v0_4',
      voice: language === 'hi' ? 'Swara-Hindi' : language === 'te' ? 'Shruti-Telugu' : 'Neerja-IndianEnglish',
    });

    return NextResponse.json({
      success: true,
      message: 'WhatsApp Voice Call bridge to Ultravox AI initiated',
      session,
      callerPhone,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create Ultravox WhatsApp session' }, { status: 500 });
  }
}
