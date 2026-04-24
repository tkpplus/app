import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, SkipBack, SkipForward, PlayCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDebouncedProgress, usePlayerControls, useAutoResume } from '../../hooks/useVideoPlayer';
import { Link, useNavigate } from 'react-router-dom';

interface VideoPlayerProps {
  video: any;
  nextEpisode?: any;
  initialProgress: number;
  onProgressSave: (timestamp: number, duration: number) => void;
  isCompleted: boolean;
}

const NextEpisodeOverlay = ({ nextEpisode, onCancel }: { nextEpisode: any, onCancel: () => void }) => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      navigate(`/watch/${nextEpisode.id}`);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate, nextEpisode.id]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white p-6 animate-in fade-in duration-300">
      <div className="flex flex-col items-center max-w-md text-center">
        <h3 className="text-xl font-medium text-white/70 mb-2">Siguiente episodio</h3>
        <h2 className="text-3xl font-bold font-display mb-6">{nextEpisode.title}</h2>
        
        <div className="relative mb-8">
           <svg className="w-24 h-24 transform -rotate-90">
             <circle cx="48" cy="48" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
             <circle 
               cx="48" cy="48" r="45" 
               stroke="#2D6CDF" 
               strokeWidth="6" fill="none" 
               strokeDasharray="283"
               strokeDashoffset={283 - (283 * countdown) / 5}
               className="transition-all duration-1000 ease-linear"
             />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
             {countdown}
           </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg" className="px-8 shadow-lg shadow-primary/30" onClick={() => navigate(`/watch/${nextEpisode.id}`)}>
            Ver ahora
          </Button>
          <Button size="lg" variant="ghost" className="text-white hover:bg-white/10" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export const VideoPlayer = memo(function VideoPlayer({ 
  video, 
  nextEpisode, 
  initialProgress, 
  onProgressSave,
  isCompleted 
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<typeof ReactPlayer>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  // Custom Hooks
  const { showPrompt, triggerResumeCheck, dismissPrompt } = useAutoResume(initialProgress);
  const debouncedSave = useDebouncedProgress(onProgressSave, 5000);

  // --- PLAYER EVENTS ---
  const onReady = () => {
    // Player is ready
  };

  const onProgress = (state: { playedSeconds: number }) => {
    if (!isCompleted) {
        debouncedSave(state.playedSeconds, 0, false);
    }
  };

  const onEnded = () => {
    setVideoEnded(true);
    debouncedSave(0, 0, true); // Mark 100% completed
  };

  // --- INITIAL INTERACTION & RESUME ---
  const handleInitialPlay = () => {
    if (isCompleted || initialProgress <= 5) {
      startPlayback(0);
    } else {
      if (!triggerResumeCheck()) {
        startPlayback(0);
      }
    }
  };

  const startPlayback = (timeSec: number) => {
    dismissPrompt();
    setHasStarted(true);
    setVideoEnded(false);
    
    if (timeSec > 0) {
      setTimeout(() => {
         if (playerRef.current && (playerRef.current as any).seekTo) {
             (playerRef.current as any).seekTo(timeSec, 'seconds');
         }
      }, 400);
    }
  };

  // --- RENDERING ---
  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl shadow-xl select-none group"
    >
      {/* 1. FACADE (Thumbnail layer) */}
      {!hasStarted && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black cursor-pointer group/facade" onClick={handleInitialPlay}>
           <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover/facade:scale-105" />
           <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover/facade:bg-black/10" />
           
           <div className="relative z-10 flex flex-col items-center gap-4">
             <div className="rounded-full bg-primary/90 text-white p-5 backdrop-blur-md shadow-[0_0_40px_rgba(45,108,223,0.5)] transition-transform duration-300 group-hover/facade:scale-110">
               <PlayCircle className="w-12 h-12" fill="currentColor" />
             </div>
           </div>

           {/* Resume Prompt Modal overlaying facade */}
           {showPrompt && (
             <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
               <div className="bg-surface/10 border border-white/20 p-8 rounded-2xl text-center max-w-sm animate-in zoom-in-95 duration-200">
                 <h3 className="text-white font-display text-xl mb-6">Parece que ya estabas viendo este video.</h3>
                 <div className="flex flex-col gap-3">
                   <Button size="lg" className="w-full gap-2 font-semibold text-base" onClick={() => startPlayback(initialProgress)}>
                     <Play className="w-4 h-4 fill-current" /> Continuar desde {Math.round(initialProgress / 60)}:{Math.floor(initialProgress % 60).toString().padStart(2, '0')}
                   </Button>
                   <Button size="lg" variant="outline" className="w-full text-white border-white/30 hover:bg-white/10" onClick={() => startPlayback(0)}>
                     Empezar de nuevo
                   </Button>
                 </div>
               </div>
             </div>
           )}
        </div>
      )}

      {/* 2. THE REAL PLAYER */}
      {hasStarted && (
        <div className={`absolute inset-0 z-0`}>
          {React.createElement(ReactPlayer as any, {
            ref: playerRef,
            url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
            width: "100%",
            height: "100%",
            controls: true,
            playing: !videoEnded,
            onReady: onReady,
            onProgress: (state: any) => onProgress(state),
            onEnded: onEnded,
            progressInterval: 5000,
            config: {
              youtube: {
                playerVars: { 
                  autoplay: 1,
                  modestbranding: 1, 
                  rel: 0
                }
              }
            }
          })}
        </div>
      )}

      {/* UP NEXT OVERLAY */}
      {videoEnded && nextEpisode && (
        <NextEpisodeOverlay nextEpisode={nextEpisode} onCancel={() => setVideoEnded(false)} />
      )}
      
      {/* WATCH AGAIN (if ended and no next episode) */}
      {videoEnded && !nextEpisode && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in duration-300">
           <Button size="lg" className="gap-2" onClick={() => startPlayback(0)}>
               Volver a ver
           </Button>
        </div>
      )}
    </div>
  );
});
