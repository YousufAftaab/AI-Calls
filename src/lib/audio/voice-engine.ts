/**
 * ChatGPT-Style Ultra-Fast Real-Time Voice Engine for Annu Beauty Salon
 * With In-Memory Audio Pre-Loading for Zero-Latency Instant Playback
 */

export interface VoicePersona {
  id: string;
  name: string;
  gender: 'female' | 'male';
  style: string;
  description: string;
  pitch: number;
  rate: number;
  openAiVoice: 'nova' | 'shimmer' | 'alloy';
}

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'annu-warm',
    name: 'Annu (ChatGPT Ultra-Fast Voice)',
    gender: 'female',
    style: 'Instant Studio Voice Response',
    description: 'Instant zero-latency natural human salon receptionist audio',
    pitch: 1.0,
    rate: 0.96,
    openAiVoice: 'nova',
  },
  {
    id: 'priya-soft',
    name: 'Priya (Soft & Polite)',
    gender: 'female',
    style: 'Soft, gentle, luxury aesthetic',
    description: 'Calm and soothing voice tone',
    pitch: 1.05,
    rate: 0.94,
    openAiVoice: 'shimmer',
  },
  {
    id: 'kavya-crisp',
    name: 'Kavya (Clear & Expressive)',
    gender: 'female',
    style: 'Professional & crisp clarity',
    description: 'Clear articulation for busy salon desks',
    pitch: 1.0,
    rate: 0.98,
    openAiVoice: 'alloy',
  },
];

/**
 * Complete Studio Audio Pack for Instant Playback
 */
export const STUDIO_AUDIO_PACK: Record<string, string> = {
  // English Pack
  'greeting_en': '/audio/greeting_en.mp3',
  'bridal_inquiry_en': '/audio/bridal_inquiry_en.mp3',
  'sunday_time_en': '/audio/sunday_time_en.mp3',
  'available_11am_en': '/audio/available_11am_en.mp3',
  'confirmed_booking_en': '/audio/confirmed_booking_en.mp3',
  'hair_spa_en': '/audio/hair_spa_en.mp3',
  'facial_en': '/audio/facial_en.mp3',
  'nails_en': '/audio/nails_en.mp3',
  'hours_en': '/audio/hours_en.mp3',
  'location_en': '/audio/location_en.mp3',
  'pricing_en': '/audio/pricing_en.mp3',
  'handoff_en': '/audio/handoff_en.mp3',
  'reschedule_en': '/audio/reschedule_en.mp3',

  // Hindi Pack
  'greeting_hi': '/audio/greeting_hi.mp3',
  'bridal_inquiry_hi': '/audio/bridal_inquiry_hi.mp3',
  'sunday_time_hi': '/audio/sunday_time_hi.mp3',
  'available_11am_hi': '/audio/available_11am_hi.mp3',
  'hindi_confirmed': '/audio/hindi_confirmed.mp3',
  'hours_hi': '/audio/hours_hi.mp3',
  'location_hi': '/audio/location_hi.mp3',
  'pricing_hi': '/audio/pricing_hi.mp3',
  'handoff_hi': '/audio/handoff_hi.mp3',

  // Telugu Pack
  'greeting_te': '/audio/greeting_te.mp3',
  'bridal_inquiry_te': '/audio/bridal_inquiry_te.mp3',
  'sunday_time_te': '/audio/sunday_time_te.mp3',
  'available_11am_te': '/audio/available_11am_te.mp3',
  'telugu_confirmed': '/audio/telugu_confirmed.mp3',
  'hours_te': '/audio/hours_te.mp3',
  'location_te': '/audio/location_te.mp3',
  'pricing_te': '/audio/pricing_te.mp3',
  'handoff_te': '/audio/handoff_te.mp3',
};

// In-Memory Preloaded Audio Element Pool for Instant 0ms Playback
const preloadedAudioPool: Map<string, HTMLAudioElement> = new Map();

export function preloadAllVoiceClips() {
  if (typeof window === 'undefined') return;
  Object.entries(STUDIO_AUDIO_PACK).forEach(([key, url]) => {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      preloadedAudioPool.set(key, audio);
    } catch {}
  });
}

