import { useState, useEffect, useCallback, useRef } from 'react';
import { videos } from '../data/seed';

export const MOCK_USER_ID = 'local-user';

export function useVideoProgress(episodeId: string | null) {
  const [initialProgress, setInitialProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!episodeId) return;
    
    // Slight timeout to simulate network and prevent flicker
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(`tkp_progress_${episodeId}`);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.completed) {
            setInitialProgress(0);
            setIsCompleted(true);
          } else {
            setInitialProgress(data.timestamp);
          }
        }
      } catch (err) {
        console.error("Could not load progress", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [episodeId]);

  const saveProgress = useCallback(async (timestamp: number, duration: number) => {
    if (!episodeId || duration <= 0) return;
    
    const now = Date.now();
    if (now - lastUpdateRef.current < 5000 && timestamp < duration - 1) {
      return; 
    }
    lastUpdateRef.current = now;

    try {
      const percentage = timestamp / duration;
      const completed = percentage >= 0.9;
      
      const record = {
        episodeId,
        timestamp: completed ? duration : Math.floor(timestamp),
        percentage,
        completed,
        lastWatched: new Date().toISOString()
      };
      
      localStorage.setItem(`tkp_progress_${episodeId}`, JSON.stringify(record));
      
      // Update the all-progress list for the "Continue watching" feature
      const allProgressStr = localStorage.getItem('tkp_all_progress') || '[]';
      let allProgress: any[] = JSON.parse(allProgressStr);
      
      allProgress = allProgress.filter(p => p.episodeId !== episodeId);
      allProgress.push(record);
      
      localStorage.setItem('tkp_all_progress', JSON.stringify(allProgress));

      if (completed && !isCompleted) {
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
    const timer = setTimeout(() => {
      try {
        const allProgressStr = localStorage.getItem('tkp_all_progress');
        if (allProgressStr) {
          let items: any[] = JSON.parse(allProgressStr);
          // Only return not completed
          items = items.filter(i => !i.completed);
          // Sort by last watched desc
          items.sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());
          
          setProgressItems(items);
        }
      } catch (err) {
        console.error("Could not load continue watching", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return { progressItems, loading };
}
