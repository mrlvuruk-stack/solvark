import { db } from '@/lib/db';
import TestimonialsManager from '@/components/testimonials-manager';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    select: {
      id: true,
      client_name: true,
      company_name: true,
      designation: true,
      review: true,
      rating: true,
      featured: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Testimonials Manager</h1>
        <p className="text-xs text-brand-gray-400">
          Publish and display client endorsements, reviews, and corporate growth reviews.
        </p>
      </div>

      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
