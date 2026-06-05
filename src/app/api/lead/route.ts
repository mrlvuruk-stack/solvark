import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculatePriorityScore, syncToHubSpotMock, logNotificationMock } from '@/lib/leads';
import * as z from 'zod';

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  service_interest: z.string().optional().nullable(),
  budget_range: z.string().optional().nullable(),
  project_details: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Find or create lead by email
    let lead = await db.lead.findFirst({
      where: { email: data.email },
    });

    const score = calculatePriorityScore({
      budget_range: data.budget_range,
      company_name: data.company_name,
      phone: data.phone,
      project_details: data.project_details,
      source: data.source,
    });

    if (lead) {
      // Update existing lead details
      lead = await db.lead.update({
        where: { id: lead.id },
        data: {
          name: data.name,
          phone: data.phone || lead.phone,
          company_name: data.company_name || lead.company_name,
          service_interest: data.service_interest || lead.service_interest,
          budget_range: data.budget_range || lead.budget_range,
          project_details: data.project_details || lead.project_details,
          source: data.source || lead.source,
          priority_score: score,
        },
      });
    } else {
      // Create new lead
      lead = await db.lead.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company_name: data.company_name || null,
          service_interest: data.service_interest || null,
          budget_range: data.budget_range || null,
          project_details: data.project_details || null,
          source: data.source || 'Website Lead',
          lead_status: 'new',
          priority_score: score,
        },
      });
    }

    // Save initial contact message as log if details are provided
    if (data.project_details) {
      await db.contactMessage.create({
        data: {
          lead_id: lead.id,
          message: data.project_details,
        },
      });
    }

    // Run notifications & HubSpot CRM sync asynchronously/mocked
    await logNotificationMock({
      name: data.name,
      email: data.email,
      source: data.source,
      service_interest: data.service_interest || 'Lead Magnet',
      message: data.project_details || undefined,
    });

    await syncToHubSpotMock({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company_name: lead.company_name,
      service_interest: lead.service_interest,
      budget_range: lead.budget_range,
      project_details: lead.project_details,
      source: lead.source,
      priority_score: lead.priority_score,
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error: any) {
    console.error('Error handling lead API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
