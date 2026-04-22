import React from 'react';
import { X, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeaturedInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: any;
}

export function FeaturedInfoModal({ isOpen, onClose, video }: FeaturedInfoModalProps) {
  const navigate = useNavigate();

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-center items-center p-4 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-lg"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-[#181818] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-scale-in border border-gray-700">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-[#181818] text-white rounded-full p-2 transition-all hover:bg-white hover:text-black shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Image */}
        <div className="relative h-64 md:h-[450px] w-full">
          <img
            src={video.thumbnail}
            className="w-full h-full object-cover"
            alt={video.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>

          <div className="absolute bottom-10 left-8 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6 drop-shadow-2xl leading-none">
              {video.title}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/watch/${video.id}`);
                }}
                className="bg-white text-black px-8 py-3 rounded-md font-bold text-xl flex items-center gap-3 hover:bg-gray-200 transition-colors shadow-xl"
              >
                <Play className="h-5 w-5 fill-current" /> Reproducir
              </button>
            </div>
          </div>
        </div>

        {/* Body Info */}
        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10 bg-[#181818]">
          <div className="md:col-span-2 text-gray-300 text-lg leading-relaxed">
            <div className="flex items-center gap-4 mb-6 text-sm font-bold tracking-wide">
              <span className="text-green-400">98% Coincidencia</span>
              <span className="text-gray-400">2024</span>
              <span className="border border-gray-500 px-1.5 py-0.5 rounded text-gray-400">
                HD
              </span>
              <span>{video.duration} min</span>
            </div>
            <p className="font-medium text-white/90">
              {video.description || 'Sin descripción disponible.'}
            </p>
          </div>
          <div className="text-sm text-gray-400 space-y-4">
            <div className="space-y-1">
              <span className="text-gray-500 block text-xs uppercase tracking-wider">
                Elenco:
              </span>
              <p className="text-white">Yosef, Benny, Aharón, Keter, Dr. Avraham</p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 block text-xs uppercase tracking-wider">
                Géneros:
              </span>
              <p className="text-white">Educativo, Judío, Infantil</p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 block text-xs uppercase tracking-wider">
                Categoría:
              </span>
              <p className="text-white">{video.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
