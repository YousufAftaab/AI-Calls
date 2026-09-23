import { NextRequest, NextResponse } from 'next/server';
import { appointmentProvider } from '@/lib/providers/appointment-provider';
import { getStoredAppointments, setStoredAppointments } from '@/lib/storage';

export async function GET() {
  const list = await appointmentProvider.getAppointments();
  return NextResponse.json({ appointments: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const appt = await appointmentProvider.createAppointment({
      customerName: body.customerName || 'Walk-in Customer',
      phone: body.phone || '+91 90000 00000',
      serviceName: body.serviceName || 'Hair Spa & Keratin',
      date: body.date || 'Tomorrow',
      time: body.time || '11:00 AM',
      status: body.status || 'Confirmed',
      notes: body.notes || 'Created manually',
      isDemo: true,
    });
    return NextResponse.json({ appointment: appt }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, date, time } = body;

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    if (date && time) {
      const updated = await appointmentProvider.rescheduleAppointment(id, date, time);
      return NextResponse.json({ appointment: updated });
    }

    if (status) {
      const updated = await appointmentProvider.updateAppointmentStatus(id, status);
      return NextResponse.json({ appointment: updated });
    }

    return NextResponse.json({ error: 'No update fields specified' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    const current = getStoredAppointments();
    const filtered = current.filter(a => a.id !== id);
    setStoredAppointments(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
