import { db } from '@/lib/db';
import BlogGrid from '@/components/blog-grid';

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { status: 'published' },
    include: {
      category: true,
    },
    orderBy: { created_at: 'desc' },
  });

  const categories = await db.blogCategory.findMany();

  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Background ambient glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[800px] -right-60 opacity-40"></div>

      {/* Hero Header */}
      <section className="py-16 md:py-24 bg-grid-dots border-b border-white/5">
        <div className="container-custom text-center max-w-3xl flex flex-col gap-6 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Articles & Insights
          </span>
          <h1 className="heading-h1">
            The Solvark Engineering Blog
          </h1>
          <p className="paragraph-lead">
            Dive into modern React development patterns, UX conversion optimization strategies, brand sitemap structuring, and search ranking guidelines.
          </p>
        </div>
      </section>

      {/* Grid Showcase */}
      <section className="py-20">
        <div className="container-custom">
          {/* @ts-ignore */}
          <BlogGrid initialPosts={posts} categories={categories} />
        </div>
      </section>
    </div>
  );
}
