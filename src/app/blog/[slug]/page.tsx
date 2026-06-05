import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Calendar, User } from 'lucide-react';
import { db } from '@/lib/db';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
    },
  });

  if (!post) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Ambient background glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[800px] -right-60 opacity-40"></div>

      {/* Header & Meta */}
      <section className="pt-12 pb-16 bg-grid-dots border-b border-white/5">
        <div className="container-custom flex flex-col gap-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-brand-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-accent">{post.category.name}</span>
          </div>

          {/* Title block */}
          <div className="max-w-4xl flex flex-col gap-4">
            <h1 className="heading-h1 leading-tight text-white">
              {post.title}
            </h1>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-brand-gray-400 font-mono mt-2">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-accent" />
                {post.author.name}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-accent" />
                {formatDate(post.created_at)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="py-8">
        <div className="container-custom">
          <div className="w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden bg-brand-gray-900 border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Article text content */}
          <div className="lg:col-span-8 flex flex-col gap-8 text-sm leading-relaxed text-brand-gray-300 font-light">
            <p className="text-base text-white font-medium leading-relaxed font-sans">
              {post.excerpt}
            </p>
            
            <div className="h-px bg-white/5 my-4"></div>
            
            {/* Split content by paragraph to render it nicely */}
            {post.content.split('\n\n').map((para, idx) => (
              <p key={idx} className="font-light leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Category badge list */}
            <div className="glass-card p-6 border-white/10 flex flex-col gap-4 bg-brand-gray-950/40">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
                Article Category
              </h3>
              <span className="px-3 py-1.5 rounded-lg bg-brand-accent/10 border border-brand-accent/20 text-xs text-brand-accent font-semibold w-fit">
                {post.category.name}
              </span>
            </div>

            {/* Lead Magnet sidebar card */}
            <div className="glass-card p-6 border-white/10 flex flex-col gap-6 bg-brand-gray-950/40">
              <h3 className="text-base font-bold text-white">
                Is your site slow or losing conversions?
              </h3>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                Get a personalized 10-minute video audit of your current website, diagnosing speed bottlenecks, UX credibility gaps, and conversion leaks.
              </p>
              <Link href="/free-website-audit" className="btn-premium-primary text-xs w-full text-center gap-2 py-3">
                Get Free Video Audit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
