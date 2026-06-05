'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  created_at: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface BlogGridProps {
  initialPosts: BlogPostItem[];
  categories: { id: string; name: string; slug: string }[];
}

export default function BlogGrid({ initialPosts, categories }: BlogGridProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || post.category.slug === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-300 border ${
              activeCategory === 'All'
                ? 'bg-brand-accent text-white border-brand-accent'
                : 'bg-white/5 text-brand-gray-400 border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-300 border ${
                activeCategory === cat.slug
                  ? 'bg-brand-accent text-white border-brand-accent'
                  : 'bg-white/5 text-brand-gray-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-brand-gray-500" />
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-card overflow-hidden flex flex-col group border-white/5"
            >
              <div className="relative h-48 overflow-hidden bg-brand-gray-900 border-b border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-brand-gray-950/80 backdrop-blur-sm text-[9px] uppercase font-bold text-brand-accent border border-white/10">
                  {post.category.name}
                </span>
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1 justify-between bg-brand-gray-950/20">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-[10px] text-brand-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-accent transition-colors leading-tight mt-1.5">
                    {post.title}
                  </h3>
                  <p className="text-xs text-brand-gray-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-white font-semibold mt-4"
                >
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-brand-gray-500 text-sm">
          No articles match your search or category filter.
        </div>
      )}
    </div>
  );
}
