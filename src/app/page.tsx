import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Terminal, TrendingUp, Zap } from 'lucide-react';
import { db } from '@/lib/db';
import FAQAccordion from '@/components/faq-accordion';
import TestimonialsSlider from '@/components/testimonials-slider';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch data directly on the server
  const services = await db.service.findMany({
    where: { featured: true },
  });

  const caseStudies = await db.caseStudy.findMany({
    where: { featured: true },
  });

  const testimonials = await db.testimonial.findMany({
    where: { featured: true },
  });

  const faqs = await db.fAQ.findMany({
    where: { active: true },
    orderBy: { display_order: 'asc' },
  });

  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden">
      {/* Dynamic ambient glow spots */}
      <div className="glow-spot top-0 -left-60 animate-glow"></div>
      <div className="glow-spot top-[1200px] -right-60 opacity-60"></div>
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 md:py-32 bg-grid-dots">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Hero Left Info */}
          <div className="lg:col-span-7 flex flex-col gap-8 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
              <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
              <span className="text-xs font-semibold text-brand-gray-300 tracking-wide uppercase">
                Premium Web Engineering Agency
              </span>
            </div>
            
            <h1 className="heading-h1">
              Build a Website That Looks Premium & Converts Visitors.
            </h1>
            
            <p className="paragraph-lead">
              Solvark designs and engineers custom, high-converting digital interfaces. We do not use templates; we write clean, performant React code that establishes credibility and generates inbound leads.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link href="/contact" className="btn-premium-primary gap-2">
                Book a Free Discovery Call
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/case-studies" className="btn-premium-secondary">
                View Case Studies
              </Link>
            </div>
          </div>

          {/* Hero Right: Premium Mockup/Dashboard Graphic */}
          <div className="lg:col-span-5 relative w-full flex justify-center z-10">
            {/* Ambient Purple Backlight */}
            <div className="absolute inset-0 bg-brand-accent/20 filter blur-[80px] rounded-full scale-75 pointer-events-none"></div>
            
            <div className="glass-card w-full max-w-md p-6 relative flex flex-col gap-6 select-none border-white/10">
              {/* Fake Window bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs font-mono text-brand-gray-500 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" />
                  solvark-analytics.config
                </div>
              </div>

              {/* Fake Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0a0a]/60 rounded-xl p-4 border border-white/5 flex flex-col gap-2">
                  <span className="text-xs text-brand-gray-500 font-medium">Lighthouse Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">99</span>
                    <span className="text-xs text-green-400 font-semibold">/100</span>
                  </div>
                  <div className="w-full bg-brand-gray-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-brand-accent h-full w-[99%] rounded-full"></div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a]/60 rounded-xl p-4 border border-white/5 flex flex-col gap-2">
                  <span className="text-xs text-brand-gray-500 font-medium">Speed Index</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">0.9</span>
                    <span className="text-xs text-brand-gray-400 font-medium">seconds</span>
                  </div>
                  <span className="text-xs text-green-400 flex items-center gap-1 font-medium mt-1">
                    <Zap className="w-3 h-3 fill-green-400" />
                    Ultra Fast
                  </span>
                </div>
              </div>

              {/* Conversion chart placeholder */}
              <div className="bg-[#0a0a0a]/60 rounded-xl p-4 border border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-brand-gray-500">Monthly Inbound Leads</span>
                    <span className="text-lg font-bold text-white">+145%</span>
                  </div>
                  <TrendingUp className="w-6 h-6 text-brand-accent" />
                </div>
                {/* Simulated Chart Bars */}
                <div className="flex items-end justify-between h-20 pt-2 px-1">
                  <div className="w-6 bg-brand-gray-800 h-6 rounded-t-sm"></div>
                  <div className="w-6 bg-brand-gray-800 h-10 rounded-t-sm"></div>
                  <div className="w-6 bg-brand-gray-800 h-8 rounded-t-sm"></div>
                  <div className="w-6 bg-brand-gray-800 h-14 rounded-t-sm"></div>
                  <div className="w-6 bg-brand-accent h-20 rounded-t-sm shadow-[0_0_12px_rgba(124,58,237,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST INDICATORS */}
      <section className="py-12 border-y border-white/5 bg-[#0a0a0a]/30">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Credibility Proof
            </span>
            <h3 className="text-lg font-bold text-white">
              Trusted by fast-growing brands
            </h3>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-12 text-sm font-semibold tracking-widest text-brand-gray-600">
            <span className="hover:text-brand-gray-300 transition-colors">SHYAM HONDA</span>
            <span className="hover:text-brand-gray-300 transition-colors">AURA SKINCARE</span>
            <span className="hover:text-brand-gray-300 transition-colors">NEXUS PROPERTIES</span>
          </div>

          <div className="flex gap-8 text-xs font-mono text-brand-gray-400">
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg">50+</span>
              <span>Projects Completed</span>
            </div>
            <div className="w-px bg-white/10 h-10"></div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg">99.8%</span>
              <span>Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section className="py-24 md:py-32">
        <div className="container-custom">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Core Capabilities
            </span>
            <h2 className="heading-h2 text-white">
              Services Designed to Elevate Your Brand
            </h2>
            <p className="text-sm text-brand-gray-400 leading-relaxed">
              We design and code clean, responsive, and secure digital assets. No generic templates, no sluggish builders—just pure performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="glass-card p-8 flex flex-col gap-6 justify-between group border-white/5">
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                    {/* Render different icon based on text */}
                    {service.icon === 'ShoppingBag' ? (
                      <Sparkles className="w-6 h-6" />
                    ) : service.icon === 'Compass' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Zap className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-brand-gray-400 leading-relaxed">
                    {service.short_description}
                  </p>
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1 text-xs text-brand-accent font-semibold group-hover:gap-2 transition-all mt-4"
                >
                  Learn More
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-brand-gray-300 hover:text-white transition-colors"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CASE STUDIES */}
      <section className="py-24 md:py-32 border-t border-white/5 bg-[#0a0a0a]/20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div className="flex flex-col gap-4 text-left max-w-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                Proof of Work
              </span>
              <h2 className="heading-h2 text-white">
                Engineered for Outsized Performance
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="btn-premium-secondary text-sm gap-2"
            >
              View All Case Studies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {caseStudies.map((project) => (
              <div key={project.id} className="glass-card overflow-hidden flex flex-col group border-white/5">
                <div className="relative h-64 overflow-hidden bg-brand-gray-900 border-b border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-gray-950/80 backdrop-blur-sm text-[10px] uppercase font-bold text-brand-accent border border-white/10">
                    {project.industry}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col gap-4 flex-1 justify-between bg-brand-gray-950/20">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs text-brand-gray-400 leading-relaxed line-clamp-3">
                      {project.challenge}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                    <span className="text-[11px] font-mono text-brand-gray-500">
                      {Array.isArray(project.technologies)
                        ? (project.technologies as string[]).slice(0, 3).join(' • ')
                        : ''}
                    </span>
                    <Link
                      href={`/case-studies/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs text-white font-semibold"
                    >
                      Read Case Study
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY SOLVARK */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="container-custom">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Why Solvark
            </span>
            <h2 className="heading-h2 text-white">
              SaaS Quality Code for Your Business
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 flex flex-col gap-4 hover:border-brand-accent/20 border-white/5">
              <Zap className="w-8 h-8 text-brand-accent" />
              <h3 className="text-lg font-bold text-white">Ultra Performance</h3>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                Page speed directly affects sales. We compile static Next.js pages that load under 1 second, scoring 95+ in Google Lighthouse.
              </p>
            </div>
            
            <div className="glass-card p-8 flex flex-col gap-4 hover:border-brand-accent/20 border-white/5">
              <ShieldCheck className="w-8 h-8 text-brand-accent" />
              <h3 className="text-lg font-bold text-white">Premium Visual Design</h3>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                We believe your web design dictates your price point. We craft custom visual systems that command high brand authority.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col gap-4 hover:border-brand-accent/20 border-white/5">
              <CheckCircle2 className="w-8 h-8 text-brand-accent" />
              <h3 className="text-lg font-bold text-white">Lead Magnet Frameworks</h3>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                A site must generate value. We implement optimized inquiry funnels, custom budget calculators, and automated lead responders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROCESS TIMELINE */}
      <section className="py-24 md:py-32 border-t border-white/5 bg-[#0a0a0a]/30">
        <div className="container-custom">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto mb-20">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              How We Work
            </span>
            <h2 className="heading-h2 text-white">
              Our 5-Step Engineering Timeline
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 md:-translate-x-1/2 z-0"></div>

            {/* Step 1 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center z-10">
              <div className="md:text-right pr-0 md:pr-12 pl-14 md:pl-0">
                <span className="text-xs font-mono text-brand-accent font-bold">STEP 01</span>
                <h4 className="text-lg font-bold text-white mt-1">Discovery & Audit</h4>
                <p className="text-xs text-brand-gray-400 mt-2 leading-relaxed">
                  We audit your current website, analyze competitor rankings, define conversion goals, and map out the exact target structure.
                </p>
              </div>
              <div className="absolute left-2 md:left-1/2 w-8 h-8 rounded-full bg-brand-gray-950 border-2 border-brand-accent md:-translate-x-1/2 flex items-center justify-center text-xs font-bold text-white font-mono z-20">
                1
              </div>
              <div className="hidden md:block"></div>
            </div>

            {/* Step 2 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center z-10">
              <div className="hidden md:block"></div>
              <div className="absolute left-2 md:left-1/2 w-8 h-8 rounded-full bg-brand-gray-950 border-2 border-brand-accent md:-translate-x-1/2 flex items-center justify-center text-xs font-bold text-white font-mono z-20">
                2
              </div>
              <div className="pl-14 md:pl-12">
                <span className="text-xs font-mono text-brand-accent font-bold">STEP 02</span>
                <h4 className="text-lg font-bold text-white mt-1">Strategy & Sitemap</h4>
                <p className="text-xs text-brand-gray-400 mt-2 leading-relaxed">
                  We write the SEO keywords strategy, define user interaction maps, and deliver a detailed sitemap layout approval draft.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center z-10">
              <div className="md:text-right pr-0 md:pr-12 pl-14 md:pl-0">
                <span className="text-xs font-mono text-brand-accent font-bold">STEP 03</span>
                <h4 className="text-lg font-bold text-white mt-1">Premium UI/UX Design</h4>
                <p className="text-xs text-brand-gray-400 mt-2 leading-relaxed">
                  We design responsive layout prototypes highlighting luxury SaaS aesthetics, typography tokens, and glassmorphic card grids.
                </p>
              </div>
              <div className="absolute left-2 md:left-1/2 w-8 h-8 rounded-full bg-brand-gray-950 border-2 border-brand-accent md:-translate-x-1/2 flex items-center justify-center text-xs font-bold text-white font-mono z-20">
                3
              </div>
              <div className="hidden md:block"></div>
            </div>

            {/* Step 4 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center z-10">
              <div className="hidden md:block"></div>
              <div className="absolute left-2 md:left-1/2 w-8 h-8 rounded-full bg-brand-gray-950 border-2 border-brand-accent md:-translate-x-1/2 flex items-center justify-center text-xs font-bold text-white font-mono z-20">
                4
              </div>
              <div className="pl-14 md:pl-12">
                <span className="text-xs font-mono text-brand-accent font-bold">STEP 04</span>
                <h4 className="text-lg font-bold text-white mt-1">Next.js Code Development</h4>
                <p className="text-xs text-brand-gray-400 mt-2 leading-relaxed">
                  Our engineering team writes clean, componentized React/Next.js pages, configures Prisma database schemas, and optimizes asset delivery.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
              <div className="md:text-right pr-0 md:pr-12 pl-14 md:pl-0">
                <span className="text-xs font-mono text-brand-accent font-bold">STEP 05</span>
                <h4 className="text-lg font-bold text-white mt-1">Security Audit & Launch</h4>
                <p className="text-xs text-brand-gray-400 mt-2 leading-relaxed">
                  We implement database security rules, enable spam protection, deploy edge-routing servers, and launch on Vercel.
                </p>
              </div>
              <div className="absolute left-2 md:left-1/2 w-8 h-8 rounded-full bg-brand-gray-950 border-2 border-brand-accent md:-translate-x-1/2 flex items-center justify-center text-xs font-bold text-white font-mono z-20">
                5
              </div>
              <div className="hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="container-custom flex flex-col gap-16">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Reviews
            </span>
            <h2 className="heading-h2 text-white">
              What Our Clients Say About Us
            </h2>
          </div>
          
          <TestimonialsSlider items={testimonials} />
        </div>
      </section>

      {/* 8. FAQs SECTION */}
      <section className="py-24 md:py-32 border-t border-white/5 bg-[#0a0a0a]/30">
        <div className="container-custom flex flex-col gap-16">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Got Questions?
            </span>
            <h2 className="heading-h2 text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="py-24 md:py-32 border-t border-white/5 relative bg-grid-dots">
        {/* Glow backlight */}
        <div className="absolute inset-0 bg-brand-accent/5 filter blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container-custom text-center relative z-10 flex flex-col gap-8 items-center max-w-2xl">
          <h2 className="heading-h1">
            Ready to Build Something Exceptional?
          </h2>
          <p className="paragraph-lead">
            Let's discuss your project goals, sitemap outline, and visual branding aspirations. Get a detailed technical proposal in 3 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/contact" className="btn-premium-primary gap-2">
              Book Discovery Call
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="btn-premium-secondary">
              Request Technical Proposal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
