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
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();

  // Reset on video change
  useEffect(() => {
    console.log("YouTube ID:", video.youtubeId);
    setHasSeeked(false);
    setShowEndScreen(false);
    setShowNextButton(false);
    setHasError(false);
  }, [video.id]);

  // Unlock autoplay (CRÍTICO)
  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
    };
  }, []);

  const handleReady = () => {
    if (!hasSeeked && initialProgress > 0 && playerRef.current) {
      playerRef.current.seekTo(initialProgress, 'seconds');
      setHasSeeked(true);
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    const duration = playerRef.current?.getDuration() || 0;

    if (onProgressSave && duration > 0) {
      onProgressSave(state.playedSeconds, duration);
    }

    if (nextEpisode && state.played > 0.9 && state.played < 0.99) {
      setShowNextButton(true);
    } else {
      setShowNextButton(false);
    }
  };

  const handleEnded = () => {
    setShowEndScreen(true);
    setShowNextButton(false);
  };

  const handleNextEpisode = () => {
    if (nextEpisode) {
      navigate(`/watch/${nextEpisode.id}`);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl shadow-2xl border border-white/5 group">

      {/* PLAYER */}
      <div className={showEndScreen || hasError ? 'hidden' : 'absolute inset-0'}>
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube-nocookie.com/watch?v=${video.youtubeId}`}
          width="100%"
          height="100%"
          playing={userInteracted && !showEndScreen}
          muted={!userInteracted}
          controls={true}
          playsinline
          onReady={handleReady}
          onProgress={handleProgress}
          onEnded={handleEnded}
          onError={(e) => {
            console.error("PLAYER ERROR:", e);
            setHasError(true);
          }}
          progressInterval={1000}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
              }
            }
          }}
        />
      </div>

      {/* FALLBACK (SI YT FALLA) */}
      {hasError && (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}

      {/* PLAY OVERLAY */}
      {!userInteracted && !showEndScreen && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30 cursor-pointer"
          onClick={() => setUserInteracted(true)}
        >
          <div className="bg-white/10 p-6 rounded-full backdrop-blur-md hover:scale-110 transition">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>
      )}

      {/* NEXT BUTTON */}
      {showNextButton && nextEpisode && (
        <div className="absolute bottom-24 right-8 z-40">
          <button 
            onClick={handleNextEpisode}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all"
          >
            <span className="text-sm">Siguiente episodio</span>
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* END SCREEN */}
      {showEndScreen && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-8 z-50">
          <h3 className="text-4xl italic text-white mb-4 font-display">
            ¿Qué idea te llevas hoy?
          </h3>
          <p className="text-xl text-text-muted font-light mb-8">
            Una pregunta para abrir la conversación.
          </p>

          <div className="flex gap-4 mt-6">
            {nextEpisode && (
              <button 
                onClick={handleNextEpisode}
                className="bg-primary text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition shadow-[0_0_20px_rgba(245,196,99,0.3)]"
              >
                Continuar: {nextEpisode.title.split('|')[0]}
              </button>
            )}

            <button 
              onClick={() => {
                setShowEndScreen(false);
                setUserInteracted(true);
                playerRef.current?.seekTo(0);
              }}
              className="text-white border border-white/20 px-8 py-3 rounded-full hover:bg-white/10 transition"
            >
              Volver a ver
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
