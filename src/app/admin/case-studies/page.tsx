import { db } from '@/lib/db';
import CaseStudiesManager from '@/components/case-studies-manager';

export const dynamic = 'force-dynamic';

export default async function AdminCaseStudiesPage() {
  const projects = await db.caseStudy.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      client_name: true,
      industry: true,
      featured: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Case Studies CRUD</h1>
        <p className="text-xs text-brand-gray-400">
          Create, view, and manage client project showcases demonstrating Solvark engineering performance metrics.
        </p>
      </div>

      <CaseStudiesManager initialProjects={projects} />
    </div>
  );
}
