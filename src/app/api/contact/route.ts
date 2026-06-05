import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculatePriorityScore, syncToHubSpotMock, logNotificationMock } from '@/lib/leads';
import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  service: z.string().min(1),
  budget: z.string().min(1),
  message: z.string().min(20),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);

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
      budget_range: data.budget,
      company_name: data.companyName,
      phone: data.phone,
      project_details: data.message,
      source: 'Contact Form',
    });

    if (lead) {
      // Update existing lead details
      lead = await db.lead.update({
        where: { id: lead.id },
        data: {
          name: data.name,
          phone: data.phone || lead.phone,
          company_name: data.companyName || lead.company_name,
          service_interest: data.service,
          budget_range: data.budget,
          project_details: data.message,
          source: 'Contact Form',
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
          company_name: data.companyName || null,
          service_interest: data.service,
          budget_range: data.budget,
          project_details: data.message,
          source: 'Contact Form',
          lead_status: 'new',
          priority_score: score,
        },
      });
    }

    // Save contact message
    await db.contactMessage.create({
      data: {
        lead_id: lead.id,
        message: data.message,
      },
    });

    // Run notifications & HubSpot CRM sync asynchronously/mocked
    await logNotificationMock({
      name: data.name,
      email: data.email,
      source: 'Contact Form',
      service_interest: data.service,
      message: data.message,
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
    console.error('Error handling contact form API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
