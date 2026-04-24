import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results = [];
const CSV_FILE = path.join(__dirname, 'videos.csv');
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'seed.ts');

let isFirst = true;

fs.createReadStream(CSV_FILE)
  .pipe(csv())
  .on("data", (data) => {
    const youtubeId = data['Contenido']?.trim();
    if (!youtubeId || youtubeId === 'Total' || isFirst) {
        if(isFirst && data['Contenido'] === 'Total') isFirst = false;
        return;
    }
    
    let originalTitle = data['Título del video']?.trim() || "";
    const publishedAt = data['Tiempo de publicación del video'] ? new Date(data['Tiempo de publicación del video']).toISOString() : new Date().toISOString();
    const durationStr = data['Duración']?.trim() || "0";
    const duration = parseInt(durationStr) || 60;
    const views = parseInt(data['Vistas'] || "0") || 0;

    let titleInfo = originalTitle;
    if (titleInfo.startsWith('"') && titleInfo.endsWith('"')) {
        titleInfo = titleInfo.slice(1, -1);
    }
    
    // Clean Title Process
    let rawTitle = titleInfo.replace(/#\S+/g, '').trim(); 
    rawTitle = rawTitle.replace(/Torah Kids Puppets\s*\|\s*/i, '');
    rawTitle = rawTitle.replace(/\s*\|\s*Torah Kids Puppets/i, '');
    rawTitle = rawTitle.replace(/\s*-?\s*Parash[aá] en un minuto\.*$/i, '');
    rawTitle = rawTitle.replace(/\s*-?\s*פרשת.*$/i, ''); 
    rawTitle = rawTitle.replace(/\s*-?\s*El Resumen de la Parashat con el Doc\s*/i, '');
    rawTitle = rawTitle.replace(/Estudiemos las Parashot\s*-?\s*/i, '');

    let finalTitle = rawTitle;
    let category = "EDUCATIVO";
    let subcategory = null;
    let series = null;
    let parashaNum = null;

    // Detect Cuentos
    if (originalTitle.toLowerCase().includes('cuentos de la tradición') || originalTitle.toLowerCase().includes('historia de')) {
       category = "CUENTOS";
       series = "cuentos-tradicion";
       finalTitle = rawTitle.split('|')[0].trim();
    } else if (originalTitle.toLowerCase().includes('cuentos de la parashá')) {
       category = "CUENTOS";
       series = "cuentos-parashot";
       finalTitle = rawTitle.split('|')[0].trim();
    } else if (originalTitle.toLowerCase().includes('sipurei pesaj')) {
       category = "CUENTOS";
       series = "sipurei-pesaj";
       finalTitle = rawTitle.split('|')[0].trim();
    } else if (originalTitle.toLowerCase().includes('cuentos del jag')) {
       category = "CUENTOS";
       series = "cuentos-jag";
       finalTitle = rawTitle.split('|')[0].trim();
    } 
    // Detect Festividades
    else if (originalTitle.toLowerCase().includes('rosh') || originalTitle.toLowerCase().includes('kipur') || originalTitle.toLowerCase().includes('sucot') || originalTitle.toLowerCase().includes('sukot') || originalTitle.toLowerCase().includes('janucá') || originalTitle.toLowerCase().includes('januca') || originalTitle.toLowerCase().includes('purim') || originalTitle.toLowerCase().includes('pesaj') || originalTitle.toLowerCase().includes('matz') || originalTitle.toLowerCase().includes('shavuot') || originalTitle.toLowerCase().includes('shabat')) {
        category = "FESTIVIDADES";
        if (originalTitle.toLowerCase().includes('rosh')) series = 'rosh-hashana';
        else if (originalTitle.toLowerCase().includes('kipur')) series = 'yom-kipur';
        else if (originalTitle.toLowerCase().includes('sucot') || originalTitle.toLowerCase().includes('sukot')) series = 'sucot';
        else if (originalTitle.toLowerCase().includes('januc')) series = 'januca';
        else if (originalTitle.toLowerCase().includes('purim')) series = 'purim';
        else if (originalTitle.toLowerCase().includes('pesaj') || originalTitle.toLowerCase().includes('matz')) {
            series = 'pesaj';
            if (rawTitle.includes('Hagadá')) {
                finalTitle = rawTitle.includes('Animada') ? "Hagadá Animada" : "Hagadá, Puppets y Matzá";
            }
        }
        else if (originalTitle.toLowerCase().includes('shavuot')) series = 'shavuot';
        else if (originalTitle.toLowerCase().includes('shabat')) series = 'shabat';
    }
    // Detect Parashot
    else if (originalTitle.toLowerCase().includes('parash') || originalTitle.toLowerCase().includes('parsh')) {
        category = "PARASHOT";
        const numMatch = originalTitle.match(/\b(\d+)\b/);
        if (numMatch) {
            parashaNum = parseInt(numMatch[1], 10);
            if (parashaNum >= 1 && parashaNum <= 12) series = 'bereshit';
            else if (parashaNum >= 13 && parashaNum <= 23) series = 'shemot';
            else if (parashaNum >= 24 && parashaNum <= 33) series = 'vayikra';
            else if (parashaNum >= 34 && parashaNum <= 43) series = 'bamidbar';
            else if (parashaNum >= 44 && parashaNum <= 54) series = 'devarim';
        } else {
            series = 'bereshit'; // default
        }
        
        const nameMatch = rawTitle.match(/Parash[aát]\s+(?:\d+\s+)?(?:-\s+)?([A-Za-zñáéíóúÁÉÍÓÚ\-' ]+)/i);
        if (nameMatch) {
           let theName = nameMatch[1].replace(/-/g, '').replace(/\|/g, '').trim();
           finalTitle = theName;
           // If it's literally just a word (like Vaigash) we append Estudio, if it's longer it might be a description
           if (finalTitle.split(' ').length <= 2) {
             finalTitle = finalTitle + " Estudio";
           }
        } else if (rawTitle.toLowerCase().includes('parsha')) {
           let parts = rawTitle.replace(/Parsha( en un minuto)? /i, '').split('|');
           finalTitle = parts[0].trim() + " Estudio";
        }
    } else {
       category = "EDUCATIVO";
       series = "todos";
    }

    const isShort = duration <= 90;

    results.push({
      id: youtubeId,
      title: finalTitle,
      youtubeId,
      duration,
      views,
      category,
      subcategory,
      seriesId: series,
      isShort,
      parashaNum,
      seasonNum: 1, 
      publishedAt,
      featured: views > 2000,
      description: finalTitle,
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    })
  })
  .on("end", () => {
    // Sort videos chronologically and add episodeNum per series
    const seriesCounters = {};
    results.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()).forEach(v => {
      if (v.seriesId) {
        if (!seriesCounters[v.seriesId]) {
          seriesCounters[v.seriesId] = 0;
        }
        seriesCounters[v.seriesId]++;
        v.episodeNum = seriesCounters[v.seriesId];
      }
    });

    const jsonStr = JSON.stringify(results, null, 2);
    const output = `// @ts-nocheck
export const characters = [
  { id: 'police', name: 'Oficial', image: '/_e21dd97e-128a-40a2-ad3b-1b15115c5453.jpeg' },
  { id: 'chef', name: 'Chef', image: '/_4e53b47c-74a9-4591-8ad2-03c6265def14.png' },
  { id: 'kippah', name: 'Niño', image: '/_ad408d6c-671e-450f-9f79-45f8f53335e9.jpeg' },
  { id: 'tie', name: 'Papá', image: '/_8edabdb4-16a7-4b77-aa9d-caaa8d3d987e.jpeg' },
  { id: 'firefighter', name: 'Bombero', image: '/_f1fd0248-cb0a-41df-9ed1-aae1fca8ee56.jpeg' },
  { id: 'princess', name: 'Niña', image: '/_37c15ee8-fa32-4416-b811-9a7da67af4ea.jpeg' },
  { id: 'bearded', name: 'Rabino', image: '/_368bc061-e0e6-42d4-a15d-85aa99017ae7.jpeg' }
];

export const seriesData = [
  { "id": "bereshit", "title": "Bereshit", "description": "Historias del origen del mundo y los patriarcas.", "categoryId": "PARASHOT" },
  { "id": "shemot", "title": "Shemot", "description": "Desde la esclavitud en Egipto hasta la entrega de la Torah.", "categoryId": "PARASHOT" },
  { "id": "vayikra", "title": "Vayikra", "description": "Leyes, santidad y servicio en el Mishkán.", "categoryId": "PARASHOT" },
  { "id": "bamidbar", "title": "Bamidbar", "description": "El pueblo en el desierto lleno de lecciones.", "categoryId": "PARASHOT" },
  { "id": "devarim", "title": "Devarim", "description": "Los discursos finales de Moshé antes de entrar a la tierra prometida.", "categoryId": "PARASHOT" },
  { "id": "rosh-hashana", "title": "Rosh Hashaná", "description": "El año nuevo judío.", "categoryId": "FESTIVIDADES" },
  { "id": "yom-kipur", "title": "Yom Kipur", "description": "El día de la expiación.", "categoryId": "FESTIVIDADES" },
  { "id": "sucot", "title": "Sucot", "description": "La festividad de las cabañas.", "categoryId": "FESTIVIDADES" },
  { "id": "januca", "title": "Janucá", "description": "La luz que nunca se apaga.", "categoryId": "FESTIVIDADES" },
  { "id": "tu-bishvat", "title": "Tu Bishvat", "description": "El año nuevo de los árboles.", "categoryId": "FESTIVIDADES" },
  { "id": "purim", "title": "Purim", "description": "La historia de Ester y la salvación.", "categoryId": "FESTIVIDADES" },
  { "id": "pesaj", "title": "Pesaj", "description": "Libertad y redención en Egipto.", "categoryId": "FESTIVIDADES" },
  { "id": "lag-baomer", "title": "Lag Baomer", "description": "Celebrando las enseñanzas místicas.", "categoryId": "FESTIVIDADES" },
  { "id": "shavuot", "title": "Shavuot", "description": "La entrega de la Torah.", "categoryId": "FESTIVIDADES" },
  { "id": "tisha-b-av", "title": "Tisha B'Av", "description": "Recordando la historia.", "categoryId": "FESTIVIDADES" },
  { "id": "shabat", "title": "Shabat", "description": "El día de descanso semanal.", "categoryId": "FESTIVIDADES" },
  { "id": "cuentos-jag", "title": "Cuentos del Jag", "description": "Historias especiales de nuestras festividades.", "categoryId": "CUENTOS" },
  { "id": "cuentos-tradicion", "title": "Cuentos de la Tradición", "description": "Historias clásicas con enseñanzas profundas.", "categoryId": "CUENTOS" },
  { "id": "cuentos-parashot", "title": "Cuentos de las Parashot", "description": "Relatos de enseñanza semanal.", "categoryId": "CUENTOS" },
  { "id": "sipurei-pesaj", "title": "Sipurei Pesaj", "description": "Todo sobre la salida de Egipto.", "categoryId": "CUENTOS" },
  { "id": "todos", "title": "General", "description": "Todo sobre Torah Kids Puppets.", "categoryId": "EDUCATIVO"}
].map(s => {
  return {
     ...s,
     thumbnail: \`/series/\${s.id}.jpg\`
  };
});

export const videos = ${jsonStr};

export function getSeriesByCategory(categoryId) {
  return seriesData.filter(s => s.categoryId === categoryId);
}

export function getSeriesById(seriesId) {
  return seriesData.find(s => s.id === seriesId);
}

export const getVideosBySeries = (seriesId) => {
  return videos.filter(v => v.seriesId === seriesId);
};

export const getVideoById = (id) => {
  if (!id) return null;
  return videos.find(v => v.id === id) || videos.find(v => v.youtubeId === id);
};

export const getShortVideos = () => {
  const shorts = videos.filter(v => v.isShort);
  return shorts.sort(() => Math.random() - 0.5);
};

export const getFeaturedVideos = () => {
  return videos.filter(v => v.featured).slice(0, 5);
};
`;

    fs.writeFileSync(OUTPUT_FILE, output);
    console.log("seed.ts generated successfully");
  });
