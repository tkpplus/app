import React from 'react';
import { ArrowRight, X, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WatchNextOverlayProps {
  nextEpisode: {
    id: string;
    title: string;
    thumbnail: string;
    duration?: number;
    seasonNum?: number;
    episodeNum?: number;
  };
  remainingSeconds: number;
  onDismiss: () => void;
  onPlayNext?: () => void;
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

function formatDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds)) return '';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const WatchNextOverlay: React.FC<WatchNextOverlayProps> = ({
  nextEpisode,
  remainingSeconds,
  onDismiss,
  onPlayNext,
}) => {
  // Progreso visual de los 10 segundos para la barrita sutil
  const progressPercent = Math.max(0, Math.min(100, (remainingSeconds / 10) * 100));

  return (
    <aside
      aria-label="Siguiente episodio"
      className="absolute bottom-14 right-3 sm:bottom-16 sm:right-6 md:bottom-20 z-30 max-w-[340px] sm:max-w-[390px] w-[calc(100%-24px)] sm:w-auto bg-[#0f1015]/95 backdrop-blur-2xl border border-white/15 hover:border-primary/60 rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-black/95 animate-in slide-in-from-bottom-4 fade-in duration-300 text-white transition-all select-none group"
    >
      {/* Barra de progreso de cuenta regresiva fina en el borde superior */}
      <div className="absolute top-0 left-3 right-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Cabecera con indicador de cuenta regresiva y botón de cerrar */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pt-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Siguiente episodio en {remainingSeconds}s
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="w-6 h-6 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 text-xs transition-colors cursor-pointer"
          title="Ocultar notificación"
          aria-label="Cerrar notificación"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card del siguiente episodio con miniatura y enlace directo */}
      <div className="flex items-center gap-3">
        <Link
          to={`/watch/${nextEpisode.id}`}
          onClick={onPlayNext}
          className="relative w-24 sm:w-28 aspect-video rounded-xl overflow-hidden shrink-0 border border-white/10 bg-surface group/thumb block"
        >
          <img
            src={nextEpisode.thumbnail}
            alt={nextEpisode.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-primary/90 text-black flex items-center justify-center shadow-lg transform transition-transform group-hover/thumb:scale-110">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
          </div>
          {nextEpisode.duration && (
            <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono font-medium text-white/90">
              {formatDuration(nextEpisode.duration)}
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <Link
            to={`/watch/${nextEpisode.id}`}
            onClick={onPlayNext}
            className="text-xs sm:text-sm font-bold text-white hover:text-primary transition-colors line-clamp-1"
          >
            {cleanTitle(nextEpisode.title)}
          </Link>

          <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
            {nextEpisode.seasonNum ? `Temporada ${nextEpisode.seasonNum} • ` : ''}
            {nextEpisode.episodeNum ? `Ep. ${nextEpisode.episodeNum}` : 'Episodio siguiente'}
          </p>

          <Link
            to={`/watch/${nextEpisode.id}`}
            onClick={onPlayNext}
            className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-black text-xs font-bold transition-all active:scale-95 shadow-md shadow-primary/25 w-fit"
          >
            <span>Ver ahora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
