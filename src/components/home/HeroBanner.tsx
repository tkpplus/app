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
          <div className="absolute top-0 right-0 w-full md:w-[85%] lg:w-3/4 xl:w-2/3 h-full">
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
          <div className="max-w-2xl">
            {video.category && (
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded bg-primary/90 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                  {video.category}
                </span>
                {video.episodeNum && (
                  <span className="rounded bg-black/60 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm border border-white/10">
                    T{video.seasonNum || 1} • E{video.episodeNum}
                  </span>
                )}
              </div>
            )}
            
            <h1 className="mb-4 text-3xl font-bold font-display leading-tight text-white md:text-5xl lg:text-6xl text-shadow-sm drop-shadow-md line-clamp-4 relative z-20">
              {video.title.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
            </h1>
            
            <p className="mb-8 line-clamp-3 text-sm md:text-base lg:text-lg text-white/90 max-w-xl font-medium drop-shadow relative z-20">
              {video.description.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 relative z-20">
              <Button size="lg" asChild className="gap-2 text-base shadow-lg shadow-primary/30">
                <Link to={`/watch/${video.id}`}>
                  <Play className="h-5 w-5 fill-current" />
                  Ver ahora
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowInfo(true)}
                className="gap-2 bg-black/40 text-white border-white/30 backdrop-blur-md hover:bg-white/20 hover:text-white transition-all"
              >
                <Info className="h-5 w-5" />
                Más info
              </Button>

              <Button size="icon" variant="outline" className="h-11 w-11 rounded-full bg-black/40 border-white/30 text-white backdrop-blur-md hover:bg-white/20 hover:text-white md:hidden">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Metadata tags */}
            <div className="mt-8 flex items-center flex-wrap gap-3 text-xs md:text-sm font-semibold text-white/80 relative z-20">
              <span className="rounded bg-accent-orange/90 px-2 py-0.5 text-white backdrop-blur shadow-sm">Destacado</span>
              <span>{video.category}</span>
              <span>•</span>
              <span>2024</span>
              <span>•</span>
              <span className="rounded border border-white/40 px-1.5 py-0.5 opacity-80">ATB</span>
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
