import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, SkipForward } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Link } from 'react-router-dom';

function cleanTitle(rawTitle?: string): string {
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

export const FloatingMiniPlayer: React.FC = () => {
  const {
    activeVideo,
    nextEpisode,
    isPlaying,
    isMuted,
    isPipMode,
    togglePlay,
    toggleMute,
    closePlayer,
    expandPlayer,
    playVideo,
  } = usePlayer();

  const [isHovered, setIsHovered] = useState(false);

  if (!isPipMode || !activeVideo) return null;

  const handleNextEpisode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nextEpisode) {
      playVideo(nextEpisode, null, 0);
    }
  };

  return (
    <aside
      aria-label="Reproductor flotante Picture-in-Picture"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[280px] sm:w-[340px] md:w-[380px] bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-6 fade-in select-none group/pip ring-1 ring-primary/30"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="font-bold text-primary text-[10px] uppercase tracking-wider shrink-0">
            Picture-in-Picture
          </span>
          <span className="text-white/40">•</span>
          <span className="text-white/90 font-medium truncate text-xs">
            {cleanTitle(activeVideo.title)}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Expand to Watch page */}
          <button
            type="button"
            onClick={expandPlayer}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Pantalla completa / Volver al video"
            aria-label="Expandir reproductor"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Close PiP */}
          <button
            type="button"
            onClick={closePlayer}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar reproductor"
            aria-label="Cerrar reproductor flotante"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Frame */}
      <div className="relative aspect-video w-full bg-black overflow-hidden group/video">
        <iframe
          className="absolute inset-0 w-full h-full object-cover pointer-events-auto"
          src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=1&modestbranding=1&rel=0&playsinline=1`}
          title={activeVideo.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Hover Action Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 flex items-center justify-center gap-3 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Mute/Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            className="w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Next Episode Button */}
          {nextEpisode && (
            <button
              type="button"
              onClick={handleNextEpisode}
              className="w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              title={`Siguiente: ${cleanTitle(nextEpisode.title)}`}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          {/* Expand to Watch page button */}
          <button
            type="button"
            onClick={expandPlayer}
            className="w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            title="Ampliar video"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Info & Next Episode preview */}
      <div className="p-3 bg-surface/80 flex items-center justify-between text-xs border-t border-white/5">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-white font-bold truncate">
            {cleanTitle(activeVideo.title)}
          </span>
          <span className="text-[10px] text-white/50 truncate">
            {activeVideo.seasonNum ? `Temporada ${activeVideo.seasonNum} • ` : ''}
            {activeVideo.episodeNum ? `Episodio ${activeVideo.episodeNum}` : 'TKP+ Streaming'}
          </span>
        </div>

        <button
          type="button"
          onClick={expandPlayer}
          className="ml-3 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-black font-bold text-[11px] transition-all shrink-0 cursor-pointer shadow-md shadow-primary/20"
        >
          Ver en grande
        </button>
      </div>
    </aside>
  );
};
