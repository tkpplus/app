import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

interface VideoPlayerProps {
  video: any;
  nextEpisode?: any;
  initialProgress?: number;
  onProgressSave?: (timestamp: number, duration: number) => void;
  isCompleted?: boolean;
}

export const VideoPlayer = memo(function VideoPlayer({ 
  video,
  nextEpisode,
  initialProgress = 0,
  onProgressSave,
  isCompleted
}: VideoPlayerProps) {
  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl shadow-2xl border border-white/5 group">
      
      {/* SIMPLE YOUTUBE IFRAME */}
      <iframe
        className="absolute inset-0 w-full h-full z-10"
        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={video.title || "YouTube video player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
});
