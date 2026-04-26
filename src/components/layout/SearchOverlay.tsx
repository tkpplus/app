import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play } from 'lucide-react';
import { videos } from '../../data/seed';

function highlightText(text: string | null | undefined, highlight: string) {
  if (!text) return '';
  if (!highlight.trim()) return text;
  const regex = new RegExp(`(${highlight.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.toString().split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary text-black font-bold rounded px-1">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredVideos = searchTerm
    ? videos
        .map(video => {
          let score = 0;
          const normalizedSearch = searchTerm.toLowerCase();
          const titleMatch = video.title.toLowerCase().includes(normalizedSearch);
          const categoryMatch = video.category.toLowerCase().includes(normalizedSearch);
          const subcategoryMatch = video.subcategory?.toLowerCase().includes(normalizedSearch);
          const descMatch = video.description?.toLowerCase().includes(normalizedSearch);

          if (titleMatch) score += 3;
          if (categoryMatch || subcategoryMatch) score += 2;
          if (descMatch) score += 1;

          return { video, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.video)
    : [];

  const handlePlay = (id: string) => {
    onClose();
    navigate(`/watch/${id}`);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#141414]/95 backdrop-blur-xl animate-fade-in flex flex-col items-center pt-24 px-4 overflow-y-auto custom-scrollbar">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="w-full max-w-4xl mb-12">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="¿Qué quieres ver hoy?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-b-2 border-gray-700 text-3xl md:text-6xl text-white placeholder-gray-600 focus:outline-none focus:border-accent-orange py-4 font-display font-bold text-center transition-colors"
        />
      </div>

      {searchTerm ? (
        <div className="w-full max-w-7xl pb-20">
          <h3 className="text-xl font-bold text-gray-400 mb-6 px-2">
            Resultados para "{searchTerm}"{' '}
            <span className="text-primary">
              ({filteredVideos.length})
            </span>
          </h3>

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handlePlay(video.id)}
                  className="relative aspect-video rounded-md overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group bg-[#202020] border border-transparent hover:border-white/20"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:blur-sm transition-all duration-500"
                  />
                  <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-0 transition-opacity">
                    <div className="bg-black/60 rounded px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {video.duration ? `${Math.floor(video.duration / 60)} min` : 'HD'}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                     <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center text-white shadow-lg bg-black/40 backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform duration-300">
                       <Play className="w-5 h-5 fill-current ml-1" />
                     </div>
                  </div>
                  <div className="absolute bottom-0 w-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-2 group-hover:translate-y-0">
                    <h4 className="font-bold text-sm text-white leading-tight mb-1 line-clamp-2">
                      {highlightText(video.title.replace('Torah Kids Puppets | ', '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').trim(), searchTerm)}
                    </h4>
                    {video.category && (
                      <span className="text-xs text-primary font-semibold">{highlightText(video.category, searchTerm)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="text-6xl mb-4">🤷‍♂️</div>
              <p className="text-xl font-bold font-display">
                No encontramos títulos que coincidan con tu búsqueda.
              </p>
              <p className="text-sm mt-2 text-gray-600">
                Prueba con otras palabras o navega por las categorías.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-4xl opacity-70 hover:opacity-100 transition-opacity">
          <p className="text-gray-400 mb-6 font-medium tracking-wide uppercase text-sm">Búsquedas sugeridas</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Bereshit', 'Noaj', 'Pesaj', 'Janucá', 'Shabat', 'Cuentos', 'Moshé'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-black text-gray-300 font-bold transition-all shadow-lg hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
