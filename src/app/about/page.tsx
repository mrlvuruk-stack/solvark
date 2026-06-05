import { ArrowRight, Compass, Shield, Sparkles, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Solvark',
  description: 'Learn about our agency story, mission, and the core engineering and design values that dictate our high standards.',
};

export default function AboutPage() {
  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Background ambient glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[1000px] -right-60 opacity-40"></div>

      {/* Hero Header */}
      <section className="py-16 md:py-24 bg-grid-dots border-b border-white/5">
        <div className="container-custom text-center max-w-3xl flex flex-col gap-6 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Our Story
          </span>
          <h1 className="heading-h1">
            Engineered for Outsized Digital Growth
          </h1>
          <p className="paragraph-lead">
            Solvark was founded to solve a critical market gap: businesses paying high prices for slow, generic templates. We build custom React/Next.js platforms that establish real credibility.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="glass-card p-8 flex flex-col gap-4 border-white/5 bg-[#0a0a0a]/50">
            <div className="w-10 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Our Mission</h3>
            <p className="text-xs text-brand-gray-400 leading-relaxed font-light">
              To empower ambitious businesses with high-performance, custom-coded web architectures that capture qualified organic leads and command premium industry authority.
            </p>
          </div>

          <div className="glass-card p-8 flex flex-col gap-4 border-white/5 bg-[#0a0a0a]/50">
            <div className="w-10 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Our Vision</h3>
            <p className="text-xs text-brand-gray-400 leading-relaxed font-light">
              To redefine agency web standards globally by eliminating sluggish, bloated drag-and-drop page builders in favor of custom, modern software engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 border-t border-white/5 bg-[#0a0a0a]/30">
        <div className="container-custom">
          <h2 className="heading-h2 text-white text-center mb-16">
            Values That Dictate Our Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-brand-accent uppercase tracking-wide">01. Performance First</span>
              <h4 className="text-lg font-bold text-white">Speed is a Feature</h4>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                Page speed impacts conversion. Every line of code is structured to compile into static HTML/JSON files that load instantly.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-brand-accent uppercase tracking-wide">02. Design Authority</span>
              <h4 className="text-lg font-bold text-white">Credibility is Visual</h4>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                Your website is your first handshake. We craft tailored visual design tokens that command luxury perception and trust.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-brand-accent uppercase tracking-wide">03. Lead Automation</span>
              <h4 className="text-lg font-bold text-white">Engineered for Results</h4>
              <p className="text-xs text-brand-gray-400 leading-relaxed">
                A premium design is meaningless if it fails to convert. We design optimal customer journeys and integrated lead funnels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 border-t border-white/5">
        <div className="container-custom max-w-4xl mx-auto flex flex-col gap-16">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Our Leadership
            </span>
            <h2 className="heading-h2 text-white">
              Meet the Founders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Founder 1 */}
            <div className="glass-card p-6 flex items-center gap-6 border-white/5">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-accent/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop"
                  alt="Aman Gupta"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Aman Gupta</h4>
                <p className="text-xs text-brand-accent font-medium mt-0.5">Co-Founder & Chief Architect</p>
                <p className="text-xs text-brand-gray-400 mt-2 leading-relaxed">
                  Web engineer specializing in Next.js backend scale, API integration architectures, and SQL optimizations.
                </p>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="glass-card p-6 flex items-center gap-6 border-white/5">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-accent/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                  alt="Nisha Sen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Nisha Sen</h4>
                <p className="text-xs text-brand-accent font-medium mt-0.5">Co-Founder & Design Director</p>
                <p className="text-xs text-brand-gray-400 mt-2 leading-relaxed">
                  UI/UX specialist focused on luxury brand positioning, interactive Framer design tokens, and user conversion psychology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-16 text-center max-w-2xl mx-auto flex flex-col gap-6 items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Work with growth-focused partners.
        </h2>
        <Link href="/contact" className="btn-premium-primary gap-2">
          Request Technical Proposal
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
