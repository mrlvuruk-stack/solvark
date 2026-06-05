import FreeAuditForm from '@/components/free-audit-form';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Free Video Performance & Conversion Audit | Solvark',
  description: 'Get a personalized 10-minute video audit of your current website, diagnosing speed bottlenecks, design credibility gaps, and conversion leakage.',
};

export default function FreeAuditPage() {
  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Ambient background glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[600px] -right-60 opacity-40"></div>

      {/* Main Grid Layout */}
      <section className="py-16 md:py-24 bg-grid-dots">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Details Column */}
          <div className="lg:col-span-6 flex flex-col gap-8 text-left z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Free Lead Magnet
            </span>
            <h1 className="heading-h1 leading-tight text-white">
              Get a Free Website Speed & Conversion Audit
            </h1>
            <p className="paragraph-lead">
              Submit your URL and receive a personalized 10-minute video analysis from our founders. We will audit your Core Web Vitals, conversion layout funnel, and technical SEO structure.
            </p>
            
            <div className="flex flex-col gap-4 text-sm mt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                <span>**Core Web Vitals Diagnosis:** We analyze LCP, CLS, and page asset sizes.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                <span>**UX Credibility Audit:** We spot visual design flaws costing you user trust.</span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                <span>**Conversion Leakage Check:** We identify gaps where traffic drops before submitting forms.</span>
              </div>
            </div>

            <p className="text-xs text-brand-gray-500 font-mono leading-relaxed mt-2">
              * Fully customized. No automated generic scanner reports. Delivery in 24 hours.
            </p>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-6 z-10 w-full">
            <FreeAuditForm />
          </div>
        </div>
      </section>
    </div>
  );
}
