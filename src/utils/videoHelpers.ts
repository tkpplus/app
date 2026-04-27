export const is4KVideo = (video: any) => {
  if (!video) return false;
  // Series
  const series4k = ['cuentos-jag', 'cuentos-perasha', 'sipurei-pesaj'];
  if (video.seriesId && series4k.includes(video.seriesId)) {
    return true;
  }
  
  // Titles
  const title = (video.title || '').toLowerCase();
  if (title.includes('hagadá, puppets y matzá') || 
      title.includes('pesaj puppets y matza') || 
      title.includes('hagada de pesaj') ||
      title.includes('hagadá de pesaj')) {
    return true;
  }
  
  return false;
};
