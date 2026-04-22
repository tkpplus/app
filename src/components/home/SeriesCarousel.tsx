import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { SeriesCard } from '../video/SeriesCard';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface SeriesCarouselProps {
  title: string;
  series: any[];
  viewMoreLink?: string;
}

export function SeriesCarousel({ title, series, viewMoreLink }: SeriesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
      
      const targetScroll = 
        direction === 'left' 
          ? container.scrollLeft - scrollAmount 
          : container.scrollLeft + scrollAmount;
          
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (!series || series.length === 0) return null;

  return (
    <section className="py-6 group/section">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mb-4 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">{title}</h2>
          {viewMoreLink && (
            <Link to={viewMoreLink} className="text-sm font-semibold text-accent-orange hover:text-white flex items-center transition-colors">
              Explorar <ChevronRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="flex gap-2 opacity-0 transition-opacity duration-300 group-hover/section:opacity-100 hidden sm:flex">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-white/20 text-white hover:bg-white/10" onClick={() => scroll('left')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-white/20 text-white hover:bg-white/10" onClick={() => scroll('right')}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="relative mx-auto max-w-[1400px]">
        {/* Left gradient fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity md:group-hover/section:opacity-100" />
        
        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-8 pt-2 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
        >
          {series.map((s) => (
            <div key={s.id} className="w-[180px] sm:w-[220px] shrink-0 snap-start">
              <SeriesCard
                id={s.id}
                title={s.title}
                thumbnail={s.thumbnail}
              />
            </div>
          ))}
        </div>
        
        {/* Right gradient fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity md:group-hover/section:opacity-100" />
      </div>
    </section>
  );
}
