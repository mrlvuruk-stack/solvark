'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CaseStudyItem {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  featured_image: string;
  challenge: string;
  technologies: any; // string[]
}

interface CaseStudiesGridProps {
  initialItems: CaseStudyItem[];
}

export default function CaseStudiesGrid({ initialItems }: CaseStudiesGridProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Extract unique industries from case studies for filter tabs
  const industries = ['All', ...Array.from(new Set(initialItems.map((item) => item.industry)))];

  const filteredItems = initialItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.client_name.toLowerCase().includes(search.toLowerCase()) ||
      item.challenge.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' || item.industry === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2.5">
          {industries.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-300 border ${
                activeTab === tab
                  ? 'bg-brand-accent text-white border-brand-accent'
                  : 'bg-white/5 text-brand-gray-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-brand-gray-500" />
        </div>
      </div>

      {/* Grid Display */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="glass-card overflow-hidden flex flex-col group border-white/5"
            >
              <div className="relative h-56 overflow-hidden bg-brand-gray-900 border-b border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.featured_image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-gray-950/80 backdrop-blur-sm text-[10px] uppercase font-bold text-brand-accent border border-white/10">
                  {project.industry}
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1 justify-between bg-brand-gray-950/20">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-semibold text-brand-gray-500 uppercase tracking-wider">
                    {project.client_name}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs text-brand-gray-400 leading-relaxed line-clamp-3">
                    {project.challenge}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-brand-gray-500">
                    {/* Parse technologies array safely */}
                    {Array.isArray(project.technologies)
                      ? project.technologies.slice(0, 3).join(' • ')
                      : JSON.parse(project.technologies as string).slice(0, 3).join(' • ')}
                  </span>
                  <Link
                    href={`/case-studies/${project.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-white font-semibold"
                  >
                    View Project
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-brand-gray-500 text-sm">
          No case studies match your search or filter.
        </div>
      )}
    </div>
  );
}
