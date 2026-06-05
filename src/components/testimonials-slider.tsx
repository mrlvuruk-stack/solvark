'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestimonialItem {
  id: string;
  client_name: string;
  company_name: string;
  designation: string;
  review: string;
  rating: number;
  image_url: string;
}

interface TestimonialsSliderProps {
  items: TestimonialItem[];
}

export default function TestimonialsSlider({ items }: TestimonialsSliderProps) {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  if (!items || items.length === 0) return null;

  const current = items[index];

  return (
    <div className="relative max-w-4xl mx-auto w-full px-4">
      {/* Background quote mark decoration */}
      <Quote className="absolute -top-12 -left-4 w-24 h-24 text-brand-accent/5 pointer-events-none select-none" />

      <div className="glass-card p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Client Image and Info Block */}
        <div className="flex flex-col items-center text-center md:text-left md:items-start gap-4 flex-shrink-0">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-brand-accent/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image_url}
              alt={current.client_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">{current.client_name}</h4>
            <p className="text-xs text-brand-accent font-medium mt-0.5">{current.designation}</p>
            <p className="text-xs text-brand-gray-400 mt-0.5">{current.company_name}</p>
          </div>
        </div>

        {/* Client Review Block */}
        <div className="flex-1 flex flex-col gap-6 text-center md:text-left justify-center">
          {/* Rating */}
          <div className="flex items-center justify-center md:justify-start gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < current.rating ? 'text-amber-400 fill-amber-400' : 'text-brand-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Testimonial Text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-base md:text-lg text-brand-gray-200 italic leading-relaxed font-light"
            >
              "{current.review}"
            </motion.p>
          </AnimatePresence>

          {/* Nav Controls */}
          <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
            <button
              onClick={prev}
              className="p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors text-white focus:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-brand-gray-500">
              {index + 1} / {items.length}
            </span>
            <button
              onClick={next}
              className="p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors text-white focus:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
