'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  service: z.string().min(1, { message: 'Please select a service.' }),
  budget: z.string().min(1, { message: 'Please select your budget range.' }),
  message: z.string().min(20, { message: 'Message must be at least 20 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const defaultPackage = searchParams.get('package') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      companyName: '',
      service: defaultPackage ? defaultPackage.charAt(0).toUpperCase() + defaultPackage.slice(1) : '',
      budget: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          companyName: data.companyName || '',
          service: data.service,
          budget: data.budget,
          message: data.message,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        reset();
      } else {
        alert('Form submission failed. Please try again.');
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
          <h3 className="text-xl font-bold text-white">Message Sent Successfully</h3>
          <p className="text-xs text-brand-gray-400 leading-relaxed">
            Thank you for reaching out. We have logged your request and our sales team will contact you within 4 business hours with custom proposal outlines.
          </p>
        </div>
        <Link
          href="/book-call"
          className="btn-premium-primary text-xs w-full py-3 gap-2"
        >
          Book Discovery Call Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-8 border-white/5 bg-[#0a0a0a]/50">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs text-brand-gray-400 font-medium">Name *</label>
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
            <label htmlFor="email" className="text-xs text-brand-gray-400 font-medium">Work Email *</label>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-xs text-brand-gray-400 font-medium">Phone (Optional)</label>
            <input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              {...register('phone')}
              className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
            {errors.phone && <span className="text-[10px] text-red-400">{errors.phone.message}</span>}
          </div>

          {/* Company */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="companyName" className="text-xs text-brand-gray-400 font-medium">Company (Optional)</label>
            <input
              id="companyName"
              type="text"
              placeholder="Your company"
              {...register('companyName')}
              className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service interest */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="service" className="text-xs text-brand-gray-400 font-medium">Service Required *</label>
            <select
              id="service"
              required
              {...register('service')}
              className="w-full bg-[#0a0a0a]/90 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            >
              <option value="">Select a service...</option>
              <option value="Website Development">Website Development</option>
              <option value="Ecommerce Development">E-commerce Development</option>
              <option value="Website Redesign">Website Redesign</option>
              <option value="Branding">Branding & Identity</option>
              <option value="Maintenance">Website Maintenance</option>
            </select>
            {errors.service && <span className="text-[10px] text-red-400">{errors.service.message}</span>}
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="budget" className="text-xs text-brand-gray-400 font-medium">Budget Range *</label>
            <select
              id="budget"
              required
              {...register('budget')}
              className="w-full bg-[#0a0a0a]/90 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            >
              <option value="">Select your budget...</option>
              <option value="Under ₹25,000">Under ₹25,000</option>
              <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
              <option value="₹50,000 - ₹1 Lakh">₹50,000 - ₹1 Lakh</option>
              <option value="₹1 Lakh+">₹1 Lakh+</option>
            </select>
            {errors.budget && <span className="text-[10px] text-red-400">{errors.budget.message}</span>}
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-xs text-brand-gray-400 font-medium">Project Details (Min 20 characters) *</label>
          <textarea
            id="message"
            required
            rows={4}
            placeholder="Tell us about your visual design desires, custom page structures, timelines, and current website frustrations..."
            {...register('message')}
            className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
          />
          {errors.message && <span className="text-[10px] text-red-400">{errors.message.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-premium-primary text-xs w-full py-3 gap-2 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting Proposal...
            </>
          ) : (
            <>
              Request Technical Proposal
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
