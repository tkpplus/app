import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import { useContinueWatching } from '../hooks/useVideoProgress';
import { videos, getVideoById } from '../data/seed';
import { VideoCard } from '../components/video/VideoCard';
import { Plus, Play, Trash2, Clock, Bookmark, RotateCcw } from 'lucide-react';

export function MyList() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'continue'>('watchlist');
  const { watchlist } = useWatchlist();
  const { progressItems, removeProgress, clearAllProgress } = useContinueWatching();
  const navigate = useNavigate();

  // Filtrar los videos que están en la lista usando el ID
  const savedVideos = videos.filter(video => watchlist.includes(video.id));

  // Videos en progreso enriquecidos
  const inProgressVideos = progressItems
    .map(item => {
      const video = getVideoById(item.episodeId);
      if (!video) return null;
      return {
        ...video,
        progressRecord: item
      };
    })
    .filter(Boolean) as (typeof videos[0] & { progressRecord: any })[];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Header and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight mb-2">
            Tu Biblioteca Personal
          </h1>
          <p className="text-sm text-white/60">
            Gestiona tu lista de favoritos y retoma tus episodios donde los dejaste.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 bg-surface/80 p-1.5 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'watchlist'
                ? 'bg-primary text-black shadow-md shadow-primary/20'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Mi Lista</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-xs font-bold ${
                activeTab === 'watchlist' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/80'
              }`}
            >
              {savedVideos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('continue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'continue'
                ? 'bg-primary text-black shadow-md shadow-primary/20'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Continuar Viendo</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-xs font-bold ${
                activeTab === 'continue' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/80'
              }`}
            >
              {inProgressVideos.length}
            </span>
          </button>
        </div>
      </div>

      {/* WATCHLIST TAB */}
      {activeTab === 'watchlist' && (
        <>
          {savedVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface/30 rounded-2xl border border-white/5 mx-auto w-full max-w-3xl text-center">
              <div className="bg-surface p-6 rounded-full mb-6 border border-white/10 shadow-xl">
                <Plus className="w-10 h-10 text-white/40" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Aún no has agregado títulos</h2>
              <p className="text-white/60 mb-8 max-w-md">
                Explora nuestro catálogo y presiona "Mi Lista" en cualquier serie o episodio para guardarlo aquí.
              </p>
              <Link
                to="/"
                className="bg-primary text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30"
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
              {savedVideos.map((video) => (
                <div key={video.id} className="flex flex-col gap-2">
                  <VideoCard
                    id={video.id}
                    title={video.title}
                    thumbnail={video.thumbnail}
                    duration={video.duration}
                    category={video.category}
                  />
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
                    Guardado en tu lista
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CONTINUE WATCHING TAB */}
      {activeTab === 'continue' && (
        <>
          {inProgressVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface/30 rounded-2xl border border-white/5 mx-auto w-full max-w-3xl text-center">
              <div className="bg-surface p-6 rounded-full mb-6 border border-white/10 shadow-xl">
                <Clock className="w-10 h-10 text-white/40" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">No tienes episodios en pausa</h2>
              <p className="text-white/60 mb-8 max-w-md">
                Cuando empieces a ver cualquier video, guardaremos automáticamente tu segundo exacto para que puedas reanudarlo aquí.
              </p>
              <Link
                to="/"
                className="bg-primary text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30"
              >
                Comenzar a ver
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs uppercase tracking-wider font-semibold text-white/60">
                  {inProgressVideos.length} {inProgressVideos.length === 1 ? 'episodio en curso' : 'episodios en curso'}
                </p>
                <button
                  onClick={clearAllProgress}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar historial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressVideos.map((video) => {
                  const rec = video.progressRecord;
                  const watchedMin = Math.floor(rec.timestamp / 60);
                  const totalMin = Math.floor((video.duration || rec.duration || 60) / 60);
                  const remainingSec = Math.max(0, (video.duration || rec.duration || 60) - rec.timestamp);
                  const remainingMin = Math.ceil(remainingSec / 60);
                  const percent = Math.round((rec.percentage || 0) * 100);

                  return (
                    <div
                      key={video.id}
                      className="group relative bg-surface/70 hover:bg-surface border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg"
                    >
                      {/* Thumbnail with overlay & progress */}
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                        {/* Resume play button badge */}
                        <Link
                          to={`/watch/${video.id}`}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                        >
                          <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </Link>

                        {/* Remaining time pill */}
                        <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md rounded-md px-2 py-0.5 text-[11px] font-semibold text-white/90">
                          Quedan {remainingMin} min
                        </div>

                        {/* Bottom progress bar on thumbnail */}
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-800">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                          />
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {video.category || 'Episodio'}
                            </span>
                            {video.seriesId && (
                              <span className="text-[10px] text-white/40">
                                • {video.seriesId.replace('-', ' ')}
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-base text-white line-clamp-2 mb-1">
                            {video.title.replace('Torah Kids Puppets | ', '').trim()}
                          </h3>

                          <div className="flex items-center justify-between text-xs text-white/60 mt-2">
                            <span>
                              {watchedMin} min de {totalMin} min vistos
                            </span>
                            <span className="font-bold text-primary">{percent}%</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <button
                            onClick={() => navigate(`/watch/${video.id}`)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Reanudar</span>
                          </button>

                          <button
                            onClick={() => removeProgress(video.id)}
                            className="text-white/40 hover:text-red-400 text-xs p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                            title="Quitar de continuar viendo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
