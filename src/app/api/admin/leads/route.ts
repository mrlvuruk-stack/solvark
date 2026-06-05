import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as z from 'zod';

const updateLeadSchema = z.object({
  id: z.string().uuid(),
  lead_status: z.enum(['new', 'contacted', 'proposal_sent', 'won', 'lost']).optional(),
  priority_score: z.number().int().min(0).max(10).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { id, lead_status, priority_score } = parsed.data;

    // Verify session
    const sessionCookie = req.cookies.get('solvark_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Update details
    const updatedLead = await db.lead.update({
      where: { id },
      data: {
        ...(lead_status && { lead_status }),
        ...(priority_score !== undefined && { priority_score }),
      },
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
