import { db } from '@/lib/db';
import BlogManager from '@/components/blog-manager';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      status: true,
      created_at: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  const categories = await db.blogCategory.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Blog Articles Manager</h1>
        <p className="text-xs text-brand-gray-400">
          Create, edit, and organize SEO articles for organic digital lead acquisition.
        </p>
      </div>

      <BlogManager initialPosts={posts} categories={categories} />
    </div>
  );
}
