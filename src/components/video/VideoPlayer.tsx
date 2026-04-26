import React, { memo, useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
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
  const playerRef = useRef<ReactPlayer>(null);
  const [hasSeeked, setHasSeeked] = useState(false);
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Reset state when video changes
    setIsReady(false);
    setIsPlaying(false);
    setHasSeeked(false);
  }, [video.id]);

  const handleReady = () => {
    setIsReady(true);
    setIsPlaying(true);
    // Only seek on first load of this video
    if (!hasSeeked && initialProgress > 0 && playerRef.current) {
      playerRef.current.seekTo(initialProgress, 'seconds');
      setHasSeeked(true);
    }
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    const duration = playerRef.current?.getDuration() || video.duration || 0;
    if (onProgressSave && duration > 0) {
      onProgressSave(state.playedSeconds, duration);
    }
  };

  const handleEnded = () => {
    if (onProgressSave) {
      const duration = playerRef.current?.getDuration() || video.duration || 0;
      onProgressSave(duration, duration); // mark as completed
    }
    if (nextEpisode) {
      // Small delay before auto-navigating could be nice, or immediate 
      navigate(`/watch/${nextEpisode.id}`);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl shadow-2xl border border-white/5 select-none">
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${video.youtubeId}`}
        width="100%"
        height="100%"
        playing={isReady && isPlaying}
        controls={true}
        onReady={handleReady}
        onProgress={handleProgress}
        onEnded={handleEnded}
        progressInterval={2000} // every 2 seconds
        config={{
          youtube: {
            playerVars: { 
              showinfo: 0,
              modestbranding: 1,
              rel: 0
            }
          }
        }}
        className="absolute inset-0"
      />
    </div>
  );
});
