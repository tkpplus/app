import { videos } from './src/data/seed.ts';
videos.forEach(v => console.log(v.id + ' | ' + v.title + (v.seriesId ? ' | ' + v.seriesId : '')));
