import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface ActiveVideo {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
  duration?: number;
  seriesId?: string | null;
  seasonNum?: number | null;
  episodeNum?: number | null;
  description?: string;
}

interface PlayerContextType {
  activeVideo: ActiveVideo | null;
  nextEpisode: ActiveVideo | null;
  isPlaying: boolean;
  isMuted: boolean;
  isPipMode: boolean;
  currentTime: number;
  duration: number;
  playVideo: (video: ActiveVideo, nextEp?: ActiveVideo | null, startTime?: number) => void;
  pauseVideo: () => void;
  resumeVideo: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  togglePip: () => void;
  enablePip: () => void;
  disablePip: () => void;
  closePlayer: () => void;
  destroyCurrentPlayer: () => void;
  expandPlayer: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (dur: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);
  const [nextEpisode, setNextEpisode] = useState<ActiveVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPipMode, setIsPipMode] = useState<boolean>(false);
  const [currentTime, setCurrentTimeState] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const setCurrentTime = useCallback((time: number) => {
    setCurrentTimeState(prev => {
      if (Math.abs(prev - time) < 0.5) return prev;
      return time;
    });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  // If user navigates away from /watch while playing a video, auto-enable Picture-in-Picture
  useEffect(() => {
    const isWatchPage = location.pathname.startsWith('/watch/');
    if (!isWatchPage && activeVideo && isPlaying && !isPipMode) {
      setIsPipMode(true);
    } else if (isWatchPage && isPipMode) {
      setIsPipMode(false);
    }
  }, [location.pathname, activeVideo, isPlaying, isPipMode]);

  const playVideo = useCallback((video: ActiveVideo, nextEp: ActiveVideo | null = null, startTime = 0) => {
    setActiveVideo(prev => {
      if (prev?.id === video.id) return prev;
      return video;
    });
    if (nextEp !== undefined) setNextEpisode(nextEp);
    setIsPlaying(true);
    setIsPipMode(false);
  }, []);

  const pauseVideo = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeVideo = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const togglePip = useCallback(() => {
    setIsPipMode(prev => !prev);
  }, []);

  const enablePip = useCallback(() => {
    setIsPipMode(true);
  }, []);

  const disablePip = useCallback(() => {
    setIsPipMode(false);
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlaying(false);
    setIsPipMode(false);
    setActiveVideo(null);
    setNextEpisode(null);
  }, []);

  const destroyCurrentPlayer = useCallback(() => {
    setIsPlaying(false);
    setIsPipMode(false);
    setCurrentTimeState(0);
    setDuration(0);
    setActiveVideo(null);
    setNextEpisode(null);
  }, []);

  const expandPlayer = useCallback(() => {
    if (activeVideo?.id) {
      setIsPipMode(false);
      navigate(`/watch/${activeVideo.id}`);
    }
  }, [activeVideo?.id, navigate]);

  return (
    <PlayerContext.Provider
      value={{
        activeVideo,
        nextEpisode,
        isPlaying,
        isMuted,
        isPipMode,
        currentTime,
        duration,
        playVideo,
        pauseVideo,
        resumeVideo,
        togglePlay,
        toggleMute,
        togglePip,
        enablePip,
        disablePip,
        closePlayer,
        destroyCurrentPlayer,
        expandPlayer,
        setCurrentTime,
        setDuration,
        setIsPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
