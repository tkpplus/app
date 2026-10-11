import { useState, useEffect, useCallback, useRef } from 'react';

export const MOCK_USER_ID = 'local-user';
export const PROGRESS_EVENT = 'tkp_progress_updated';

export interface VideoProgressRecord {
  episodeId: string;
  timestamp: number;
  duration?: number;
  percentage: number;
  completed: boolean;
  lastWatched: string;
}

// Synchronous helper to get progress for any episode (useful for cards and lists)
export function getVideoProgress(episodeId: string | null | undefined): VideoProgressRecord | null {
  if (!episodeId) return null;
  try {
    const stored = localStorage.getItem(`tkp_progress_${episodeId}`);
    if (stored) {
      return JSON.parse(stored) as VideoProgressRecord;
    }
  } catch (err) {
    console.warn('Error reading video progress for', episodeId, err);
  }
  return null;
}

// Dispatch event across the window so all components update in real-time
function notifyProgressChange(episodeId: string, record?: VideoProgressRecord | null) {
  try {
    window.dispatchEvent(
      new CustomEvent(PROGRESS_EVENT, {
        detail: { episodeId, record }
      })
    );
  } catch (e) {
    // Ignore in non-browser envs
  }
}

// Save video progress
export function saveVideoProgress(episodeId: string, timestamp: number, duration: number): VideoProgressRecord | null {
  if (!episodeId || duration <= 0) return null;

  try {
    const cleanDuration = Math.round(duration);
    const cleanTimestamp = Math.min(Math.max(0, Math.floor(timestamp)), cleanDuration);
    const percentage = cleanDuration > 0 ? cleanTimestamp / cleanDuration : 0;
    const completed = percentage >= 0.90 || (cleanDuration > 30 && cleanDuration - cleanTimestamp < 15);

    const record: VideoProgressRecord = {
      episodeId,
      timestamp: completed ? cleanDuration : cleanTimestamp,
      duration: cleanDuration,
      percentage: Number(percentage.toFixed(3)),
      completed,
      lastWatched: new Date().toISOString()
    };

    localStorage.setItem(`tkp_progress_${episodeId}`, JSON.stringify(record));

    // Update global list
    const allProgressStr = localStorage.getItem('tkp_all_progress') || '[]';
    let allProgress: VideoProgressRecord[] = [];
    try {
      allProgress = JSON.parse(allProgressStr);
    } catch {
      allProgress = [];
    }

    allProgress = allProgress.filter(p => p.episodeId !== episodeId);
    allProgress.unshift(record); // newest first

    localStorage.setItem('tkp_all_progress', JSON.stringify(allProgress));
    notifyProgressChange(episodeId, record);

    return record;
  } catch (e) {
    console.warn('Could not save progress to localStorage', e);
    return null;
  }
}

// Remove an episode from progress
export function removeVideoProgress(episodeId: string) {
  if (!episodeId) return;
  try {
    localStorage.removeItem(`tkp_progress_${episodeId}`);

    const allProgressStr = localStorage.getItem('tkp_all_progress') || '[]';
    let allProgress: VideoProgressRecord[] = [];
    try {
      allProgress = JSON.parse(allProgressStr);
    } catch {
      allProgress = [];
    }

    allProgress = allProgress.filter(p => p.episodeId !== episodeId);
    localStorage.setItem('tkp_all_progress', JSON.stringify(allProgress));
    notifyProgressChange(episodeId, null);
  } catch (e) {
    console.warn('Could not remove progress', e);
  }
}

// Reset progress back to the beginning (0s)
export function resetVideoProgress(episodeId: string) {
  if (!episodeId) return;
  try {
    const existing = getVideoProgress(episodeId);
    const duration = existing?.duration || 0;
    const record: VideoProgressRecord = {
      episodeId,
      timestamp: 0,
      duration,
      percentage: 0,
      completed: false,
      lastWatched: new Date().toISOString()
    };

    localStorage.setItem(`tkp_progress_${episodeId}`, JSON.stringify(record));

    const allProgressStr = localStorage.getItem('tkp_all_progress') || '[]';
    let allProgress: VideoProgressRecord[] = [];
    try {
      allProgress = JSON.parse(allProgressStr);
    } catch {
      allProgress = [];
    }

    allProgress = allProgress.filter(p => p.episodeId !== episodeId);
    allProgress.unshift(record);
    localStorage.setItem('tkp_all_progress', JSON.stringify(allProgress));
    notifyProgressChange(episodeId, record);
  } catch (e) {
    console.warn('Could not reset progress', e);
  }
}

