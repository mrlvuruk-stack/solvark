import ContactForm from '@/components/contact-form';
import FAQAccordion from '@/components/faq-accordion';
import { db } from '@/lib/db';
import { Mail, MapPin, Phone, Clock, MessageSquare } from 'lucide-react';
import { Suspense } from 'react';

export const metadata = {
  title: 'Request a Scoping Proposal | Solvark',
  description: 'Connect with the engineering team at Solvark. Request custom project quotes, scoping agreements, and sitemap audits.',
};

export default async function ContactPage() {
  const faqs = await db.fAQ.findMany({
    where: { active: true },
    orderBy: { display_order: 'asc' },
  });

  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Background ambient glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[600px] -right-60 opacity-40"></div>

      <section className="py-16 md:py-24 bg-grid-dots border-b border-white/5 mb-16">
        <div className="container-custom text-center max-w-3xl flex flex-col gap-6 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Connect With Us
          </span>
          <h1 className="heading-h1">
            Let's Engineer Something Exceptional
          </h1>
          <p className="paragraph-lead">
            Discuss your sitemap requirements, visual parameters, and timeline scopes. We return scoping proposals in 3 days.
          </p>
        </div>
      </section>

      <section className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Info Columns */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-accent" />
                Contact Information
              </h3>
              <p className="text-xs text-brand-gray-400 leading-relaxed font-light">
                Feel free to contact us via work email, direct phone, or scheduling a calendar meeting. We are active Mon-Fri 9AM-6PM IST.
              </p>
            </div>

            <div className="flex flex-col gap-5 text-sm">
              <a href="mailto:hello@solvark.com" className="flex items-center gap-3.5 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent group-hover:border-brand-accent/20 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs text-brand-gray-500 font-mono">Email Address</h4>
                  <span className="text-white font-medium">hello@solvark.com</span>
                </div>
              </a>

              <a href="tel:+919876543210" className="flex items-center gap-3.5 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent group-hover:border-brand-accent/20 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs text-brand-gray-500 font-mono">Direct Phone</h4>
                  <span className="text-white font-medium">+91 98765 43210</span>
                </div>
              </a>

              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent group-hover:border-brand-accent/20 transition-all">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs text-brand-gray-500 font-mono">Headquarters</h4>
                  <span className="text-white font-medium">HSR Layout, Bangalore, India</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent group-hover:border-brand-accent/20 transition-all">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs text-brand-gray-500 font-mono">Response Time</h4>
                  <span className="text-white font-medium">Within 4 Business Hours</span>
                </div>
              </div>
            </div>
            
            {/* FAQs Accordion under info */}
            <div className="flex flex-col gap-6 mt-6 border-t border-white/5 pt-10">
              <h3 className="text-lg font-bold text-white">General Inquiry FAQs</h3>
              <FAQAccordion items={faqs.slice(0, 3)} />
            </div>
          </div>

          {/* Form Columns */}
          <div className="lg:col-span-7 w-full">
            <Suspense fallback={<div className="text-center text-brand-gray-500 text-xs py-10">Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
