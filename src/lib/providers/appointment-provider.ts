import { Appointment, IAppointmentProvider } from '../types';
import { getStoredAppointments, setStoredAppointments } from '../storage';

export class MockAppointmentProvider implements IAppointmentProvider {
  async getAppointments(): Promise<Appointment[]> {
    return getStoredAppointments();
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    const list = getStoredAppointments();
    return list.find((a) => a.id === id) || null;
  }

  async createAppointment(data: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const current = getStoredAppointments();
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    const updated = [newAppointment, ...current];
    setStoredAppointments(updated);
    return newAppointment;
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    const current = getStoredAppointments();
    const index = current.findIndex((a) => a.id === id);
    if (index === -1) return null;
    const updatedItem = { ...current[index], status };
    const nextList = [...current];
    nextList[index] = updatedItem;
    setStoredAppointments(nextList);
    return updatedItem;
  }

  async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<Appointment | null> {
    const current = getStoredAppointments();
    const index = current.findIndex((a) => a.id === id);
    if (index === -1) return null;
    const updatedItem = {
      ...current[index],
      date: newDate,
      time: newTime,
      status: 'Rescheduled' as const,
      notes: `${current[index].notes ? current[index].notes + ' | ' : ''}Rescheduled via AI Voice Receptionist on ${new Date().toLocaleDateString()}`
    };
    const nextList = [...current];
    nextList[index] = updatedItem;
    setStoredAppointments(nextList);
    return updatedItem;
  }

  async checkAvailability(service: string, date: string, time: string): Promise<{ available: boolean; reason?: string; alternativeSlots?: string[] }> {
    // Normal salon checks:
    // If date indicates Monday -> closed
    const dateLower = date.toLowerCase();
    if (dateLower.includes('monday') || dateLower.includes('somwar') || dateLower.includes('somavaram')) {
      return {
        available: false,
        reason: 'Annu Beauty Salon is closed on Mondays.',
        alternativeSlots: ['Tuesday 11:00 AM', 'Tuesday 02:00 PM', 'Sunday 11:00 AM']
      };
    }

    // Check if slot conflicts with existing confirmed booking
    const current = getStoredAppointments();
    const conflict = current.find(
      (a) =>
        a.status === 'Confirmed' &&
        a.date.toLowerCase() === date.toLowerCase() &&
        a.time.toLowerCase() === time.toLowerCase()
    );

    if (conflict) {
      return {
        available: false,
        reason: `The ${time} slot on ${date} is already booked.`,
        alternativeSlots: ['12:30 PM', '02:00 PM', '04:30 PM']
      };
    }

    return {
      available: true,
      reason: `${time} on ${date} is available for ${service || 'your appointment'}.`
    };
  }
}

export const appointmentProvider = new MockAppointmentProvider();
