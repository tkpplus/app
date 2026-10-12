import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Play, CheckCircle2, ArrowRight, VolumeX, Clock, PictureInPicture } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Plyr from 'plyr';
import { WatchNextOverlay } from './WatchNextOverlay';
import { usePlayer } from '../../context/PlayerContext';

interface VideoPlayerProps {
  video: any;
  nextEpisode?: any;
  initialProgress?: number;
  onProgressSave?: (timestamp: number, duration: number) => void;
  isCompleted?: boolean;
  isVertical?: boolean;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function cleanTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  return rawTitle
    .replace(/^Torah Kids Puppets\s*\|\s*/i, '')
    .replace(/Parash[aá] /, '')
    .replace(/Parashat /, '')
    .replace(/#\S+/g, '')
    .replace(/ - Parash[aá] en un minuto/i, '')
    .replace(/ פרשת.*/, '')
    .trim();
}

export const VideoPlayer = memo(function VideoPlayer({
  video,
  nextEpisode,
  initialProgress = 0,
  onProgressSave,
  isVertical = false,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const lastSavedTimeRef = useRef<number>(initialProgress || 0);
  const navigate = useNavigate();

  const { playVideo, setCurrentTime, setDuration, setIsPlaying, enablePip } = usePlayer();

  // Si el video ya tiene progreso previo (> 5s), NO se reproduce automáticamente
  // y se despliega el menú de opciones (Reanudar o Empezar de nuevo)
  const hasSavedProgress = (initialProgress || 0) > 5;
  const [showResumeChoice, setShowResumeChoice] = useState<boolean>(hasSavedProgress);

  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [, setPlayerReady] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showWatchNext, setShowWatchNext] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(10);
  const [dismissedWatchNext, setDismissedWatchNext] = useState<boolean>(false);
  const [autoNavigating, setAutoNavigating] = useState<boolean>(false);

  // Sync with global player context
  useEffect(() => {
    if (video) {
      playVideo(video, nextEpisode, initialProgress);
    }
  }, [video, nextEpisode, initialProgress, playVideo]);

  // Manejador para navegar al siguiente episodio automáticamente
  const navigateToNextEpisode = useCallback(() => {
    if (!nextEpisode?.id || autoNavigating) return;
    setAutoNavigating(true);
    navigate(`/watch/${nextEpisode.id}`);
  }, [nextEpisode?.id, autoNavigating, navigate]);

  // Manejador para cancelar la auto-reproducción si el usuario quiere quedarse
  const cancelAutoPlay = useCallback(() => {
    setAutoNavigating(false);
    setCountdown(0);
  }, []);

  // Initialize Plyr with Clean YouTube configuration
  useEffect(() => {
    if (!containerRef.current || !video?.youtubeId) return;

    let countdownTimer: NodeJS.Timeout | null = null;
    let isSubscribed = true;

    try {
      const player = new Plyr(containerRef.current, {
        // Si no hay progreso previo, arranca automáticamente
        autoplay: !hasSavedProgress,
        muted: false,
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'duration',
          'mute',
          'volume',
          'captions',
          'settings',
          'pip',
          'airplay',
          'fullscreen'
        ],
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          controls: 0,
          disablekb: 0,
          enablejsapi: 1,
          origin: window.location.origin
        },
        settings: ['quality', 'speed'],
        speed: { selected: 1, options: [0.75, 1, 1.25, 1.5] },
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: true },
        displayDuration: true,
        invertTime: false,
        resetOnEnd: false,
      });

      playerRef.current = player;

      const checkMutedState = () => {
        if (!isSubscribed) return;
        try {
          const muted = Boolean(player.muted || (typeof player.volume === 'number' && player.volume === 0));
          setIsMuted(muted);
        } catch (e) {
          // ignore
        }
      };

      // Al estar listo el reproductor
      player.on('ready', () => {
        if (!isSubscribed) return;
        setPlayerReady(true);
        checkMutedState();

        try {
          if (player.captions) {
            player.captions.active = false;
          }
          const ytEmbed = (player as any).embed;
          if (ytEmbed && typeof ytEmbed.unloadModule === 'function') {
            ytEmbed.unloadModule('captions');
          }
        } catch (e) {
          // ignore
        }

        // Si tiene progreso guardado, pausar y precargar posición para que no inicie solo
        if (hasSavedProgress) {
          try {
            player.pause();
            const resumeAt = Math.max(0, Math.floor(initialProgress || 0));
            player.currentTime = resumeAt;
          } catch (e) {
            // ignore
          }
        }
      });

      // Handle PiP mode change from Plyr
      player.on('enterpip', () => {
        enablePip();
      });

      player.on('pipchange', () => {
        if ((player as any).pip) {
          enablePip();
        }
      });

      // Si YouTube intenta arrancar solo pero la ventana de opciones de reanudar está abierta, pausar
      player.on('playing', () => {
        setIsPlaying(true);
        if (showResumeChoice) {
          try {
            player.pause();
          } catch (e) {
            // ignore
          }
          return;
        }
        checkMutedState();
      });

      player.on('pause', () => {
        setIsPlaying(false);
      });

      player.on('volumechange', () => {
        checkMutedState();
      });

      // Actualizar progreso
      player.on('timeupdate', () => {
        if (!isSubscribed || showResumeChoice) return;
        const current = player.currentTime || 0;
        const dur = player.duration || video?.duration || 0;

        setCurrentTime(current);
        if (dur > 0) setDuration(dur);

        // Notificación de siguiente episodio 10s antes del final (únicamente si hay siguiente episodio)
        if (nextEpisode && dur > 15 && (dur - current) <= 10.5 && (dur - current) > 0.5) {
          setRemainingSeconds(Math.max(1, Math.ceil(dur - current)));
          setShowWatchNext(true);
        } else {
          setShowWatchNext(false);
        }

        if (onProgressSave && Math.abs(current - lastSavedTimeRef.current) >= 3) {
          lastSavedTimeRef.current = current;
          onProgressSave(current, dur);
        }
      });

      // Guardar inmediatamente en pausa
      player.on('pause', () => {
        if (!isSubscribed || !onProgressSave || showResumeChoice) return;
        const current = player.currentTime || 0;
        const dur = player.duration || video?.duration || 0;
        if (current > 0) {
          lastSavedTimeRef.current = current;
          onProgressSave(current, dur);
        }
      });

      // Al terminar el video
      player.on('ended', () => {
        if (!isSubscribed) return;
        setShowWatchNext(false);
        setHasEnded(true);
        setIsPlaying(false);
        const dur = player.duration || video?.duration || 100;
        if (onProgressSave) {
          onProgressSave(dur, dur);
        }

        // Si existe un siguiente episodio, inicia cuenta regresiva y auto-reproducción
        if (nextEpisode?.id) {
          setCountdown(5);
          countdownTimer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                if (countdownTimer) clearInterval(countdownTimer);
                // Dispara automáticamente la reproducción del siguiente episodio
                navigateToNextEpisode();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      });

    } catch (err) {
      console.error('Error initializing Plyr:', err);
    }

    return () => {
      isSubscribed = false;
      if (countdownTimer) clearInterval(countdownTimer);
      if (playerRef.current) {
        try {
          if (onProgressSave && playerRef.current.currentTime && !showResumeChoice) {
            const current = playerRef.current.currentTime;
            const dur = playerRef.current.duration || video?.duration || 0;
            if (current > 0) {
              onProgressSave(current, dur);
            }
          }
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [video.youtubeId, hasSavedProgress, nextEpisode?.id, navigateToNextEpisode, enablePip, setCurrentTime, setDuration, setIsPlaying]);

  // Manejador para reanudar desde el minuto guardado
  const handleResumePlayback = () => {
    setShowResumeChoice(false);
    if (playerRef.current) {
      try {
        const resumeAt = Math.max(0, Math.floor(initialProgress || 0));
        playerRef.current.currentTime = resumeAt;
        playerRef.current.play().catch(() => {});
      } catch (e) {
        console.warn('Error al reanudar:', e);
      }
    }
  };

  // Manejador para iniciar desde el principio (0:00)
  const handleRestartFromBeginning = () => {
    setShowResumeChoice(false);
    setHasEnded(false);
    lastSavedTimeRef.current = 0;
    if (onProgressSave) {
      onProgressSave(0, video.duration || 100);
    }
    if (playerRef.current) {
      try {
        playerRef.current.currentTime = 0;
        playerRef.current.play().catch(() => {});
      } catch (e) {
        console.warn('Error al reiniciar:', e);
      }
    }
  };

  // Manejador para activar sonido si el navegador silencia inicialmente
  const handleUnmute = () => {
    if (playerRef.current) {
      try {
        playerRef.current.muted = false;
        playerRef.current.volume = 1;
        const ytEmbed = (playerRef.current as any).embed;
        if (ytEmbed) {
          if (typeof ytEmbed.unMute === 'function') ytEmbed.unMute();
          if (typeof ytEmbed.setVolume === 'function') ytEmbed.setVolume(100);
        }
      } catch (e) {
        // ignore
      }
    }
    setIsMuted(false);
  };

  // Trigger floating Picture-in-Picture mode
  const handleTriggerPip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playerRef.current) {
      try {
        if (typeof (playerRef.current as any).pip === 'function') {
          (playerRef.current as any).pip();
        }
      } catch (err) {
        // ignore
      }
    }
    enablePip();
  };

  return (
    <div className={`relative w-full ${isVertical ? 'aspect-[9/16] h-full max-h-[82vh] vertical-player-wrapper' : 'aspect-video'} bg-black overflow-hidden rounded-2xl shadow-2xl border border-white/10 group`}>
      
      {/* Contenedor destino para Plyr */}
      <div className="w-full h-full relative overflow-hidden">
        <div
          ref={containerRef}
          data-plyr-provider="youtube"
          data-plyr-embed-id={video.youtubeId}
          className="w-full h-full"
        />
      </div>

      {/* Botón flotante Picture-in-Picture en la esquina superior izquierda */}
      {!hasEnded && !showResumeChoice && (
        <button
          type="button"
          onClick={handleTriggerPip}
          className="absolute top-4 left-4 z-30 group flex items-center gap-2 px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white border border-white/20 hover:border-primary/70 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 cursor-pointer select-none"
          title="Ver en ventana flotante (Picture-in-Picture)"
        >
          <PictureInPicture className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-bold tracking-wide uppercase text-white group-hover:text-primary transition-colors">
            Picture-in-Picture
          </span>
        </button>
      )}

      {/* OVERLAY DE OPCIONES DE REPRODUCCIÓN (CUANDO HAY PROGRESO GUARDADO) */}
      {showResumeChoice && hasSavedProgress && !hasEnded && (
        <div 
          className="absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md select-none animate-fade-in"
        >
          {/* Fondo de vista previa del video */}
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none scale-105 blur-xs" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50 pointer-events-none" />

          {/* Modal flotante con opciones claras al estilo Apple TV / Netflix */}
          <div className="relative max-w-md w-full bg-[#121319]/95 border border-white/15 rounded-2xl p-6 sm:p-8 text-center shadow-2xl shadow-black/95 transition-all">
            {/* Badge de progreso guardado */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Progreso guardado</span>
            </div>

            {/* Título y detalle del episodio */}
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-1.5 line-clamp-1">
              {cleanTitle(video.title)}
            </h3>

            <p className="text-xs sm:text-sm text-white/70 mb-4 leading-relaxed">
              Te quedaste en el minuto <strong className="text-primary font-mono text-sm">{formatTime(initialProgress)}</strong> de {formatTime(video.duration)}
            </p>

            {/* Mini barra de progreso dentro del modal */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ 
                  width: `${Math.min(100, Math.max(0, ((initialProgress || 0) / (video.duration || 100)) * 100))}%` 
                }} 
              />
            </div>

            {/* Opciones directas: Reanudar o Empezar de nuevo */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full">
              {/* Opción 1: Reanudar */}
              <button
                type="button"
                onClick={handleResumePlayback}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-black font-bold text-sm shadow-xl shadow-primary/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current shrink-0" />
                <span>Reanudar ({formatTime(initialProgress)})</span>
              </button>

              {/* Opción 2: Empezar de nuevo */}
              <button
                type="button"
                onClick={handleRestartFromBeginning}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Desde el inicio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante para activar sonido si está silenciado */}
      {isMuted && !hasEnded && !showResumeChoice && (
        <button
          type="button"
          onClick={handleUnmute}
          className="absolute top-4 right-4 z-30 group flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-black/80 hover:bg-black/95 text-white border border-white/20 hover:border-primary/70 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in cursor-pointer select-none"
          title="Haz clic para activar el sonido"
        >
          <div className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 text-primary shrink-0">
            <VolumeX className="w-3.5 h-3.5 animate-pulse text-primary" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wide uppercase text-white group-hover:text-primary transition-colors">
              Activar sonido
            </span>
          </div>
        </button>
      )}

      {/* Componente Watch Next: Notificación no intrusiva 10s antes de terminar con enlace al siguiente episodio */}
      {showWatchNext && !dismissedWatchNext && !hasEnded && nextEpisode && !showResumeChoice && (
        <WatchNextOverlay
          nextEpisode={nextEpisode}
          remainingSeconds={remainingSeconds}
          onDismiss={() => setDismissedWatchNext(true)}
          onPlayNext={navigateToNextEpisode}
        />
      )}

      {/* Pantalla post-reproducción al terminar el episodio: Auto-reproduce si hay siguiente episodio */}
      {hasEnded && nextEpisode && (
        <div className="absolute inset-0 z-40 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none">
          <div className="max-w-md w-full bg-[#121319]/95 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 shadow-2xl shadow-black">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Episodio terminado</span>
            </div>

            {/* Cuenta regresiva de reproducción automática */}
            <div className="w-full bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-3 text-left">
              <div className="relative w-20 aspect-video rounded-lg overflow-hidden shrink-0 border border-white/10">
                <img
                  src={nextEpisode.thumbnail}
                  alt={nextEpisode.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                  Reproduciendo en {countdown}s
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {cleanTitle(nextEpisode.title)}
                </h4>
                <p className="text-[11px] text-white/50">
                  {nextEpisode.episodeNum ? `Episodio ${nextEpisode.episodeNum}` : 'Siguiente episodio'}
                </p>
              </div>
            </div>

            {/* Barra de progreso de la cuenta regresiva */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${Math.max(0, Math.min(100, (countdown / 5) * 100))}%` }}
              />
            </div>

            <div className="flex items-center gap-3 w-full pt-1">
              <button
                type="button"
                onClick={handleRestartFromBeginning}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repetir</span>
              </button>

              <button
                type="button"
                onClick={navigateToNextEpisode}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-black font-bold text-sm shadow-xl shadow-primary/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>Reproducir ya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {countdown > 0 && (
              <button
                type="button"
                onClick={cancelAutoPlay}
                className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer mt-1"
              >
                Cancelar reproducción automática
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pantalla post-reproducción si NO hay siguiente episodio (Fin de la serie) */}
      {hasEnded && !nextEpisode && (
        <div className="absolute inset-0 z-40 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none">
          <div className="max-w-md w-full bg-[#121319]/95 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 shadow-2xl shadow-black">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Episodio completado</span>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-xs text-white/50 uppercase tracking-widest">Fin de la serie</p>
              <h3 className="text-lg font-bold text-white font-display line-clamp-2">
                {cleanTitle(video.title)}
              </h3>
            </div>

            <div className="flex items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={handleRestartFromBeginning}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-black font-bold text-sm shadow-xl shadow-primary/25 transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ver de nuevo</span>
              </button>

              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all active:scale-95"
              >
                <span>Explorar más</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