// Mark video as completed
export function markVideoCompleted(episodeId: string, duration?: number) {
  if (!episodeId) return;
  try {
    const existing = getVideoProgress(episodeId);
    const cleanDuration = duration || existing?.duration || 100;
    const record: VideoProgressRecord = {
      episodeId,
      timestamp: cleanDuration,
      duration: cleanDuration,
      percentage: 1,
      completed: true,
      lastWatched: new Date().toISOString()
    };

    localStorage.setItem(`tkp_progress_${episodeId}`, JSON.stringify(record));

    const allProgressStr = localStorage.getItem('tkp_all_progress') || '[]';
    let allProgress: VideoProgressRecord[] = [];
    try {
      allProgress = JSON.parse(allProgressStr);
    } catch {
      allProgress = [];
    }

    allProgress = allProgress.filter(p => p.episodeId !== episodeId);
    allProgress.unshift(record);
    localStorage.setItem('tkp_all_progress', JSON.stringify(allProgress));
    notifyProgressChange(episodeId, record);
  } catch (e) {
    console.warn('Could not mark completed', e);
  }
}

// Hook to track & resume a specific video in Watch page
export function useVideoProgress(episodeId: string | null) {
  const [initialProgress, setInitialProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [lastWatched, setLastWatched] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const lastSaveTimeRef = useRef<number>(0);

  const loadData = useCallback(() => {
    if (!episodeId) {
      setInitialProgress(0);
      setIsCompleted(false);
      setPercentage(0);
      setLoading(false);
      return;
    }

    const data = getVideoProgress(episodeId);
    if (data) {
      setInitialProgress(data.completed ? 0 : data.timestamp);
      setIsCompleted(data.completed);
      setPercentage(data.percentage);
      setDuration(data.duration || 0);
      setLastWatched(data.lastWatched);
    } else {
      setInitialProgress(0);
      setIsCompleted(false);
      setPercentage(0);
      setDuration(0);
      setLastWatched(null);
    }
    setLoading(false);
  }, [episodeId]);

  useEffect(() => {
    loadData();

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.episodeId === episodeId) {
        loadData();
      }
    };

    window.addEventListener(PROGRESS_EVENT, handleUpdate);
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('storage', loadData);
    };
  }, [episodeId, loadData]);

  const saveProgress = useCallback(
    async (timestamp: number, dur: number) => {
      if (!episodeId || dur <= 0) return;

      const now = Date.now();
      // Throttle saves to every 2 seconds, unless near the end
      if (now - lastSaveTimeRef.current < 2000 && timestamp < dur - 2) {
        return;
      }
      lastSaveTimeRef.current = now;

      const record = saveVideoProgress(episodeId, timestamp, dur);
      if (record) {
        setIsCompleted(record.completed);
        setPercentage(record.percentage);
        setDuration(record.duration || dur);
        setLastWatched(record.lastWatched);
      }
    },
    [episodeId]
  );

  const resetProgress = useCallback(() => {
    if (!episodeId) return;
    resetVideoProgress(episodeId);
    setInitialProgress(0);
    setIsCompleted(false);
    setPercentage(0);
  }, [episodeId]);

  const markCompleted = useCallback(() => {
    if (!episodeId) return;
    markVideoCompleted(episodeId, duration);
    setIsCompleted(true);
    setPercentage(1);
  }, [episodeId, duration]);

  const removeProgress = useCallback(() => {
    if (!episodeId) return;
    removeVideoProgress(episodeId);
    setInitialProgress(0);
    setIsCompleted(false);
    setPercentage(0);
    setLastWatched(null);
  }, [episodeId]);

  return {
    initialProgress,
    isCompleted,
    percentage,
    duration,
    lastWatched,
    loading,
    saveProgress,
    resetProgress,
    markCompleted,
    removeProgress
  };
}

// Hook to get all videos currently in progress
export function useContinueWatching() {
  const [progressItems, setProgressItems] = useState<VideoProgressRecord[]>([]);
  const [completedItems, setCompletedItems] = useState<VideoProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    try {
      const allProgressStr = localStorage.getItem('tkp_all_progress');
      if (allProgressStr) {
        const items: VideoProgressRecord[] = JSON.parse(allProgressStr);
        
        // Active in-progress: not marked completed AND watched at least 5 seconds
        const inProgress = items.filter(i => !i.completed && i.timestamp >= 5);
        inProgress.sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());

        // Completed items
        const completed = items.filter(i => i.completed);
        completed.sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());

        setProgressItems(inProgress);
        setCompletedItems(completed);
      } else {
        setProgressItems([]);
        setCompletedItems([]);
      }
    } catch (err) {
      console.error('Could not load continue watching list', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => {
      refresh();
    };

    window.addEventListener(PROGRESS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const removeProgress = useCallback((episodeId: string) => {
    removeVideoProgress(episodeId);
  }, []);

  const clearAllProgress = useCallback(() => {
    try {
      const allProgressStr = localStorage.getItem('tkp_all_progress') || '[]';
      const items: VideoProgressRecord[] = JSON.parse(allProgressStr);
      items.forEach(i => localStorage.removeItem(`tkp_progress_${i.episodeId}`));
      localStorage.removeItem('tkp_all_progress');
      setProgressItems([]);
      setCompletedItems([]);
      window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { cleared: true } }));
    } catch (e) {
      console.warn('Failed clearing all progress', e);
    }
  }, []);

  return {
    progressItems,
    completedItems,
    loading,
    removeProgress,
    clearAllProgress,
    refresh
  };
}
