import { db } from '@/lib/db';
import CaseStudiesGrid from '@/components/case-studies-grid';

export const revalidate = 3600;

export default async function CaseStudiesPage() {
  const caseStudies = await db.caseStudy.findMany({
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
            Proof of Value
          </span>
          <h1 className="heading-h1">
            Proven Client Results & Web Engineering
          </h1>
          <p className="paragraph-lead">
            Explore how we partnered with dealers, retailers, and SaaS startups to design, build, and deploy premium web applications that drive real business revenue.
          </p>
        </div>
      </section>

      {/* Interactive Grid Showcase */}
      <section className="py-20">
        <div className="container-custom">
          <CaseStudiesGrid initialItems={caseStudies} />
        </div>
      </section>
    </div>
  );
}
