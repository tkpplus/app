import fs from 'fs';

let seedContent = fs.readFileSync('src/data/seed.ts', 'utf8');

let videosMatch = seedContent.match(/export const videos = (\[[\s\S]*?\]);/);
let charactersMatch = seedContent.match(/export const characters = (\[[\s\S]*?\]);/);
let seriesDataMatch = seedContent.match(/export const seriesData = (\[[\s\S]*?\]);/);

if (videosMatch) {
    let characters = eval(charactersMatch[1]);
    let seriesData = eval(seriesDataMatch[1]);
    let videos = eval(videosMatch[1]);
    
    // Ensure parasha-en-un-minuto exists
    if (!seriesData.find(s => s.id === 'parasha-en-un-minuto')) {
        seriesData.push({
            id: 'parasha-en-un-minuto',
            title: 'Parashá en un minuto',
            description: 'Aprende la Parashá semanal en solo un minuto.',
            categoryId: 'PARASHOT',
            thumbnail: '/series/especiales.jpg'
        });
    }
    
    // Process videos based on transform.js rules
    videos = videos.map(v => {
        let titleInfo = v.title;
        let isMinutoOrig = false;

        if (titleInfo.startsWith('"') && titleInfo.endsWith('"')) {
            titleInfo = titleInfo.slice(1, -1);
        }
        
        let oldTitle = titleInfo;
        
        // Clean Title Process from transform.js
        let rawTitle = titleInfo.replace(/#\S+/g, '').trim(); 
        rawTitle = rawTitle.replace(/Torah Kids Puppets\s*\|\s*/i, '');
        rawTitle = rawTitle.replace(/\s*\|\s*Torah Kids Puppets/i, '');
        
        if (/\s*-?\s*Parash[aá] en un minuto\.*$/i.test(rawTitle)) {
           isMinutoOrig = true;
        }
        
        rawTitle = rawTitle.replace(/\s*-?\s*Parash[aá] en un minuto\.*$/i, '');
        rawTitle = rawTitle.replace(/\s*-?\s*פרשת.*$/i, ''); 
        rawTitle = rawTitle.replace(/\s*-?\s*El Resumen de la Parashat con el Doc\s*/i, '');
        rawTitle = rawTitle.replace(/Estudiemos las Parashot\s*-?\s*/i, '');
        
        let finalTitle = rawTitle;
        
        const nameMatch = rawTitle.match(/Parash[aát]\s+(?:\d+\s+)?(?:-\s+)?([A-Za-zñáéíóúÁÉÍÓÚ\-' ]+)/i);
        if (nameMatch && (v.category === 'PARASHOT' && !v.isShort)) {
           let theName = nameMatch[1].replace(/-/g, '').replace(/\|/g, '').trim();
           finalTitle = theName;
           if (finalTitle.split(' ').length <= 2) {
             finalTitle = finalTitle + " Estudio";
           }
        } else if (rawTitle.toLowerCase().includes('parsha') && !v.isShort) {
           let parts = rawTitle.replace(/Parsha( en un minuto)? /i, '').split('|');
           finalTitle = parts[0].trim() + " Estudio";
        }
        
        v.title = finalTitle || oldTitle; // Fallback

        // Check if it's the "Parasha en un minuto" series
        let isMinuto = isMinutoOrig || 
                       /Parash[at\u00E1a]+\s+\d+/i.test(oldTitle) || 
                       /un minuto/i.test(oldTitle) || 
                       /Parsha en un minuto/i.test(oldTitle);
        
        if (isMinuto) {
            v.seriesId = 'parasha-en-un-minuto';
            v.category = 'PARASHOT';
            v.isShort = true;
            v.title = oldTitle.replace(/#\S+/g, '').replace(/Torah Kids Puppets\s*\|\s*/i, '').trim(); // Don't strip too much for shorts if they lose context
        }
        
        return v;
    });
    
    const newSeedContent = `// @ts-nocheck
export const characters = ${JSON.stringify(characters, null, 2)};

export const seriesData = ${JSON.stringify(seriesData, null, 2)};

export const videos = ${JSON.stringify(videos, null, 2)};

export const getSeriesByCategory = (categoryId: string) => {
  return seriesData.filter(s => s.categoryId === categoryId);
};

export const getVideoById = (id: string | null) => {
  if (!id) return null;
  return videos.find(v => v.id === id) || null;
};

export const getFeaturedVideos = () => {
  return videos.filter(v => v.featured).slice(0, 5);
};
`;

    fs.writeFileSync('src/data/seed.ts', newSeedContent);
    console.log("Updated seed data successfully!");
}
