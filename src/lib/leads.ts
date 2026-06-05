import { db } from './db';

export function calculatePriorityScore(data: {
  budget_range?: string | null;
  company_name?: string | null;
  phone?: string | null;
  project_details?: string | null;
  source?: string | null;
}): number {
  let score = 0;

  // Budget validation
  const budget = data.budget_range || '';
  if (budget.includes('1 Lakh+') || budget.includes('1,00,000')) {
    score += 3;
  } else if (budget.includes('50,000 - ₹1 Lakh') || budget.includes('50,000')) {
    score += 2;
  } else if (budget.includes('25,000 - ₹50,000') || budget.includes('25,000')) {
    score += 1;
  }

  // Company validation
  if (data.company_name && data.company_name.trim().length > 0) {
    score += 1;
  }

  // Phone validation
  if (data.phone && data.phone.trim().length > 0) {
    score += 1;
  }

  // Message depth validation
  if (data.project_details && data.project_details.trim().length > 100) {
    score += 1;
  }

  // High-value lead sources
  if (data.source === 'Calendar Booking Page' || data.source === 'Contact Form') {
    score += 1;
  }

  return score;
}

export async function syncToHubSpotMock(lead: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  service_interest?: string | null;
  budget_range?: string | null;
  project_details?: string | null;
  source?: string | null;
  priority_score: number;
}) {
  console.log(`[HUBSPOT CRM SYNC] [${new Date().toISOString()}] Initiating synchronization...`);
  console.log(`[HUBSPOT CRM SYNC] ID: ${lead.id}`);
  console.log(`[HUBSPOT CRM SYNC] Contact: ${lead.name} <${lead.email}>`);
  console.log(`[HUBSPOT CRM SYNC] Company: ${lead.company_name || 'N/A'}, Phone: ${lead.phone || 'N/A'}`);
  console.log(`[HUBSPOT CRM SYNC] Interest: ${lead.service_interest || 'N/A'}, Budget: ${lead.budget_range || 'N/A'}`);
  console.log(`[HUBSPOT CRM SYNC] Source: ${lead.source || 'N/A'}, Priority Score: ${lead.priority_score}`);
  console.log(`[HUBSPOT CRM SYNC] Sync status: SUCCESS`);
}

export async function logNotificationMock(lead: {
  name: string;
  email: string;
  source?: string | null;
  service_interest?: string | null;
  message?: string;
}) {
  console.log(`=========================================`);
  console.log(`[NOTIFICATION ALERT] NEW LEAD SUBMITTED`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log(`Name: ${lead.name}`);
  console.log(`Email: ${lead.email}`);
  console.log(`Source: ${lead.source || 'Website'}`);
  console.log(`Interest: ${lead.service_interest || 'Not Specified'}`);
  if (lead.message) {
    console.log(`Message Details: ${lead.message}`);
  }
  console.log(`=========================================`);
}
