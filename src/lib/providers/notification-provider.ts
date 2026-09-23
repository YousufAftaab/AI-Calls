import { Appointment, INotificationProvider } from '../types';

export class MockNotificationProvider implements INotificationProvider {
  name = 'MockNotificationProvider (Ready for WhatsApp Cloud API & SMS)';

  async sendWhatsAppConfirmation(phone: string, appointment: Appointment): Promise<boolean> {
    console.log(`[DEMO NOTIFICATION] Simulated WhatsApp message sent to ${phone} for appointment ${appointment.serviceName} at ${appointment.time}`);
    return true;
  }

  async sendSmsReminder(phone: string, message: string): Promise<boolean> {
    console.log(`[DEMO NOTIFICATION] Simulated SMS sent to ${phone}: "${message}"`);
    return true;
  }
}

export const notificationProvider = new MockNotificationProvider();
