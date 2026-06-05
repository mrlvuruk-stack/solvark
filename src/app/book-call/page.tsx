import CalendarScheduler from '@/components/calendar-scheduler';

export const metadata = {
  title: 'Book a 15-Minute Discovery Call | Solvark',
  description: 'Select an available date and time slot to connect with our founders. Learn how Solvark can help you design, build, and scale your brand website.',
};

export default function BookCallPage() {
  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden pb-24">
      {/* Background ambient glows */}
      <div className="glow-spot top-0 -left-60 opacity-60"></div>
      <div className="glow-spot top-[600px] -right-60 opacity-40"></div>

      {/* Hero Header */}
      <section className="py-16 md:py-24 bg-grid-dots border-b border-white/5 mb-16">
        <div className="container-custom text-center max-w-3xl flex flex-col gap-6 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            1-on-1 Strategy Scoping
          </span>
          <h1 className="heading-h1">
            Book a 15-Minute Discovery Call
          </h1>
          <p className="paragraph-lead">
            Select a slot below to discuss sitemaps, database scale, visual guidelines, and pricing packages with our founders. No sales pitches, just scoping code.
          </p>
        </div>
      </section>

      {/* Scheduler Block */}
      <section className="container-custom">
        <CalendarScheduler />
      </section>
    </div>
  );
}
