import { SalonInfo, SalonService } from './types';

export const DEMO_NOTICE = "DEMO DATA — For demonstration purposes only. Values can be customized for real business use.";

export const SALON_SERVICES: SalonService[] = [
  {
    id: 'bridal-makeup',
    name: 'Bridal Makeup (HD / Airbrush)',
    category: 'Makeup',
    durationMinutes: 180,
    durationFormatted: '3 hours',
    demoPrice: '₹12,000 - ₹20,000 (DEMO)',
    description: 'Complete luxury bridal package including HD/Airbrush makeup, hair styling, saree draping, and jewelry setting.',
    isPopular: true,
  },
  {
    id: 'party-makeup',
    name: 'Party / Reception Makeup',
    category: 'Makeup',
    durationMinutes: 90,
    durationFormatted: '1.5 hours',
    demoPrice: '₹3,500 - ₹6,000 (DEMO)',
    description: 'Glamorous or subtle makeup look tailored for parties, sangeet, or family events with basic hairstyling.',
    isPopular: true,
  },
  {
    id: 'hair-spa-keratin',
    name: 'Hair Spa & Keratin Treatment',
    category: 'Hair',
    durationMinutes: 120,
    durationFormatted: '2 hours',
    demoPrice: '₹2,500 - ₹5,000 (DEMO)',
    description: 'Deep nourishing hair repair, smoothing therapy, scalp detox, and relaxing massage.',
    isPopular: true,
  },
  {
    id: 'hydra-facial',
    name: 'Hydra Glow & Anti-Aging Facial',
    category: 'Skin',
    durationMinutes: 75,
    durationFormatted: '1 hour 15 min',
    demoPrice: '₹2,800 - ₹4,500 (DEMO)',
    description: 'Deep pore cleansing, ultrasonic hydration, skin rejuvenation, and glowing face mask.',
    isPopular: true,
  },
  {
    id: 'nail-art',
    name: 'Nail Art & Gel Extensions',
    category: 'Nails',
    durationMinutes: 60,
    durationFormatted: '1 hour',
    demoPrice: '₹1,500 - ₹3,000 (DEMO)',
    description: 'Custom acrylic or gel extensions, trendy nail art designs, chrome finishes, and cuticle care.',
  },
  {
    id: 'mehendi-traditional',
    name: 'Bridal & Party Mehendi',
    category: 'Traditional',
    durationMinutes: 120,
    durationFormatted: '2 - 4 hours',
    demoPrice: '₹2,000 - ₹8,000 (DEMO)',
    description: 'Intricate organic henna designs for brides, festivals, and celebratory occasions.',
  },
  {
    id: 'waxing-threading',
    name: 'Full Body Waxing & Eyebrow Shaping',
    category: 'Skin',
    durationMinutes: 45,
    durationFormatted: '45 min',
    demoPrice: '₹800 - ₹2,000 (DEMO)',
    description: 'Rica peel-off waxing, organic threading, and post-wax soothing lotion application.',
  }
];

export const SALON_INFO: SalonInfo = {
  name: 'Annu Beauty Salon',
  tagline: 'Luxury Hair, Skin & Bridal Sanctuary',
  phone: '+91 98765 43210 (DEMO)',
  email: 'appointments@annubeautysalon.demo',
  address: 'Plot No. 42, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033 (DEMO LOCATION)',
  workingHours: {
    days: 'Tuesday to Sunday',
    hours: '10:00 AM to 8:00 PM',
    holiday: 'Closed on Mondays',
  },
  services: SALON_SERVICES,
  faqs: [
    {
      question: 'Do you require advance booking for bridal makeup?',
      answer: 'Yes, we recommend booking bridal appointments at least 2-4 weeks in advance to reserve your preferred artist and date.'
    },
    {
      question: 'Where is Annu Beauty Salon located?',
      answer: 'We are located at Road No. 36, Jubilee Hills, Hyderabad, right near Metro Pillar 1400 (Demo Location).'
    },
    {
      question: 'What are the salon timings?',
      answer: 'We are open Tuesday through Sunday from 10:00 AM to 8:00 PM. We are closed on Mondays.'
    },
    {
      question: 'Do you offer home visits or on-location bridal services?',
      answer: 'Yes! For bridal makeup and large group packages, our senior artists can travel to your wedding venue or home. Please speak with the team for custom arrangements.'
    }
  ]
};

export const AI_SYSTEM_PROMPT = `You are Annu Beauty Salon's phone receptionist. Be warm, brief (1-2 sentences max), and natural — like a real person on a call.

RULES: Match caller's language (English/Hindi/Telugu). Never invent info. Keep replies SHORT for voice. If unsure, offer to connect to salon team.

BOOKING FLOW: Ask service → day → time → name/phone → check_availability → book_appointment.

SALON INFO:
- Hours: Tue-Sun 10AM-8PM, closed Monday
- Location: Road 36, Jubilee Hills, Hyderabad (near Metro Pillar 1400)
- Services: Bridal Makeup ₹12K-20K (3hr) | Party Makeup ₹3.5K-6K (1.5hr) | Hair Spa/Keratin ₹2.5K-5K (2hr) | Hydra Facial ₹2.8K-4.5K (1.25hr) | Nail Art ₹1.5K-3K (1hr) | Mehendi ₹2K-8K (2-4hr) | Waxing ₹800-2K (45min)
`;
