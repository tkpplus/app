import React, { useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeaturedInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: any;
}

export function FeaturedInfoModal({ isOpen, onClose, video }: FeaturedInfoModalProps) {
  const navigate = useNavigate();
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center sm:p-6 p-2">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-[#181818] w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl relative z-10 animate-scale-in border border-white/10 scrollbar-hide">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-[#181818] text-white rounded-full p-2 transition-all hover:bg-white hover:text-black shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Image */}
        <div className="relative h-64 md:h-[400px] w-full shrink-0">
          <img
            src={video.thumbnail}
            className="w-full h-full object-cover"
            alt={video.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/60 to-transparent"></div>

          <div className="absolute bottom-6 left-6 md:left-10 max-w-2xl px-2">
            <h2 className="text-3xl md:text-[3.5rem] font-display font-bold text-white mb-6 drop-shadow-lg leading-none">
              {video.title.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/watch/${video.id}`);
                }}
                className="bg-white text-black px-6 py-2.5 md:px-8 md:py-3 rounded-[4px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-lg"
              >
                <Play className="h-6 w-6 md:h-7 md:w-7 fill-current" /> Reproducir
              </button>
            </div>
          </div>
        </div>

        {/* Body Info */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 bg-[#181818]">
          <div className="md:col-span-2 text-[#e5e5e5] text-sm md:text-lg leading-relaxed">
            <div className="flex items-center flex-wrap gap-3 mb-4 font-bold tracking-wide">
              <span className="text-[#46d369]">98% Coincidencia</span>
              <span className="text-[#bcbcbc]">{new Date(video.publishedAt || Date.now()).getFullYear()}</span>
              {video.episodeNum && (
                <span className="text-white px-1 py-0.5 rounded-sm bg-white/10 text-sm">T{video.seasonNum || 1} • E{video.episodeNum}</span>
              )}
              <span className="border border-gray-600 px-1 py-0 rounded-[3px] text-[#bcbcbc] text-xs">
                HD
              </span>
              <span className="text-[#bcbcbc]">{Math.floor(video.duration ? video.duration / 60 : 20)}:34 min</span>
            </div>
            <p className="font-medium text-white/95 text-[15px] sm:text-[17px]">
              {video.description || 'Sin descripción disponible.'}
            </p>
          </div>
          <div className="text-sm text-[#777] space-y-4">
            <div className="space-y-1">
              <span className="block text-xs uppercase tracking-wider">
                Elenco:
              </span>
              <p className="text-white">Yosef, Benny, Aharón, Keter, Dr. Avraham</p>
            </div>
            <div className="space-y-1">
              <span className="block text-xs uppercase tracking-wider">
                Géneros:
              </span>
              <p className="text-white">Educativo, Judío, Infantil</p>
            </div>
            <div className="space-y-1">
              <span className="block text-xs uppercase tracking-wider">
                Vibra:
              </span>
              <p className="text-white">Divertido, Inspirador, Con Valores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
