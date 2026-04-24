import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { FeaturedInfoModal } from './FeaturedInfoModal';

interface HeroBannerProps {
  video: any;
}

export function HeroBanner({ video }: HeroBannerProps) {
  const [showInfo, setShowInfo] = useState(false);

  if (!video) return null;

  return (
    <>
      <div className="relative mb-12 w-full min-h-[50vh] md:min-h-[65vh] xl:min-h-[75vh] flex items-center pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Thumbnail on the right */}
          <div className="absolute top-0 right-0 w-full md:w-[85%] lg:w-3/4 xl:w-2/3 h-full overflow-hidden">
              <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-1000 scale-[1.02]"
              />
              {/* Gradients to fade out the left and bottom edges of the thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/80 to-background" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded bg-[#F5C463] px-3 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-sm">
                Destacado
              </span>
              {video.category && (
                <span className="rounded bg-white/10 border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
                  {video.category}
                </span>
              )}
            </div>
            
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold font-display leading-[1.05] tracking-tight text-white drop-shadow-lg line-clamp-4 relative z-20">
              {video.title.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
            </h1>
            
            <p className="mb-8 line-clamp-3 text-base md:text-xl text-white/90 max-w-2xl font-medium drop-shadow-md relative z-20 leading-relaxed">
              {video.description.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 relative z-20">
              <Button size="lg" asChild className="gap-2 text-base shadow-lg bg-white text-black hover:bg-white/90 border border-white h-14 px-8 rounded-lg">
                <Link to={`/watch/${video.id}`}>
                  <Play className="h-6 w-6 fill-current" />
                  Reproducir
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowInfo(true)}
                className="gap-2 bg-[#44444b] text-white border-transparent hover:bg-[#52525a] hover:text-white transition-all h-14 px-8 rounded-lg font-semibold text-base shadow-lg"
              >
                <Info className="h-6 w-6" />
                Más Info
              </Button>
            </div>
            
            {/* Metadata tags (kept per user request, moved lower or less prominent if needed, or kept as requested) */}
            <div className="mt-8 flex items-center flex-wrap gap-3 text-xs md:text-sm font-semibold text-white/60 relative z-20">
              {video.episodeNum && (
                <>
                  <span>T{video.seasonNum || 1} • E{video.episodeNum}</span>
                  <span>•</span>
                </>
              )}
              <span>2024</span>
              <span>•</span>
              <span className="rounded border border-white/30 px-1.5 py-0.5 opacity-80">ATB</span>
            </div>
          </div>
        </div>
      </div>

      <FeaturedInfoModal 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
        video={video} 
      />
    </>
  );
}
