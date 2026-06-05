import { db } from '@/lib/db';
import { Users, AlertCircle, Award, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function getEstBudgetVal(budgetStr?: string | null): number {
  if (!budgetStr) return 0;
  if (budgetStr.includes('1 Lakh+')) return 150000;
  if (budgetStr.includes('50,000 - ₹1 Lakh')) return 75000;
  if (budgetStr.includes('25,000 - ₹50,000')) return 37500;
  if (budgetStr.includes('Under ₹25,000')) return 15000;
  return 0;
}

export default async function AdminDashboard() {
  // Fetch stats from DB
  const totalLeads = await db.lead.count();
  const newLeads = await db.lead.count({ where: { lead_status: 'new' } });
  const wonLeads = await db.lead.count({ where: { lead_status: 'won' } });
  const lostLeads = await db.lead.count({ where: { lead_status: 'lost' } });

  // Get active leads
  const activeLeads = await db.lead.findMany({
    orderBy: { created_at: 'desc' },
    take: 5,
  });

  // Get recent messages
  const recentMessages = await db.contactMessage.findMany({
    include: {
      lead: true,
    },
    orderBy: { created_at: 'desc' },
    take: 5,
  });

  // Calculate revenue statistics
  const wonLeadsData = await db.lead.findMany({
    where: { lead_status: 'won' },
    select: { budget_range: true },
  });

  const totalWonRevenue = wonLeadsData.reduce(
    (sum, lead) => sum + getEstBudgetVal(lead.budget_range),
    0
  );

  const allLeadsData = await db.lead.findMany({
    select: { budget_range: true },
  });

  const totalPipelineRevenue = allLeadsData.reduce(
    (sum, lead) => sum + getEstBudgetVal(lead.budget_range),
    0
  );

  // Conversion rates
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner/Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-brand-gray-400">
            Real-time visual monitoring of Solvark lead acquisition and pipeline health.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-brand-gray-300">
          <Calendar className="w-4 h-4 text-brand-accent" />
          <span>Last 24 Hours Metrics</span>
        </div>
      </div>

      {/* Numerical Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Leads */}
        <div className="glass-card p-6 border-white/5 bg-[#0a0a0a]/40 hover:border-brand-accent/20 transition-all flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-xs text-brand-gray-450 font-medium uppercase tracking-wider">Total Leads</span>
            <div className="p-2 bg-brand-accent/10 border border-brand-accent/20 rounded-lg text-brand-accent">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalLeads}</div>
            <p className="text-[10px] text-green-400 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Pipeline growing</span>
            </p>
          </div>
        </div>

        {/* New Inquiries */}
        <div className="glass-card p-6 border-white/5 bg-[#0a0a0a]/40 hover:border-blue-500/20 transition-all flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-xs text-brand-gray-450 font-medium uppercase tracking-wider">New Inquiries</span>
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{newLeads}</div>
            <p className="text-[10px] text-brand-gray-400 mt-1">Requires immediate follow-up</p>
          </div>
        </div>

        {/* Closed Won Revenue */}
        <div className="glass-card p-6 border-white/5 bg-[#0a0a0a]/40 hover:border-green-500/20 transition-all flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-xs text-brand-gray-450 font-medium uppercase tracking-wider">Closed Won Est.</span>
            <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalWonRevenue)}</div>
            <p className="text-[10px] text-brand-gray-400 mt-1">
              Pipeline total: {formatCurrency(totalPipelineRevenue)}
            </p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="glass-card p-6 border-white/5 bg-[#0a0a0a]/40 hover:border-purple-500/20 transition-all flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="text-xs text-brand-gray-450 font-medium uppercase tracking-wider">Conversion Rate</span>
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{conversionRate}%</div>
            <p className="text-[10px] text-brand-gray-400 mt-1">
              Won: {wonLeads} | Lost: {lostLeads}
            </p>
          </div>
        </div>
      </div>

      {/* Split Details Section: Recent Leads & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries Card */}
        <div className="glass-card border-white/5 bg-[#0a0a0a]/50 p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-sm font-bold text-white">Recent Leads & Inquiries</h2>
            <Link
              href="/admin/leads"
              className="text-[10px] font-semibold text-brand-accent hover:underline flex items-center gap-1"
            >
              <span>View All Leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {activeLeads.length > 0 ? (
              activeLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-white">{lead.name}</span>
                    <span className="text-[10px] text-brand-gray-400">
                      {lead.email} | {lead.service_interest || 'General'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-brand-gray-450 bg-white/5 rounded border border-white/5 px-2 py-0.5 uppercase tracking-wide">
                      {lead.source || 'Direct'}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                        lead.lead_status === 'won'
                          ? 'bg-green-500/10 border-green-500/20 text-green-400'
                          : lead.lead_status === 'new'
                          ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                          : lead.lead_status === 'lost'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {lead.lead_status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-brand-gray-500 font-light border border-dashed border-white/10 rounded-xl">
                No active leads found in the database.
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages Card */}
        <div className="glass-card border-white/5 bg-[#0a0a0a]/50 p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-sm font-bold text-white">Recent Message Snippets</h2>
            <span className="text-[10px] text-brand-gray-450 font-mono uppercase">
              Last {recentMessages.length} received
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-brand-accent">{msg.lead.name}</span>
                    <span className="text-brand-gray-500">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-brand-gray-300 italic line-clamp-2 leading-relaxed">
                    &ldquo;{msg.message}&rdquo;
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-brand-gray-500 font-light border border-dashed border-white/10 rounded-xl">
                No contact messages logged in database.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
