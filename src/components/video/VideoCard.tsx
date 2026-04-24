import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  series?: string;
  isNew?: boolean;
  category?: string;
  progressPercentage?: number; // 0 to 1
  isCompleted?: boolean;
  seasonNum?: number | null;
  episodeNum?: number | null;
}

export function VideoCard({
  id,
  title,
  thumbnail,
  duration,
  series,
  isNew,
  category,
  progressPercentage,
  isCompleted,
  seasonNum,
  episodeNum
}: VideoCardProps) {
  
  // Format duration from seconds to M:SS or H:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Link to={`/watch/${id}`} className="group relative flex flex-col w-full h-full">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-50 hover:shadow-2xl bg-[#202020] border border-transparent hover:border-gray-500">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-40"
          loading="lazy"
        />
        
        {/* Badges on Top */}
        <div className="absolute top-2 left-2 flex gap-2 z-10 opacity-100 group-hover:opacity-0 transition-opacity">
          {isNew && !isCompleted && <Badge variant="new" className="shadow-md">Nuevo</Badge>}
          {isCompleted && <Badge variant="default" className="shadow-md bg-green-500 hover:bg-green-600">Visto</Badge>}
        </div>

        {/* Regular Duration Badge (Hidden on Hover) */}
        <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-0 transition-opacity z-10">
          <div className="bg-black/80 rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
            {formatDuration(duration)}
          </div>
        </div>

        {/* Info Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
           <div className="flex items-center gap-2 mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
               <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs pl-0.5 shadow-lg">▶</div>
               <span className="border border-gray-500 text-gray-300 text-[10px] px-1 rounded">HD</span>
           </div>
           
           {category && (
              <span className="text-[10px] uppercase tracking-wider font-semibold text-accent-orange mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-50 line-clamp-1">{category}</span>
           )}
           <h4 className="font-bold text-xs md:text-sm text-white leading-tight mb-1 line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
               {title.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
           </h4>
           
           <div className="flex justify-between items-center mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                    {episodeNum ? `T${seasonNum || 1} • E${episodeNum}` : 'Video'} • ⏱ {formatDuration(duration)}
                </span>
           </div>
        </div>
        
        {/* Progress bar */}
        {progressPercentage !== undefined && progressPercentage > 0 && !isCompleted && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800 z-10 group-hover:hidden">
             <div 
               className="h-full bg-red-600" 
               style={{ width: `${Math.min(Math.max(progressPercentage * 100, 0), 100)}%` }} 
             />
          </div>
        )}
      </div>
    </Link>
  );
}
