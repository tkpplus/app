import { useState, useEffect } from 'react';

export function useWatchlist() {
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

  const toggleWatchlist = (videoId: string) => {
    setWatchlist((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const isInWatchlist = (videoId: string) => watchlist.includes(videoId);

  return {
    watchlist,
    toggleWatchlist,
    isInWatchlist,
  };
}
