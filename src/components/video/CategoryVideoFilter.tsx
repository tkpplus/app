import { useState, useMemo } from 'react';
import { VideoCard } from './VideoCard';
import { getSeriesById } from '../../data/seed';

// Assuming Video type structure matches the seed
interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  views: number;
  category: string;
  subcategory: string | null;
  seriesId: string | null;
  isShort: boolean;
  publishedAt: string;
  thumbnail: string;
  [key: string]: any;
}

interface CategoryVideoFilterProps {
  videos: Video[];
}

export function CategoryVideoFilter({ videos }: CategoryVideoFilterProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');

  // Extract unique subcategories (using seriesId as fallback if subcategory is null)
  const subcategories = useMemo(() => {
    const subs = new Set<string>();
    videos.forEach(v => {
      if (v.subcategory) subs.add(v.subcategory);
      else if (v.seriesId) subs.add(v.seriesId);
    });
    return Array.from(subs);
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      // 1. Subcategory filter
      if (selectedSubcategory !== 'all') {
        const sub = v.subcategory || v.seriesId;
        if (sub !== selectedSubcategory) return false;
      }
      
      // 2. Duration filter
      if (selectedDuration !== 'all') {
        // duration is in seconds
        if (selectedDuration === 'short' && v.duration > 300) return false; // < 5 mins
        if (selectedDuration === 'medium' && (v.duration < 300 || v.duration > 900)) return false; // 5-15 mins
        if (selectedDuration === 'long' && v.duration < 900) return false; // > 15 mins
      }
      
      return true;
    }).sort((a, b) => {
      // 3. Sort Order
      const dateA = new Date(a.publishedAt || 0).getTime();
      const dateB = new Date(b.publishedAt || 0).getTime();
      
      if (sortOrder === 'newest') return dateB - dateA;
      if (sortOrder === 'oldest') return dateA - dateB;
      if (sortOrder === 'popular') return (b.views || 0) - (a.views || 0);
      
      return 0;
    });
  }, [videos, selectedSubcategory, selectedDuration, sortOrder]);

  const getSubcategoryName = (subId: string) => {
    // If it's a seriesId, we can get the title. Otherwise capitalize it.
    const series = getSeriesById(subId);
    if (series) return series.title;
    return subId.charAt(0).toUpperCase() + subId.slice(1);
  };

  return (
    <div className="mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold font-display text-white drop-shadow-md">
            Explorar Todos los Videos
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Encuentra exactamente lo que buscas
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Subcategory Filter */}
          {subcategories.length > 0 && (
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer hover:border-white/20 transition-colors"
            >
              <option value="all">Subcategoría / Serie</option>
              {subcategories.map(sub => (
                <option key={sub} value={sub}>{getSubcategoryName(sub)}</option>
              ))}
            </select>
          )}

          {/* Duration Filter */}
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer hover:border-white/20 transition-colors"
          >
            <option value="all">Cualquier duración</option>
            <option value="short">Menos de 5 min</option>
            <option value="medium">5 a 15 min</option>
            <option value="long">Más de 15 min</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer hover:border-white/20 transition-colors"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="popular">Más populares</option>
          </select>
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-white/50 text-xl font-medium">No se encontraron videos con los filtros seleccionados.</p>
          <button 
            onClick={() => {
              setSelectedSubcategory('all');
              setSelectedDuration('all');
              setSortOrder('newest');
            }}
            className="mt-4 text-primary hover:text-primary-hover font-semibold"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="min-w-0">
              <VideoCard
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                duration={video.duration}
                category={video.category}
                seasonNum={video.seasonNum}
                episodeNum={video.episodeNum}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
