import React, { memo, useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import { Play, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  video: any;
  nextEpisode?: any;
  initialProgress?: number;
  onProgressSave?: (timestamp: number, duration: number) => void;
  isCompleted?: boolean;
}

export const VideoPlayer = memo(function VideoPlayer({ 
  video,
  nextEpisode,
  initialProgress = 0,
  onProgressSave,
  isCompleted
}: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const [hasSeeked, setHasSeeked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset state when video changes
    setHasSeeked(false);
    setShowEndScreen(false);
    setShowNextButton(false);
  }, [video.id]);

  const handleReady = () => {
    // Only seek on first load of this video
    if (!hasSeeked && initialProgress > 0 && playerRef.current) {
      playerRef.current.seekTo(initialProgress, 'seconds');
      setHasSeeked(true);
    }
  };

  const handleProgress = (state: { playedSeconds: number; played: number }) => {
    const duration = playerRef.current?.getDuration() || video.duration || 0;
    
    if (onProgressSave && duration > 0) {
      onProgressSave(state.playedSeconds, duration);
    }

    // Show "Next episode" button when 90% is reached
    if (nextEpisode && state.played > 0.9 && state.played < 0.99) {
      setShowNextButton(true);
    } else {
      setShowNextButton(false);
    }
  };

  const handleEnded = () => {
    if (onProgressSave) {
      const duration = playerRef.current?.getDuration() || video.duration || 0;
      onProgressSave(duration, duration); // mark as completed
    }
    setShowNextButton(false);
    setShowEndScreen(true);
  };

  const handleNextEpisode = () => {
    if (nextEpisode) {
      navigate(`/watch/${nextEpisode.id}`);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl shadow-2xl border border-white/5 select-none transition-all duration-700">
      
      {/* Video Player */}
      {!showEndScreen && (
        <div className="absolute inset-0">
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            width="100%"
            height="100%"
            playing={true}
            light={video.thumbnail || true}
            controls={true}
            onReady={handleReady}
            onProgress={handleProgress}
            onEnded={handleEnded}
            progressInterval={1000} // every second
            config={{
              youtube: {
                playerVars: { 
                  showinfo: 0,
                  modestbranding: 1,
                  rel: 0,
                  autoplay: 1
                }
              }
            }}
          />
        </div>
      )}

      {/* Next Episode Floating Button */}
      {showNextButton && !showEndScreen && nextEpisode && (
        <div className="absolute bottom-24 right-8 z-40 animate-fade-in-up">
          <button 
            onClick={handleNextEpisode}
            className="flex items-center gap-2 bg-surface/90 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-full hover:bg-white/10 hover:border-white/30 transition-all shadow-2xl group"
          >
            <span className="font-semibold text-sm">Siguiente episodio</span>
            <SkipForward className="h-4 w-4 group-hover:text-primary transition-colors" />
          </button>
        </div>
      )}

      {/* End Screen Experience */}
      {showEndScreen && (
        <div className="absolute inset-0 w-full h-full bg-surface/95 flex flex-col items-center justify-center text-center p-8 z-50 animate-fade-in backdrop-blur-md">
          <div className="max-w-xl space-y-8">
            <h3 className="text-4xl md:text-5xl font-display font-medium text-white italic tracking-tight">
              "¿Qué idea te llevas hoy?"
            </h3>
            <p className="text-xl text-text-muted font-light">
               Una pregunta para abrir la conversación.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              {nextEpisode ? (
                <button 
                  onClick={handleNextEpisode}
                  className="bg-primary text-black font-bold px-8 py-4 rounded-full shadow-[0_0_40px_rgba(245,196,99,0.3)] hover:shadow-[0_0_60px_rgba(245,196,99,0.5)] hover:scale-105 transition-all"
                >
                  Continuar: {nextEpisode.title.split('|')[0]}
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/catalog')}
                  className="bg-white/10 text-white border border-white/20 font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-all"
                >
                  Explorar más historias
                </button>
              )}
              <button 
                onClick={() => {
                  setShowEndScreen(false);
                  if (playerRef.current) {
                    playerRef.current.seekTo(0);
                  }
                }}
                className="text-text-muted hover:text-white px-8 py-4 rounded-full hover:bg-white/5 transition-all font-medium"
              >
                Volver a ver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
