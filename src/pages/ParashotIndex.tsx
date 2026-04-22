import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { getSeriesByCategory } from '../data/seed';

export function ParashotIndex() {
  const parashotSeries = getSeriesByCategory('PARASHOT');

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-14 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4 tracking-tight drop-shadow-md">
          Especial Parashot
        </h1>
        <p className="text-lg text-white/80 leading-relaxed font-medium">
          Explora los cinco libros de la Torá. Cada libro incluye sus porciones semanales 
          listas para reproducir como una serie continua.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {parashotSeries.map((series) => {
          return (
            <Link 
              key={series.id} 
              to={`/series/${series.id}`}
              className="group relative flex aspect-[3/4] w-full flex-col justify-end overflow-hidden rounded-md bg-surface transition-all duration-300 hover:scale-105 hover:ring-4 hover:ring-white/30 hover:shadow-xl hover:shadow-black/50"
            >
              <img
                src={series.thumbnail}
                alt={series.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
              
              <div className="relative z-10 p-4 flex flex-col justify-end h-full text-white">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-auto shadow-lg opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                
                <h3 className="text-xl font-bold font-display shadow-black text-shadow-sm mb-1">
                  {series.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
