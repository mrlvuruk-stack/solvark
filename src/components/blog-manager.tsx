'use client';

import { useState } from 'react';
import { Trash2, Plus, Loader2, FileText, CheckCircle } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  created_at: Date | string;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface BlogManagerProps {
  initialPosts: BlogPost[];
  categories: Category[];
}

export default function BlogManager({ initialPosts, categories }: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=85');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    );
    setSeoTitle(`${val} | Solvark`);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!categoryId) {
      setError('Please select a valid category.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          featured_image: featuredImage,
          seo_title: seoTitle,
          seo_description: seoDescription || excerpt.substring(0, 150),
          status,
          category_id: categoryId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        // Add to list
        const categoryName = categories.find((c) => c.id === categoryId)?.name || 'General';
        const newPost: BlogPost = {
          id: data.post.id,
          title: data.post.title,
          slug: data.post.slug,
          excerpt: data.post.excerpt,
          status: data.post.status,
          created_at: new Date(),
          category: { name: categoryName },
        };
        setPosts([newPost, ...posts]);

        // Reset fields
        setTitle('');
        setSlug('');
        setExcerpt('');
        setContent('');
        setSeoTitle('');
        setSeoDescription('');
      } else {
        setError(data.error || 'Failed to create blog post.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete blog post.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to API.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left panel: Form to add new post */}
      <div className="lg:col-span-7 glass-card p-6 md:p-8 border-white/5 bg-[#0a0a0a]/50">
        <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-accent" />
          Write & Publish Blog Post
        </h2>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Post created and published successfully!
          </div>
        )}

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Post Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. 5 Visual Tricks to Double Conversion"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="5-visual-tricks-to-double-conversion"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-450 font-medium">Excerpt * (Short summary for feed)</label>
            <input
              type="text"
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Discover how micro-animations and aesthetic HSL styling can increase client engagement..."
              className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>

          {/* Full content */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-450 font-medium">Content * (Supports HTML / markdown)</label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full body content here..."
              className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Publishing Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-450 font-medium">Featured Image URL</label>
            <input
              type="text"
              required
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>

          {/* SEO Optimization Section */}
          <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-4">
            <span className="text-[10px] font-mono text-brand-gray-500">SEO METADATA PARAMETERS</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-brand-gray-450 font-medium">Meta Title</label>
                <input
                  type="text"
                  required
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-brand-gray-450 font-medium">Meta Description</label>
                <input
                  type="text"
                  required
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Seeded description fallback is the excerpt."
                  className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium-primary text-xs w-full py-3 gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Blog Post...
              </>
            ) : (
              <>
                Publish & Sync Live Feed
                <Plus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right panel: Listing of existing posts */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-card p-6 border-white/5 bg-[#0a0a0a]/50 flex flex-col gap-5">
          <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-brand-accent" />
            Active Articles ({posts.length})
          </h2>

          <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-lg bg-[#070707] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors"
                >
                  <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                    <span className="text-xs font-semibold text-white truncate max-w-[220px]">
                      {post.title}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-brand-gray-450">
                      <span className="px-1.5 py-0.2 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded">
                        {post.category.name}
                      </span>
                      <span className="uppercase font-semibold text-brand-gray-500">
                        {post.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="p-2 text-brand-gray-450 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    {deletingId === post.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-brand-gray-500 font-light border border-dashed border-white/10 rounded-xl">
                No blog posts published yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
