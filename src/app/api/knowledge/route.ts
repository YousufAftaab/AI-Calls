import { NextResponse } from 'next/server';
import { SALON_INFO, SALON_SERVICES } from '@/lib/salon-data';

export async function GET() {
  return NextResponse.json({
    salon: SALON_INFO,
    services: SALON_SERVICES,
  });
}
