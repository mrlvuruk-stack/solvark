'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2, Briefcase, CheckCircle } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  featured: boolean;
  created_at: Date | string;
}

interface CaseStudiesManagerProps {
  initialProjects: CaseStudy[];
}

export default function CaseStudiesManager({ initialProjects }: CaseStudiesManagerProps) {
  const [projects, setProjects] = useState<CaseStudy[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [results, setResults] = useState('');
  const [techInput, setTechInput] = useState(''); // Comma separated
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80');
  const [projectUrl, setProjectUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle title to slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (techArray.length === 0) {
      setError('Please provide at least one technology (e.g. Next.js, Tailwind).');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          client_name: clientName,
          industry,
          challenge,
          solution,
          results,
          technologies: techArray,
          featured_image: featuredImage,
          gallery_images: [featuredImage],
          project_url: projectUrl || undefined,
          featured,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        // Add to list
        const newProject: CaseStudy = {
          id: data.project.id,
          title: data.project.title,
          slug: data.project.slug,
          client_name: data.project.client_name,
          industry: data.project.industry,
          featured: data.project.featured,
          created_at: new Date(),
        };
        setProjects([newProject, ...projects]);

        // Reset
        setTitle('');
        setSlug('');
        setClientName('');
        setIndustry('');
        setChallenge('');
        setSolution('');
        setResults('');
        setTechInput('');
        setProjectUrl('');
        setFeatured(false);
      } else {
        setError(data.error || 'Failed to create case study.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/case-studies?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete project.');
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
      {/* Form Left Panel */}
      <div className="lg:col-span-7 glass-card p-6 md:p-8 border-white/5 bg-[#0a0a0a]/50">
        <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-accent" />
          Add New Case Study
        </h2>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Case study created successfully!
          </div>
        )}

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Acme SaaS Redesign"
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
                placeholder="acme-saas-redesign"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Client Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            {/* Industry */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Industry *</label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. FinTech, Healthcare"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>

          {/* Challenge */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-450 font-medium">The Challenge * (Min 20 characters)</label>
            <textarea
              required
              rows={3}
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="What was the client's problem, slow web vitals, or low conversions?"
              className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>

          {/* Solution */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-450 font-medium">Our Solution * (Min 20 characters)</label>
            <textarea
              required
              rows={3}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="How did Solvark solve it? Next.js framework build, HSL colors, or glassmorphism dashboard styling?"
              className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>

          {/* Results */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-450 font-medium">Results Summary * (e.g. 40% Speed Up, 2x Leads)</label>
            <input
              type="text"
              required
              value={results}
              onChange={(e) => setResults(e.target.value)}
              placeholder="e.g. +145% Conversion Rate, 18ms Page Speed Index"
              className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tech stack */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Technologies * (Comma-separated)</label>
              <input
                type="text"
                required
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Next.js, Tailwind, Prisma, PostgreSQL"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            {/* Project URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Project Live Link URL (Optional)</label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://acme.com"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Featured Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Image Showcase URL</label>
              <input
                type="text"
                required
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3 mt-4">
              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent bg-[#070707] border-white/10"
              />
              <label htmlFor="featured" className="text-xs text-brand-gray-400 font-medium">
                Feature on Homepage Portfolio
              </label>
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
                Saving Project...
              </>
            ) : (
              <>
                Publish Case Study Project
                <Plus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Listing Right Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-card p-6 border-white/5 bg-[#0a0a0a]/50 flex flex-col gap-5">
          <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
            <Briefcase className="w-4.5 h-4.5 text-brand-accent" />
            Active Projects ({projects.length})
          </h2>

          <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 rounded-lg bg-[#070707] border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors"
                >
                  <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                    <span className="text-xs font-semibold text-white truncate max-w-[220px]">
                      {proj.title}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-brand-gray-450">
                      <span>{proj.client_name}</span>
                      <span className="text-brand-gray-500">|</span>
                      <span>{proj.industry}</span>
                      {proj.featured && (
                        <span className="text-[8px] bg-brand-accent/20 border border-brand-accent/30 text-brand-accent rounded px-1">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(proj.id)}
                    disabled={deletingId === proj.id}
                    className="p-2 text-brand-gray-450 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    {deletingId === proj.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-brand-gray-500 font-light border border-dashed border-white/10 rounded-xl">
                No case studies stored yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
