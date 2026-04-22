import { useState, useEffect } from 'react';

// Re-using the mock user id for the MVP
export const MOCK_USER_ID = 'mock-user-1';

interface UseRecommendationsProps {
  episodeId?: string;
  userId?: string;
}

export function useRecommendations({ episodeId, userId }: UseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = '/api/recommendations?';
    const params = new URLSearchParams();
    if (episodeId) params.append('episodeId', episodeId);
    if (userId) params.append('userId', userId);
    
    setLoading(true);
    fetch(url + params.toString())
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecommendations(data);
        }
      })
      .catch(err => console.error("Could not load recommendations", err))
      .finally(() => setLoading(false));
  }, [episodeId, userId]);

  return { recommendations, loading };
}
