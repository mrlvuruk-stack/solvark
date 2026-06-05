import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import * as z from 'zod';

const caseStudySchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  client_name: z.string().min(2),
  industry: z.string().min(2),
  challenge: z.string().min(20),
  solution: z.string().min(20),
  results: z.string().min(10),
  technologies: z.array(z.string()).min(1),
  featured_image: z.string().url(),
  gallery_images: z.array(z.string()).optional(),
  project_url: z.string().url().optional().nullable().or(z.literal('')),
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
    const parsed = caseStudySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existing = await db.caseStudy.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug must be unique. A case study with this slug already exists.' },
        { status: 400 }
      );
    }

    const project = await db.caseStudy.create({
      data: {
        title: data.title,
        slug: data.slug,
        client_name: data.client_name,
        industry: data.industry,
        challenge: data.challenge,
        solution: data.solution,
        results: data.results,
        technologies: data.technologies, // SQLite supports direct arrays through Prisma Json mapper
        featured_image: data.featured_image,
        gallery_images: data.gallery_images || [],
        project_url: data.project_url || null,
        featured: data.featured,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error creating case study:', error);
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

    await db.caseStudy.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting case study:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
