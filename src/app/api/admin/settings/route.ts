import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import * as z from 'zod';

const settingsSchema = z.object({
  id: z.string().uuid(),
  site_name: z.string().min(2),
  logo_url: z.string().url().nullable().or(z.literal('')),
  favicon_url: z.string().url().nullable().or(z.literal('')),
  contact_email: z.string().email(),
  contact_phone: z.string().nullable().or(z.literal('')),
  address: z.string().nullable().or(z.literal('')),
  social_links: z.record(z.string(), z.string().url().or(z.literal(''))),
});

export async function PATCH(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('solvark_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(sessionCookie);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid Session' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updatedSettings = await db.websiteSettings.update({
      where: { id: data.id },
      data: {
        site_name: data.site_name,
        logo_url: data.logo_url || null,
        favicon_url: data.favicon_url || null,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || null,
        address: data.address || null,
        social_links: data.social_links,
      },
    });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
