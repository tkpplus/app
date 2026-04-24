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
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [controlsHovered, setControlsHovered] = useState(false);

  // Custom Hooks
  const { showPrompt, triggerResumeCheck, dismissPrompt } = useAutoResume(initialProgress);
  const debouncedSave = useDebouncedProgress(onProgressSave, 5000);
  
  const {
    playing, setPlaying, volume, setVolume, muted, setMuted,
    played, setPlayed, playedSeconds, setPlayedSeconds,
    duration, setDuration, seeking, setSeeking,
    isFullscreen, setIsFullscreen,
    handleSeekChange, handleSeekMouseUp, handleSeekMouseDown,
    skip, formatTime
  } = usePlayerControls(playerRef);

  // --- MOUSE & CONTROLS VISIBILITY ---
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    if (!controlsHovered && playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [controlsHovered, playing]);

  const handleMouseLeave = () => {
    if (playing) setShowControls(false);
  };

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      switch(e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          setPlaying(p => !p);
          handleMouseMove();
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          skip(10);
          handleMouseMove();
          break;
        case 'arrowleft':
        case 'j':
          e.preventDefault();
          skip(-10);
          handleMouseMove();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          setMuted(m => !m);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMouseMove, skip]); // skip is stable

  // --- FULLSCREEN ---
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // --- PLAYER EVENTS ---
  const onReady = () => {
    // If user clicked resume, initialProgress is already handled in state before mounting.
    // If user clicked start over, we ignore initialProgress.
    // However, if we mount, we naturally start from 0 unless we seek.
  };

  const onProgress = (state: { played: number, playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      setPlayedSeconds(state.playedSeconds);
      if (!isCompleted) {
         debouncedSave(state.playedSeconds, duration, false);
      }
    }
  };

  const onPause = () => {
    setPlaying(false);
    setShowControls(true);
    if (!isCompleted) debouncedSave(playedSeconds, duration, true); // Immediate save
  };

  const onEnded = () => {
    setPlaying(false);
    setVideoEnded(true);
    debouncedSave(duration, duration, true); // Mark 100% completed
    setShowControls(true);
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
    
    // Tiny delay before setting playing=true to allow the player to mount correctly
    setTimeout(() => {
      setPlaying(true);
    }, 50);
    
    // We delay the seek slightly to ensure ReactPlayer has mounted and initialized
    if (timeSec > 0) {
      setTimeout(() => {
         if (playerRef.current && (playerRef.current as any).seekTo) {
             (playerRef.current as any).seekTo(timeSec, 'seconds');
         }
      }, 400);
    }
  };

  // Cleanup on unmount to prevent memory leaks and play() interruptions
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      setPlaying(false);
    };
  }, [setPlaying]);

  // --- RENDERING ---
  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl shadow-xl select-none group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseMove} // Mobile wake up controls
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
                     <Play className="w-4 h-4 fill-current" /> Continuar desde {formatTime(initialProgress)}
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

      {/* 2. THE REAL PLAYER (Pre-loaded but hidden or under the facade) */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
        {React.createElement(ReactPlayer as any, {
          ref: playerRef,
          url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
          width: "100%",
          height: "100%",
          playing: playing,
          volume: volume,
          muted: muted,
          onReady: onReady,
          onProgress: (state: any) => onProgress(state),
          onPause: onPause,
          onPlay: () => setPlaying(true),
          onEnded: onEnded,
          progressInterval: 1000,
          config: {
            youtube: {
              playerVars: { 
                controls: 0, 
                modestbranding: 1, 
                rel: 0,
                disablekb: 1,
                fs: 0,
                playsinline: 1
              }
            }
          }
        })}
      </div>

      {/* 3. CUSTOM CONTROLS OVERLAY */}
      {hasStarted && !videoEnded && (
        <div 
           className={`absolute inset-0 z-10 flex flex-col transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0'}`}
           style={{ cursor: showControls ? 'default' : 'none' }}
        >
          {/* Top gradient (optional, for title) */}
          <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

          {/* Double Tap Zones for Mobile/Desktop Skipping */}
          <div className="flex-1 flex w-full">
            <div className="w-[30%] h-full" onDoubleClick={() => skip(-10)} />
            <div className="w-[40%] h-full flex items-center justify-center" onClick={() => setPlaying(!playing)}>
               {/* Center Play/Pause indicator (only shows when paused on desktop, or fades out) */}
               {!playing && (
                 <div className="bg-black/50 text-white rounded-full p-4 backdrop-blur-md animate-in zoom-in duration-200 pointer-events-none shadow-2xl border border-white/10">
                   <Play className="w-10 h-10 ml-1" fill="currentColor" />
                 </div>
               )}
            </div>
            <div className="w-[30%] h-full" onDoubleClick={() => skip(10)} />
          </div>

          {/* Bottom Controls Area */}
          <div 
             className="w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-10"
             onMouseEnter={() => setControlsHovered(true)}
             onMouseLeave={() => setControlsHovered(false)}
          >
            {/* Scrubber / Progress Bar */}
            <div className="w-full flex items-center group/scrubber cursor-pointer h-6" 
                 onMouseDown={handleSeekMouseDown} 
                 onTouchStart={handleSeekMouseDown}>
              <input
                type="range" min={0} max={0.999999} step="any"
                value={played}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onTouchEnd={handleSeekMouseUp}
                className="w-full h-1.5 appearance-none bg-white/20 rounded-full outline-none transition-all duration-200 group-hover/scrubber:h-2"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) ${played * 100}%, rgba(255,255,255,0.2) ${played * 100}%)`
                }}
              />
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-white">
                <button onClick={() => setPlaying(!playing)} className="p-1.5 hover:text-primary transition-colors focus:outline-none">
                  {playing ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>

                <button onClick={() => skip(-10)} className="p-1.5 hover:text-white/70 transition-colors focus:outline-none hidden sm:block delay-150">
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
                <button onClick={() => skip(10)} className="p-1.5 hover:text-white/70 transition-colors focus:outline-none hidden sm:block">
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                {/* Volume Control */}
                <div className="group/vol flex items-center">
                  <button onClick={() => setMuted(!muted)} className="p-1.5 hover:text-white/70 transition-colors focus:outline-none">
                     {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="w-0 overflow-hidden transition-all duration-300 ease-out group-hover/vol:w-20 ml-2 h-6 flex items-center">
                    <input 
                      type="range" min={0} max={1} step="any" 
                      value={muted ? 0 : volume} 
                      onChange={e => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                      className="w-full h-1 accent-white bg-white/30 appearance-none rounded-full"
                    />
                  </div>
                </div>

                {/* Time Display */}
                <div className="text-xs sm:text-sm font-medium font-mono text-white/90 select-none hidden sm:block">
                  {formatTime(playedSeconds)} <span className="text-white/40 mx-1">/</span> {formatTime(duration)}
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-2 sm:gap-4 text-white">
                <div className="text-xs sm:hidden font-mono mx-2">
                  {formatTime(playedSeconds)}
                </div>
                <button onClick={toggleFullscreen} className="p-1.5 hover:text-white/70 transition-colors focus:outline-none">
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. UP NEXT OVERLAY */}
      {videoEnded && nextEpisode && (
        <NextEpisodeOverlay nextEpisode={nextEpisode} onCancel={() => setVideoEnded(false)} />
      )}
      
      {/* 5. WATCH AGAIN (if ended and no next episode) */}
      {videoEnded && !nextEpisode && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in duration-300">
          <Button size="lg" className="gap-2" onClick={() => startPlayback(0)}>
            <SkipBack className="w-5 h-5" /> Volver a ver
          </Button>
        </div>
      )}
    </div>
  );
});
