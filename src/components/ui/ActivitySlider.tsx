import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface Slide {
  src: string;
  captionBn: string;
  captionEn: string;
}

const SLIDES: Slide[] = [
  {
    src: '/mock/activity-1.jpg',
    captionBn: 'সুবিধাবঞ্চিত পরিবারের মধ্যে কাপড় বিতরণ – গুনাইগাছ, উলিপুর',
    captionEn: 'Cloth distribution among underprivileged families – Gunaigach, Ulipur',
  },
  {
    src: '/mock/activity-2.jpg',
    captionBn: 'স্বেচ্ছায় রক্তদান কর্মসূচিতে অংশগ্রহণ – কুড়িগ্রাম',
    captionEn: 'Voluntary blood donation campaign – Kurigram',
  },
  {
    src: '/mock/activity-3.jpg',
    captionBn: 'বিশুদ্ধ পানির নলকূপ স্থাপন ও হস্তান্তর – উলিপুর',
    captionEn: 'Tubewell installation and handover for safe water – Ulipur',
  },
];

const AUTO_PLAY_MS = 4000;

interface ActivitySliderProps {
  language?: 'bn' | 'en';
}

export const ActivitySlider: React.FC<ActivitySliderProps> = ({ language = 'bn' }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goTo = useCallback(
    (index: number, dir: 'left' | 'right' = 'right') => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 350);
    },
    [animating]
  );

  const prev = useCallback(() => {
    const idx = (current - 1 + SLIDES.length) % SLIDES.length;
    goTo(idx, 'left');
  }, [current, goTo]);

  const next = useCallback(() => {
    const idx = (current + 1) % SLIDES.length;
    goTo(idx, 'right');
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];
  const isBn = language === 'bn';

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
          <Images className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {isBn ? 'সামাজিক কার্যক্রম' : 'Community Activities'}
          </h2>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'গুনাইগাছ · উলিপুর · কুড়িগ্রামে পরিচালিত স্থানীয় উদ্যোগ'
              : 'Local initiatives conducted in Gunaigach · Ulipur · Kurigram'}
          </p>
        </div>
      </div>

      {/* Slider card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-slate-700/40 group">
        {/* Image */}
        <div
          className={`transition-all duration-350 ease-in-out ${
            animating
              ? direction === 'right'
                ? '-translate-x-6 opacity-0'
                : 'translate-x-6 opacity-0'
              : 'translate-x-0 opacity-100'
          }`}
        >
          <img
            key={current}
            src={slide.src}
            alt={isBn ? slide.captionBn : slide.captionEn}
            className="w-full h-64 sm:h-80 md:h-96 object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Dark gradient overlay for caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 py-5">
          {/* Dots */}
          <div className="flex items-center gap-1.5 mb-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 h-2 bg-emerald-400'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Caption */}
          <p className="text-white text-sm font-semibold leading-snug drop-shadow">
            {isBn ? slide.captionBn : slide.captionEn}
          </p>

          {/* Counter */}
          <span className="text-white/50 text-[11px] font-mono mt-0.5 block">
            {current + 1} / {SLIDES.length}
          </span>
        </div>

        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="grid grid-cols-3 gap-3">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 'right' : 'left')}
            className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
              i === current
                ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
                : 'border-transparent opacity-60 hover:opacity-90 hover:scale-[1.02]'
            }`}
          >
            <img
              src={s.src}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-20 sm:h-24 object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {i === current && (
              <div className="absolute inset-0 ring-2 ring-emerald-400 rounded-2xl pointer-events-none" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};
