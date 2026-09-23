import { ITelephonyProvider } from '../types';

export class MockTelephonyProvider implements ITelephonyProvider {
  name = 'MockTelephonyProvider (Ready for Exotel / Twilio)';

  async initiateCall(toNumber: string): Promise<{ callId: string; status: string }> {
    console.log(`[DEMO TELEPHONY] Initiating simulated phone call to: ${toNumber}`);
    return {
      callId: `tel-demo-${Date.now()}`,
      status: 'ringing'
    };
  }

  async endCall(callId: string): Promise<boolean> {
    console.log(`[DEMO TELEPHONY] Ending call session: ${callId}`);
    return true;
  }

  async transferCall(callId: string, toAgentNumber: string): Promise<boolean> {
    console.log(`[DEMO TELEPHONY] Handoff transfer for call ${callId} to Salon Desk: ${toAgentNumber}`);
    return true;
  }
}

export const telephonyProvider = new MockTelephonyProvider();
