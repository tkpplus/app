import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Check, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { FeaturedInfoModal } from './FeaturedInfoModal';
import { useWatchlist } from '../../hooks/useWatchlist';

interface HeroBannerProps {
  video: any;
}

export function HeroBanner({ video }: HeroBannerProps) {
  const [showInfo, setShowInfo] = useState(false);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  if (!video) return null;

  return (
    <>
      <div className="relative mb-12 w-full min-h-[50vh] md:min-h-[65vh] xl:min-h-[75vh] flex items-center pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-background overflow-hidden">
          {/* YouTube Background Video */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] opacity-60">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.youtubeId}&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3&playsinline=1`}
              title="Background Video"
              className="absolute inset-0 w-full h-full pointer-events-none border-0 scale-105"
              allow="autoplay; encrypted-media"
            />
          </div>

          {/* Fallback Overlay (shown briefly while video loads or if autoplay fails) */}
          <div className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay">
              <img
                src={video.thumbnail}
                alt=""
                className="w-full h-full object-cover blur-sm"
              />
          </div>

          {/* Gradients to fade out the left and bottom edges and create a vignette effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
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
                onClick={() => toggleWatchlist(video.id)}
                variant={isInWatchlist(video.id) ? "default" : "outline"} 
                className={`gap-2 h-14 px-8 rounded-lg font-semibold text-base shadow-lg transition-colors ${
                  isInWatchlist(video.id) 
                  ? 'bg-primary border-primary text-white hover:bg-primary/90' 
                  : 'bg-[#44444b] text-white border-transparent hover:bg-[#52525a] hover:text-white'
                }`}
              >
                {isInWatchlist(video.id) ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                {isInWatchlist(video.id) ? 'En mi lista' : 'Mi lista'}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowInfo(true)}
                className="gap-2 bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white transition-all h-14 px-8 rounded-lg font-semibold text-base shadow-lg"
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
