import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Check, Volume2, VolumeX, Lock, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getSeriesById, getVideosBySeries } from '../data/seed';
import { useWatchlist } from '../hooks/useWatchlist';
import { getSeriesCover } from '../utils/covers';
import { PuppetLoader } from '../components/ui/PuppetLoader';
import { getVideoProgress } from '../hooks/useVideoProgress';

const formatEpisodeDuration = (totalSeconds: number) => {
  if (!totalSeconds) return '0 min';
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (s === 0) return `${m} ${m === 1 ? 'minuto' : 'min'}`;
  return `${m}:${s.toString().padStart(2, '0')} min`;
};

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
        
        // Attach progress if available
        results = results.map(video => {
          const p = getVideoProgress(video.id);
          return {
            ...video,
            progressPercentage: p ? (p.timestamp / (p.duration || video.duration || 1)) : undefined,
            isCompleted: p?.completed
          };
        });

        // Sort: if season differs sort by season, otherwise by episodeNum
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

  // Videos directly sorted and available
  const filteredVideos = videos;

  // Group videos by season
  const videosBySeason = useMemo(() => {
    const grouped = filteredVideos.reduce((acc, video) => {
      const season = video.seasonNum || 1;
      if (!acc[season]) {
        acc[season] = [];
      }
      acc[season].push(video);
      return acc;
    }, {} as Record<number, any[]>);
    return grouped;
  }, [filteredVideos]);

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><PuppetLoader /></div>;
  }

  if (!seriesInfo) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold font-display text-text-main">Serie no encontrada</h2>
        <Button asChild><Link to="/">Volver al inicio</Link></Button>
      </div>
    );
  }

  // Pick first playable trailer video
  const trailerVideo = filteredVideos.find(v => !v.isUpcoming && v.youtubeId) 
    || videos.find(v => !v.isUpcoming && v.youtubeId) 
    || null;

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Series Hero */}
      <div className="relative w-full min-h-[50vh] md:min-h-[65vh] bg-black overflow-hidden border-b border-border">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-background overflow-hidden">
          {trailerVideo ? (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] opacity-60">
               <iframe
                 src={`https://www.youtube.com/embed/${trailerVideo.youtubeId}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=${trailerVideo.youtubeId}&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3&playsinline=1`}
                 title="Background Video"
                 className="absolute inset-0 w-full h-full pointer-events-none border-0 scale-105"
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

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-medium tracking-wider px-2.5 py-1 rounded bg-white/10 text-white/80">
                  {seriesInfo.categoryId || 'Serie'}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold font-display text-white tracking-tight drop-shadow-md mb-4">
                {seriesInfo.title}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-xl font-medium drop-shadow mb-6">
                {seriesInfo.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                {trailerVideo && (
                  <Button size="lg" asChild className="gap-2 shadow-lg shadow-primary/30">
                    <Link to={`/watch/${trailerVideo.id}`}>
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
          
          {/* Mute Toggle Control */}
          {trailerVideo && (
            <div className="absolute bottom-12 right-4 sm:right-8 z-20">
               <button 
                 onClick={() => setIsMuted(!isMuted)}
                 className="p-3 rounded-full border border-white/30 bg-black/40 text-white hover:bg-white/20 hover:border-white transition-all backdrop-blur-md cursor-pointer"
                 aria-label={isMuted ? "Unmute" : "Mute"}
               >
                 {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Episode List Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        

        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4 bg-surface/30 rounded-2xl border border-white/5 mx-auto max-w-2xl">
             <div className="bg-surface p-4 rounded-full mb-4 inline-block shadow-xl">
               <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
               </svg>
             </div>
             <h3 className="text-2xl text-white font-bold mb-2">Próximamente</h3>
             <p className="text-white/60 max-w-md">Estamos produciendo episodios increíbles para esta serie. Te invitamos a explorar más contenido mientras tanto.</p>
          </div>
        ) : (
          Object.keys(videosBySeason).sort((a,b) => parseInt(a) - parseInt(b)).map(season => {
            const seasonVideos = videosBySeason[Number(season)];
            
            // Sub-grouping for Relatos de Avraham by Parashá / Category
            const subGroups: { key: string; title: string; videos: typeof seasonVideos }[] = [];
            if (slug === 'relatos-avraham') {
              const groupsMap = new Map<string, typeof seasonVideos>();
              seasonVideos.forEach(v => {
                let gKey = v.subcategory || (v.category === 'FESTIVIDADES' ? 'Festividades' : 'Historias');
                if (v.episodeType === 'talmud') gKey = 'Misterios del Talmud';
                if (!groupsMap.has(gKey)) groupsMap.set(gKey, []);
                groupsMap.get(gKey)!.push(v);
              });

              // Orden canónico de subgrupos para Relatos de Avraham
              const orderPref = ['Ki Tavó', 'Nitzavim', 'Vaiélej', 'Haazinu', 'Rosh Hashaná', 'Yom Kipur', 'Festividades'];
              
              const sortedGroupKeys = Array.from(groupsMap.keys()).sort((a, b) => {
                const idxA = orderPref.indexOf(a);
                const idxB = orderPref.indexOf(b);
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                return a.localeCompare(b);
              });

              sortedGroupKeys.forEach((gKey) => {
                const vids = groupsMap.get(gKey)!;
                let displayTitle = `Parashá ${gKey}`;
                if (gKey === 'Ki Tavó') displayTitle = 'Parashá Ki Tavó';
                else if (gKey === 'Nitzavim') displayTitle = 'Parashá Nitzavim';
                else if (gKey === 'Vaiélej') displayTitle = 'Parashá Vaiélej';
                else if (gKey === 'Haazinu') displayTitle = 'Parashá Haazinu';
                else if (gKey === 'Rosh Hashaná') displayTitle = 'Especial Rosh Hashaná';
                else if (gKey === 'Yom Kipur') displayTitle = 'Especial Yom Kipur';
                else if (gKey === 'Festividades') displayTitle = 'Especiales de Festividades';
                
                // Sort complete episode first (episodeNum 0), then short stories by episodeNum
                const sortedVids = [...vids].sort((a, b) => {
                  if (a.episodeType === 'completo') return -1;
                  if (b.episodeType === 'completo') return 1;
                  return (a.episodeNum || 0) - (b.episodeNum || 0);
                });

                subGroups.push({ key: gKey, title: displayTitle, videos: sortedVids });
              });
            }

            // Nombres limpios de temporada: solo "Temporada 1", "Temporada 2", etc.
            const getSeasonTitle = (sNum: string) => {
              return `Temporada ${sNum}`;
            };

            return (
              <div key={season} className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      {getSeasonTitle(season)}
                    </h3>
                  </div>
                  <span className="text-xs text-white/50 font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                    {seasonVideos.length} {seasonVideos.length === 1 ? 'relato' : 'relatos'}
                  </span>
                </div>

                {slug === 'relatos-avraham' && subGroups.length > 0 ? (
                  <div className="space-y-8">
                    {subGroups.map((group) => (
                      <div key={group.key} className="space-y-3">
                        {/* Subsección discreta y elegante por Parashá */}
                        <div className="flex items-center gap-2 pt-2 pb-1 text-sm font-semibold text-white/90">
                          <span>{group.title}</span>
                          <span className="text-xs text-white/40 font-normal">
                            ({group.videos.length} {group.videos.length === 1 ? 'relato' : 'relatos'})
                          </span>
                        </div>

                        <div className="flex flex-col gap-3">
                          {group.videos.map((video) => {
                            const isLocked = video.isUpcoming || video.status === 'EN_PRODUCCION' || !video.youtubeId;

                            if (isLocked) {
                              return (
                                <div
                                  key={video.id}
                                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-surface/10 border border-white/5 opacity-80 select-none cursor-not-allowed group/locked"
                                >
                                  <div className="flex-shrink-0 w-full sm:w-56 aspect-video sm:h-32 bg-surface/40 rounded-lg overflow-hidden relative shadow-lg">
                                    <img 
                                      src={video.thumbnail} 
                                      alt={video.title} 
                                      className="w-full h-full object-cover grayscale brightness-50"
                                      loading="lazy"
                                    />
                                    {/* Overlay con candado y aviso de En Producción */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-center p-2">
                                      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 mb-1.5 shadow-md">
                                        <Lock className="w-4 h-4 text-primary" />
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                                        En producción
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col flex-1 justify-center">
                                    <div className="flex justify-between items-start sm:items-center mb-1">
                                      <h4 className="text-base sm:text-lg font-bold text-white/80 line-clamp-1 flex items-center gap-2">
                                        <span>{video.episodeNum ? `${video.episodeNum}. ` : ''}{video.title}</span>
                                        <Lock className="w-3.5 h-3.5 text-white/40 inline shrink-0" />
                                      </h4>
                                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white/60 whitespace-nowrap ml-2">
                                        Próximamente
                                      </span>
                                    </div>
                                    <p className="text-sm text-text-muted/70 line-clamp-2 md:line-clamp-3 leading-relaxed mt-1">
                                      {video.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <Link
                                key={video.id}
                                to={`/watch/${video.id}`}
                                className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl hover:bg-surface/60 transition-colors border border-transparent hover:border-white/10 group bg-surface/20"
                              >
                                <div className="flex-shrink-0 w-full sm:w-56 aspect-video sm:h-32 bg-surface rounded-lg overflow-hidden relative shadow-lg">
                                  <img 
                                    src={video.thumbnail} 
                                    alt={video.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-black/40 text-white backdrop-blur-sm">
                                      <Play className="h-5 w-5 fill-current ml-1" />
                                    </div>
                                  </div>

                                  {/* Barra de progreso guardado del usuario */}
                                  {video.progressPercentage !== undefined && video.progressPercentage > 0 && !video.isCompleted && (
                                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-900/80 z-10">
                                      <div 
                                        className="h-full bg-primary" 
                                        style={{ width: `${Math.min(Math.max(video.progressPercentage * 100, 0), 100)}%` }} 
                                      />
                                    </div>
                                  )}

                                  {video.isCompleted && (
                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-primary text-black text-[10px] font-bold z-10 shadow">
                                      Visto
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col flex-1 justify-center">
                                  <div className="flex justify-between items-start sm:items-center mb-1">
                                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                                      {video.episodeType === 'completo' ? 'Episodio Completo: ' : (video.episodeNum ? `${video.episodeNum}. ` : '')}
                                      {video.title.replace(/^Torah Kids Puppets\s*\|\s*/i, '').replace(/#\S+/g, '').trim()}
                                    </h4>
                                    <span className="text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap ml-2">
                                      {formatEpisodeDuration(video.duration)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-text-muted line-clamp-2 md:line-clamp-3 leading-relaxed mt-1">
                                    {video.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {seasonVideos.map((video) => {
                      const isLocked = video.isUpcoming || video.status === 'EN_PRODUCCION' || !video.youtubeId;

                      if (isLocked) {
                        return (
                          <div
                            key={video.id}
                            className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-surface/10 border border-white/5 opacity-80 select-none cursor-not-allowed"
                          >
                            <div className="flex-shrink-0 w-full sm:w-56 aspect-video sm:h-32 bg-surface/40 rounded-lg overflow-hidden relative shadow-lg">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title} 
                                className="w-full h-full object-cover grayscale brightness-50"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-center p-2">
                                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 mb-1.5 shadow-md">
                                  <Lock className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                                  En producción
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col flex-1 justify-center">
                              <div className="flex justify-between items-start sm:items-center mb-1">
                                <h4 className="text-base sm:text-lg font-bold text-white/80 line-clamp-1 flex items-center gap-2">
                                  <span>{video.episodeNum ? `${video.episodeNum}. ` : ''}{video.title}</span>
                                  <Lock className="w-3.5 h-3.5 text-white/40 inline shrink-0" />
                                </h4>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-white/60 whitespace-nowrap ml-2">
                                  Próximamente
                                </span>
                              </div>
                              <p className="text-sm text-text-muted/70 line-clamp-2 md:line-clamp-3 leading-relaxed mt-1">
                                {video.description}
                              </p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={video.id}
                          to={`/watch/${video.id}`}
                          className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl hover:bg-surface/60 transition-colors border border-transparent hover:border-white/10 group bg-surface/20"
                        >
                          <div className={`flex-shrink-0 ${slug === 'especiales' ? 'w-24 sm:w-28 aspect-[9/16]' : 'w-full sm:w-56 aspect-video sm:h-32'} bg-surface rounded-lg overflow-hidden relative shadow-lg`}>
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-black/40 text-white backdrop-blur-sm">
                                <Play className="h-5 w-5 fill-current ml-1" />
                              </div>
                            </div>

                            {/* Barra de progreso guardado del usuario */}
                            {video.progressPercentage !== undefined && video.progressPercentage > 0 && !video.isCompleted && (
                              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-900/80 z-10">
                                <div 
                                  className="h-full bg-primary" 
                                  style={{ width: `${Math.min(Math.max(video.progressPercentage * 100, 0), 100)}%` }} 
                                />
                              </div>
                            )}

                            {video.isCompleted && (
                              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-primary text-black text-[10px] font-bold z-10 shadow">
                                Visto
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col flex-1 justify-center">
                            <div className="flex justify-between items-start sm:items-center mb-1">
                              <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                                {video.episodeNum ? `${video.episodeNum}. ` : ''} 
                                {video.title.replace(/^Torah Kids Puppets\s*\|\s*/i, '').replace(/#\S+/g, '').trim()}
                              </h4>
                              <span className="text-xs sm:text-sm font-medium text-text-muted whitespace-nowrap ml-2">
                                {formatEpisodeDuration(video.duration)}
                              </span>
                            </div>
                            <p className="text-sm text-text-muted line-clamp-2 md:line-clamp-3 leading-relaxed mt-1">
                              {video.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
