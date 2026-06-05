'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2, MessageSquare, CheckCircle, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  company_name: string;
  designation: string;
  review: string;
  rating: number;
  featured: boolean;
}

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsManager({ initialTestimonials }: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          company_name: companyName,
          designation,
          review,
          rating: Number(rating),
          image_url: imageUrl,
          featured,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        const newTestimonial: Testimonial = {
          id: data.testimonial.id,
          client_name: data.testimonial.client_name,
          company_name: data.testimonial.company_name,
          designation: data.testimonial.designation,
          review: data.testimonial.review,
          rating: data.testimonial.rating,
          featured: data.testimonial.featured,
        };
        setTestimonials([newTestimonial, ...testimonials]);

        // Reset
        setClientName('');
        setCompanyName('');
        setDesignation('');
        setReview('');
        setRating(5);
        setFeatured(false);
      } else {
        setError(data.error || 'Failed to create testimonial.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client testimonial review?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert('Failed to delete testimonial.');
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
          Add Client Testimonial
        </h2>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Client testimonial registered successfully!
          </div>
        )}

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Client Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Digitizers"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Designation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Designation / Role *</label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Founder & CEO, VP Marketing"
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Client Rating (Stars) *</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              >
                <option value={5}>5 Stars (Excellent)</option>
                <option value={4}>4 Stars (Good)</option>
                <option value={3}>3 Stars (Average)</option>
                <option value={2}>2 Stars (Poor)</option>
                <option value={1}>1 Star (Critical)</option>
              </select>
            </div>
          </div>

          {/* Testimonial Review */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-450 font-medium">Review Body * (Min 10 characters)</label>
            <textarea
              required
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write client remarks, results achieved, and engineering feedback..."
              className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Image Url */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-gray-450 font-medium">Client Photo URL</label>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#070707] text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3 mt-4">
              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent bg-[#070707] border-white/10"
              />
              <label htmlFor="featured" className="text-xs text-brand-gray-400 font-medium">
                Feature in Homepage Slider
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
                Registering Review...
              </>
            ) : (
              <>
                Publish Client Review
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
            <MessageSquare className="w-4.5 h-4.5 text-brand-accent" />
            Active Testimonials ({testimonials.length})
          </h2>

          <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
            {testimonials.length > 0 ? (
              testimonials.map((test) => (
                <div
                  key={test.id}
                  className="p-3.5 rounded-lg bg-[#070707] border border-white/5 flex flex-col gap-2 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 min-w-0 pr-4">
                      <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                        {test.client_name}
                      </span>
                      <span className="text-[10px] text-brand-gray-500">
                        {test.designation} @ {test.company_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => handleDelete(test.id)}
                        disabled={deletingId === test.id}
                        className="p-1.5 text-brand-gray-450 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        {deletingId === test.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-0.5 text-yellow-400">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    {test.featured && (
                      <span className="text-[8px] bg-brand-accent/20 border border-brand-accent/30 text-brand-accent rounded px-1 font-semibold uppercase">
                        Slider
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-brand-gray-500 font-light border border-dashed border-white/10 rounded-xl">
                No client testimonials registered yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
