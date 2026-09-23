export type CallState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'CONNECTED' | 'ENDED' | 'TRANSFERRING';

export type LanguageCode = 'en' | 'hi' | 'te';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: string;
  language?: LanguageCode;
  toolCall?: {
    name: string;
    args: Record<string, unknown>;
    result?: unknown;
  };
}

export interface SalonService {
  id: string;
  name: string;
  category: 'Makeup' | 'Hair' | 'Skin' | 'Nails' | 'Traditional' | 'Packages';
  durationMinutes: number;
  durationFormatted: string;
  demoPrice: string;
  description: string;
  isPopular?: boolean;
}

export interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
  createdAt: string;
  callId?: string;
  isDemo: boolean;
}

export interface CallRecord {
  id: string;
  callerName: string;
  callerPhone: string;
  durationSeconds: number;
  durationFormatted: string;
  language: 'English' | 'Hindi' | 'Telugu';
  purpose: 'Appointment Booking' | 'Service Inquiry' | 'Pricing Inquiry' | 'Salon Hours & Info' | 'Human Handoff' | 'Rescheduling';
  outcome: 'Confirmed' | 'Inquiry Answered' | 'Transferred to Human' | 'Cancelled' | 'Follow-up Needed';
  transcript: {
    sender: 'AI' | 'Customer' | 'System';
    text: string;
    time: string;
  }[];
  summary: string;
  appointmentCreated?: Appointment;
  timestamp: string;
  createdAt: string;
}

export interface SalonInfo {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  workingHours: {
    days: string;
    hours: string;
    holiday: string;
  };
  services: SalonService[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

// Extensibility interfaces for production telephony & persistence
export interface ITelephonyProvider {
  name: string;
  initiateCall(toNumber: string): Promise<{ callId: string; status: string }>;
  endCall(callId: string): Promise<boolean>;
  transferCall(callId: string, toAgentNumber: string): Promise<boolean>;
}

export interface IAppointmentProvider {
  getAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: string): Promise<Appointment | null>;
  createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null>;
  rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<Appointment | null>;
  checkAvailability(service: string, date: string, time: string): Promise<{ available: boolean; reason?: string; alternativeSlots?: string[] }>;
}

export interface INotificationProvider {
  sendWhatsAppConfirmation(phone: string, appointment: Appointment): Promise<boolean>;
  sendSmsReminder(phone: string, message: string): Promise<boolean>;
}
