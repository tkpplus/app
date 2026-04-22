import { useState, useEffect, useCallback, useRef } from 'react';

// Replace with true auth state later
export const MOCK_USER_ID = 'mock-user-1';

export function useVideoProgress(episodeId: string | null) {
  const [initialProgress, setInitialProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!episodeId) return;

    fetch(`/api/progress/${episodeId}?userId=${MOCK_USER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.completed) {
            setInitialProgress(0); // If completed, start from 0
            setIsCompleted(true);
          } else {
            setInitialProgress(data.timestamp);
          }
        }
      })
      .catch(err => console.error("Could not load progress", err))
      .finally(() => setLoading(false));
  }, [episodeId]);

  const saveProgress = useCallback(async (timestamp: number, duration: number) => {
    if (!episodeId || duration <= 0) return;
    
    // Throttle updates: Call API only every 5 seconds maximum
    const now = Date.now();
    if (now - lastUpdateRef.current < 5000 && timestamp < duration - 1) {
      return; 
    }
    lastUpdateRef.current = now;

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId,
          timestamp,
          duration,
          userId: MOCK_USER_ID // mock auth check
        })
      });
      const data = await res.json();
      if (data.completed && !isCompleted) {
        setIsCompleted(true);
      }
    } catch (e) {
      console.warn("Could not save progress right now");
    }
  }, [episodeId, isCompleted]);

  return { initialProgress, isCompleted, loading, saveProgress };
}

export function useContinueWatching() {
  const [progressItems, setProgressItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/progress?userId=${MOCK_USER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProgressItems(data);
        }
      })
      .catch(err => console.error("Could not load continue watching", err))
      .finally(() => setLoading(false));
  }, []);

  return { progressItems, loading };
}
