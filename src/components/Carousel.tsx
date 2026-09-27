'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';

export function Carousel({ title, children }: { title: string; children: React.ReactNode }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps' });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="mb-10 relative">
      <div className="flex justify-between items-center mb-4 px-6 md:px-10">
        <div className="flex items-center gap-2">
           <div className="w-1 h-5 bg-red-600 rounded-full" />
           <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={scrollPrev} className="p-2 rounded-full border border-zinc-700 bg-[#09090b] hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
          <button onClick={scrollNext} className="p-2 rounded-full border border-zinc-700 bg-[#09090b] hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="overflow-hidden px-6 md:px-10" ref={emblaRef}>
        <div className="flex gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}