/// <reference types="vite/client" />
import { getVideosBySeries } from '../data/seed';

export const coverModules = import.meta.glob('/src/assets/series-covers/*.{png,jpg,jpeg,webp,svg}', { eager: true, import: 'default' }) as Record<string, string>;

// Mapping of series IDs to possible cover filename prefixes or aliases
const ID_ALIASES: Record<string, string[]> = {
  'especiales': ['parashot-especiales', 'especiales', 'basic'],
  'parashot-especiales': ['parashot-especiales', 'especiales'],
  'parasha-en-un-minuto': ['parashot-especiales', 'especiales', 'basic'],
  'shabuot': ['shavuot', 'shabuot'],
  'shavuot': ['shavuot', 'shabuot'],
  'shabat': ['shabat', 'basic'],
  'vayikra': ['vaikra', 'vayikra'],
  'vaikra': ['vaikra', 'vayikra'],
  'sucot': ['sucot', 'sukot'],
  'sukot': ['sucot', 'sukot'],
  'tisha-beav': ['tisha-beav', 'tisha-b-av'],
  'tisha-b-av': ['tisha-beav', 'tisha-b-av'],
  'cuentos-parashot': ['cuentos-perasha', 'cuentos-perasha'],
  'cuentos-perasha': ['cuentos-perasha'],
};

export function getSeriesCover(id: string, defaultThumbnail: string): string {
  if (!id) return defaultThumbnail;
  const cleanId = id.toLowerCase().trim();

  // Get aliases for this ID or use cleanId itself
  const aliases = ID_ALIASES[cleanId] || [cleanId];

  const matchedSet = new Set<string>();

  Object.entries(coverModules).forEach(([path, url]) => {
    const filename = path.split('/').pop()?.toLowerCase() || '';
    const nameWithoutExt = filename.split('.')[0];

    for (const alias of aliases) {
      if (
        filename.startsWith(alias + '_') ||
        filename.startsWith(alias + '-') ||
        nameWithoutExt === alias
      ) {
        matchedSet.add(url);
        break;
      }
    }
  });

  const matched = Array.from(matchedSet);

  if (matched.length > 0) {
    // Pick a random cover from matching series covers
    return matched[Math.floor(Math.random() * matched.length)];
  }

  // Fallback: if basic cover exists, try it or a random video thumbnail
  const basicCoverEntry = Object.entries(coverModules).find(([path]) =>
    path.toLowerCase().includes('basic.')
  );
  if (basicCoverEntry) {
    return basicCoverEntry[1];
  }

  try {
    const seriesVideos = getVideosBySeries(id);
    if (seriesVideos && seriesVideos.length > 0) {
      const randomVid = seriesVideos[Math.floor(Math.random() * seriesVideos.length)];
      if (randomVid && randomVid.thumbnail) return randomVid.thumbnail;
    }
  } catch (e) {
    // ignore
  }

  return defaultThumbnail;
}
