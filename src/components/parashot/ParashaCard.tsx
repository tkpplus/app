import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ParashaCardProps {
  number: number;
  name: string;
  book: string;
  thumbnail: string;
  videoCount: number;
}

export function ParashaCard({ number, name, book, thumbnail, videoCount }: ParashaCardProps) {
  return (
    <Link to={`/parashot/${number}`} className="group relative flex flex-col gap-3 w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-secondary/30 shadow-sm transition-all duration-300 ease-out group-hover:shadow-[0_8px_30px_rgba(45,108,223,0.15)] group-hover:ring-2 group-hover:ring-primary/40 group-hover:-translate-y-1">
        <img
          src={thumbnail}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
        
        {/* Top Badge */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <Badge variant="category" className="shadow-md font-display uppercase tracking-widest text-[10px] bg-white/90">
            Parashá {number}
          </Badge>
        </div>

        {/* Content bottom */}
        <div className="absolute bottom-0 left-0 w-full p-4 z-10 flex flex-col gap-1">
          <span className="text-primary-hover font-semibold text-xs tracking-wider uppercase mb-1 drop-shadow-sm">
            {book}
          </span>
          <h3 className="text-xl font-bold font-display text-white transition-colors drop-shadow-md">
            {name}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-white/80 text-xs font-medium">
             <BookOpen className="w-4 h-4" />
             <span>{videoCount} {videoCount === 1 ? 'video' : 'videos'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
