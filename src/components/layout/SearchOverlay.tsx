import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play } from 'lucide-react';
import { videos } from '../../data/seed';

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
    ? videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
            <span className="text-accent-orange">
              ({filteredVideos.length})
            </span>
          </h3>

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handlePlay(video.id)}
                  className="relative aspect-video rounded-md overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group bg-[#202020] border border-transparent hover:border-gray-500"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                  />
                  <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-0 transition-opacity">
                    <div className="bg-black/60 rounded px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {video.duration} min
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs pl-0.5 shadow-lg">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-white leading-tight mb-1 line-clamp-2">
                      {video.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="text-6xl mb-4">🤷‍♂️</div>
              <p className="text-xl font-bold">
                Benny no encontró videos con ese nombre.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl opacity-50 hover:opacity-100 transition-opacity">
          {['Janucá', 'Shabat', 'Parashá', 'Pesaj'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="p-4 border border-gray-700 rounded-xl hover:bg-white/10 text-gray-300 font-bold transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
