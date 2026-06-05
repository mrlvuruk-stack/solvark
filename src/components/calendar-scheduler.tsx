'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const timeSlots = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'];

// Generate next 14 days (excluding Sundays)
const getAvailableDays = () => {
  const days: Date[] = [];
  const current = new Date();
  let count = 0;
  while (count < 14) {
    current.setDate(current.getDate() + 1);
    if (current.getDay() !== 0) { // Exclude Sunday
      days.push(new Date(current));
      count++;
    }
  }
  return days;
};

export default function CalendarScheduler() {
  const [days] = useState(getAvailableDays());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Info, 3: Success
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);

  const selectDay = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      setStep(2);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: '',
          company_name: '',
          service_interest: 'Discovery Call',
          budget_range: 'Scoping',
          project_details: `Scheduled meeting on: ${selectedDate?.toLocaleDateString()} at ${selectedTime}. Client Website: ${website || 'None'}`,
          source: 'Calendar Booking Page',
        }),
      });

      if (response.ok) {
        setStep(3);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (step === 3) {
    return (
      <div className="glass-card p-8 text-center flex flex-col items-center gap-6 max-w-md mx-auto border-brand-accent/20 bg-brand-accent/5">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white">Discovery Call Confirmed</h3>
          <p className="text-xs text-brand-gray-400 leading-relaxed">
            Your meeting is scheduled for **{selectedDate && formatDate(selectedDate)}** at **{selectedTime}** (IST). A calendar invite containing the Google Meet link has been sent to your email.
          </p>
        </div>
        <div className="w-full bg-[#0a0a0a]/50 rounded-lg p-4 border border-white/5 text-xs text-left flex flex-col gap-2 font-mono">
          <div className="flex justify-between">
            <span className="text-brand-gray-500">Attendee</span>
            <span className="text-white">{name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-gray-500">Email</span>
            <span className="text-white">{email}</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="glass-card p-6 md:p-8 max-w-lg mx-auto border-white/5 bg-[#0a0a0a]/50">
        <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-brand-accent" />
          Confirm Call Info
        </h3>
        
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/5 text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 text-brand-gray-300">
            <CalendarIcon className="w-4 h-4 text-brand-accent" />
            <span>{selectedDate && selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-gray-300">
            <Clock className="w-4 h-4 text-brand-accent" />
            <span>{selectedTime} (India Standard Time)</span>
          </div>
        </div>

        <form onSubmit={handleBooking} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-400 font-medium">Name *</label>
            <input
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-400 font-medium">Email *</label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-brand-gray-400 font-medium">Current Website (Optional)</label>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-[#0a0a0a]/50 text-white rounded-lg border border-white/10 px-4 py-2.5 text-xs focus:outline-none focus:border-brand-accent transition-all"
            />
          </div>

          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-premium-secondary text-xs flex-1 py-3"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-premium-primary text-xs flex-1 py-3"
            >
              {loading ? 'Booking...' : 'Confirm Call'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="glass-card max-w-2xl mx-auto border-white/5 bg-[#0a0a0a]/50 p-6 md:p-8 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Col: Date List */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            1. Select a Date
          </span>
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
            {days.map((date) => {
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => selectDay(date)}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-brand-accent border-brand-accent text-white'
                      : 'bg-white/5 border-white/5 text-brand-gray-450 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {formatDate(date)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Time List */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            2. Select a Time Slot
          </span>
          {selectedDate ? (
            <div className="flex flex-col gap-2.5">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`w-full text-center p-3.5 rounded-lg border text-xs font-semibold tracking-wide uppercase transition-all ${
                      isSelected
                        ? 'bg-brand-accent border-brand-accent text-white'
                        : 'bg-white/5 border-white/5 text-brand-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center border border-dashed border-white/10 rounded-xl p-8 text-center text-xs text-brand-gray-500 font-light">
              Select a date on the left column first to see available time slots.
            </div>
          )}
        </div>
      </div>

      {/* Control panel */}
      {selectedDate && selectedTime && (
        <div className="flex items-center justify-between border-t border-white/5 pt-6 animate-fade-in">
          <div className="flex flex-col text-left gap-1">
            <span className="text-[10px] text-brand-gray-500 font-mono">SELECTED MEETING TIME</span>
            <span className="text-xs text-white font-semibold">
              {formatDate(selectedDate)} at {selectedTime}
            </span>
          </div>
          <button
            onClick={handleNext}
            className="btn-premium-primary text-xs gap-2 py-3 px-6"
          >
            Enter Call Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
