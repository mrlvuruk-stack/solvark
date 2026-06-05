'use client';

import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-gray-950 border-t border-white/5 pt-20 pb-8 text-brand-gray-400">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center group w-fit">
              <div className="bg-white px-4 py-1.5 rounded-lg flex items-center justify-center h-12 transition-all group-hover:scale-[1.03] duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Solvark Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-sm max-w-sm leading-relaxed">
              We design and engineer premium, fast, and growth-focused web experiences that improve business credibility and acquire qualified leads.
            </p>
            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 max-w-sm mt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                Subscribe to our newsletter
              </span>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 pr-12 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-md transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <span className="text-xs text-green-400 animate-fade-in">
                  Thanks for subscribing!
                </span>
              )}
            </form>
          </div>

          {/* Column 1: Services */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              Services
            </span>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/services/website-development" className="hover:text-white transition-colors">
                Website Development
              </Link>
              <Link href="/services/ecommerce-development" className="hover:text-white transition-colors">
                E-commerce
              </Link>
              <Link href="/services/website-redesign" className="hover:text-white transition-colors">
                Website Redesign
              </Link>
              <Link href="/services/branding" className="hover:text-white transition-colors">
                Branding & Identity
              </Link>
              <Link href="/services/website-maintenance" className="hover:text-white transition-colors">
                Website Maintenance
              </Link>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              Company
            </span>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/portfolio" className="hover:text-white transition-colors">
                Portfolio Showcase
              </Link>
              <Link href="/case-studies" className="hover:text-white transition-colors">
                Case Studies
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors">
                Articles & Blog
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact & Support
              </Link>
            </div>
          </div>

          {/* Column 3: Contact Details */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              Contact
            </span>
            <div className="flex flex-col gap-4 text-sm">
              <a href="mailto:hello@solvark.com" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-brand-accent" />
                hello@solvark.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-brand-accent" />
                +91 98765 43210
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-accent mt-1 flex-shrink-0" />
                <span className="leading-relaxed">
                  Tech Hub, HSR Layout, Bangalore, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-8"></div>

        {/* Bottom Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>
            © {new Date().getFullYear()} Solvark. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors font-medium border-l border-white/10 pl-6">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
