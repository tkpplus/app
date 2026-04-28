import { videos } from '../data/seed';
import { CategoryVideoFilter } from '../components/video/CategoryVideoFilter';

export function Explore() {
  const allVideos = videos.filter(v => !v.isShort);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4 tracking-tight drop-shadow-md">
          Explorar Videos
        </h1>
        <p className="text-lg text-white/80 leading-relaxed font-medium">
          Encuentra todos nuestros videos, filtra por duración, categorías o novedades.
        </p>
      </div>

      <CategoryVideoFilter videos={allVideos} />
    </div>
  );
}