/**
 * Find matching pre-cached studio human audio for phrase with intelligent intent recognition
 */
export function getStudioVoiceClip(text: string, lang: 'en' | 'hi' | 'te'): string | null {
  const lower = text.toLowerCase();

  // 1. Human Handoff
  if (lower.includes('connect you right away') || lower.includes('someone from the salon team') || lower.includes('transfer you right away') || lower.includes('कृपया लाइन पर') || lower.includes('దయచేసి లైన్‌లో')) {
    if (lang === 'hi') return STUDIO_AUDIO_PACK.handoff_hi;
    if (lang === 'te') return STUDIO_AUDIO_PACK.handoff_te;
    return STUDIO_AUDIO_PACK.handoff_en;
  }

  // 2. Booking Confirmation
  if (lower.includes('confirmed for sunday') || lower.includes('appointment is confirmed') || lower.includes('कन्फर्म कर दी गई') || lower.includes('కన్ఫర్మ్ చేయబడింది') || lower.includes('all set!')) {
    if (lang === 'hi') return STUDIO_AUDIO_PACK.hindi_confirmed;
    if (lang === 'te') return STUDIO_AUDIO_PACK.telugu_confirmed;
    return STUDIO_AUDIO_PACK.confirmed_booking_en;
  }

  // 3. Slot Availability Check
  if (lower.includes('check availability') || lower.includes('11:00 am is available') || lower.includes('11 am on sunday is open') || lower.includes('स्लॉट उपलब्ध है') || lower.includes('స్లాట్ ఖాళీగా ఉంది')) {
    if (lang === 'hi') return STUDIO_AUDIO_PACK.available_11am_hi;
    if (lang === 'te') return STUDIO_AUDIO_PACK.available_11am_te;
    return STUDIO_AUDIO_PACK.available_11am_en;
  }

  // 4. Sunday time inquiry
  if (lower.includes('what time on sunday') || lower.includes('what time would you prefer') || lower.includes('किस समय आना पसंद') || lower.includes('ఏ సమయం అనుకూలంగా')) {
    if (lang === 'hi') return STUDIO_AUDIO_PACK.sunday_time_hi;
    if (lang === 'te') return STUDIO_AUDIO_PACK.sunday_time_te;
    return STUDIO_AUDIO_PACK.sunday_time_en;
  }

  // 5. Bridal Makeup Inquiry
  if (lower.includes('bridal packages') || lower.includes('which day would you like') || lower.includes('what day would you like') || lower.includes('ब्राइडल मेकअप') || lower.includes('బ్రైడల్ మేకప్')) {
    if (lang === 'hi') return STUDIO_AUDIO_PACK.bridal_inquiry_hi;
    if (lang === 'te') return STUDIO_AUDIO_PACK.bridal_inquiry_te;
    return STUDIO_AUDIO_PACK.bridal_inquiry_en;
  }

  // 6. Hair Spa, Facial, Nails
  if (lower.includes('hair spa') || lower.includes('keratin')) {
    return STUDIO_AUDIO_PACK.hair_spa_en;
  }
  if (lower.includes('hydra glow') || lower.includes('facial')) {
    return STUDIO_AUDIO_PACK.facial_en;
  }
  if (lower.includes('nail art') || lower.includes('gel extension')) {
    return STUDIO_AUDIO_PACK.nails_en;
  }

  // 7. Hours & Timings
  if (lower.includes('open tuesday through sunday') || lower.includes('closed on mondays') || lower.includes('10:00 am to 8:00 pm') || lower.includes('मंगलवार से रविवार') || lower.includes('మంగళవారం నుండి ఆదివారం')) {
    if (lang === 'hi') return STUDIO_AUDIO_PACK.hours_hi;
    if (lang === 'te') return STUDIO_AUDIO_PACK.hours_te;
    return STUDIO_AUDIO_PACK.hours_en;
  }

  // 8. Location & Address
  if (lower.includes('road number 36') || lower.includes('jubilee hills') || lower.includes('metro pillar 1400') || lower.includes('जुबली हिल्स') || lower.includes('జూబ్లీ హిల్స్')) {
    if (lang === 'hi') return STUDIO_AUDIO_PACK.location_hi;
    if (lang === 'te') return STUDIO_AUDIO_PACK.location_te;
    return STUDIO_AUDIO_PACK.location_en;
  }

  // 9. Pricing & Rates
  if (lower.includes('12,000') || lower.includes('3,500') || lower.includes('rates') || lower.includes('pricing') || lower.includes('रुपये') || lower.includes('రూపాయల')) {
    if (lang === 'hi') return STUDIO_AUDIO_PACK.pricing_hi;
    if (lang === 'te') return STUDIO_AUDIO_PACK.pricing_te;
    return STUDIO_AUDIO_PACK.pricing_en;
  }

  // 10. Reschedule
  if (lower.includes('reschedule') || lower.includes('रीशेड्यूल') || lower.includes('రీషెడ్యూల్')) {
    return STUDIO_AUDIO_PACK.reschedule_en;
  }

  // 11. Greetings
  if (lower.includes('welcome to annu') || lower.includes('virtual receptionist') || lower.includes('how can i help') || lower.includes('how may i help')) {
    return STUDIO_AUDIO_PACK.greeting_en;
  }
  if (lang === 'hi' && (lower.includes('नमस्ते') || lower.includes('स्वागत') || lower.includes('मदद कर सकती'))) {
    return STUDIO_AUDIO_PACK.greeting_hi;
  }
  if (lang === 'te' && (lower.includes('నమస్కారం') || lower.includes('స్వాగతం') || lower.includes('సహాయపడగలను'))) {
    return STUDIO_AUDIO_PACK.greeting_te;
  }

  return null;
}

