import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Plus } from 'lucide-react';
import { getVideoById, videos } from '../data/seed';
import { Button } from '../components/ui/Button';
import { useVideoProgress } from '../hooks/useVideoProgress';
import { useRecommendations, MOCK_USER_ID } from '../hooks/useRecommendations';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { VideoCarousel } from '../components/home/VideoCarousel'; // Importamos el carousel para la banda de episodios

import { characters } from '../data/seed';

// Inside Watch component, we'll assign random characters to mock for now
export function Watch() {
  const { id } = useParams<{ id: string }>();
  const video = getVideoById(id || null);
  
  const { initialProgress, isCompleted, loading: progressLoading, saveProgress } = useVideoProgress(video?.id || null);
  const { recommendations, loading: recLoading } = useRecommendations({ episodeId: video?.id || undefined, userId: MOCK_USER_ID });

  if (!video) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 bg-background">
        <h2 className="text-2xl font-bold font-display text-white">Video no encontrado</h2>
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  // Todos los episodios de la MISMA serie
  const seriesEpisodes = video.seriesId 
    ? videos.filter(v => v.seriesId === video.seriesId).sort((a, b) => ((a as any).episodeNum || 0) - ((b as any).episodeNum || 0))
    : [];

  // Buscar el siguiente episodio basado en el índice
  const currentIndex = seriesEpisodes.findIndex(v => v.id === video.id);
  const nextEpisode = currentIndex >= 0 && currentIndex < seriesEpisodes.length - 1 
    ? seriesEpisodes[currentIndex + 1] 
    : undefined;

  return (
    <div className="relative mx-auto w-full min-h-screen bg-background px-0 sm:px-6 lg:px-8 py-0 sm:py-8 overflow-hidden">
      
      {/* Ambient Lighting Background */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] sm:h-[100vh] z-0 pointer-events-none opacity-30 select-none">
         <img src={video.thumbnail} className="w-full h-full object-cover blur-[120px] scale-150 saturate-[2]" alt="" />
         <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background"></div>
      </div>

      {/* Container max-width en desktop, full width en mobile para el player */}
      <div className="relative z-10 flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
        
        {/* Back Link - Oculto en mobile porque el player ocupa todo */}
        <Link to="/" className="hidden sm:inline-flex flex-row items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors mb-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        {/* PRO Video Player Component */}
        <div className="relative w-full sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/80 bg-black aspect-video">
          {progressLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <VideoPlayer 
              key={video.id}
              video={video} 
              nextEpisode={nextEpisode}
              initialProgress={initialProgress}
              onProgressSave={saveProgress}
              isCompleted={isCompleted}
            />
          )}
        </div>

        {/* Video Metadata */}
        <div className="px-4 sm:px-0 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              {video.category && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-primary shadow-sm">{video.category}</span>
                  <span className="text-border/50">•</span>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">{video.subcategory || 'General'}</span>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold font-display text-white mb-2">
                {video.title.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
              </h1>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-white/60">
                <span>{new Date(video.publishedAt).getFullYear()}</span>
                {video.episodeNum && (
                  <>
                    <span>•</span>
                    <span className="text-white">T{video.seasonNum || 1} • E{video.episodeNum}</span>
                  </>
                )}
                <span>•</span>
                <span>{Math.floor(video.duration / 60)} min {video.duration % 60} s</span>
                <span>•</span>
                <span>{video.views.toLocaleString()} vistas</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 font-semibold bg-surface/50 border-white/10 text-white hover:bg-white/10 hover:text-white">
                <Plus className="h-4 w-4" />
                Mi lista
              </Button>
              <Button variant="outline" size="icon" className="rounded-full bg-surface/50 border-white/10 text-white hover:bg-white/10 hover:text-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-2 border-border/20 pt-4">
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-3xl">
              {video.description}
            </p>
          </div>

          {/* Personajes / Cast */}
          <div className="mt-6 pt-4 border-t border-border/20">
            <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">Aparecen en este episodio</h3>
            <div className="flex flex-wrap gap-4 items-center">
              {[
                characters[video.title.length % characters.length],
                characters[(video.title.length + 2) % characters.length],
                characters[(video.title.length + 4) % characters.length],
              ].filter((c, index, self) => self.findIndex(t => t.id === c.id) === index) // unique
              .map(personaje => (
                <div key={personaje.id} className="flex items-center gap-2 bg-surface/30 px-3 py-1.5 rounded-full border border-white/5 hover:bg-surface/50 transition-colors">
                  <img src={personaje.image} alt={personaje.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                  <span className="text-sm font-medium text-white/90">{personaje.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Banda de episodios de la misma serie (Netflix style) */}
        {seriesEpisodes.length > 0 && (
          <div className="mt-8 mx-0 mb-20">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-4 border-b border-white/10 pb-4 px-4 sm:px-0">
                 <div>
                    <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                        Más episodios de <span className="text-accent-orange">{video.seriesId ? video.seriesId.replace('-', ' ') : 'esta serie'}</span>
                    </h3>
                 </div>
             </div>
             
             {/* Using the standard VideoCarousel for uniformity but styled inside the layout */}
             <div className="-mt-4">
                <VideoCarousel 
                   title="" 
                   videos={seriesEpisodes} 
                />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
