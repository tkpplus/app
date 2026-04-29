import { useState, useEffect } from 'react';
import { videos } from '../data/seed';

// Re-using the mock user id for the MVP
export const MOCK_USER_ID = 'local-user';

interface UseRecommendationsProps {
  episodeId?: string;
  userId?: string;
}

export function useRecommendations({ episodeId, userId }: UseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    try {
      let allVideos = [...videos];
      let targetVideo = episodeId ? allVideos.find(v => v.id === episodeId) : null;
      
      // Emulate completed logic from local storage
      const allProgressStr = localStorage.getItem('tkp_all_progress') || '[]';
      const allProgress: any[] = JSON.parse(allProgressStr);
      const completedIds = new Set(allProgress.filter(p => p.completed).map(p => p.episodeId));
      
      const scoredVideos = allVideos.map(v => {
        if (v.id === episodeId) return { video: v, score: -1 };
        if (completedIds.has(v.id)) return { video: v, score: -1 };

        let score = (v.views || 0) * 0.001;
        
        const isRecent = new Date(v.publishedAt).getTime() > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime();
        if (isRecent) score += 10;

        if (targetVideo) {
            if (targetVideo.seriesId && v.seriesId === targetVideo.seriesId) {
              score += 50; 
              if ((v as any).episodeNum === (targetVideo as any).episodeNum + 1) {
                score += 1000;
              }
            }
            if (targetVideo.category && v.category === targetVideo.category) score += 30;
            if (targetVideo.subcategory && v.subcategory === targetVideo.subcategory) score += 20;
        }

        if (v.featured) score += 5;

        return { video: v, score };
      }).filter(item => item.score >= 0);

      scoredVideos.sort((a, b) => b.score - a.score);
      setRecommendations(scoredVideos.slice(0, 20).map(i => i.video));
    } catch (e) {
      console.error("Could not load recommendations", e);
    } finally {
      setLoading(false);
    }
  }, [episodeId, userId]);

  return { recommendations, loading };
}
