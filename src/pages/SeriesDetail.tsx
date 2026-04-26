import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import { VideoCard } from '../components/video/VideoCard';
import { Button } from '../components/ui/Button';
import { getSeriesById, getVideosBySeries } from '../data/seed';
import { useWatchlist } from '../hooks/useWatchlist';
import { VideoCarousel } from '../components/home/VideoCarousel';
import { getSeriesCover } from '../utils/covers';

export function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [seriesInfo, setSeriesInfo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
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
        results = results.sort((a, b) => {
           if (a.seasonNum !== b.seasonNum) {
             return (a.seasonNum || 1) - (b.seasonNum || 1);
           }
           return (a.episodeNum || 0) - (b.episodeNum || 0);
        });
        setVideos(results);
      }
    }
    setLoading(false);
  }, [slug]);

  // Group videos by season
  const videosBySeason = useMemo(() => {
    const grouped = videos.reduce((acc, video) => {
      const season = video.seasonNum || 1;
      if (!acc[season]) {
        acc[season] = [];
      }
      acc[season].push(video);
      return acc;
    }, {} as Record<number, any[]>);
    return grouped;
  }, [videos]);

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
                 src={`https://www.youtube.com/embed/${trailerVideo.youtubeId}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=${trailerVideo.youtubeId}&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3&playsinline=1`}
                 title="Background Video"
                 className="w-full h-full pointer-events-none"
                 allow="autoplay; encrypted-media"
               />
             </div>
           ) : null}
           
           {/* Fallback/Thumbnail Overlay */}
           <div className={`absolute inset-0 w-full h-full mix-blend-overlay ${trailerVideo ? 'opacity-30' : 'opacity-40'}`}>
             <img 
               src={getSeriesCover(seriesInfo.id, seriesInfo.thumbnail)} 
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
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
          Object.keys(videosBySeason).sort((a,b) => parseInt(a) - parseInt(b)).map(season => {
            const seasonVideos = videosBySeason[Number(season)];
            return (
              <div key={season} className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">Temporada {season}</h3>
                <div className="flex flex-col gap-4">
                  {seasonVideos.map((video, index) => (
                    <Link
                      key={video.id}
                      to={`/watch/${video.id}`}
                      className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl hover:bg-surface/60 transition-colors border border-transparent hover:border-white/10 group"
                    >
                      <div className="flex-shrink-0 w-full sm:w-48 aspect-video sm:h-28 bg-surface rounded-lg overflow-hidden relative shadow-lg">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-black/40 text-white backdrop-blur-sm">
                            <Play className="h-5 w-5 fill-current ml-1" />
                          </div>
                        </div>
                        {video.progressPercentage !== undefined && video.progressPercentage > 0 && !video.isCompleted && (
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800 z-10">
                            <div 
                              className="h-full bg-red-600" 
                              style={{ width: `${Math.min(Math.max(video.progressPercentage * 100, 0), 100)}%` }} 
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 justify-center">
                        <div className="flex justify-between items-start sm:items-center mb-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                            {video.episodeNum ? `${video.episodeNum}. ` : ''} {video.title.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
                          </h4>
                          <span className="text-sm font-medium text-text-muted whitespace-nowrap">
                            {Math.floor(video.duration / 60)} {Math.floor(video.duration / 60) === 1 ? 'minuto' : 'min'}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted line-clamp-2 md:line-clamp-3 leading-relaxed mt-2 md:mt-1">
                          {video.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

