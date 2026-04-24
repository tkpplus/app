import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import { VideoCard } from '../components/video/VideoCard';
import { Button } from '../components/ui/Button';
import { getSeriesById, getVideosBySeries } from '../data/seed';
import { useWatchlist } from '../hooks/useWatchlist';

export function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [seriesInfo, setSeriesInfo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    setLoading(true);
    if (slug) {
      const info = getSeriesById(slug);
      setSeriesInfo(info);
      
      if (info) {
        let results = getVideosBySeries(slug);
        
        // Filtrar shorts de las series, EXCEPTO para "especiales"
        if (slug !== 'especiales') {
          results = results.filter((v: any) => !v.isShort);
        }
        
        // Sort by episodeNum if available
        results = results.sort((a, b) => ((a as any).episodeNum || 0) - ((b as any).episodeNum || 0));
        setVideos(results);
      }
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!seriesInfo) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold font-display text-text-main">Serie no encontrada</h2>
        <Button asChild><Link to="/">Volver al inicio</Link></Button>
      </div>
    );
  }

  const trailerVideo = videos.length > 0 ? videos[0] : null;

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Series Hero */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-black overflow-hidden border-b border-border">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-background overflow-hidden">
          {trailerVideo ? (
             <div className="absolute inset-0 w-full h-full transform scale-[1.35] md:scale-[1.1] opacity-60">
               <iframe
                 src={`https://www.youtube.com/embed/${trailerVideo.youtubeId}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=${trailerVideo.youtubeId}&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3`}
                 title="Background Video"
                 className="w-full h-full pointer-events-none"
                 allow="autoplay; encrypted-media"
               />
             </div>
           ) : null}
           
           {/* Fallback/Thumbnail Overlay */}
           <div className={`absolute inset-0 w-full h-full mix-blend-overlay ${trailerVideo ? 'opacity-30' : 'opacity-40'}`}>
             <img 
               src={seriesInfo.thumbnail} 
               alt={seriesInfo.title}
               className="w-full h-full object-cover blur-sm"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542157585-ef20bbcce178?q=80&w=2000&auto=format&fit=crop";
               }}
             />
           </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent pointer-events-none" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl relative z-10">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-4 w-fit">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Link>
              <h1 className="text-4xl md:text-6xl font-bold font-display text-white tracking-tight drop-shadow-md mb-4">
                {seriesInfo.title}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-xl font-medium drop-shadow mb-6">
                {seriesInfo.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                {videos.length > 0 && (
                  <Button size="lg" asChild className="gap-2 shadow-lg shadow-primary/30">
                    <Link to={`/watch/${videos[0].id}`}>
                      <Play className="h-5 w-5 fill-current" />
                      Ver desde el inicio
                    </Link>
                  </Button>
                )}
                {trailerVideo && (
                  <Button 
                    size="lg" 
                    onClick={() => toggleWatchlist(trailerVideo.id)}
                    variant={isInWatchlist(trailerVideo.id) ? "default" : "outline"} 
                    className={`gap-2 font-semibold transition-colors ${
                      isInWatchlist(trailerVideo.id) 
                      ? 'bg-primary border-primary text-white hover:bg-primary/90' 
                      : 'bg-surface/50 border-white/10 text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isInWatchlist(trailerVideo.id) ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {isInWatchlist(trailerVideo.id) ? 'En mi lista' : 'Mi lista'}
                  </Button>
                )}
              </div>
          </div>
          
          {/* Mute Toggle Control - positioned bottom right inside hero */}
          {trailerVideo && (
            <div className="absolute bottom-12 right-4 sm:right-8 z-20">
               <button 
                 onClick={() => setIsMuted(!isMuted)}
                 className="p-3 rounded-full border border-white/30 bg-black/40 text-white hover:bg-white/20 hover:border-white transition-all backdrop-blur-md"
                 aria-label={isMuted ? "Unmute" : "Mute"}
               >
                 {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Episode List */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold font-display text-text-main">Episodios</h2>
           <span className="text-sm font-medium text-text-muted">{videos.length} videos</span>
        </div>
        
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4 bg-surface/30 rounded-2xl border border-white/5 mx-auto max-w-2xl">
             <div className="bg-surface p-4 rounded-full mb-4 inline-block shadow-xl">
               <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
               </svg>
             </div>
             <h3 className="text-2xl text-white font-bold mb-2">¡Próximamente! 🎬</h3>
             <p className="text-white/60 max-w-md">Estamos produciendo episodios increíbles para esta serie. Te invitamos a explorar más contenido mientras tanto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
            {videos.map((video) => (
              <div key={video.id} className="flex flex-col gap-2">
                 <VideoCard
                    id={video.id}
                    title={video.title}
                    thumbnail={video.thumbnail}
                    duration={video.duration}
                  />
                  {(video.episodeNum !== undefined && video.episodeNum !== null) && (
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
                          T{video.seasonNum || 1} • E{video.episodeNum}
                      </span>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
