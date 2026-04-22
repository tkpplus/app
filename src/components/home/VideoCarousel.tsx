import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { VideoCard } from '../video/VideoCard';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface VideoCarouselProps {
  title: string;
  videos: any[];
  viewMoreLink?: string;
}

export function VideoCarousel({ title, videos, viewMoreLink }: VideoCarouselProps) {
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

  if (!videos || videos.length === 0) return null;

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
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll('left')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll('right')}>
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
          {videos.map((video) => (
            <div key={video.id} className="w-[280px] sm:w-[300px] shrink-0 snap-start">
              <VideoCard
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                duration={video.duration}
                category={video.subcategory || video.category}
                isNew={new Date(video.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                progressPercentage={video.progressPercentage}
                isCompleted={video.isCompleted}
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
