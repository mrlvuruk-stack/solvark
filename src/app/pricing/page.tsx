import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Pre-Qualifying Pricing Packages | Solvark',
  description: 'Select the optimal web design and development package for your business. We offer Starter, Growth, Premium, and custom Enterprise tiers.',
};

const packages = [
  {
    name: 'Starter',
    price: '₹24,999',
    description: 'Perfect for local small businesses needing a clean, high-performance landing page layout.',
    features: [
      'Single dynamic landing page',
      'Fully responsive mobile layout',
      'Google Lighthouse speed 95+ score',
      'Integrated Contact Form + validations',
      'Standard technical SEO config',
      '1 week post-launch support',
    ],
    cta: 'Select Starter Plan',
    popular: false,
  },
  {
    name: 'Growth',
    price: '₹49,999',
    description: 'Ideal for established businesses looking to rebuild their online credibility and publish articles.',
    features: [
      'Up to 5 custom-coded pages',
      'Complete Web CMS (Services & FAQs)',
      'Lead Magnet funnels integration',
      'Automated email notifications',
      'Structured schema markups',
      '30 days post-launch support',
    ],
    cta: 'Select Growth Plan',
    popular: true,
  },
  {
    name: 'Premium',
    price: '₹99,999',
    description: 'Designed for scaling e-commerce brands and companies requiring custom database engines.',
    features: [
      'Up to 12 custom pages + CMS',
      'Headless Shopify or custom transaction engine',
      'Secure Client admin dashboard panel',
      'Advanced HubSpot CRM integration',
      'Full visual branding guide',
      '90 days priority support',
    ],
    cta: 'Select Premium Plan',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large-scale operations with specific database security compliance needs.',
    features: [
      'Unlimited custom pages',
      'Dedicated API integration architecture',
      'Compliance and penetration audit security',
      'Custom CRM automation workflows',
      'Centralized Media Library controls',
      '12-month SLA maintenance agreement',
    ],
    cta: 'Request Custom Quote',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Background ambient glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[800px] -right-60 opacity-40"></div>

      {/* Hero Header */}
      <section className="py-16 md:py-24 bg-grid-dots border-b border-white/5">
        <div className="container-custom text-center max-w-3xl flex flex-col gap-6 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Investment Plans
          </span>
          <h1 className="heading-h1">
            Predictable Pricing Packages
          </h1>
          <p className="paragraph-lead">
            Select the optimal plan to scale your digital presence. All plans are custom-coded with a performance-first mindset.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`glass-card p-6 flex flex-col justify-between relative group border-white/5 ${
                  pkg.popular ? 'border-brand-accent/40 shadow-[0_0_20px_rgba(124,58,237,0.15)] bg-brand-accent/5' : ''
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-brand-accent text-[9px] font-bold text-white uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                    <p className="text-[10px] text-brand-gray-500 mt-1.5 leading-relaxed min-h-12">
                      {pkg.description}
                    </p>
                  </div>
                  
                  <div className="flex items-baseline gap-1 py-4 border-y border-white/5">
                    <span className="text-3xl font-extrabold text-white">{pkg.price}</span>
                    {pkg.price !== 'Custom' && (
                      <span className="text-[10px] text-brand-gray-500 font-medium">starting cost</span>
                    )}
                  </div>

                  <ul className="flex flex-col gap-3 text-xs">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                        <span className="text-brand-gray-350">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/contact?package=${pkg.name.toLowerCase()}`}
                  className={`w-full text-center mt-8 text-xs font-semibold py-3 rounded-lg border transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-brand-accent text-white border-brand-accent hover:bg-brand-accent-hover'
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-qualification disclaimer */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-6 items-center px-4">
        <h2 className="text-lg font-bold text-white">
          Looking for a custom integration or multi-site network?
        </h2>
        <p className="text-xs text-brand-gray-400 leading-relaxed font-light">
          We engineer complex, custom SaaS backends, third-party database syncs, and multi-tenant portals. Contact us for a scoping call to get a customized time and budget estimate.
        </p>
        <Link href="/contact" className="inline-flex items-center gap-2 text-sm text-brand-accent font-semibold hover:underline">
          Book Custom Scoping Call
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
