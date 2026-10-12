function resolveModuleUrl(mod: unknown): string {
  if (!mod) return '';
  if (typeof mod === 'string') return mod;
  if (typeof mod === 'object' && mod !== null && 'default' in mod && typeof (mod as { default?: string }).default === 'string') {
    return (mod as { default: string }).default;
  }
  return String(mod ?? '');
}

// Vite asset import map for src/assets/series-covers.
// We intentionally import every file under the folder and normalize names later,
// because the filenames are mixed-case and include underscores/number suffixes.
export const coverModules: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/series-covers/*', { eager: true, import: 'default' })).map(([key, value]) => [key, resolveModuleUrl(value)])
) as Record<string, string>;

function normalizeCoverName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim();
}

export const BASIC_COVER: string =
  Object.entries(coverModules).find(([filePath]) => /basic\.(jpg|jpeg|png)$/i.test(filePath))?.[1] ??
  '/assets/series-covers/basic.jpg';

const ID_ALIASES: Record<string, string[]> = {
  bereshit: ['bereshit'],
  shemot: ['shemot'],
  vaikra: ['vaikra'],
  bamidbar: ['bamidbar'],
  devarim: ['devarim'],
  especiales: ['parashot-especiales', 'especiales'],
  'parashot-especiales': ['parashot-especiales', 'especiales'],
  'parasha-en-un-minuto': ['parashot-especiales', 'especiales'],

  'rosh-hashana': ['rosh-hashana'],
  'yom-kipur': ['yom-kipur'],
  sucot: ['sucot'],
  januca: ['januca'],
  'tu-bishvat': ['tu-bishvat'],
  purim: ['purim'],
  pesaj: ['pesaj'],
  'lag-baomer': ['lag-baomer'],
  shabuot: ['shavuot', 'shabuot'],
  shavuot: ['shavuot', 'shabuot'],
  'tisha-beav': ['tisha-beav'],
  shabat: ['shabat'],

  'cuentos-tradicion': ['cuentos-tradicion'],
  'cuentos-perasha': ['cuentos-perasha', 'cuentos-parasha'],
  'cuentos-jag': ['cuentos-jag'],
  'sipurei-pesaj': ['sipurei-pesaj'],

  'relatos-avraham': ['relatos-avraham'],
};

export function getSeriesCover(id: string, defaultThumbnail?: string): string {
  if (!id) return BASIC_COVER;

  const cleanId = id.toLowerCase().trim();
  const validPrefixes = ID_ALIASES[cleanId] || [cleanId];
  const normalizedPrefixes = validPrefixes.map(normalizeCoverName);

  const matched = Array.from(
    new Set(
      Object.entries(coverModules)
        .filter(([filePath]) => {
          const filename = filePath.split('/').pop() ?? '';
          if (/basic\.(jpg|jpeg|png)$/i.test(filename)) return false;

          const baseName = normalizeCoverName(filename);
          return normalizedPrefixes.some(prefix =>
            baseName === prefix ||
            baseName.startsWith(`${prefix}-`) ||
            baseName.startsWith(`${prefix}_`)
          );
        })
        .map(([, mod]) => mod)
        .filter(Boolean)
    )
  );

  if (matched.length > 0) {
    const storageKey = `series_cover_persisted_${cleanId}`;

    if (typeof window !== 'undefined') {
      try {
        const savedSession = window.sessionStorage?.getItem(storageKey);
        if (savedSession && matched.includes(savedSession)) return savedSession;

        const savedLocal = window.localStorage?.getItem(storageKey);
        if (savedLocal && matched.includes(savedLocal)) return savedLocal;
      } catch {
        // ignore storage access issues
      }
    }

    const selectedCover = matched[Math.floor(Math.random() * matched.length)];

    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage?.setItem(storageKey, selectedCover);
        window.localStorage?.setItem(storageKey, selectedCover);
      } catch {
        // ignore storage access issues
      }
    }

    return selectedCover;
  }

  if (defaultThumbnail && typeof defaultThumbnail === 'string' && !defaultThumbnail.startsWith('/series/') && !defaultThumbnail.includes('undefined')) {
    return defaultThumbnail;
  }

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