/**
 * Natural Neural Voice Fallback
 */
export function getBestNaturalVoice(
  voices: SpeechSynthesisVoice[],
  lang: 'en' | 'hi' | 'te'
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const naturalKeywords = ['natural', 'neural', 'online', 'google', 'siri', 'premium', 'enhanced'];

  if (lang === 'hi') {
    const hiVoices = voices.filter(v => v.lang.includes('hi') || v.lang.includes('IN') || v.name.toLowerCase().includes('hindi'));
    const naturalHi = hiVoices.find(v => naturalKeywords.some(kw => v.name.toLowerCase().includes(kw)));
    if (naturalHi) return naturalHi;
    if (hiVoices.length > 0) return hiVoices[0];
  }

  if (lang === 'te') {
    const teVoices = voices.filter(v => v.lang.includes('te') || v.lang.includes('telugu'));
    const naturalTe = teVoices.find(v => naturalKeywords.some(kw => v.name.toLowerCase().includes(kw)));
    if (naturalTe) return naturalTe;
    if (teVoices.length > 0) return teVoices[0];
  }

  const enIndianVoices = voices.filter(v => 
    (v.lang === 'en-IN' || v.lang.includes('en_IN') || v.name.toLowerCase().includes('india'))
  );
  const naturalIndianEn = enIndianVoices.find(v => naturalKeywords.some(kw => v.name.toLowerCase().includes(kw)));
  if (naturalIndianEn) return naturalIndianEn;
  if (enIndianVoices.length > 0) return enIndianVoices[0];

  const enVoices = voices.filter(v => v.lang.startsWith('en'));
  const naturalEn = enVoices.find(v => 
    naturalKeywords.some(kw => v.name.toLowerCase().includes(kw)) &&
    (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('jenny') || v.name.toLowerCase().includes('aria') || v.name.toLowerCase().includes('samantha'))
  );
  if (naturalEn) return naturalEn;

  const anyNatural = enVoices.find(v => naturalKeywords.some(kw => v.name.toLowerCase().includes(kw)));
  if (anyNatural) return anyNatural;

  return enVoices[0] || voices[0] || null;
}

export function humanizeSpeechText(text: string): string {
  return text
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*-\s*/g, ', ')
    .replace(/^(Hi|Hello|Namaste|Namaskaram),?/i, '$1,')
    .replace(/₹\s*([0-9,]+)/g, '$1 rupees');
}
