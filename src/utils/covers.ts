export const coverModules = import.meta.glob('/src/assets/series-covers/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });

export function getSeriesCover(id: string, defaultThumbnail: string): string {
  const matched = Object.entries(coverModules)
    .filter(([path]) => {
      const filename = path.split('/').pop()?.toLowerCase() || '';
      return filename.startsWith(id.toLowerCase() + '_') || 
             filename.startsWith(id.toLowerCase() + '-') ||
             filename.split('.')[0] === id.toLowerCase();
    })
    .map(([_, url]) => url as string);
    
  if (matched.length > 0) {
    // Pick a random cover
    return matched[Math.floor(Math.random() * matched.length)];
  }
  
  return defaultThumbnail;
}
