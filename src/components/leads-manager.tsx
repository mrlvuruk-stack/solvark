'use client';

import { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
  Minus,
  Mail,
  Phone,
  Copy,
  Check,
} from 'lucide-react';

interface ContactMessage {
  id: string;
  message: string;
  created_at: Date | string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  service_interest: string | null;
  budget_range: string | null;
  project_details: string | null;
  source: string | null;
  lead_status: string;
  priority_score: number;
  created_at: Date | string;
  contactMessages?: ContactMessage[];
}

interface LeadsManagerProps {
  initialLeads: Lead[];
}

export default function LeadsManager({ initialLeads }: LeadsManagerProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at'); // created_at or priority_score
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Handle status update
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, lead_status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === leadId ? { ...lead, lead_status: newStatus } : lead))
        );
      } else {
        alert('Failed to update status.');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle priority score update
  const handlePriorityChange = async (leadId: string, currentScore: number, change: number) => {
    const newScore = Math.max(0, Math.min(10, currentScore + change));
    if (newScore === currentScore) return;

    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, priority_score: newScore } : lead))
    );

    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, priority_score: newScore }),
      });
    } catch (e) {
      console.error('Error updating priority score in DB:', e);
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtering
  const filteredLeads = leads
    .filter((lead) => {
      const matchSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company_name && lead.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.service_interest &&
          lead.service_interest.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'all' || lead.lead_status === statusFilter;
      const matchBudget = budgetFilter === 'all' || lead.budget_range === budgetFilter;

      return matchSearch && matchStatus && matchBudget;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'created_at') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        comparison = a.priority_score - b.priority_score;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters panel */}
      <div className="glass-card p-5 border-white/5 bg-[#0a0a0a]/50 flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, company, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070707] text-white rounded-lg border border-white/10 pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-brand-accent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#070707] text-white rounded-lg border border-white/10 px-3.5 py-3 text-xs focus:outline-none focus:border-brand-accent transition-all flex-grow lg:flex-grow-0"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>

          {/* Budget Filter */}
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="bg-[#070707] text-white rounded-lg border border-white/10 px-3.5 py-3 text-xs focus:outline-none focus:border-brand-accent transition-all flex-grow lg:flex-grow-0"
          >
            <option value="all">All Budgets</option>
            <option value="Under ₹25,000">Under ₹25,000</option>
            <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
            <option value="₹50,000 - ₹1 Lakh">₹50,000 - ₹1 Lakh</option>
            <option value="₹1 Lakh+">₹1 Lakh+</option>
            <option value="Lead Magnet">Lead Magnet</option>
            <option value="Scoping">Scoping</option>
          </select>

          {/* Sort Controls */}
          <button
            onClick={() => {
              if (sortField === 'created_at') {
                setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
              } else {
                setSortField('created_at');
                setSortOrder('desc');
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-3 rounded-lg border text-xs font-medium transition-all ${
              sortField === 'created_at'
                ? 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent'
                : 'bg-[#070707] border-white/10 text-brand-gray-450 hover:text-white'
            }`}
          >
            <span>Date</span>
            {sortField === 'created_at' && sortOrder === 'desc' ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => {
              if (sortField === 'priority_score') {
                setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
              } else {
                setSortField('priority_score');
                setSortOrder('desc');
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-3 rounded-lg border text-xs font-medium transition-all ${
              sortField === 'priority_score'
                ? 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent'
                : 'bg-[#070707] border-white/10 text-brand-gray-450 hover:text-white'
            }`}
          >
            <span>Priority</span>
            {sortField === 'priority_score' && sortOrder === 'desc' ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Leads Table / Card list */}
      <div className="glass-card border-white/5 bg-[#0a0a0a]/40 overflow-hidden">
        {filteredLeads.length > 0 ? (
          <div className="flex flex-col divider-y divider-white/5">
            {filteredLeads.map((lead) => {
              const isExpanded = expandedLead === lead.id;
              const formattedDate = new Date(lead.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={lead.id}
                  className={`flex flex-col transition-colors border-b border-white/5 last:border-0 ${
                    isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'
                  }`}
                >
                  {/* Lead Summary Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between p-5 gap-4">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-grow min-w-0">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-sm font-semibold text-white truncate max-w-[200px]">
                            {lead.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-white/5 border border-white/5 text-brand-gray-400 rounded">
                            {lead.source || 'Direct'}
                          </span>
                          <span className="text-[10px] text-brand-gray-500">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-brand-gray-450 flex-wrap">
                          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Mail className="w-3.5 h-3.5 text-brand-accent" />
                            <a href={`mailto:${lead.email}`}>{lead.email}</a>
                            <button
                              onClick={() => handleCopy(lead.email, `${lead.id}-email`)}
                              className="text-brand-gray-500 hover:text-white"
                            >
                              {copiedId === `${lead.id}-email` ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </span>
                          {lead.phone && (
                            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                              <Phone className="w-3.5 h-3.5 text-brand-accent" />
                              <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                              <button
                                onClick={() => handleCopy(lead.phone || '', `${lead.id}-phone`)}
                                className="text-brand-gray-500 hover:text-white"
                              >
                                {copiedId === `${lead.id}-phone` ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </span>
                          )}
                          {lead.company_name && (
                            <span className="text-[11px] font-mono text-brand-gray-500">
                              @{lead.company_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Service & Budget */}
                    <div className="flex flex-col lg:items-end gap-1 flex-shrink-0">
                      <span className="text-xs font-semibold text-white">
                        {lead.service_interest || 'General Inquiry'}
                      </span>
                      <span className="text-[10px] text-brand-gray-400 font-mono">
                        Budget: {lead.budget_range || 'N/A'}
                      </span>
                    </div>

                    {/* Priority & Status Controls */}
                    <div className="flex items-center gap-4 flex-shrink-0 flex-wrap lg:flex-nowrap">
                      {/* Priority Score Component */}
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-lg px-2 py-1.5">
                        <Star className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" />
                        <span className="text-xs font-mono font-bold text-white">
                          {lead.priority_score}
                        </span>
                        <div className="flex flex-col border-l border-white/10 pl-1.5 ml-1">
                          <button
                            onClick={() => handlePriorityChange(lead.id, lead.priority_score, 1)}
                            className="text-brand-gray-400 hover:text-white p-0.2"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handlePriorityChange(lead.id, lead.priority_score, -1)}
                            className="text-brand-gray-400 hover:text-white p-0.2"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div className="relative">
                        <select
                          value={lead.lead_status}
                          disabled={updatingId === lead.id}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`rounded-lg border px-3 py-2 text-[10px] font-bold tracking-wider uppercase tracking-tight focus:outline-none focus:border-brand-accent transition-all ${
                            lead.lead_status === 'won'
                              ? 'bg-green-500/10 border-green-500/20 text-green-400'
                              : lead.lead_status === 'new'
                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              : lead.lead_status === 'lost'
                              ? 'bg-red-500/10 border-red-500/20 text-red-400'
                              : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="proposal_sent">Proposal Sent</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>

                      {/* Expand Details Trigger */}
                      <button
                        onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                        className="text-brand-gray-450 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-white/5 bg-[#0a0a0a]/30 animate-fade-in flex flex-col gap-4">
                      {lead.project_details && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-mono text-brand-gray-500">
                            PROJECT DETAILS & DESCRIPTION
                          </span>
                          <p className="text-xs text-brand-gray-300 leading-relaxed font-light whitespace-pre-line">
                            {lead.project_details}
                          </p>
                        </div>
                      )}
                      {!lead.project_details && (
                        <span className="text-xs text-brand-gray-500 font-light">
                          No descriptive project details provided.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-xs text-brand-gray-500 font-light border border-dashed border-white/10 rounded-xl m-6">
            No leads found matching your search and filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
