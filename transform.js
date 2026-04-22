import fs from "fs"
import csv from "csv-parser"

const results = []

// 1. Detecciones automáticas idénticas al Prisma seed de referencia
function detectCategory(title) {
  const t = title.toLowerCase()

  if (t.includes('parashá') || t.includes('parashat') || t.includes('parsh')) return 'PARASHOT'
  if (t.includes('pesaj') || t.includes('januc') || t.includes('sucot') || t.includes('purim') || t.includes('shabat') || t.includes('abib') || t.includes('aviv')) return 'FESTIVIDADES'
  if (t.includes('cuento') || t.includes('historia')) return 'CUENTOS'

  return 'EDUCATIVO'
}

function detectSubcategory(title) {
  const t = title.toLowerCase()

  if (t.includes('pesaj') || t.includes('abib') || t.includes('aviv')) return 'Pesaj'
  if (t.includes('januc')) return 'Janucá'
  if (t.includes('sucot')) return 'Sucot'
  if (t.includes('purim')) return 'Purim'
  if (t.includes('shabat')) return 'Shabat'

  return null
}

function detectParashaNumber(title) {
  const match = title.match(/parash[aáat]\s*(\d+)/i)
  return match ? parseInt(match[1]) : null
}

fs.createReadStream("videos.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (row["Contenido"] === "Total" || !row["Contenido"]) return

    const title = row["Título del video"]
    const duration = parseInt(row["Duración"]) || 60
    const views = parseInt(row["Vistas"]) || 0
    const youtubeId = row["Contenido"].trim()
    
    const dateStr = row["Tiempo de publicación del video"]
    let publishedAt = new Date().toISOString()
    if (dateStr) {
        publishedAt = new Date(dateStr + " UTC").toISOString()
    }

    const category = detectCategory(title)
    const subcategory = detectSubcategory(title)
    const parashaNum = detectParashaNumber(title)

    let series = null

    if (category === 'PARASHOT') {
      if (parashaNum && parashaNum <= 12) series = 'bereshit'
      else if (parashaNum && parashaNum <= 23) series = 'shemot'
      else if (parashaNum && parashaNum <= 33) series = 'vayikra'
      else if (parashaNum && parashaNum <= 42) series = 'bamidbar'
      else if (parashaNum && parashaNum > 42) series = 'devarim'
      else {
        // Fallback for parashot without numbers in title but matching names
        if (title.toLowerCase().includes('beresh')) series = 'bereshit'
        else if (title.toLowerCase().includes('shemot')) series = 'shemot'
        else if (title.toLowerCase().includes('vaikra') || title.toLowerCase().includes('vayikra')) series = 'vayikra'
        else if (title.toLowerCase().includes('bamidbar')) series = 'bamidbar'
        else if (title.toLowerCase().includes('devarim')) series = 'devarim'
        else series = 'bereshit' // default
      }
    }

    if (subcategory === 'Pesaj') series = 'pesaj'
    if (subcategory === 'Janucá') series = 'januca'
    if (subcategory === 'Sucot') series = 'sucot'
    if (subcategory === 'Purim') series = 'purim'
    if (subcategory === 'Shabat') series = 'shabat'
    
    if (title.toLowerCase().includes('cuento') || title.toLowerCase().includes('historia')) {
        if (subcategory === 'Pesaj') {
             series = 'cuentos-pesaj'
        } else {
             series = 'cuentos-tradicion'
        }
    }

    const isShort = duration <= 90

    results.push({
      id: youtubeId,
      title,
      youtubeId,
      duration,
      views,
      category,
      subcategory,
      seriesId: series,
      isShort,
      parashaNum,
      publishedAt,
      featured: views > 2000,
      description: title.split('|')[0].trim(),
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    })
  })
  .on("end", () => {
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
  {
    "id": "bereshit",
    "title": "Bereshit",
    "description": "Historias del origen del mundo y los patriarcas.",
    "categoryId": "PARASHOT"
  },
  {
    "id": "shemot",
    "title": "Shemot",
    "description": "Desde la esclavitud en Egipto hasta la entrega de la Torah.",
    "categoryId": "PARASHOT"
  },
  {
    "id": "vayikra",
    "title": "Vayikra",
    "description": "Leyes, santidad y servicio en el Mishkán.",
    "categoryId": "PARASHOT"
  },
  {
    "id": "bamidbar",
    "title": "Bamidbar",
    "description": "El pueblo en el desierto lleno de lecciones.",
    "categoryId": "PARASHOT"
  },
  {
    "id": "devarim",
    "title": "Devarim",
    "description": "Los discursos finales de Moshé antes de entrar a la tierra prometida.",
    "categoryId": "PARASHOT"
  },
  {
    "id": "pesaj",
    "title": "Pesaj",
    "description": "Libertad, redención y la salida de Egipto.",
    "categoryId": "FESTIVIDADES"
  },
  {
    "id": "januca",
    "title": "Janucá",
    "description": "La luz que nunca se apaga.",
    "categoryId": "FESTIVIDADES"
  },
  {
    "id": "purim",
    "title": "Purim",
    "description": "La historia de Ester y la salvación del pueblo judío.",
    "categoryId": "FESTIVIDADES"
  },
  {
    "id": "sucot",
    "title": "Sucot",
    "description": "La festividad de las cabañas y la alegría de estar con Hashem.",
    "categoryId": "FESTIVIDADES"
  },
  {
    "id": "shavuot",
    "title": "Shavuot",
    "description": "La entrega de la Torah en el Monte Sinaí.",
    "categoryId": "FESTIVIDADES"
  },
  {
    "id": "shabat",
    "title": "Shabat",
    "description": "El día de descanso y conexión espiritual semanal.",
    "categoryId": "FESTIVIDADES"
  },
  {
    "id": "cuentos-tradicion",
    "title": "Cuentos de la Tradición",
    "description": "Historias clásicas con enseñanzas profundas del judaísmo.",
    "categoryId": "CUENTOS"
  },
  {
    "id": "cuentos-pesaj",
    "title": "Cuentos de Pesaj",
    "description": "Relatos especiales que transmiten el espíritu de Pesaj.",
    "categoryId": "CUENTOS",
    "subcategory": "Pesaj"
  }
].map(s => {
  return {
     ...s,
     thumbnail: "" 
  };
});

export const videos = ${jsonStr};

// Sort videos chronologically and add episodeNum per series
const seriesCounters = {};
videos.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()).forEach(v => {
  if (v.seriesId) {
    if (!seriesCounters[v.seriesId]) {
      seriesCounters[v.seriesId] = 0;
    }
    seriesCounters[v.seriesId]++;
    v.episodeNum = seriesCounters[v.seriesId];
  }
});

seriesData.forEach(s => {
   const firstVid = videos.find(v => v.seriesId === s.id);
   if (firstVid) {
      s.thumbnail = firstVid.thumbnail;
   } else {
      s.thumbnail = "https://images.unsplash.com/photo-1542157585-ef20bbcce178?q=80&w=2000&auto=format&fit=crop";
   }
});

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
  return videos.filter(v => v.featured).slice(0, 5); // Just some featured ones
};
`;

    fs.writeFileSync("src/data/seed.ts", output);
  });
