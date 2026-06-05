import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Industry-Specific SEO Solutions | Solvark',
  description: 'Learn how Solvark engineers custom websites, e-commerce stores, and booking engines tailored for Healthcare, Education, Real Estate, Automotive, and Retail sectors.',
};

const industries = [
  { name: 'Healthcare', slug: 'healthcare', description: 'HIPAA-compliant, highly secure web interfaces for patient portals, clinic directories, and telemedicine systems.' },
  { name: 'Education', slug: 'education', description: 'Scalable LMS portals, enrollment catalogs, student registration schedules, and academic directories.' },
  { name: 'Real Estate', slug: 'real-estate', description: 'Visual property grid catalogs, advanced search filters, geographic listings, and lead scheduling.' },
  { name: 'Automotive', slug: 'automotive', description: 'Showroom vehicle catalog grids, 360-degree color selectors, local booking schedules, and automated lead routing.' },
  { name: 'E-commerce', slug: 'ecommerce', description: 'Headless Shopify storefronts, secure single-step checkouts, and priority inventory gateway syncs.' },
];

export default function IndustriesPage() {
  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Background glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[600px] -right-60 opacity-40"></div>

      {/* Hero Header */}
      <section className="py-16 md:py-24 bg-grid-dots border-b border-white/5">
        <div className="container-custom text-center max-w-3xl flex flex-col gap-6 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            SEO Verticals
          </span>
          <h1 className="heading-h1">
            Industry-Specific Web Engineering
          </h1>
          <p className="paragraph-lead">
            We code niche-specific layouts designed to address the unique customer acquisition and scheduling constraints of your business sector.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind) => (
              <div
                key={ind.slug}
                className="glass-card p-8 flex flex-col gap-6 justify-between group border-white/5"
              >
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-brand-gray-400 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
                <Link
                  href={`/industries/${ind.slug}`}
                  className="inline-flex items-center gap-1 text-xs text-brand-accent font-semibold group-hover:gap-2 transition-all mt-4"
                >
                  Explore Industry Solutions
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
