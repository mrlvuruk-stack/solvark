import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import * as z from 'zod';

const testimonialSchema = z.object({
  client_name: z.string().min(2),
  company_name: z.string().min(2),
  designation: z.string().min(2),
  review: z.string().min(10),
  rating: z.number().int().min(1).max(5),
  image_url: z.string().url(),
  featured: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
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
    const parsed = testimonialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const testimonial = await db.testimonial.create({
      data: {
        client_name: data.client_name,
        company_name: data.company_name,
        designation: data.designation,
        review: data.review,
        rating: data.rating,
        image_url: data.image_url,
        featured: data.featured,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('solvark_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(sessionCookie);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid Session' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await db.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
