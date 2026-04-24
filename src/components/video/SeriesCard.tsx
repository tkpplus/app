import { useState, MouseEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Info, X, Play } from 'lucide-react';

interface SeriesCardProps {
  id: string;
  title: string;
  thumbnail: string;
  category?: string;
  description?: string;
}

export function SeriesCard({
  id,
  title,
  thumbnail,
  category,
  description = 'Descubre más sobre esta increíble serie de Torah Kids Puppets llena de enseñanzas y aventuras divertidas.',
}: SeriesCardProps) {
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfo(true);
  };

  useEffect(() => {
    if (showInfo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showInfo]);

  return (
    <>
      <Link to={`/series/${id}`} className="group relative flex flex-col w-full h-full">
        {/* Thumbnail Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-50 hover:shadow-2xl bg-[#202020] border border-transparent hover:border-gray-500">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-60"
            loading="lazy"
            onError={(e) => {
               // Fallback image in case user hasn't uploaded local cover yet
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542157585-ef20bbcce178?q=80&w=2000&auto=format&fit=crop";
            }}
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
            <div className="mt-3 opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto transition-all duration-300 delay-100 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-black bg-primary px-2 py-1 rounded shadow-sm border border-primary-hover hover:bg-primary-hover transition-colors">
                <Play className="w-3 h-3 fill-current" />
                VER SERIE
              </span>
              <button 
                onClick={handleInfoClick}
                className="flex items-center gap-1 text-xs font-bold text-white bg-white/20 px-2 py-1 rounded backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-colors"
              >
                <Info className="w-3 h-3" />
                MÁS INFO
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Info Modal Portal */}
      {showInfo && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 p-2">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowInfo(false)}></div>
          
          <div className="bg-[#181818] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in z-10 scrollbar-hide">
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 z-30 p-2 bg-[#181818] hover:bg-white rounded-full text-white hover:text-black transition-colors shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Header Image */}
            <div className="relative h-64 md:h-[400px] w-full shrink-0">
              <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/60 to-transparent" />
              
              <div className="absolute bottom-6 left-6 md:left-10 max-w-2xl px-2">
                <h2 className="text-3xl md:text-[3.5rem] font-display font-bold text-white mb-6 drop-shadow-lg leading-none">{title}</h2>
                <div className="flex gap-4">
                  <Link to={`/series/${id}`} onClick={() => setShowInfo(false)} className="bg-white text-black px-6 py-2.5 md:px-8 md:py-3 rounded-[4px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-lg">
                    <Play className="h-6 w-6 md:h-7 md:w-7 fill-current" /> Reproducir
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Body Info */}
            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 bg-[#181818]">
              <div className="md:col-span-2 text-[#e5e5e5] text-sm md:text-lg leading-relaxed">
                <div className="flex items-center flex-wrap gap-3 mb-4 font-bold tracking-wide">
                  <span className="text-[#46d369]">98% Coincidencia</span>
                  <span className="text-[#bcbcbc]">2024</span>
                  {category && (
                    <span className="text-white px-1 py-0.5 rounded-sm bg-white/10 text-sm uppercase">{category}</span>
                  )}
                  <span className="border border-gray-600 px-1 py-0 rounded-[3px] text-[#bcbcbc] text-xs">HD</span>
                </div>
                <p className="font-medium text-white/95 text-[15px] sm:text-[17px] mb-6">
                  {description}
                </p>
              </div>
              
              <div className="text-sm text-[#777] space-y-4">
                <div className="space-y-1">
                  <span className="block text-xs uppercase tracking-wider">Elenco:</span>
                  <p className="text-white">Yosef, Benny, Aharón, Keter, Dr. Avraham</p>
                </div>
                <div className="space-y-1">
                  <span className="block text-xs uppercase tracking-wider">Géneros:</span>
                  <p className="text-white">Educativo, Judío, Infantil</p>
                </div>
                <div className="space-y-1">
                  <span className="block text-xs uppercase tracking-wider">Vibra:</span>
                  <p className="text-white">Divertido, Inspirador, Con Valores</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
