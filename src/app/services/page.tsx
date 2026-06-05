import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Code, Shield, Sparkles } from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 3600;

export default async function ServicesPage() {
  const services = await db.service.findMany({
    orderBy: { featured: 'desc' },
  });

  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Ambient background glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[600px] -right-60 opacity-40"></div>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-grid-dots border-b border-white/5">
        <div className="container-custom text-center max-w-3xl flex flex-col gap-6 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Our Expertise
          </span>
          <h1 className="heading-h1">
            Core Web Engineering & Identity Design
          </h1>
          <p className="paragraph-lead">
            We code ultra-fast websites, build conversion-focused e-commerce portals, and shape premium brand identities to establish market authority.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container-custom flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="glass-card p-8 flex flex-col gap-6 justify-between group border-white/5"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                    {/* Dynamic Icons */}
                    {service.slug === 'website-development' ? (
                      <Code className="w-6 h-6" />
                    ) : service.slug === 'ecommerce-development' ? (
                      <Sparkles className="w-6 h-6" />
                    ) : service.slug === 'website-maintenance' ? (
                      <Shield className="w-6 h-6" />
                    ) : (
                      <Zap className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-brand-gray-400 leading-relaxed">
                    {service.short_description}
                  </p>
                </div>
                <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-white/5">
                  <p className="text-[11px] text-brand-gray-500 leading-relaxed line-clamp-2">
                    {service.full_description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-brand-accent font-semibold group-hover:gap-2 transition-all mt-2"
                  >
                    View Service Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Block */}
      <section className="py-20 border-t border-white/5 bg-[#0a0a0a]/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                Our Standards
              </span>
              <h2 className="heading-h2 text-white">
                How We Deliver Outsized Value
              </h2>
              <p className="text-sm text-brand-gray-400 leading-relaxed">
                We believe that modern web applications should operate instantly and establish instant visual credibility. We use modern, compiled code architectures to ensure your website excels in speed, SEO, and security.
              </p>
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">No bloated builders</h4>
                    <p className="text-xs text-brand-gray-450 mt-1">
                      We never use WordPress builders or templates that slow your site down.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Lighthouse Speed Optimized</h4>
                    <p className="text-xs text-brand-gray-450 mt-1">
                      Every site is engineered to pass Core Web Vitals with speed index scores under 1.2s.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Lead Funnel Architecture</h4>
                    <p className="text-xs text-brand-gray-450 mt-1">
                      We build audit forms, interactive calculators, and integrated CRM scheduling triggers to convert organic traffic.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic/Visual Block */}
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-brand-accent/15 filter blur-[60px] rounded-full pointer-events-none scale-75"></div>
              <div className="glass-card w-full max-w-md p-8 border-white/10 flex flex-col gap-6 select-none">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-accent" />
                  Standard Web Delivery Check
                </h4>
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/5 text-brand-gray-400">
                    <span>Performance Score</span>
                    <span className="text-green-400 font-semibold">99%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5 text-brand-gray-400">
                    <span>Accessibility Score</span>
                    <span className="text-green-400 font-semibold">100%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5 text-brand-gray-400">
                    <span>Technical SEO Score</span>
                    <span className="text-green-400 font-semibold">100%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5 text-brand-gray-400">
                    <span>Best Practices Check</span>
                    <span className="text-green-400 font-semibold">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries served */}
      <section className="py-20">
        <div className="container-custom flex flex-col gap-12 text-center max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Expertise Alignment
            </span>
            <h2 className="heading-h2 text-white">
              Industries We Serve
            </h2>
            <p className="text-sm text-brand-gray-400">
              We engineer custom industry-specific digital solutions designed to solve niche customer acquisition pain points.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
            <Link href="/industries/healthcare" className="glass-card p-6 flex flex-col items-center justify-center hover:border-brand-accent/20 border-white/5">
              <span>Healthcare</span>
            </Link>
            <Link href="/industries/education" className="glass-card p-6 flex flex-col items-center justify-center hover:border-brand-accent/20 border-white/5">
              <span>Education</span>
            </Link>
            <Link href="/industries/real-estate" className="glass-card p-6 flex flex-col items-center justify-center hover:border-brand-accent/20 border-white/5">
              <span>Real Estate</span>
            </Link>
            <Link href="/industries/automotive" className="glass-card p-6 flex flex-col items-center justify-center hover:border-brand-accent/20 border-white/5">
              <span>Automotive</span>
            </Link>
            <Link href="/industries/ecommerce" className="glass-card p-6 flex flex-col items-center justify-center hover:border-brand-accent/20 border-white/5">
              <span>E-commerce</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pt-16 text-center max-w-2xl mx-auto flex flex-col gap-6 items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Ready to scale your digital presence?
        </h2>
        <Link href="/contact" className="btn-premium-primary gap-2">
          Request Technical Proposal
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
