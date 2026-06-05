import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';
import { db } from '@/lib/db';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;

  const project = await db.caseStudy.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  // Parse technologies safely
  let technologies: string[] = [];
  try {
    technologies = Array.isArray(project.technologies)
      ? project.technologies
      : JSON.parse(project.technologies as string);
  } catch (e) {
    technologies = [];
  }

  // Parse gallery images safely
  let galleryImages: string[] = [];
  try {
    galleryImages = Array.isArray(project.gallery_images)
      ? project.gallery_images
      : JSON.parse(project.gallery_images as string);
  } catch (e) {
    galleryImages = [];
  }

  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Background ambient glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[1000px] -right-60 opacity-40"></div>

      {/* Breadcrumbs & Header */}
      <section className="pt-12 pb-16 bg-grid-dots border-b border-white/5">
        <div className="container-custom flex flex-col gap-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-brand-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-accent">{project.client_name}</span>
          </div>

          {/* Title block */}
          <div className="max-w-4xl flex flex-col gap-4">
            <span className="text-xs font-mono text-brand-accent uppercase tracking-wider">
              {project.industry} Case Study
            </span>
            <h1 className="heading-h1 leading-tight text-white">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="py-8">
        <div className="container-custom">
          <div className="w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden bg-brand-gray-900 border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.featured_image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Case Study Details Grid */}
      <section className="py-16">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main content columns */}
          <div className="lg:col-span-8 flex flex-col gap-12 text-sm leading-relaxed">
            {/* Overview / Challenge */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white">The Challenge</h2>
              <p className="text-brand-gray-400 font-light font-sans">
                {project.challenge}
              </p>
            </div>

            {/* Solution */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white">Our Solution</h2>
              <p className="text-brand-gray-400 font-light font-sans">
                {project.solution}
              </p>
            </div>

            {/* Results block */}
            <div className="flex flex-col gap-6 p-8 glass-card border-brand-accent/20 bg-brand-accent/5">
              <h2 className="text-xl font-bold text-white">Key Results Achieved</h2>
              <p className="text-base text-white font-medium">
                {project.results}
              </p>
            </div>

            {/* Image Gallery Mockups */}
            {galleryImages.length > 0 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-white">Project Screens & Deliverables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-brand-gray-900 h-64">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Project screen ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Columns */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="glass-card p-6 border-white/10 flex flex-col gap-6 bg-brand-gray-950/40">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-4">
                Project Information
              </h3>
              
              <div className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-brand-gray-500">Client</span>
                  <span className="text-white font-medium">{project.client_name}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-brand-gray-500">Industry</span>
                  <span className="text-white font-medium">{project.industry}</span>
                </div>

                {project.project_url && (
                  <div className="flex flex-col gap-1">
                    <span className="text-brand-gray-500">Website URL</span>
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-accent hover:underline flex items-center gap-1.5 font-medium mt-0.5"
                    >
                      Visit Site
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Technologies Sidebar Panel */}
            <div className="glass-card p-6 border-white/10 flex flex-col gap-6 bg-brand-gray-950/40">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-4">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-brand-gray-300 uppercase tracking-wider"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* General CTA sidebar */}
            <div className="glass-card p-6 border-white/10 flex flex-col gap-6 bg-brand-gray-950/40">
              <h3 className="text-base font-bold text-white">
                Interested in similar results?
              </h3>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                Connect with our team to discuss your project needs and layout plan.
              </p>
              <Link href="/contact" className="btn-premium-primary text-xs w-full text-center gap-2 py-3">
                Request Proposal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
