import { Link } from 'react-router-dom';
import { PlayCircle, Lock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { getVideoById } from '../../data/seed';
import { is4KVideo } from '../../utils/videoHelpers';
import { getVideoProgress, PROGRESS_EVENT } from '../../hooks/useVideoProgress';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '../ui/Toast';

import { getVideoThumbnail, BASIC_COVER } from '../../utils/covers';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  series?: string;
  isNew?: boolean;
  category?: string;
  progressPercentage?: number; // 0 to 1
  isCompleted?: boolean;
  seasonNum?: number | null;
  episodeNum?: number | null;
  isActive?: boolean;
}

export function VideoCard({
  id,
  title,
  thumbnail,
  duration,
  series,
  isNew,
  category,
  progressPercentage,
  isCompleted,
  seasonNum,
  episodeNum,
  isActive
}: VideoCardProps) {
  const videoData = getVideoById(id);
  const youtubeId = videoData?.youtubeId || id;
  const isLocked = Boolean((videoData as any)?.isLocked);
  const { addToast } = useToast();
  
  const displayThumbnail = getVideoThumbnail(videoData) || (thumbnail && thumbnail.trim() !== '' ? thumbnail : BASIC_COVER);

  const [isHoverPlaying, setIsHoverPlaying] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const [effectiveProgress, setEffectiveProgress] = useState<number | undefined>(progressPercentage);
  const [effectiveCompleted, setEffectiveCompleted] = useState<boolean | undefined>(isCompleted);

  useEffect(() => {
    if (progressPercentage !== undefined) {
      setEffectiveProgress(progressPercentage);
      setEffectiveCompleted(isCompleted);
      return;
    }

    const checkProgress = () => {
      const record = getVideoProgress(id);
      if (record) {
        setEffectiveProgress(record.percentage);
        setEffectiveCompleted(record.completed);
      } else {
        setEffectiveProgress(undefined);
        setEffectiveCompleted(undefined);
      }
    };

    checkProgress();

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (!custom.detail?.episodeId || custom.detail?.episodeId === id || custom.detail?.cleared) {
        checkProgress();
      }
    };

    window.addEventListener(PROGRESS_EVENT, handleUpdate);
    return () => window.removeEventListener(PROGRESS_EVENT, handleUpdate);
  }, [id, progressPercentage, isCompleted]);

  const handleMouseEnter = () => {
    if (isActive || isLocked || !videoData?.youtubeId) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoverPlaying(true);
    }, 600); // 600ms delay before preview starts
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHoverPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  // Format duration from seconds to M:SS or H:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Link 
      to={isLocked ? '#' : `/watch/${id}`} 
      onClick={(e) => {
        if (isActive) e.preventDefault();
        if (isLocked) {
          e.preventDefault();
          addToast(`"${title}" se encuentra en fase de producción. ¡Muy pronto disponible!`, 'info');
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col w-full h-full ${isActive ? 'cursor-default pointer-events-none' : ''}`}
    >
      {/* Thumbnail Container */}
      <div className={`relative aspect-video w-full overflow-hidden rounded-xl cursor-pointer transition-all duration-400 ease-out transform ${isActive ? 'ring-2 ring-primary scale-[1.02] shadow-[0_0_20px_rgba(245,196,99,0.3)]' : 'bg-surface border border-white/5 group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] group-hover:border-white/20 group-hover:z-50'}`}>
        
        {isHoverPlaying && !isLocked ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${youtubeId}&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-150 transform transition-opacity duration-500 z-0"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        ) : (
          <img
            src={displayThumbnail}
            alt={title}
            className={`h-full w-full object-cover transition-opacity duration-300 ${isLocked ? 'opacity-50 grayscale-[30%]' : (isActive ? 'opacity-40' : 'group-hover:opacity-40')}`}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== BASIC_COVER) {
                target.src = BASIC_COVER;
              }
            }}
          />
        )}

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[1px] z-10 pointer-events-none">
            <div className="w-9 h-9 rounded-full border border-amber-400/50 flex items-center justify-center bg-black/70 text-amber-400 shadow-lg mb-1">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 border border-white/10">
              En producción
            </span>
          </div>
        )}
        
        {/* Badges on Top */}
        <div className={`absolute top-2 left-2 flex gap-2 z-10 transition-opacity ${isActive ? 'opacity-100' : 'opacity-100 group-hover:opacity-0'}`}>
          {isActive && <Badge variant="default" className="shadow-md bg-primary text-black font-bold">Estás viendo</Badge>}
          {isLocked && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
              <Lock className="w-2.5 h-2.5" />
              En producción
            </span>
          )}
          {!isLocked && isNew && !effectiveCompleted && !isActive && <Badge variant="new" className="shadow-md">Nuevo</Badge>}
          {!isLocked && effectiveCompleted && !isActive && <Badge variant="default" className="shadow-md bg-green-500 hover:bg-green-600">Visto</Badge>}
        </div>

        {/* Regular Duration Badge (Hidden on Hover or Active) */}
        {!isActive && !isLocked && (
          <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-0 transition-opacity z-10">
            <div className="bg-black/80 rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {formatDuration(duration)}
            </div>
          </div>
        )}

        {/* Info Hover Overlay / Active Overlay */}
        <div className={`absolute inset-0 flex flex-col justify-end p-3 md:p-4 transition-all duration-300 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
           <div className={`flex items-center gap-2 mb-2 transition-transform duration-300 ${isActive ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'}`}>
               {!isActive && <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs pl-0.5 shadow-lg">▶</div>}
               {isActive && (
                 <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-xs pl-0.5 shadow-[0_0_15px_rgba(245,196,99,0.4)]">▶</div>
               )}
               <span className="border border-gray-500 text-gray-300 text-[10px] px-1 rounded">
                 {is4KVideo(videoData) ? '4K' : 'HD'}
               </span>
           </div>
           
           {category && (
              <span className={`text-[10px] uppercase tracking-wider font-semibold text-primary mb-1 transition-transform duration-300 delay-50 line-clamp-1 ${isActive ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'}`}>{category}</span>
           )}
           <h4 className={`font-bold text-xs md:text-sm text-white leading-tight mb-1 line-clamp-2 transition-transform duration-300 delay-75 ${isActive ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'}`}>
               {title.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
           </h4>
           
           <div className={`flex justify-between items-center mt-1 transition-transform duration-300 delay-100 ${isActive ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'}`}>
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                    {episodeNum ? `T${seasonNum || 1} • E${episodeNum}` : 'Video'} • ⏱ {formatDuration(duration)}
                </span>
           </div>
        </div>
        
        {/* Progress bar */}
        {effectiveProgress !== undefined && effectiveProgress > 0 && !effectiveCompleted && !isActive && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800 z-10 group-hover:hidden">
             <div 
               className="h-full bg-red-600" 
               style={{ width: `${Math.min(Math.max(effectiveProgress * 100, 0), 100)}%` }} 
             />
          </div>
        )}
      </div>
    </Link>
  );
}
