import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import { videos } from '../data/seed';
import { VideoCard } from '../components/video/VideoCard';
import { Plus } from 'lucide-react';

export function MyList() {
  const { watchlist } = useWatchlist();
  
  // Filtrar los videos que están en la lista usando el ID
  // En SeriesDetail el ID que se guarda debe ser del video, pero si guardamos series ID, hay que tener cuidado.
  // Asumiremos que se guardn video.id
  const savedVideos = videos.filter(video => watchlist.includes(video.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">Mi Lista</h1>
      </div>

      {savedVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface/30 rounded-2xl border border-white/5 mx-auto w-full max-w-3xl text-center">
          <div className="bg-surface p-6 rounded-full mb-6 border border-white/10 shadow-xl">
             <Plus className="w-10 h-10 text-white/40" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Aún no has agregado títulos</h2>
          <p className="text-white/60 mb-8 max-w-md">
            Explora nuestro catálogo y agrega series o episodios a tu lista para verlos más tarde.
          </p>
          <Link to="/" className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30">
            Explorar contenido
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
              />
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
                Añadido a Mi Lista
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
