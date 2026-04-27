import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ui/Toast';

export function useWatchlist() {
  const { addToast } = useToast();
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tkp_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tkp_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = useCallback((videoId: string) => {
    const isCurrentlyInWatchlist = watchlist.includes(videoId);
    
    if (isCurrentlyInWatchlist) {
      addToast('Video eliminado de tu lista', 'info');
      setWatchlist((prev) => prev.filter((id) => id !== videoId));
    } else {
      addToast('¡Video añadido a tu lista!', 'success');
      setWatchlist((prev) => [...prev, videoId]);
    }
  }, [watchlist, addToast]);

  const isInWatchlist = useCallback((videoId: string) => watchlist.includes(videoId), [watchlist]);

  return {
    watchlist,
    toggleWatchlist,
    isInWatchlist,
  };
}
