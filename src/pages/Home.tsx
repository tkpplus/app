import { useMemo } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { VideoCarousel } from '../components/home/VideoCarousel';
import { SeriesCarousel } from '../components/home/SeriesCarousel';
import { getFeaturedVideos, getSeriesByCategory, videos, getVideoById } from '../data/seed';
import { useContinueWatching } from '../hooks/useVideoProgress';
import { useRecommendations, MOCK_USER_ID } from '../hooks/useRecommendations';

export function Home() {
  const featuredVideo = useMemo(() => {
    const featuredVideos = getFeaturedVideos();
    const sourceVideos = featuredVideos.length > 0 ? featuredVideos : videos.filter(v => !v.isShort);
    const randomIndex = Math.floor(Math.random() * sourceVideos.length);
    return sourceVideos[randomIndex];
  }, []);
  const parashotSeries = getSeriesByCategory('PARASHOT');
  const festividadesSeries = getSeriesByCategory('FESTIVIDADES');
  const cuentosSeries = getSeriesByCategory('CUENTOS');

  const { progressItems, loading: progressLoading } = useContinueWatching();
  const { recommendations, loading: recLoading } = useRecommendations({ userId: MOCK_USER_ID });

  // Mapeamos los videos en progreso con sus datos reales del 'seed' / DB 
  const continueWatchingVideos = progressItems
    .map(p => {
      const video = getVideoById(p.episodeId);
      if (!video || video.isShort) return null;
      return {
        ...video,
        progressPercentage: p.percentage,
        isCompleted: p.completed
      };
    })
    .filter(Boolean);

  const SHOW_VIEW_MORE_THRESHOLD = 6;

  return (
    <div className="relative flex flex-col pb-16 bg-background min-h-screen">
      <div className="absolute top-0 w-full h-[80vh] md:h-[100vh] z-[-1] overflow-hidden pointer-events-none">
        <img 
          src="/_31caec9e-f0b9-408a-b9c2-55dbbdeea961.png" 
          alt="Banner" 
          className="w-full h-full object-cover opacity-30 blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
      </div>
      
      <HeroBanner video={featuredVideo} />
      
      <div className="relative z-20 -mt-24 md:-mt-32 space-y-8 md:space-y-12 pb-12">
        {!progressLoading && continueWatchingVideos.length > 0 && (
          <VideoCarousel title="Continuar viendo" videos={continueWatchingVideos} />
        )}
        
        {!recLoading && recommendations.length > 0 && (
          <VideoCarousel 
            title="Nuestra selección de episodios" 
            videos={recommendations.filter((v: any) => !v.isShort).slice(0, 8)} 
          />
        )}

        {parashotSeries.length > 0 && <SeriesCarousel title="Parashot" series={parashotSeries} viewMoreLink={parashotSeries.length > SHOW_VIEW_MORE_THRESHOLD ? "/category/parashot" : undefined} />}
        {cuentosSeries.length > 0 && <SeriesCarousel title="Cuentos" series={cuentosSeries} viewMoreLink={cuentosSeries.length > SHOW_VIEW_MORE_THRESHOLD ? "/category/cuentos" : undefined} />}
        {festividadesSeries.length > 0 && <SeriesCarousel title="Festividades" series={festividadesSeries} viewMoreLink={festividadesSeries.length > SHOW_VIEW_MORE_THRESHOLD ? "/category/festividades" : undefined} />}
      </div>
    </div>
  );
}

