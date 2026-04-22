import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus } from 'lucide-react';
import { VideoCard } from '../components/video/VideoCard';
import { Button } from '../components/ui/Button';
import { getSeriesById, getVideosBySeries } from '../data/seed';

export function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [seriesInfo, setSeriesInfo] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (slug) {
      const info = getSeriesById(slug);
      setSeriesInfo(info);
      
      if (info) {
        let results = getVideosBySeries(slug);
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

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Series Hero */}
      <div className="relative w-full h-[50vh] bg-black overflow-hidden border-b border-border">
        <img 
          src={seriesInfo.thumbnail} 
          alt={seriesInfo.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
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
                <Button size="lg" variant="outline" className="gap-2 font-semibold bg-surface/50 border-white/10 text-white hover:bg-white/10 hover:text-white">
                  <Plus className="h-5 w-5" />
                  Mi lista
                </Button>
              </div>
          </div>
        </div>
      </div>

      {/* Episode List */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold font-display text-text-main">Episodios</h2>
           <span className="text-sm font-medium text-text-muted">{videos.length} videos</span>
        </div>
        
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
                        Episodio {video.episodeNum}
                    </span>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
