import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Plus, Check } from 'lucide-react';
import { getVideoById, videos } from '../data/seed';
import { Button } from '../components/ui/Button';
import { useVideoProgress } from '../hooks/useVideoProgress';
import { useWatchlist } from '../hooks/useWatchlist';
import { useRecommendations, MOCK_USER_ID } from '../hooks/useRecommendations';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { VideoCarousel } from '../components/home/VideoCarousel'; // Importamos el carousel para la banda de episodios

import { characters } from '../data/seed';
import { is4KVideo } from '../utils/videoHelpers';
import { PuppetLoader } from '../components/ui/PuppetLoader';
import { useToast } from '../components/ui/Toast';

// Inside Watch component, we'll assign random characters to mock for now
export function Watch() {
  const { id } = useParams<{ id: string }>();
  const video = getVideoById(id || null);
  
  const { initialProgress, isCompleted, loading: progressLoading, saveProgress } = useVideoProgress(video?.id || null);
  const { recommendations, loading: recLoading } = useRecommendations({ episodeId: video?.id || undefined, userId: MOCK_USER_ID });
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

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
  const prevEpisode = currentIndex > 0 
    ? seriesEpisodes[currentIndex - 1] 
    : undefined;

  const { addToast } = useToast();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Encontré este episodio de TKP+ y pensé en ustedes: "${video.title}"`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`Encontré este episodio de TKP+ y pensé en ustedes: "${video.title}" - ${window.location.href}`);
      addToast("¡Enlace copiado al portapapeles!", "success");
    }
  };

  return (
    <div className="relative mx-auto w-full min-h-screen bg-background px-0 sm:px-6 lg:px-8 pb-0 sm:pb-8 overflow-hidden animate-in fade-in duration-700">
      
      {/* Ambient Lighting Background */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] sm:h-[100vh] z-0 pointer-events-none opacity-20 select-none transition-opacity duration-1000">
         <img src={video.thumbnail} className="w-full h-full object-cover blur-[140px] scale-150 saturate-[1.5]" alt="" />
         <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background"></div>
      </div>

      {/* Container max-width en desktop, full width en mobile para el player */}
      <div className="relative z-10 flex flex-col gap-8 w-full max-w-[1200px] mx-auto pt-8 sm:pt-12">
        
        {/* Back Link - Oculto en mobile porque el player ocupa todo */}
        <Link to="/" className="hidden sm:inline-flex flex-row items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors mb-2 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver
        </Link>

        {/* CONTENIDO PRINCIPAL LAYOUT */}
        <div className="flex flex-col gap-8">
          {/* PRO Video Player Component */}
          <div className="relative w-full sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/80 bg-black aspect-video ring-1 ring-white/5">
            {progressLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <PuppetLoader />
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

          {/* ESTÁS VIENDO SECTION */}
          <div className="px-4 sm:px-0 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              {/* Info del Episodio */}
              <div className="flex flex-col gap-1 w-full max-w-2xl">
                {/* Serie y Temporada */}
                <div className="flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-widest">
                  <span>{video.seriesId ? video.seriesId.replace('-', ' ') : 'Episodio Individual'}</span>
                  {(video as any).seasonNum && (
                    <>
                      <span className="text-white/20">•</span>
                      <span>Temporada {(video as any).seasonNum}</span>
                    </>
                  )}
                </div>

                {/* Título Principal */}
                <h1 className="text-3xl md:text-5xl font-bold font-display text-white mt-2 leading-tight">
                  {video.title.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
                </h1>

                {/* Metadatos (Episodio, Duración) */}
                <div className="flex items-center gap-3 mt-3 text-sm font-medium text-white/50">
                  {video.episodeNum && (
                    <>
                      <span>Episodio {video.episodeNum}</span>
                      <span className="text-white/20">•</span>
                    </>
                  )}
                  <span>{Math.floor(video.duration / 60)} min {video.duration % 60} s</span>
                  <span className="text-white/20">•</span>
                  <span className="border border-white/10 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-white/70">
                    {is4KVideo(video) ? '4K' : 'HD'}
                  </span>
                </div>

                {/* Botones de acción (Mi lista, Compartir) */}
                <div className="flex items-center gap-3 mt-6">
                  <Button 
                    onClick={() => toggleWatchlist(video.id)}
                    variant={isInWatchlist(video.id) ? "default" : "outline"} 
                    className={`gap-2 font-semibold transition-all duration-300 ${
                      isInWatchlist(video.id) 
                      ? 'bg-primary/90 border-primary text-black hover:bg-primary shadow-[0_0_20px_rgba(245,196,99,0.2)] hover:scale-105' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:scale-105'
                    }`}
                  >
                    {isInWatchlist(video.id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {isInWatchlist(video.id) ? 'En mi lista' : 'Mi lista'}
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline" 
                    className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
                  >
                    <Share2 className="h-4 w-4 text-white/70" />
                    <span className="hidden sm:inline">Compartir</span>
                  </Button>
                </div>
              </div>

              {/* Botones Anterior / Siguiente Episodio (Netflix-style next actions) */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 pt-4 md:pt-0 shrink-0">
                 {prevEpisode && (
                   <Link to={`/watch/${prevEpisode.id}`} className="group flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 text-white/70 hover:text-white">
                     <span className="text-xl leading-none transition-transform duration-300 group-hover:-translate-x-2 text-white/40 group-hover:text-white">←</span>
                     <span className="text-sm font-semibold tracking-wide">Anterior</span>
                   </Link>
                 )}
                 {nextEpisode && (
                   <Link to={`/watch/${nextEpisode.id}`} className="group flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all duration-300 text-white">
                     <span className="text-sm font-semibold tracking-wide">Siguiente</span>
                     <span className="text-xl leading-none transition-transform duration-300 group-hover:translate-x-2 text-primary">→</span>
                   </Link>
                 )}
              </div>
            </div>
            
            {/* Description and tags */}
            <div className="mt-4 pt-6 border-t border-white/5">
              <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-4xl font-light mb-8">
                {video.description}
              </p>
              
              {/* Personajes */}
              <div className="border-t border-white/5 pt-6 mt-4">
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Aparecen en este episodio</h3>
                <div className="flex flex-wrap gap-4">
                  {[...characters]
                    .sort(() => {
                      const seed = video.id.charCodeAt(0) + video.id.charCodeAt(video.id.length - 1);
                      return 0.5 - (seed % 100) / 100;
                    })
                    .slice(0, 4)
                    .map((char) => (
                      <div key={char.id} className="flex flex-col items-center gap-2 group">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors bg-surface shadow-lg shadow-black/20">
                          <img 
                            src={char.image} 
                            alt={char.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${char.name}&background=1a1a2e&color=F5C463&size=150`;
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{char.name}</span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banda de episodios de la misma serie (Netflix style) */}
        {seriesEpisodes.length > 0 && (
          <div className="mt-12 mb-24 w-full overflow-hidden animate-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
             <div className="flex items-end mb-6 px-4 sm:px-0 opacity-80">
                <h3 className="text-lg font-medium text-white/50 tracking-wide uppercase">
                    Más episodios de <span className="text-white font-bold">{video.seriesId ? video.seriesId.replace('-', ' ') : 'esta serie'}</span>
                </h3>
             </div>
             
             {/* Using the standard VideoCarousel for uniformity but styled inside the layout */}
             <div className="-mt-2 w-full">
                <VideoCarousel 
                   title="" 
                   videos={seriesEpisodes} 
                   activeVideoId={video.id}
                />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
