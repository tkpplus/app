import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../hooks/useWatchlist';

interface FeaturedInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: any;
}

export function FeaturedInfoModal({ isOpen, onClose, video }: FeaturedInfoModalProps) {
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  
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

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-2 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-surface w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl relative z-10 animate-scale-in border border-white/5 scrollbar-hide">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full p-2.5 sm:p-2 transition-all hover:bg-white hover:text-black shadow-lg"
        >
          <X className="w-5 h-5 sm:w-5 sm:h-5" />
        </button>

        {/* Header Image */}
        <div className="relative h-64 sm:h-72 md:h-[450px] w-full shrink-0">
          <img
            src={video.thumbnail}
            className="w-full h-full object-cover"
            alt={video.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>

          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-12 max-w-2xl px-2">
            {video.category && (
              <span className="text-primary font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase mb-3 block opacity-90">
                {video.category}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl md:text-[4rem] font-display font-bold text-white mb-6 sm:mb-8 drop-shadow-xl leading-tight">
              {video.title.replace('Torah Kids Puppets | ', '').replace(/Parash[aá] /, '').replace(/Parashat /, '').replace(/#\S+/g, '').replace(/ - Parash[aá] en un minuto/i, '').replace(/ פרשת.*/, '').trim()}
            </h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/watch/${video.id}`);
                }}
                className="bg-white text-black px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current" /> Reproducir
              </button>
              <button
                onClick={() => toggleWatchlist(video.id)}
                className={`px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3 hover:scale-105 transition-transform border ${
                  isInWatchlist(video.id)
                  ? 'bg-primary border-primary text-white shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                  : 'bg-black/40 border-white/30 text-white backdrop-blur-md'
                }`}
              >
                {isInWatchlist(video.id) ? <Check className="h-5 w-5 sm:h-6 sm:w-6" /> : <Plus className="h-5 w-5 sm:h-6 sm:w-6" />} 
                {isInWatchlist(video.id) ? 'En mi lista' : 'Mi lista'}
              </button>
            </div>
          </div>
        </div>

        {/* Body Info */}
        <div className="p-6 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14 bg-surface pb-16 sm:pb-12">
          <div className="md:col-span-2 text-text-muted text-sm sm:text-base md:text-lg leading-relaxed">
            <div className="flex items-center flex-wrap gap-3 sm:gap-4 mb-6 font-semibold tracking-wide text-xs sm:text-sm">
              <span className="text-[#46d369]">98% Coincidencia</span>
              <span className="text-white/60">{new Date(video.publishedAt || Date.now()).getFullYear()}</span>
              {video.episodeNum && (
                <span className="text-white px-2 py-0.5 rounded bg-white/10">T{video.seasonNum || 1} • E{video.episodeNum}</span>
              )}
              <span className="border border-white/20 px-1.5 py-0.5 rounded text-white/60 text-[10px] sm:text-xs">
                HD
              </span>
              <span className="text-white/60">{Math.floor(video.duration ? video.duration / 60 : 20)}:34 min</span>
            </div>
            <p className="font-medium text-white/90 text-base sm:text-lg md:text-xl leading-relaxed">
              {video.description || 'Sin descripción disponible.'}
            </p>
          </div>
          <div className="text-sm text-text-muted space-y-5 sm:space-y-6">
            <div className="space-y-1.5">
              <span className="block text-[10px] sm:text-xs uppercase tracking-[0.15em] opacity-60">
                Elenco:
              </span>
              <p className="text-white/90 font-medium text-sm">Yosef, Benny, Aharón, Keter, Dr. Avraham</p>
            </div>
            <div className="space-y-1.5">
              <span className="block text-[10px] sm:text-xs uppercase tracking-[0.15em] opacity-60">
                Géneros:
              </span>
              <p className="text-white/90 font-medium text-sm">Educativo, Judío, Infantil</p>
            </div>
            <div className="space-y-1.5">
              <span className="block text-[10px] sm:text-xs uppercase tracking-[0.15em] opacity-60">
                Mood:
              </span>
              <p className="text-white/90 font-medium text-sm">Sofisticado, Inspirador, Con Valores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
