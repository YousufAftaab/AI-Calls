import OpenAI from 'openai';
import { appointmentProvider } from '../providers/appointment-provider';
import { SALON_SERVICES, SALON_INFO, AI_SYSTEM_PROMPT } from '../salon-data';
import { ChatMessage, Appointment } from '../types';

export const AI_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'check_availability',
      description: 'Check if a specific time slot on a given date is available for salon appointment.',
      parameters: {
        type: 'object',
        properties: {
          service: { type: 'string', description: 'Name of the service (e.g., Bridal Makeup, Hair Spa, Hydra Facial)' },
          date: { type: 'string', description: 'Day or date requested (e.g., Sunday, Oct 25, Tomorrow)' },
          time: { type: 'string', description: 'Time of day (e.g., 11:00 AM, 3:30 PM)' },
        },
        required: ['date', 'time'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'book_appointment',
      description: 'Create and confirm a new salon appointment after the customer agrees to the time slot.',
      parameters: {
        type: 'object',
        properties: {
          customerName: { type: 'string', description: 'Name of the customer' },
          phone: { type: 'string', description: 'Phone number of customer' },
          service: { type: 'string', description: 'Name of service booked' },
          date: { type: 'string', description: 'Date of booking' },
          time: { type: 'string', description: 'Time slot' },
          notes: { type: 'string', description: 'Any special requests or details' }
        },
        required: ['customerName', 'service', 'date', 'time'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'transfer_to_human',
      description: 'Simulate human transfer when customer requests to talk to a human, manager, or complex inquiry.',
      parameters: {
        type: 'object',
        properties: {
          reason: { type: 'string', description: 'Why customer wants human handoff' },
        },
        required: ['reason'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_salon_info',
      description: 'Get verified salon hours, location, contact, or service pricing demo information.',
      parameters: {
        type: 'object',
        properties: {
          topic: { type: 'string', enum: ['hours', 'location', 'pricing', 'bridal_policy'], description: 'Topic to query' },
        },
        required: ['topic'],
      },
    },
  },
];

// Tool execution handler
export async function executeToolCall(name: string, args: Record<string, unknown>): Promise<{ result: unknown; appointmentCreated?: Appointment; isTransfer?: boolean }> {
  switch (name) {
    case 'check_availability': {
      const service = (args.service as string) || 'Service';
      const date = (args.date as string) || 'Today';
      const time = (args.time as string) || '11:00 AM';
      const availability = await appointmentProvider.checkAvailability(service, date, time);
      return { result: availability };
    }
    case 'book_appointment': {
      const customerName = (args.customerName as string) || 'Valued Guest';
      const phone = (args.phone as string) || '+91 98000 00000';
      const service = (args.service as string) || 'Bridal Makeup';
      const date = (args.date as string) || 'Sunday';
      const time = (args.time as string) || '11:00 AM';
      const notes = (args.notes as string) || 'Booked via AI Receptionist Voice Demo';

      const appt = await appointmentProvider.createAppointment({
        customerName,
        phone,
        serviceName: service,
        date,
        time,
        status: 'Confirmed',
        notes,
        isDemo: true,
      });

      return {
        result: {
          success: true,
          message: `Appointment successfully booked for ${customerName} for ${service} on ${date} at ${time}.`,
          appointmentId: appt.id,
        },
        appointmentCreated: appt,
      };
    }
    case 'transfer_to_human': {
      return {
        result: {
          status: 'transfer_initiated',
          message: 'Connecting to Annu Beauty Salon front desk...',
          deskPhone: SALON_INFO.phone,
        },
        isTransfer: true,
      };
    }
    case 'get_salon_info': {
      const topic = args.topic as string;
      if (topic === 'hours') {
        return { result: SALON_INFO.workingHours };
      } else if (topic === 'location') {
        return { result: { address: SALON_INFO.address, landmark: 'Near Jubilee Hills Metro' } };
      } else if (topic === 'pricing') {
        return { result: SALON_SERVICES.map(s => ({ name: s.name, price: s.demoPrice, duration: s.durationFormatted })) };
      }
      return { result: SALON_INFO };
    }
    default:
      return { result: { error: `Tool ${name} not found` } };
  }
}

// Smart Native Fallback Engine for offline/demo zero-dependency execution
export async function processOfflineConversation(
  messages: ChatMessage[],
  userInput: string
): Promise<{
  reply: string;
  language: 'en' | 'hi' | 'te';
  appointmentCreated?: Appointment;
  isTransfer?: boolean;
}> {
  const text = userInput.trim().toLowerCase();
  
  // 1. Language detection
  const isTelugu = /[\u0C00-\u0C7F]/.test(userInput) || text.includes('naaku') || text.includes('cheyyali') || text.includes('somavaram') || text.includes('namaskaram') || text.includes('telugu');
  const isHindi = /[\u0900-\u097F]/.test(userInput) || text.includes('mujhe') || text.includes('karna') || text.includes('kahiye') || text.includes('namaste') || text.includes('samay') || text.includes('kitna') || text.includes('hindi');
  
  const lang: 'en' | 'hi' | 'te' = isTelugu ? 'te' : isHindi ? 'hi' : 'en';

  // 2. Human Transfer detection
  if (
    text.includes('human') || text.includes('person') || text.includes('talk to someone') ||
    text.includes('speak with someone') || text.includes('manager') || text.includes('baat karni') ||
    text.includes('matladali') || text.includes('transfer')
  ) {
    if (lang === 'hi') {
      return {
        reply: "ज़रूर, मैं आपको सैलून टीम के साथ कनेक्ट कर रही हूँ। कृपया लाइन पर बने रहें।",
        language: 'hi',
        isTransfer: true
      };
    } else if (lang === 'te') {
      return {
        reply: "ఖచ్చితంగా, నేను మిమ్మల్ని సెలూన్ టీమ్‌తో కనెక్ట్ చేస్తున్నాను. దయచేసి లైన్‌లో ఉండండి.",
        language: 'te',
        isTransfer: true
      };
    } else {
      return {
        reply: "Of course. I'll connect you right away with someone from the salon team. Please hold.",
        language: 'en',
        isTransfer: true
      };
    }
  }

  // 3. Rescheduling or Cancellation
  if (text.includes('cancel') || text.includes('radd') || text.includes('reschedule') || text.includes('badalna')) {
    if (lang === 'hi') {
      return {
        reply: "मैं आपकी अपॉइंटमेंट को रीशेड्यूल या कैंसिल करने में मदद कर सकती हूँ। आप कौन सा नया समय या तारीख पसंद करेंगी?",
        language: 'hi'
      };
    } else if (lang === 'te') {
      return {
        reply: "నేను మీ అపాయింట్‌మెంట్‌ను రద్దు చేయడానికి లేదా రీషెడ్యూల్ చేయడానికి సహాయపడగలను. మీకు ఏ కొత్త సమయం కావాలి?",
        language: 'te'
      };
    } else {
      return {
        reply: "I can help you reschedule or cancel your appointment. What new date or time would you prefer?",
        language: 'en'
      };
    }
  }

  // 4. Working hours & timings
  if (text.includes('time') || text.includes('hour') || text.includes('open') || text.includes('close') || text.includes('somwar') || text.includes('monday') || text.includes('samay') || text.includes('timing')) {
    if (lang === 'hi') {
      return {
        reply: "अन्नू ब्यूटी सैलून मंगलवार से रविवार सुबह 10:00 बजे से रात 8:00 बजे तक खुला रहता है। सोमवार को हमारा सैलून बंद रहता है।",
        language: 'hi'
      };
    } else if (lang === 'te') {
      return {
        reply: "అన్ను బ్యూటీ సెలూన్ మంగళవారం నుండి ఆదివారం వరకు ఉదయం 10:00 నుండి రాత్రి 8:00 వరకు తెరిచి ఉంటుంది. సోమవారం సెలవు.",
        language: 'te'
      };
    } else {
      return {
        reply: "Annu Beauty Salon is open Tuesday through Sunday from 10:00 AM to 8:00 PM. We are closed on Mondays.",
        language: 'en'
      };
    }
  }

  // 5. Location
  if (text.includes('where') || text.includes('location') || text.includes('address') || text.includes('kahan') || text.includes('ekada') || text.includes('place')) {
    if (lang === 'hi') {
      return {
        reply: "हमारा सैलून जुबली हिल्स, रोड नंबर 36, हैदराबाद में मेट्रो पिलर 1400 के पास स्थित है।",
        language: 'hi'
      };
    } else if (lang === 'te') {
      return {
        reply: "మా సెలూన్ జూబ్లీ హిల్స్, రోడ్ నంబర్ 36, హైదరాబాద్ లో మెట్రో పిల్లర్ 1400 దగ్గర ఉంది.",
        language: 'te'
      };
    } else {
      return {
        reply: "We are located at Road No. 36, Jubilee Hills, Hyderabad, near Metro Pillar 1400 (Demo Location).",
        language: 'en'
      };
    }
  }

  // 6. Pricing & Services Inquiry
  if (text.includes('price') || text.includes('cost') || text.includes('rate') || text.includes('charge') || text.includes('kitna') || text.includes('dharalu') || text.includes('services')) {
    if (text.includes('bridal') || text.includes('dulhan')) {
      if (lang === 'hi') {
        return {
          reply: "हमारे ब्राइडल मेकअप (HD / एयरब्रश) पैकेज की कीमत लगभग ₹12,000 से ₹20,000 है, जिसमें हेयर स्टाइलिंग और साड़ी ड्रेपिंग शामिल है। क्या आप बुकिंग करना चाहेंगी?",
          language: 'hi'
        };
      } else if (lang === 'te') {
        return {
          reply: "మా బ్రైడల్ మేకప్ ప్యాకేజీ దాదాపు ₹12,000 నుండి ₹20,000 వరకు ఉంటుంది, ఇందులో హెయిర్ స్టైలింగ్ కూడా ఉంటుంది. మీరు బుక్ చేయాలనుకుంటున్నారా?",
          language: 'te'
        };
      } else {
        return {
          reply: "Our Bridal Makeup packages range from ₹12,000 to ₹20,000 (demo pricing), including HD/Airbrush makeup and hair styling. Would you like to book a slot?",
          language: 'en'
        };
      }
    }
    
    if (lang === 'hi') {
      return {
        reply: "हम ब्राइडल मेकअप, पार्टी मेकअप, हेयर स्पा, हाइड्रा फेशियल, और नेल आर्ट जैसी प्रीमियम सेवाएँ प्रदान करते हैं। आप किस सेवा की जानकारी चाहती हैं?",
        language: 'hi'
      };
    } else if (lang === 'te') {
      return {
        reply: "మేము బ్రైడల్ మేకప్, పార్టీ మేకప్, హెయిర్ స్పా, హైడ్రా ఫేషియల్ మరియు నెయిల్ ఆర్ట్ వంటి సేవలను అందిస్తున్నాము. మీరు ఏ సేవ గురించి తెలుసుకోవాలనుకుంటున్నారు?",
        language: 'te'
      };
    } else {
      return {
        reply: "We offer Bridal & Party Makeup, Hair Spa & Keratin, Hydra Glow Facial, and Nail Art. Which service are you interested in?",
        language: 'en'
      };
    }
  }

  // 7. Booking Flow
  // Check if conversation already had intent to book and user is providing time/date/confirmation
  const historyText = messages.map(m => m.content).join(' ').toLowerCase();

  // If user says "Yes" or confirmation after slot check:
  if (
    (text === 'yes' || text === 'sure' || text === 'ha' || text === 'haan' || text === 'avunu' || text.includes('confirm') || text.includes('book it') || text.includes('please book')) &&
    (historyText.includes('available') || historyText.includes('sunday') || historyText.includes('11') || historyText.includes('makeup'))
  ) {
    const newAppt = await appointmentProvider.createAppointment({
      customerName: 'Demo Customer',
      phone: '+91 90000 00000',
      serviceName: 'Bridal Makeup (HD / Airbrush)',
      date: 'Sunday',
      time: '11:00 AM',
      status: 'Confirmed',
      notes: 'Confirmed via AI Receptionist Voice Call',
      isDemo: true,
    });

    if (lang === 'hi') {
      return {
        reply: "बहुत बढ़िया! आपकी ब्राइडल मेकअप अपॉइंटमेंट रविवार सुबह 11:00 बजे के लिए कन्फर्म कर दी गई है। अन्नू ब्यूटी सैलून में आपका स्वागत है!",
        language: 'hi',
        appointmentCreated: newAppt
      };
    } else if (lang === 'te') {
      return {
        reply: "చాలా సంతోషం! ఆదివారం ఉదయం 11:00 గంటలకు మీ బ్రైడల్ మేకప్ అపాయింట్‌మెంట్ కన్ఫర్మ్ చేయబడింది. అన్ను బ్యూటీ సెలూన్ మీ కోసం ఎదురుచూస్తోంది!",
        language: 'te',
        appointmentCreated: newAppt
      };
    } else {
      return {
        reply: "Perfect! Your Bridal Makeup appointment is confirmed for Sunday at 11:00 AM. We look forward to seeing you at Annu Beauty Salon!",
        language: 'en',
        appointmentCreated: newAppt
      };
    }
  }

  // If user specifies time (e.g. 11 AM, 3 PM, Sunday at 11):
  if (text.includes('11') || text.includes('11 am') || text.includes('11:00') || text.includes('12') || text.includes('3') || text.includes('4') || text.includes('5')) {
    const extractedTime = text.includes('11') ? '11:00 AM' : text.includes('3') ? '03:00 PM' : text.includes('4') ? '04:00 PM' : '11:00 AM';
    const extractedDate = text.includes('sunday') || historyText.includes('sunday') ? 'Sunday' : text.includes('tomorrow') ? 'Tomorrow' : 'Sunday';
    
    // Check availability
    const avail = await appointmentProvider.checkAvailability('Bridal Makeup', extractedDate, extractedTime);
    
    if (avail.available) {
      if (lang === 'hi') {
        return {
          reply: `मैंने चेक किया है, ${extractedDate} को ${extractedTime} का स्लॉट उपलब्ध है। क्या मैं इसे आपके नाम से बुक कर दूँ?`,
          language: 'hi'
        };
      } else if (lang === 'te') {
        return {
          reply: `నేను పరిశీలించాను, ${extractedDate} న ${extractedTime} స్లాట్ ఖాళీగా ఉంది. నేను దీన్ని మీ కోసం బుక్ చేయమంటారా?`,
          language: 'te'
        };
      } else {
        return {
          reply: `Let me check availability... Yes, ${extractedTime} is available on ${extractedDate}. Would you like me to book it for you?`,
          language: 'en'
        };
      }
    }
  }

  // If user specifies date or mentions booking bridal makeup / appointment:
  if (text.includes('sunday') || text.includes('ravivar') || text.includes('adivaram') || text.includes('tomorrow') || text.includes('today')) {
    const day = text.includes('sunday') ? 'Sunday' : text.includes('ravivar') ? 'रविवार' : text.includes('adivaram') ? 'ఆదివారం' : 'Sunday';
    if (lang === 'hi') {
      return {
        reply: `ज़रूर, ${day} को आप किस समय आना पसंद करेंगी? (जैसे कि सुबह 11:00 बजे या शाम को)`,
        language: 'hi'
      };
    } else if (lang === 'te') {
      return {
        reply: `తప్పకుండా, ${day} న మీరు ఏ సమయానికి రాగలరు? (ఉదాహరణకు ఉదయం 11:00 గంటలకు)`,
        language: 'te'
      };
    } else {
      return {
        reply: `Sure. What time on ${day} would you prefer?`,
        language: 'en'
      };
    }
  }

  if (text.includes('bridal') || text.includes('makeup') || text.includes('book') || text.includes('appointment') || text.includes('facial') || text.includes('hair')) {
    if (lang === 'hi') {
      return {
        reply: "बिल्कुल, मैं आपकी ब्राइडल मेकअप अपॉइंटमेंट बुक कर सकती हूँ। आप किस दिन आना पसंद करेंगी?",
        language: 'hi'
      };
    } else if (lang === 'te') {
      return {
        reply: "తప్పకుండా, నేను మీ బ్రైడల్ మేకప్ అపాయింట్‌మెంట్ బుక్ చేస్తాను. మీరు ఏ రోజున రావాలనుకుంటున్నారు?",
        language: 'te'
      };
    } else {
      return {
        reply: "Absolutely. What day would you like to book for?",
        language: 'en'
      };
    }
  }

  // Default greeting / helpful response
  if (lang === 'hi') {
    return {
      reply: "नमस्ते! मैं अन्नू ब्यूटी सैलून की वर्चुअल रिसेप्शनिस्ट हूँ। मैं आपकी अपॉइंटमेंट बुकिंग या सेवाओं की जानकारी में कैसे मदद कर सकती हूँ?",
      language: 'hi'
    };
  } else if (lang === 'te') {
    return {
      reply: "నమస్కారం! నేను అన్ను బ్యూటీ సెలూన్ వర్చువల్ రిసెప్షనిస్ట్‌ని. అపాయింట్‌మెంట్ బుకింగ్ లేదా సేవల వివరాల కోసం నేను మీకు ఎలా సహాయపడగలను?",
      language: 'te'
    };
  }

  return {
    reply: "Hi, welcome to Annu Beauty Salon. I'm the salon's virtual receptionist. How may I help you today?",
    language: 'en'
  };
}
