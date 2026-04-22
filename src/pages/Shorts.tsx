import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { getShortVideos } from '../data/seed';
import { Heart, Share2, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Shorts() {
  const [shorts, setShorts] = useState(getShortVideos());
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShorts(getShortVideos());
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const scrollPosition = containerRef.current.scrollTop;
    const itemHeight = containerRef.current.clientHeight;
    const newIndex = Math.round(scrollPosition / itemHeight);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < shorts.length) {
      setActiveIndex(newIndex);
      setIsPlaying(true); // reset playing state when changing video
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="absolute top-[64px] left-0 right-0 bottom-0 bg-black overflow-hidden flex justify-center z-40">
      <div 
        ref={containerRef}
        className="w-full max-w-[450px] h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar relative"
        onScroll={handleScroll}
      >
        {shorts.map((video, index) => (
          <div 
            key={`${video.id}-${index}`} 
            className="w-full h-full snap-always snap-start relative bg-surface flex items-center justify-center overflow-hidden"
          >
            {/* Background Blur Ambient */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
               <img src={video.thumbnail} className="w-full h-full object-cover blur-[50px] scale-150 saturate-[1.5]" alt="" />
               <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer" onClick={togglePlayPause}>
              {Math.abs(activeIndex - index) <= 1 ? ( // Only render current, prev, next
                React.createElement(ReactPlayer as any, {
                  url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
                  width: "100%",
                  height: "100%",
                  playing: activeIndex === index && isPlaying,
                  loop: true,
                  muted: false,
                  config: {
                    youtube: {
                      playerVars: { 
                        controls: 0, 
                        modestbranding: 1, 
                        rel: 0,
                        disablekb: 1,
                        fs: 0,
                        playsinline: 1
                      }
                    }
                  },
                  style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none' // Prevent YouTube clicks, we'll do our own
                  }
                })
              ) : (
                <img src={video.thumbnail} alt={video.title} className="w-full object-contain h-full" />
              )}
              
              {/* Play Button Overlay (Visible only when paused) */}
              {activeIndex === index && !isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-sm p-5 rounded-full scale-150 animate-in fade-in duration-200">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Overlays */}
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-4">
              <div className="flex justify-between items-end w-full">
                {/* Meta */}
                <div className="flex flex-col gap-2 w-3/4 mb-4">
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{video.title}</h3>
                  {video.category && (
                     <span className="text-primary text-xs font-bold uppercase tracking-wider bg-black/50 w-max px-2 py-1 rounded-md backdrop-blur-sm">
                       {video.category}
                     </span>
                  )}
                  <p className="text-white/80 text-sm line-clamp-2">{video.description}</p>
                </div>

                {/* Vertical Actions */}
                <div className="flex flex-col gap-4 items-center mb-4 pointer-events-auto">
                   <div className="flex flex-col items-center gap-1 group cursor-pointer">
                     <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:text-primary transition">
                       <Heart className="w-6 h-6" />
                     </div>
                     <span className="text-white text-xs font-semibold">12k</span>
                   </div>
                   
                   <div className="flex flex-col items-center gap-1 group cursor-pointer">
                     <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:text-primary transition">
                       <MessageCircle className="w-6 h-6" />
                     </div>
                     <span className="text-white text-xs font-semibold">104</span>
                   </div>

                   <div className="flex flex-col items-center gap-1 group cursor-pointer">
                     <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:text-primary transition">
                       <Share2 className="w-6 h-6" />
                     </div>
                     <span className="text-white text-xs font-semibold">Share</span>
                   </div>
                </div>
              </div>
            </div>

          </div>
        ))}
        {shorts.length === 0 && (
          <div className="text-white flex items-center justify-center h-full">
            No hay shorts disponibles.
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
