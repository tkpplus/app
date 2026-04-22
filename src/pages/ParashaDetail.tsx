import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { db } from '../lib/db';
import { getParashaByNumber } from '../data/parashot';
import { VideoCard } from '../components/video/VideoCard';

export function ParashaDetail() {
  const { number } = useParams<{ number: string }>();
  const parashaNum = parseInt(number || '0');
  
  const parashaInfo = getParashaByNumber(parashaNum);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      const results = await db.episode.findMany({
        where: { 
          category: 'PARASHOT',
          parashaNum: parashaNum
        },
        orderBy: { episodeNum: 'asc' }
      });
      setVideos(results);
      setLoading(false);
    }
    loadVideos();
  }, [parashaNum]);

  if (!parashaInfo) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Minimalista */}
      <div className="relative w-full h-[40vh] bg-black overflow-hidden border-b border-border">
        <img 
          src={parashaInfo.thumbnail} 
          alt={parashaInfo.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/category/parashot" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-4 w-fit">
            <ArrowLeft className="h-4 w-4" />
            Volver a Parashot
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-primary-hover font-bold text-sm tracking-wider uppercase bg-white/90 px-2 py-0.5 rounded shadow-sm">
              Parashá {parashaNum}
            </span>
            <span className="text-white/80 font-medium text-sm">{parashaInfo.book}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-white tracking-tight drop-shadow-md">
            {parashaInfo.name}
          </h1>
        </div>
      </div>

      {/* Grid de Contenido */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="flex items-center justify-center p-12">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                duration={video.duration}
                series={video.seriesId === 'parasha-en-un-minuto' ? 'Parashá en 1 minuto' : 'Cuentos de la Torá'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface rounded-xl border border-border">
            <h3 className="text-xl font-bold font-display text-text-main mb-2">Aún no hay videos para esta Parashá</h3>
            <p className="text-text-muted">Estamos trabajando para agregar más contenido pronto.</p>
          </div>
        )}
      </div>
    </div>
  );
}
