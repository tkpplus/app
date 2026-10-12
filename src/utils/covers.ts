import { getVideosBySeries } from '../data/seed';

// Helper to safely extract URL string from Vite module import or string
function resolveModuleUrl(mod: any): string {
  if (!mod) return '';
  if (typeof mod === 'string') return mod;
  if (typeof mod === 'object' && typeof mod.default === 'string') return mod.default;
  return String(mod || '');
}

// Import all files from src/assets/series-covers
export const coverModules: Record<string, any> = {
  ...((import.meta as any).glob?.('../assets/series-covers/*', { eager: true }) || {}),
  ...((import.meta as any).glob?.('/src/assets/series-covers/*', { eager: true }) || {})
};

// Find basic.jpg URL bundled asset
export const BASIC_COVER: string = (() => {
  const basicEntry = Object.entries(coverModules).find(([path]) => path.toLowerCase().includes('basic.jpg'));
  if (basicEntry) {
    const url = resolveModuleUrl(basicEntry[1]);
    if (url) return url;
  }
  return '/assets/series-covers/basic.jpg';
})();

const ID_ALIASES: Record<string, string[]> = {
  // Parashot
  bereshit: ['bereshit'],
  shemot: ['shemot'],
  vaikra: ['vaikra'],
  bamidbar: ['bamidbar'],
  devarim: ['devarim'],
  especiales: ['parashot-especiales', 'especiales', 'perashot-especiales'],
  'parashot-especiales': ['parashot-especiales', 'especiales', 'perashot-especiales'],
  'parasha-en-un-minuto': ['parashot-especiales', 'especiales', 'perashot-especiales'],

  // Festividades
  'rosh-hashana': ['rosh-hashana', 'rosh_hashana'],
  'yom-kipur': ['yom-kipur', 'yom_kipur'],
  sucot: ['sucot'],
  januca: ['januca'],
  'tu-bishvat': ['tu-bishvat', 'tu_bishvat'],
  purim: ['purim'],
  pesaj: ['pesaj'],
  'lag-baomer': ['lag-baomer', 'lag_baomer'],
  shabuot: ['shavuot', 'shabuot'],
  shavuot: ['shavuot', 'shabuot'],
  'tisha-beav': ['tisha-beav', 'tisha_beav'],
  shabat: ['shabat'],

  // Cuentos
  'cuentos-tradicion': ['cuentos-tradicion', 'cuentos_tradicion'],
  'cuentos-perasha': ['cuentos-perasha', 'cuentos-parasha', 'cuentos_perasha', 'cuentos_parasha'],
  'cuentos-jag': ['cuentos-jag', 'cuentos_jag'],
  'sipurei-pesaj': ['sipurei-pesaj', 'sipurei_pesaj'],

  // Relatos
  'relatos-avraham': ['relatos-avraham', 'relatos_avraham', 'avraham'],
};

export function getSeriesCover(id: string, defaultThumbnail?: string): string {
  if (!id) return BASIC_COVER;
  const cleanId = id.toLowerCase().trim();
  const validPrefixes = ID_ALIASES[cleanId] || [cleanId];

  // Filter coverModules for files that match validPrefixes
  const matched = Object.entries(coverModules)
    .filter(([filePath]) => {
      const filename = filePath.split('/').pop()?.toLowerCase() || '';
      if (filename === 'basic.jpg') return false;
      
      const baseName = filename.substring(0, filename.lastIndexOf('.')) || filename;
      
      return validPrefixes.some(prefix => 
        baseName === prefix || 
        baseName.startsWith(prefix + '_') || 
        baseName.startsWith(prefix + '-')
      );
    })
    .map(([_, mod]) => resolveModuleUrl(mod))
    .filter(url => Boolean(url) && url.length > 0 && !url.includes('[object Object]'));

  if (matched.length > 0) {
    // Pick a random cover from matching series-covers
    const randomIndex = Math.floor(Math.random() * matched.length);
    return matched[randomIndex];
  }

  // If defaultThumbnail is provided and is a valid web URL or asset path (not a broken /series/ link)
  if (defaultThumbnail && typeof defaultThumbnail === 'string' && !defaultThumbnail.startsWith('/series/') && !defaultThumbnail.includes('undefined')) {
    return defaultThumbnail;
  }

  // Fallback to basic.jpg
  return BASIC_COVER;
}

export function getVideoThumbnail(video: any): string {
  if (video?.thumbnail && typeof video.thumbnail === 'string' && video.thumbnail.trim() !== '' && !video.thumbnail.startsWith('/series/') && !video.thumbnail.includes('undefined')) {
    return video.thumbnail;
  }
  if (video?.seriesId) {
    const cover = getSeriesCover(video.seriesId);
    if (cover) return cover;
  }
  return BASIC_COVER;
}




