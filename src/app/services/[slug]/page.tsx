import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  const service = await db.service.findUnique({
    where: { slug },
  });

  if (!service) {
    notFound();
  }

  // Get matching case studies for this service based on technology stack
  const isWebDev = slug === 'website-development' || slug === 'website-redesign';
  const isEcom = slug === 'ecommerce-development';
  const isBranding = slug === 'branding';

  const industryFilter = isEcom ? 'E-commerce' : isBranding ? 'Branding' : undefined;

  const relatedCaseStudies = await db.caseStudy.findMany({
    where: industryFilter ? { industry: industryFilter } : undefined,
    take: 2,
  });

  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Glow backgrounds */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[800px] -right-60 opacity-40"></div>

      {/* Breadcrumbs & Header */}
      <section className="pt-12 pb-16 bg-grid-dots border-b border-white/5">
        <div className="container-custom flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-brand-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-accent">{service.title}</span>
          </div>

          <div className="max-w-3xl flex flex-col gap-4">
            <h1 className="heading-h1 leading-tight text-white">
              {service.title}
            </h1>
            <p className="paragraph-lead">
              {service.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-20">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Detailed Content */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-white">Service Overview</h2>
              <p className="text-sm text-brand-gray-400 leading-relaxed font-light">
                {service.full_description}
              </p>
            </div>

            {/* Custom Benefits for this service */}
            <div className="flex flex-col gap-6 p-8 glass-card border-white/5 bg-[#0a0a0a]/50">
              <h3 className="text-lg font-bold text-white">What You Can Expect</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-brand-gray-300">Clean, fully custom and responsive code layouts.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-brand-gray-300">Google Lighthouse optimization (Speed score 95+).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-brand-gray-300">Centralized database-backed administrative panels.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-brand-gray-300">Technical SEO markup and organization indexing.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar CTA Panel */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="glass-card p-6 border-white/10 flex flex-col gap-6 bg-brand-gray-950/40">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">
                Need a Custom Quote?
              </h3>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                Connect with our engineering team to discuss sitemaps, database integrations, and get a technical proposal in 3 days.
              </p>
              <Link href="/contact" className="btn-premium-primary text-xs w-full text-center gap-2 py-3">
                Book Discovery Call
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Case Studies */}
      {relatedCaseStudies.length > 0 && (
        <section className="py-20 border-t border-white/5 bg-[#0a0a0a]/30">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-white mb-12">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedCaseStudies.map((project) => (
                <div key={project.id} className="glass-card overflow-hidden flex flex-col group border-white/5">
                  <div className="relative h-48 overflow-hidden bg-brand-gray-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                    <div>
                      <h4 className="text-xs font-mono text-brand-accent uppercase tracking-wider">{project.industry}</h4>
                      <h3 className="text-lg font-bold text-white mt-1.5 leading-tight">{project.title}</h3>
                    </div>
                    <Link
                      href={`/case-studies/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs text-white font-semibold mt-4"
                    >
                      View Case Study
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
