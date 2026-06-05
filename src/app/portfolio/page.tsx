import { db } from '@/lib/db';
import CaseStudiesGrid from '@/components/case-studies-grid';

export const revalidate = 3600;

export default async function PortfolioPage() {
  const projects = await db.caseStudy.findMany({
    orderBy: { created_at: 'desc' },
  });

  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Background ambient glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[800px] -right-60 opacity-40"></div>

      {/* Hero Banner */}
      <section className="py-16 md:py-24 bg-grid-dots border-b border-white/5">
        <div className="container-custom text-center max-w-3xl flex flex-col gap-6 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Visual Showcase
          </span>
          <h1 className="heading-h1">
            Our Work Portfolio
          </h1>
          <p className="paragraph-lead">
            Explore our curated gallery of premium websites, transactional online stores, and dynamic branding systems engineered for client growth.
          </p>
        </div>
      </section>

      {/* Visual Grid Showcase */}
      <section className="py-20">
        <div className="container-custom">
          <CaseStudiesGrid initialItems={projects} />
        </div>
      </section>
    </div>
  );
}
