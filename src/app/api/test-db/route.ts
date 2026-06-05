import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const services = await db.service.findMany({ take: 1 });
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || String(error),
      stack: error.stack
    }, { status: 500 });
  }
}
