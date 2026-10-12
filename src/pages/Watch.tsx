import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Plus, Check, Server, Play, Clock } from 'lucide-react';
import { getVideoById, videos, characters } from '../data/seed';
import { Button } from '../components/ui/Button';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { VideoCarousel } from '../components/home/VideoCarousel';
import { useVideoProgress } from '../hooks/useVideoProgress';
import { useRecommendations } from '../hooks/useRecommendations';
import { useWatchlist } from '../hooks/useWatchlist';
import { is4KVideo } from '../utils/videoHelpers';
import { PuppetLoader } from '../components/ui/PuppetLoader';
import { useToast } from '../components/ui/Toast';

const MOCK_USER_ID = "guest_user";

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds) return '0 min';
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (s === 0) return `${m} min`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Watch() {
  const { id } = useParams<{ id: string }>();
  const video = getVideoById(id || null);
  const [activeStream, setActiveStream] = useState<'stream1' | 'stream2'>('stream1');
  
  const { initialProgress, isCompleted, loading: progressLoading, saveProgress } = useVideoProgress(video?.id || null);
  const { recommendations, loading: recLoading } = useRecommendations({ episodeId: video?.id || undefined, userId: MOCK_USER_ID });
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { addToast } = useToast();

  // Cleanup on page unmount or when navigating between video IDs
  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, [id]);



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

  // Comprobar si pertenece a la sección de Parashot Especiales (formato vertical tipo Shorts)
  const isEspeciales = video.seriesId === 'especiales';

  // Todos los episodios de la MISMA serie disponibles para reproducir
  const seriesEpisodes = video.seriesId 
    ? videos
        .filter(v => v.seriesId === video.seriesId && (!v.isShort || video.isShort || isEspeciales) && !(v as any).isUpcoming && (v as any).status !== 'EN_PRODUCCION')
        .sort((a, b) => {
          if ((a as any).seasonNum !== (b as any).seasonNum) {
            return ((a as any).seasonNum || 1) - ((b as any).seasonNum || 1);
          }
          return ((a as any).episodeNum || 0) - ((b as any).episodeNum || 0);
        })
    : [];

  // Buscar el siguiente episodio basado en el índice
  const currentIndex = seriesEpisodes.findIndex(v => v.id === video.id);
  const nextEpisode = currentIndex >= 0 && currentIndex < seriesEpisodes.length - 1 
    ? seriesEpisodes[currentIndex + 1] 
    : undefined;
  const prevEpisode = currentIndex > 0 
    ? seriesEpisodes[currentIndex - 1] 
    : undefined;

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

      {/* Container max-width en desktop, full width en mobile */}
      <div className={`relative z-10 flex flex-col gap-8 w-full ${isEspeciales ? 'max-w-[1260px]' : 'max-w-[1200px]'} mx-auto pt-8 sm:pt-12`}>
        
        {/* Back Link */}
        <Link to="/" className="hidden sm:inline-flex flex-row items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors mb-2 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver
        </Link>

        {/* ============================================================ */}
        {/* CASO 1: SECCIÓN DE PARASHOT ESPECIALES (REPRODUCTOR VERTICAL + BARRA LATERAL) */}
        {/* ============================================================ */}
        {isEspeciales ? (
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-10 w-full">
            
            {/* COLUMNA PRINCIPAL (IZQUIERDA): Reproductor Vertical 9:16 Amplio y Centrado */}
            <div className="w-full lg:flex-1 flex flex-col items-center justify-center shrink-0">
              {/* Contenedor del reproductor: Más grande y con límites de proporción y altura */}
              <div className="w-[300px] sm:w-[360px] md:w-[400px] lg:w-[440px] xl:w-[460px] aspect-[9/16] max-h-[82vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/95 bg-black ring-1 ring-white/10 relative">
                {progressLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <PuppetLoader />
                  </div>
                ) : (
                  <VideoPlayer 
                    key={`${video.id}-${activeStream}`}
                    video={video} 
                    nextEpisode={nextEpisode}
                    initialProgress={initialProgress}
                    onProgressSave={saveProgress}
                    isCompleted={isCompleted}
                    isVertical={true}
                  />
                )}
              </div>

              {/* Botones de navegación Anterior / Siguiente debajo del reproductor */}
              <div className="flex items-center justify-between w-[300px] sm:w-[360px] md:w-[400px] lg:w-[440px] xl:w-[460px] mt-4 gap-3">
                {prevEpisode ? (
                  <Link
                    to={`/watch/${prevEpisode.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all"
                  >
                    <span>← Anterior</span>
                  </Link>
                ) : <div className="flex-1" />}

                {nextEpisode && (
                  <Link
                    to={`/watch/${nextEpisode.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-black text-xs font-bold transition-all shadow-md shadow-primary/20"
                  >
                    <span>Siguiente →</span>
                  </Link>
                )}
              </div>
            </div>

            {/* COLUMNA LATERAL (DERECHA): Barra Lateral Más Compacta de Detalles y Lista Vertical de Episodios */}
            <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 flex flex-col gap-5 px-4 sm:px-0">
              {/* Información del episodio */}
              <div className="flex flex-col gap-2 bg-surface/30 border border-white/5 p-4 sm:p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest">
                  <span>Parashot Especiales</span>
                  <span className="text-white/20">•</span>
                  <span>Ep. {video.episodeNum || 1} de {seriesEpisodes.length}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {video.title}
                </h1>

                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(video.duration)}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="border border-white/10 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-white/70">
                    Vertical HD
                  </span>
                </div>

                <p className="text-white/70 text-xs sm:text-sm leading-relaxed mt-1">
                  {video.description}
                </p>

                {/* Acciones */}
                <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-white/5">
                  <Button 
                    onClick={() => toggleWatchlist(video.id)}
                    variant={isInWatchlist(video.id) ? "default" : "outline"} 
                    size="sm"
                    className={`flex-1 gap-1.5 font-semibold text-xs transition-all duration-300 ${
                      isInWatchlist(video.id) 
                      ? 'bg-primary/90 border-primary text-black hover:bg-primary shadow-[0_0_20px_rgba(245,196,99,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {isInWatchlist(video.id) ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {isInWatchlist(video.id) ? 'En mi lista' : 'Mi lista'}
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline" 
                    size="sm"
                    className="flex-1 gap-1.5 bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs transition-all duration-300"
                  >
                    <Share2 className="h-3.5 w-3.5 text-white/70" />
                    <span>Compartir</span>
                  </Button>
                </div>
              </div>

              {/* BARRA LATERAL VERTICAL COMPACTA DE EPISODIOS */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-1 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">
                    Episodios Disponibles ({seriesEpisodes.length})
                  </h3>
                  <span className="text-[11px] text-primary font-medium">Vertical</span>
                </div>

                <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
                  {seriesEpisodes.map((ep) => {
                    const isCurrent = ep.id === video.id;

                    return (
                      <Link
                        key={ep.id}
                        to={`/watch/${ep.id}`}
                        className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 border ${
                          isCurrent
                            ? 'bg-primary/15 border-primary/50 shadow-md shadow-primary/10'
                            : 'bg-surface/30 hover:bg-surface/70 border-white/5 hover:border-white/15'
                        }`}
                      >
                        {/* Miniatura vertical 9:16 compacta */}
                        <div className="relative w-12 sm:w-14 aspect-[9/16] rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                          <img
                            src={ep.thumbnail}
                            alt={ep.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {isCurrent ? (
                            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                              <div className="w-5 h-5 rounded-full bg-primary text-black flex items-center justify-center">
                                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                              </div>
                            </div>
                          ) : (
                            <div className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/85 text-[8px] font-mono font-medium text-white/90">
                              {formatDuration(ep.duration)}
                            </div>
                          )}
                        </div>

                        {/* Detalles del episodio */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-primary' : 'text-white/40'}`}>
                              Episodio {ep.episodeNum || 1}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded-full bg-primary text-black text-[8px] font-bold uppercase">
                                En curso
                              </span>
                            )}
                          </div>

                          <h4 className={`text-xs sm:text-sm font-bold line-clamp-1 mt-0.5 ${isCurrent ? 'text-primary' : 'text-white'}`}>
                            {ep.title}
                          </h4>

                          <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                            {ep.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* CASO 2: REPRODUCTOR ESTÁNDAR HORIZONTAL (TODAS LAS DEMÁS SERIES) */
          /* ============================================================ */
          <div className="flex flex-col gap-8">
            {/* PRO Video Player Component */}
            <div className="relative w-full sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/80 bg-black aspect-video ring-1 ring-white/5">
              {progressLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <PuppetLoader />
                </div>
              ) : (
                <VideoPlayer 
                  key={`${video.id}-${activeStream}`}
                  video={video} 
                  nextEpisode={nextEpisode}
                  initialProgress={initialProgress}
                  onProgressSave={saveProgress}
                  isCompleted={isCompleted}
                  isVertical={false}
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
                    <span>
                      {video.duration % 60 === 0 
                        ? `${Math.floor(video.duration / 60)} min` 
                        : `${Math.floor(video.duration / 60)} min ${video.duration % 60} s`}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="border border-white/10 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-white/70">
                      {is4KVideo(video) ? '4K' : 'HD'}
                    </span>
                  </div>

                  {/* Botones de acción (Mi lista, Compartir) */}
                  <div className="flex flex-wrap items-center gap-3 mt-6">
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

                  {/* Selector de Servidor / Fuente de Transmisión */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                      <Server className="w-3.5 h-3.5 text-primary" /> Fuente:
                    </span>
                    <button
                      onClick={() => {
                        if (activeStream !== 'stream1') {
                          setActiveStream('stream1');
                          addToast("Conectado a Stream 1 (YouTube HD Limpio)", "info");
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeStream === 'stream1'
                          ? 'bg-primary text-black font-bold shadow'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      Stream 1 (YouTube HD)
                    </button>
                    <button
                      onClick={() => {
                        if (activeStream !== 'stream2') {
                          setActiveStream('stream2');
                          addToast("Conectado a Stream 2 (Alternativo / Backup)", "info");
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeStream === 'stream2'
                          ? 'bg-primary text-black font-bold shadow'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      Stream 2 (Alternativo)
                    </button>
                  </div>
                </div>

                {/* Botones Anterior / Siguiente Episodio */}
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
                {video.characters && video.characters.length > 0 && (
                  <div className="border-t border-white/5 pt-6 mt-4">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Aparecen en este episodio</h3>
                    <div className="flex flex-wrap gap-4">
                      {video.characters.map((charName) => {
                        const char = characters.find(c => c.name.toLowerCase() === charName.toLowerCase()) || { id: charName, name: charName, image: `/characters/${charName.toLowerCase()}.png` };
                        return (
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
                        );
                      })}
                    </div>
                  </div>
                )}
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
        )}
      </div>
    </div>
  );
}
