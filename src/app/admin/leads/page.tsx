import { db } from '@/lib/db';
import LeadsManager from '@/components/leads-manager';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Leads & Inquiries</h1>
        <p className="text-xs text-brand-gray-400">
          Manage all incoming customer inquiries, prioritize sales pipeline, and track conversions.
        </p>
      </div>

      <LeadsManager initialLeads={leads} />
    </div>
  );
}
