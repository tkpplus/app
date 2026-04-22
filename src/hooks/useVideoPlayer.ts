import { useRef, useCallback, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

// 1. Debounce Progress 
export function useDebouncedProgress(saveFn: (timestamp: number, duration: number) => void, delayMs = 5000) {
  const lastSaveTime = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveProgress = useCallback((timestamp: number, duration: number, immediate = false) => {
    // Only save significant changes or ignore very early saves
    const now = Date.now();

    if (immediate) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      lastSaveTime.current = now;
      saveFn(timestamp, duration);
      return;
    }

    if (now - lastSaveTime.current >= delayMs) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      lastSaveTime.current = now;
      saveFn(timestamp, duration);
    } else {
      // Debounce the trailing edge
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
         lastSaveTime.current = Date.now();
         saveFn(timestamp, duration);
      }, delayMs);
    }
  }, [saveFn, delayMs]);

  return saveProgress;
}

// 2. Auto Resume UI Logic
export function useAutoResume(initialProgress: number) {
  const [showPrompt, setShowPrompt] = useState(false);
  
  const triggerResumeCheck = useCallback((): boolean => {
    if (initialProgress > 5) {
      setShowPrompt(true);
      return true; // Indicates prompt is blocking playback
    }
    return false; // Proceed normally
  }, [initialProgress]);

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
  }, []);

  return { showPrompt, triggerResumeCheck, dismissPrompt };
}

// 3. Player Controls Logic
export function usePlayerControls(playerRef: React.RefObject<typeof ReactPlayer | any>) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0); // 0 to 1
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Formatting helper
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      const target = e.target as HTMLInputElement;
      playerRef.current.seekTo(parseFloat(target.value), 'fraction');
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const skip = (amount: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + amount, 'seconds');
    }
  };

  return {
    playing, setPlaying,
    volume, setVolume,
    muted, setMuted,
    played, setPlayed,
    playedSeconds, setPlayedSeconds,
    duration, setDuration,
    seeking, setSeeking,
    isFullscreen, setIsFullscreen,
    handleSeekChange, handleSeekMouseUp, handleSeekMouseDown,
    skip, formatTime
  };
}
