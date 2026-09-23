import { Appointment, CallRecord } from './types';

// Initial realistic seed data for Annu Beauty Salon
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    customerName: 'Pooja Sharma',
    phone: '+91 98490 11223',
    serviceName: 'Bridal Makeup (HD / Airbrush)',
    date: 'Sunday, Oct 25',
    time: '11:00 AM',
    status: 'Confirmed',
    notes: 'Requires Airbrush trial and saree draping assistance',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isDemo: true,
  },
  {
    id: 'apt-102',
    customerName: 'Sneha Reddy',
    phone: '+91 97000 44556',
    serviceName: 'Hydra Glow & Anti-Aging Facial',
    date: 'Tomorrow',
    time: '03:30 PM',
    status: 'Confirmed',
    notes: 'Sensitive skin, requested fruit extract mask',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    isDemo: true,
  },
  {
    id: 'apt-103',
    customerName: 'Ananya Rao',
    phone: '+91 99887 76655',
    serviceName: 'Hair Spa & Keratin Treatment',
    date: 'Saturday',
    time: '05:00 PM',
    status: 'Confirmed',
    notes: 'Post-coloring hair care',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    isDemo: true,
  }
];

export const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'call-201',
    callerName: 'Pooja Sharma',
    callerPhone: '+91 98490 11223',
    durationSeconds: 142,
    durationFormatted: '02:22',
    language: 'English',
    purpose: 'Appointment Booking',
    outcome: 'Confirmed',
    transcript: [
      { sender: 'AI', text: "Hi, welcome to Annu Beauty Salon. I'm the salon's virtual receptionist. How may I help you?", time: '00:02' },
      { sender: 'Customer', text: "Hi! I would like to book a bridal makeup appointment for this Sunday.", time: '00:08' },
      { sender: 'AI', text: "Wonderful! We would love to host you. What time on Sunday would you prefer?", time: '00:15' },
      { sender: 'Customer', text: "Is 11:00 AM available?", time: '00:21' },
      { sender: 'AI', text: "Let me check availability for Sunday at 11:00 AM... Yes, that slot is open with our senior bridal artist. May I have your name to confirm?", time: '00:32' },
      { sender: 'Customer', text: "Pooja Sharma.", time: '00:45' },
      { sender: 'AI', text: "Perfect Pooja! Your Bridal Makeup appointment is confirmed for Sunday at 11:00 AM. We look forward to seeing you!", time: '01:02' }
    ],
    summary: 'Customer booked HD Bridal Makeup package for Sunday at 11:00 AM.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'call-202',
    callerName: 'Radha Rani',
    callerPhone: '+91 98111 22334',
    durationSeconds: 98,
    durationFormatted: '01:38',
    language: 'Hindi',
    purpose: 'Pricing Inquiry',
    outcome: 'Inquiry Answered',
    transcript: [
      { sender: 'AI', text: "नमस्ते! अन्नू ब्यूटी सैलून में आपका स्वागत है। मैं आपकी क्या मदद कर सकती हूँ?", time: '00:02' },
      { sender: 'Customer', text: "नमस्ते, मुझे पार्टी मेकअप और हेयर स्टाइलिंग का चार्ज जानना था।", time: '00:10' },
      { sender: 'AI', text: "हमारा पार्टी मेकअप पैकेज लगभग ₹3,500 से ₹6,000 के बीच है, जिसमें बेसिक हेयर स्टाइलिंग भी शामिल है।", time: '00:22' },
      { sender: 'Customer', text: "बहुत अच्छा, धन्यवाद! मैं बाद में बुक करूँगी।", time: '00:35' },
      { sender: 'AI', text: "आपका स्वागत है! जब भी आप तैयार हों, हमें दोबारा कॉल कर सकती हैं। आपका दिन शुभ हो!", time: '00:48' }
    ],
    summary: 'Inquired about Party Makeup and Hair Styling pricing in Hindi.',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'call-203',
    callerName: 'Kavitha Devi',
    callerPhone: '+91 94400 33221',
    durationSeconds: 75,
    durationFormatted: '01:15',
    language: 'Telugu',
    purpose: 'Salon Hours & Info',
    outcome: 'Inquiry Answered',
    transcript: [
      { sender: 'AI', text: "నమస్కారం! అన్ను బ్యూటీ సెలూన్‌కి స్వాగతం. నేను మీకు ఎలా సహాయపడగలను?", time: '00:02' },
      { sender: 'Customer', text: "సెలూన్ సోమవారం తెరిచి ఉంటుందా?", time: '00:10' },
      { sender: 'AI', text: "అన్ను బ్యూటీ సెలూన్ మంగళవారం నుండి ఆదివారం వరకు ఉదయం 10 నుండి రాత్రి 8 గంటల వరకు తెరిచి ఉంటుంది. సోమవారం సెలవు.", time: '00:24' },
      { sender: 'Customer', text: "సరేనండి, ధన్యవాదాలు.", time: '00:32' },
      { sender: 'AI', text: "సంతోషం అండి! మీకు ఏదైనా సేవ కావాలంటే ఎప్పుడైనా సంప్రదించండి.", time: '00:45' }
    ],
    summary: 'Inquired about Monday salon opening hours in Telugu.',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

// Global in-memory persistence for Server API routes
const globalStore = global as unknown as {
  __ANNU_APPOINTMENTS__?: Appointment[];
  __ANNU_CALLS__?: CallRecord[];
};

if (!globalStore.__ANNU_APPOINTMENTS__) {
  globalStore.__ANNU_APPOINTMENTS__ = [...INITIAL_APPOINTMENTS];
}

if (!globalStore.__ANNU_CALLS__) {
  globalStore.__ANNU_CALLS__ = [...INITIAL_CALLS];
}

export const getStoredAppointments = (): Appointment[] => {
  return globalStore.__ANNU_APPOINTMENTS__ || INITIAL_APPOINTMENTS;
};

export const setStoredAppointments = (appts: Appointment[]) => {
  globalStore.__ANNU_APPOINTMENTS__ = appts;
};

export const getStoredCalls = (): CallRecord[] => {
  return globalStore.__ANNU_CALLS__ || INITIAL_CALLS;
};

export const setStoredCalls = (calls: CallRecord[]) => {
  globalStore.__ANNU_CALLS__ = calls;
};
