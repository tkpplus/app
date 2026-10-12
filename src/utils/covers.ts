import { getVideosBySeries } from '../data/seed';

export const coverModules = ((import.meta as any).glob?.('/src/assets/series-covers/*.{png,jpg,jpeg,webp,svg}', { eager: true, import: 'default' })) || {};

const ID_ALIASES: Record<string, string[]> = {
  shabuot: ['shabuot', 'shavuot'],
  shavuot: ['shavuot', 'shabuot'],
  especiales: ['especiales', 'parashot-especiales', 'perashot-especiales'],
  'parashot-especiales': ['parashot-especiales', 'especiales', 'perashot-especiales'],
  'cuentos-perasha': ['cuentos-perasha', 'cuentos-parasha'],
};

export function getSeriesCover(id: string, defaultThumbnail: string): string {
  if (!id) return defaultThumbnail;
  const cleanId = id.toLowerCase().trim();
  const validPrefixes = ID_ALIASES[cleanId] || [cleanId];

  const matched = Object.entries(coverModules)
    .filter(([path]) => {
      const filename = path.split('/').pop()?.toLowerCase() || '';
      return validPrefixes.some(prefix => 
        filename.startsWith(prefix + '_') || 
        filename.startsWith(prefix + '-') ||
        filename.split('.')[0] === prefix
      );
    })
    .map(([_, url]) => url as string);
    
  if (matched.length > 0) {
    // Pick a random cover from matching series-covers
    return matched[Math.floor(Math.random() * matched.length)];
  }

  // Fallback: pick a random video thumbnail from this series if available
  try {
    const seriesVideos = getVideosBySeries(id);
    if (seriesVideos && seriesVideos.length > 0) {
      const randomVid = seriesVideos[Math.floor(Math.random() * seriesVideos.length)];
      if (randomVid && randomVid.thumbnail) return randomVid.thumbnail;
    }
  } catch (e) {
    // ignore
  }

  // Check if basic.jpg is available in coverModules
  const basicCover = Object.entries(coverModules).find(([path]) => path.endsWith('/basic.jpg'));
  if (basicCover && basicCover[1]) {
    return basicCover[1] as string;
  }

  return defaultThumbnail;
}


