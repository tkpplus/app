import { useState, MouseEvent, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Info, X, Play } from 'lucide-react';
import { getSeriesCover } from '../../utils/covers';
import { getVideosBySeries } from '../../data/seed';

interface SeriesCardProps {
  id: string;
  title: string;
  thumbnail: string;
  category?: string;
  description?: string;
}

export function SeriesCard({
  id,
  title,
  thumbnail,
  category,
  description = 'Descubre más sobre esta increíble serie de Torah Kids Puppets llena de enseñanzas y aventuras divertidas.',
}: SeriesCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInfoClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfo(true);
  };

  useEffect(() => {
    if (showInfo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showInfo]);

  // Find matching custom covers for this series
  const customCover = useMemo(() => getSeriesCover(id, thumbnail), [id, thumbnail]);

  // Get the first video of the series to use as trailer
  const firstVideo = useMemo(() => {
    const videos = getVideosBySeries(id);
    return videos.length > 0 ? videos[0] : null;
  }, [id]);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 600); // 600ms delay before autoplay starts
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  return (
    <>
      <Link 
        to={`/series/${id}`} 
        className="group relative flex flex-col w-full h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl cursor-pointer transition-all duration-400 ease-out transform group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-surface border border-white/5 group-hover:border-white/20 group-hover:z-50">
          
          {/* Trailer Auto-Play Box */}
          {isHovered && firstVideo ? (
             <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
               <iframe
                 src={`https://www.youtube.com/embed/${firstVideo.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${firstVideo.youtubeId}&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3&playsinline=1`}
                 title="Series Trailer"
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[150%] pointer-events-none"
                 allow="autoplay; encrypted-media"
               />
             </div>
          ) : null}

          <img
            src={customCover}
            alt={title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isHovered && firstVideo ? 'opacity-0' : 'group-hover:opacity-60'}`}
            loading="lazy"
            onError={(e) => {
               const target = e.target as HTMLImageElement;
               if (target.src !== thumbnail) {
                 target.src = thumbnail;
               } else {
                 target.src = "https://images.unsplash.com/photo-1542157585-ef20bbcce178?q=80&w=2000&auto=format&fit=crop";
               }
            }}
          />
          
          {/* Overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${isHovered && firstVideo ? 'opacity-100 from-black via-black/40' : 'group-hover:from-black/90'}`} />
          
          <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="line-clamp-2 text-xl font-bold leading-tight text-white font-display text-shadow-sm">
              {title}
            </h3>
            {category && (
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-1">{category}</p>
            )}
            
            {/* View Series specific UI on hover */}
            <div className={`mt-3 overflow-hidden transition-all duration-300 flex flex-wrap items-center gap-2 ${isHovered ? 'opacity-100 h-auto' : 'opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto'}`}>
              <span className="flex items-center gap-1 text-xs font-bold text-black bg-primary px-2 py-1 rounded shadow-sm border border-primary-hover hover:bg-primary-hover transition-colors">
                <Play className="w-3 h-3 fill-current" />
                VER SERIE
              </span>
              <button 
                onClick={handleInfoClick}
                className="flex items-center gap-1 text-xs font-bold text-white bg-white/20 px-2 py-1 rounded backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-colors"
              >
                <Info className="w-3 h-3" />
                MÁS INFO
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Info Modal Portal */}
      {showInfo && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 p-2">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowInfo(false)}></div>
          
          <div className="bg-surface border border-white/5 rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in z-10 scrollbar-hide">
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-6 right-6 z-30 p-2 bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all rounded-full shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header Image */}
            <div className="relative h-72 md:h-[450px] w-full shrink-0">
              <img src={customCover} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              
              <div className="absolute bottom-8 left-8 md:left-12 max-w-2xl px-2">
                {category && (
                  <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-3 block opacity-90">{category}</span>
                )}
                <h2 className="text-4xl md:text-[4rem] font-display font-bold text-white mb-8 drop-shadow-xl leading-tight">{title}</h2>
                <div className="flex gap-4">
                  <Link to={`/series/${id}`} onClick={() => setShowInfo(false)} className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    <Play className="h-6 w-6 fill-current" /> Reproducir
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Body Info */}
            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 bg-surface">
              <div className="md:col-span-2 text-text-muted text-base md:text-lg leading-relaxed">
                <div className="flex items-center flex-wrap gap-4 mb-6 font-semibold tracking-wide">
                  <span className="text-[#46d369]">98% Coincidencia</span>
                  <span className="text-white/60">2024</span>
                  <span className="border border-white/20 px-1.5 py-0.5 rounded text-white/60 text-xs">
                    {['cuentos-jag', 'cuentos-perasha', 'sipurei-pesaj'].includes(id) ? '4K' : 'HD'}
                  </span>
                </div>
                <p className="font-medium text-white/90 text-lg sm:text-xl leading-relaxed mb-6">
                  {description}
                </p>
              </div>
              
              <div className="text-sm text-text-muted space-y-6">
                <div className="space-y-1.5">
                  <span className="block text-xs uppercase tracking-[0.15em] opacity-60">Elenco:</span>
                  <p className="text-white/90 font-medium">Yosef, Benny, Aharón, Keter, Dr. Avraham</p>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-xs uppercase tracking-[0.15em] opacity-60">Géneros:</span>
                  <p className="text-white/90 font-medium">Educativo, Judío, Infantil</p>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-xs uppercase tracking-[0.15em] opacity-60">Mood:</span>
                  <p className="text-white/90 font-medium">Sofisticado, Inspirador, Con Valores</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
