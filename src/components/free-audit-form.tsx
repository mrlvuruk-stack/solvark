'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const auditFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  websiteUrl: z.string().url({ message: 'Please enter a valid URL (starting with https:// or http://).' }),
  concern: z.string().min(1, { message: 'Please select a primary concern.' }),
  details: z.string().optional(),
});

type AuditFormValues = z.infer<typeof auditFormSchema>;

export default function FreeAuditForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      name: '',
      email: '',
      websiteUrl: '',
      concern: '',
      details: '',
    },
  });

  const onSubmit = async (data: AuditFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: '',
          company_name: '',
          service_interest: `Free Audit (${data.concern})`,
          budget_range: 'Lead Magnet',
          project_details: `Website: ${data.websiteUrl}. Details: ${data.details || 'None'}`,
          source: 'Free Audit Page',
        }),
      });

      if (response.ok) {
        setSuccess(true);
        reset();
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card p-8 text-center flex flex-col items-center gap-6 max-w-md mx-auto border-brand-accent/20 bg-brand-accent/5">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white">Audit Request Received</h3>
          <p className="text-xs text-brand-gray-400 leading-relaxed">
            Our engineering team is analyzing your site parameters. We will email your detailed PDF Speed and Conversion Audit within 24 hours.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="btn-premium-secondary text-xs w-full py-3"
        >
          Submit Another Website
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-8 max-w-lg mx-auto border-white/5 bg-[#0a0a0a]/50">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs text-brand-gray-400 font-medium">Name</label>
          <input
            id="name"
            type="text"
            required
            placeholder="Your name"
            {...register('name')}
            className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
          />
          {errors.name && <span className="text-[10px] text-red-400">{errors.name.message}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs text-brand-gray-400 font-medium">Work Email</label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@company.com"
            {...register('email')}
            className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
          />
          {errors.email && <span className="text-[10px] text-red-400">{errors.email.message}</span>}
        </div>

        {/* Website URL */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="websiteUrl" className="text-xs text-brand-gray-400 font-medium">Website URL</label>
          <input
            id="websiteUrl"
            type="url"
            required
            placeholder="https://yourwebsite.com"
            {...register('websiteUrl')}
            className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
          />
          {errors.websiteUrl && <span className="text-[10px] text-red-400">{errors.websiteUrl.message}</span>}
        </div>

        {/* Primary Concern */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="concern" className="text-xs text-brand-gray-400 font-medium">Primary Concern</label>
          <select
            id="concern"
            required
            {...register('concern')}
            className="w-full bg-[#0a0a0a]/90 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
          >
            <option value="">Select your main focus...</option>
            <option value="Speed & Core Web Vitals">Slow Loading / Performance</option>
            <option value="Visual Aesthetics">Outdated Branding / Interface</option>
            <option value="Lead Conversion">Low Inquiry Rates</option>
            <option value="SEO Rankings">Poor Google Visibility</option>
          </select>
          {errors.concern && <span className="text-[10px] text-red-400">{errors.concern.message}</span>}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="details" className="text-xs text-brand-gray-400 font-medium">Additional Details (Optional)</label>
          <textarea
            id="details"
            rows={3}
            placeholder="Any specific pages or concerns you want us to audit..."
            {...register('details')}
            className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-premium-primary text-xs w-full py-3 gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Web Assets...
            </>
          ) : (
            <>
              Request Free Video Audit
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
