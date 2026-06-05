import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/db';

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

interface IndustryData {
  name: string;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  features: string[];
  dbFilter: string;
}

const industryDetails: Record<string, IndustryData> = {
  healthcare: {
    name: 'Healthcare',
    title: 'Healthcare Web Engineering Solutions',
    description: 'HIPAA-compliant, highly secure web interfaces for patient portals, clinic directories, and telemedicine systems.',
    challenge: 'Patient booking dropoffs, slow dashboard portals, complex HIPAA form integration compliance, and non-accessible screen layouts.',
    solution: 'We build fast, secure custom-coded patient inquiry pages, edge-routed database APIs, and WCAG-compliant screen contrasts.',
    features: [
      'Secure credential access structures',
      'Instant patient intake form integrations',
      'WCAG 2.1 accessibility compliance checks',
      'Edge database encryption rules',
    ],
    dbFilter: 'Healthcare',
  },
  education: {
    name: 'Education',
    title: 'Education & LMS Web Engineering',
    description: 'Scalable LMS portals, enrollment catalogs, student registration schedules, and academic directories.',
    challenge: 'Messy LMS navigation, heavy media load delays, poor mobile compatibility for students, and outdated directory searches.',
    solution: 'We construct clean component hierarchies, lazy-loaded video/media course assets, and client-side instant search catalogs.',
    features: [
      'Responsive student portal layouts',
      'Instant catalog course filter arrays',
      'Fast CDN visual course delivery networks',
      'Accessible keyboard navigation standards',
    ],
    dbFilter: 'Education',
  },
  'real-estate': {
    name: 'Real Estate',
    title: 'Real Estate Web Showcases & Grids',
    description: 'Visual property catalog grids, advanced search filters, geographic listings, and lead scheduling.',
    challenge: 'Sluggish property filtering loading times, low-quality visual card interfaces, slow map load times, and low form conversion rates.',
    solution: 'We implement client-side instant filter grids, light lazy-loaded catalog cards, smooth image carousels, and budget estimators.',
    features: [
      'Instant property parameter filtering',
      'Premium visual grids and asset loaders',
      'Integrated map location APIs',
      'Scoping budget call schedulers',
    ],
    dbFilter: 'Real Estate',
  },
  automotive: {
    name: 'Automotive',
    title: 'Automotive Digital Showroom Platforms',
    description: 'Showroom vehicle catalog grids, 360-degree color selectors, local booking schedules, and automated lead routing.',
    challenge: 'Slow model catalog loading, non-responsive dealer locators, high dropoff rates on test ride bookings, and slow sales follow-up.',
    solution: 'We write Next.js catalog codes, 360-degree vehicle selectors, interactive local time slot selectors, and automated HubSpot CRM syncs.',
    features: [
      'Smooth vehicle color transitions selectors',
      'Interactive time slot scheduler arrays',
      'Automated sales desk lead routing',
      'Ultra-fast asset loading speeds',
    ],
    dbFilter: 'Automotive',
  },
  ecommerce: {
    name: 'E-commerce',
    title: 'Headless E-commerce & Retail Scaling',
    description: 'Headless Shopify storefronts, secure single-step checkouts, and priority inventory gateway syncs.',
    challenge: 'Bloated standard Shopify template paths, high checkout cart abandonment, laggy page transitions, and poor mobile checkout flow.',
    solution: 'We engineer headless Shopify architectures using Next.js, single-step checkouts, and priority inventory gate syncs.',
    features: [
      'Headless Shopify GraphQL integrations',
      'Secure single-page checkout flows',
      'Mobile thumb-friendly buttons and navs',
      'Instant search and filter operations',
    ],
    dbFilter: 'E-commerce',
  },
};

export default async function IndustryDetailPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const data = industryDetails[slug];

  if (!data) {
    notFound();
  }

  // Fetch related case studies from database based on industry filter
  const caseStudies = await db.caseStudy.findMany({
    where: {
      industry: {
        contains: data.dbFilter,
      },
    },
    take: 2,
  });

  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Background ambient glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[800px] -right-60 opacity-40"></div>

      {/* Header Breadcrumbs */}
      <section className="pt-12 pb-16 bg-grid-dots border-b border-white/5">
        <div className="container-custom flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-brand-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/industries" className="hover:text-white transition-colors">Industries</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-accent">{data.name}</span>
          </div>

          <div className="max-w-3xl flex flex-col gap-4">
            <span className="text-xs font-mono text-brand-accent uppercase tracking-wider">
              {data.name} Industry Verticals
            </span>
            <h1 className="heading-h1 leading-tight text-white">
              {data.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-20">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Challenges & Solutions */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white">Industry Challenges</h2>
              <p className="text-sm text-brand-gray-400 leading-relaxed font-light">
                {data.challenge}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white">Our Solutions</h2>
              <p className="text-sm text-brand-gray-400 leading-relaxed font-light">
                {data.solution}
              </p>
            </div>

            {/* Feature lists */}
            <div className="flex flex-col gap-6 p-8 glass-card border-white/5 bg-[#0a0a0a]/50">
              <h3 className="text-lg font-bold text-white">Key Deliverables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {data.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                    <span className="text-brand-gray-300">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA panel */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="glass-card p-6 border-white/10 flex flex-col gap-6 bg-brand-gray-950/40">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-4">
                Need a Scoped Proposal?
              </h3>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                Connect with our team to discuss sitemap requirements, visual parameters, and budget estimations for {data.name}.
              </p>
              <Link href="/contact" className="btn-premium-primary text-xs w-full text-center gap-2 py-3">
                Request Proposal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {caseStudies.length > 0 && (
        <section className="py-20 border-t border-white/5 bg-[#0a0a0a]/30">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-white mb-12">
              Related Case Studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.map((project) => (
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
