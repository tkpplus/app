import { Link } from 'react-router-dom';

interface SeriesCardProps {
  id: string;
  title: string;
  thumbnail: string;
  category?: string;
}

export function SeriesCard({
  id,
  title,
  thumbnail,
  category,
}: SeriesCardProps) {
  return (
    <Link to={`/series/${id}`} className="group relative flex flex-col w-full h-full">
      {/* Thumbnail Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-50 hover:shadow-2xl bg-[#202020] border border-transparent hover:border-gray-500">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-60"
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
        
        <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="line-clamp-2 text-xl font-bold leading-tight text-white font-display text-shadow-sm">
            {title}
          </h3>
          {category && (
            <p className="text-xs font-semibold text-accent-orange uppercase tracking-wider mt-1">{category}</p>
          )}
          
          {/* View Series specific UI on hover */}
          <div className="mt-3 opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto transition-all duration-300 delay-100 flex items-center gap-2">
            <span className="text-xs font-bold text-white bg-white/20 px-2 py-1 rounded backdrop-blur-sm border border-white/20">VER SERIE</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
