import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newCharacters = `export const characters = [
  { id: 'police', name: 'Oficial', image: '/_e21dd97e-128a-40a2-ad3b-1b15115c5453.jpeg' },
  { id: 'chef', name: 'Chef', image: '/_4e53b47c-74a9-4591-8ad2-03c6265def14.png' },
  { id: 'kippah', name: 'Niño', image: '/_ad408d6c-671e-450f-9f79-45f8f53335e9.jpeg' },
  { id: 'tie', name: 'Papá', image: '/_8edabdb4-16a7-4b77-aa9d-caaa8d3d987e.jpeg' },
  { id: 'firefighter', name: 'Bombero', image: '/_f1fd0248-cb0a-41df-9ed1-aae1fca8ee56.jpeg' },
  { id: 'princess', name: 'Niña', image: '/_37c15ee8-fa32-4416-b811-9a7da67af4ea.jpeg' },
  { id: 'bearded', name: 'Rabino', image: '/_368bc061-e0e6-42d4-a15d-85aa99017ae7.jpeg' }
];`;

const seriesList = [
  // SECTION – PARASHOT
  { id: 'bereshit', title: 'Bereshit', description: 'Génesis - Historias del origen y los patriarcas.', categoryId: 'PARASHOT' },
  { id: 'shemot', title: 'Shemot', description: 'Éxodo - Desde la esclavitud en Egipto hasta la entrega de la Torah.', categoryId: 'PARASHOT' },
  { id: 'vaikra', title: 'Vaikra', description: 'Levítico - Leyes, santidad y servicio en el Mishkán.', categoryId: 'PARASHOT' },
  { id: 'bamidbar', title: 'Bamidbar', description: 'Números - El pueblo en el desierto.', categoryId: 'PARASHOT' },
  { id: 'devarim', title: 'Devarim', description: 'Deuteronomio - Los discursos finales de Moshé.', categoryId: 'PARASHOT' },
  { id: 'especiales', title: 'Especiales', description: 'Parashot especiales y Shabatot.', categoryId: 'PARASHOT' },
  
  // SECTION – FESTIVIDADES
  { id: 'rosh-hashana', title: 'Rosh Hashaná', description: 'El año nuevo judío.', categoryId: 'FESTIVIDADES' },
  { id: 'yom-kipur', title: 'Yom Kipur', description: 'El día del perdón.', categoryId: 'FESTIVIDADES' },
  { id: 'sucot', title: 'Sucot', description: 'La fiesta de las cabañas.', categoryId: 'FESTIVIDADES' },
  { id: 'januca', title: 'Janucá', description: 'La fiesta de las luminarias.', categoryId: 'FESTIVIDADES' },
  { id: 'tu-bishvat', title: 'Tu Bishvat', description: 'El año nuevo de los árboles.', categoryId: 'FESTIVIDADES' },
  { id: 'purim', title: 'Purim', description: 'La salvación en Persia.', categoryId: 'FESTIVIDADES' },
  { id: 'pesaj', title: 'Pesaj', description: 'La salida de Egipto y la libertad.', categoryId: 'FESTIVIDADES' },
  { id: 'lag-baomer', title: 'Lag Baomer', description: 'La alegría de la Torá oral.', categoryId: 'FESTIVIDADES' },
  { id: 'shabuot', title: 'Shabuot', description: 'La entrega de la Torá.', categoryId: 'FESTIVIDADES' },
  { id: 'tisha-beav', title: 'Tisha Beav', description: 'Día de duelo y esperanza.', categoryId: 'FESTIVIDADES' },
  { id: 'shabat', title: 'Shabat', description: 'El día más especial de la semana.', categoryId: 'FESTIVIDADES' },

  // SECTION – CUENTOS
  { id: 'cuentos-tradicion', title: 'Cuentos de la Tradición', description: 'David el pastor, tesoros de pureza, todo es para bien.', categoryId: 'CUENTOS' },
  { id: 'cuentos-perasha', title: 'Cuentos de la Parashá', description: 'Relatos sobre la porción semanal.', categoryId: 'CUENTOS' },
  { id: 'cuentos-jag', title: 'Cuentos del Jag', description: 'Relatos para vivir las fiestas.', categoryId: 'CUENTOS' },
  { id: 'sipurei-pesaj', title: 'Sipurei Pesaj', description: 'Relatos milagrosos de la liberación de Egipto.', categoryId: 'CUENTOS' }
];

const videosList = [
  // PARASHOT - BERESHIT
  { vId: '8rAPAkIKRHE', t: 'Parashat Bereshit Estudiemos', cat: 'PARASHOT', sId: 'bereshit', ep: 1 },
  { vId: 'bUu2W_fGqo8', t: 'Resumen Bereshit con el Doc', cat: 'PARASHOT', sId: 'bereshit', ep: 2 },
  { vId: 'sMd0opDs2Ss', t: 'Parashat Nóaj Estudiemos', cat: 'PARASHOT', sId: 'bereshit', ep: 3 },
  { vId: '6YoVDp5Jeqs', t: 'Resumen Nóaj con el Doc', cat: 'PARASHOT', sId: 'bereshit', ep: 4 },
  { vId: 've0VT8f00fY', t: 'Parashat Lej Lejá Estudiemos', cat: 'PARASHOT', sId: 'bereshit', ep: 5 },
  { vId: '--Z6J-rIgrk', t: 'Parashat Vaierá Estudiemos', cat: 'PARASHOT', sId: 'bereshit', ep: 6 },
  { vId: 'zkBk1z0u5-Q', t: 'Parashat Jaié Saráh Estudiemos', cat: 'PARASHOT', sId: 'bereshit', ep: 7 },
  { vId: '5GJFMWdIGbo', t: 'Parashat Toldot', cat: 'PARASHOT', sId: 'bereshit', ep: 8 },
  { vId: 'biWskHeVKpU', t: 'Parashat Vaietzé', cat: 'PARASHOT', sId: 'bereshit', ep: 9 },
  { vId: 'GOfB9q9vb_8', t: 'Parashat Vaishlaj', cat: 'PARASHOT', sId: 'bereshit', ep: 10 },
  { vId: 'LeF_n_OXbNo', t: 'Parashat Vaieshev', cat: 'PARASHOT', sId: 'bereshit', ep: 11 },
  { vId: 'C3NQV3plamY', t: 'Parashat Miketz', cat: 'PARASHOT', sId: 'bereshit', ep: 12 },
  { vId: 'VfLg8ivtdFU', t: 'Parashat Vaigash', cat: 'PARASHOT', sId: 'bereshit', ep: 13 },
  { vId: 'WsR2TAyVZoY', t: 'Parashat Vaiejí', cat: 'PARASHOT', sId: 'bereshit', ep: 14 },

  // PARASHOT - SHEMOT
  { vId: 'wWVrrqyVRls', t: 'Parashat Shemot', cat: 'PARASHOT', sId: 'shemot', ep: 1 },
  { vId: 'r7fX55dNlqc', t: 'Parashat Vaerá', cat: 'PARASHOT', sId: 'shemot', ep: 2 },
  { vId: 'FAgIYC7KhpU', t: 'Parashat Bo', cat: 'PARASHOT', sId: 'shemot', ep: 3 },
  { vId: 'AwKQLzKyW5s', t: 'Parashat Beshalaj', cat: 'PARASHOT', sId: 'shemot', ep: 4 },
  { vId: 'sHnaggaoroY', t: 'Parashat Itró', cat: 'PARASHOT', sId: 'shemot', ep: 5 },
  { vId: '8UBu-rCS5sA', t: 'Parashat Mishpatim', cat: 'PARASHOT', sId: 'shemot', ep: 6 },
  { vId: 'VdY9Giv2laY', t: 'Parashat Terumáh', cat: 'PARASHOT', sId: 'shemot', ep: 7 },
  { vId: 'g2akTy5BB0Q', t: 'Parashat Tetzavé', cat: 'PARASHOT', sId: 'shemot', ep: 8 },
  { vId: 'Bd4lU_MYILU', t: 'Parashat Ki Tisá', cat: 'PARASHOT', sId: 'shemot', ep: 9 },
  { vId: 'DfeuzcRBfto', t: 'Parashat Vayakel', cat: 'PARASHOT', sId: 'shemot', ep: 10 },
  { vId: 'yk8hXQzolOM', t: 'Parashat Pekudéi', cat: 'PARASHOT', sId: 'shemot', ep: 11 },

  // PARASHOT - VAIKRA
  { vId: 'NwwUrSSDRvQ', t: 'Parashat Vaikrá', cat: 'PARASHOT', sId: 'vaikra', ep: 1 },
  { vId: '1mDsNbou-Eg', t: 'Parashat Tzav', cat: 'PARASHOT', sId: 'vaikra', ep: 2 },
  { vId: '9Nhcw27C7fU', t: 'Parashat Sheminí', cat: 'PARASHOT', sId: 'vaikra', ep: 3 },
  { vId: 'cUGfwEKJB_w', t: 'Parashat Tazría-Metzorá', cat: 'PARASHOT', sId: 'vaikra', ep: 4 },
  { vId: '-ORflM1R4H4', t: 'Parashat Tazria', cat: 'PARASHOT', sId: 'vaikra', ep: 5 },
  { vId: '7LN0uQYABmU', t: 'Parashat Metzora', cat: 'PARASHOT', sId: 'vaikra', ep: 6 },

  // PARASHOT - ESPECIALES (Includes the 4 specific shorts from Parashot Especiales)
  { vId: 'IhFRnooopPo', t: 'Parsha HaJodesh', cat: 'PARASHOT', sId: 'especiales', ep: 1 },
  { vId: '1XCQgq6Eouo', t: 'Perashá especial Parshá HaJodesh', cat: 'PARASHOT', sId: 'especiales', ep: 2 },
  { vId: 'ZwxOaHvYZ1Y', t: 'Parsha Pará', cat: 'PARASHOT', sId: 'especiales', ep: 3 },
  { vId: 'J_h86yuU4Vo', t: 'Parsha Pará 2', cat: 'PARASHOT', sId: 'especiales', ep: 4 },
  { vId: 'hccDm7RF-Ls', t: 'Shabat Shekalim', cat: 'PARASHOT', sId: 'especiales', ep: 5 },
  { vId: 'SlWuko2q-Y0', t: 'Shabat Shekalim 2', cat: 'PARASHOT', sId: 'especiales', ep: 6 },
  { vId: 'Yja7jteJ3d4', t: 'Shabat Zajor', cat: 'PARASHOT', sId: 'especiales', ep: 7 },
  { vId: 'LWITMNQEWTo', t: 'Shabat Zajor 2', cat: 'PARASHOT', sId: 'especiales', ep: 8 },

  // FESTIVIDADES - JANUCA
  { vId: '5wE1ZTeTOIU', t: '¡La Chispa de Janucá!', cat: 'FESTIVIDADES', sId: 'januca', ep: 1 },
  { vId: 'vS3C7F1Okm4', t: 'Benny Has a Little Dreidel', cat: 'FESTIVIDADES', sId: 'januca', ep: 2 },
  { vId: 'rP9CG-5NV1o', t: 'El Milagroso Aceite de Janucá', cat: 'FESTIVIDADES', sId: 'januca', ep: 3 },

  // FESTIVIDADES - PESAJ
  { vId: 'Defyt5gOBQo', t: 'Hagadá, Puppets y Matzá', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 1 },
  { vId: 'NeQJdLIVj0A', t: 'Matzah ¿Qué es el Matzah?', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 2 },

  // FESTIVIDADES - SHABAT
  { vId: 'ndf9CmDBHWY', t: 'Yosef y el Shabat', cat: 'FESTIVIDADES', sId: 'shabat', ep: 1 },

  // CUENTOS - TRADICION
  { vId: 'uQdfLlJ98IQ', t: 'Tesoros de Pureza', cat: 'CUENTOS', sId: 'cuentos-tradicion', ep: 1 },
  { vId: 'pIgwPuIPzPQ', t: 'David, el Buen Pastor', cat: 'CUENTOS', sId: 'cuentos-tradicion', ep: 2 },
  { vId: 'ntU9gSXIU9w', t: 'Todo es para bien', cat: 'CUENTOS', sId: 'cuentos-tradicion', ep: 3 },

  // CUENTOS - PERASHA
  { vId: 'nvzRK0GQZgk', t: '¿Qué hacía un Rebe en un Casino de París?', cat: 'CUENTOS', sId: 'cuentos-perasha', ep: 1 },
  { vId: 'h10wQ1V3yt0', t: 'Un cuento que enciende el corazón', cat: 'CUENTOS', sId: 'cuentos-perasha', ep: 2 },
  { vId: 'NLB8leKLO4k', t: '¿Etrog o Caballo?', cat: 'CUENTOS', sId: 'cuentos-perasha', ep: 3 },
  { vId: 'MIhXjY5Fo7c', t: '¿Noaj fue egoísta?', cat: 'CUENTOS', sId: 'cuentos-perasha', ep: 4 },
  { vId: 'cqd6YZU86nM', t: '¿Por qué el Rabino NO quiso rezar?', cat: 'CUENTOS', sId: 'cuentos-perasha', ep: 5 },
  { vId: 'Koao7Pp7CwI', t: 'Un Experto', cat: 'CUENTOS', sId: 'cuentos-perasha', ep: 6 },

  // CUENTOS - JAG
  { vId: '0Fx9rKWegsc', t: '¿Por qué salir de Egipto NO fue el final?', cat: 'CUENTOS', sId: 'cuentos-jag', ep: 1 },

  // CUENTOS - SIPUREI PESAJ
  { vId: 'aTa3lcWLwQ0', t: '¿Cómo empezó la esclavitud?', cat: 'CUENTOS', sId: 'sipurei-pesaj', ep: 1 },
  { vId: 'EuWL4xrCQy0', t: '¿Cómo una niña de 3 años salvó al pueblo judío?', cat: 'CUENTOS', sId: 'sipurei-pesaj', ep: 2 },
  { vId: 'FnzQmTU-2jU', t: '¿Por qué Moshé no podía hablar bien?', cat: 'CUENTOS', sId: 'sipurei-pesaj', ep: 3 },
  { vId: 'RzqvBDyrt2g', t: '¡La espada de Faraón se ROMPIÓ!', cat: 'CUENTOS', sId: 'sipurei-pesaj', ep: 4 },

  // SHORTS
  { vId: 'XCP6sLsrT6Q', t: 'Parashá 1 Bereshit - un minuto', cat: 'SHORTS', isShort: true },
  { vId: 'oLAULPrPEj8', t: 'Parashá 2 Noaj - un minuto', cat: 'SHORTS', isShort: true },
  { vId: 'hh4ppg7E5yI', t: 'Parashat 3 Lej Lejá - un minuto', cat: 'SHORTS', isShort: true },
  { vId: 'oGBrpfV6Wug', t: 'Parashá 4 Vaierá - un minuto', cat: 'SHORTS', isShort: true },
  { vId: 'msarrAETqGI', t: 'Parashá 5 Jaié Sará', cat: 'SHORTS', isShort: true },
  { vId: '-wxWR4UiXXI', t: 'Parashá 6 Toldot', cat: 'SHORTS', isShort: true },
  { vId: 'Olinh9ZgvYk', t: 'Parashá 7 Vaietzé', cat: 'SHORTS', isShort: true },
  { vId: 'pow5BUl1A5M', t: 'Parashá 8 Vaishlaj', cat: 'SHORTS', isShort: true },
  { vId: 'mNPB8ICD0i8', t: 'Parashá 9 Vaieshev', cat: 'SHORTS', isShort: true },
  { vId: 'upcJnnNbcO8', t: 'Parashá 10 Miketz', cat: 'SHORTS', isShort: true },
  { vId: 'w4GK3pplW_Y', t: 'Parashá 11 Vaigash', cat: 'SHORTS', isShort: true },
  { vId: 'p4gsg2bZ3jo', t: 'Parashá 12 Vaiejí', cat: 'SHORTS', isShort: true },
  { vId: '0ZJUre6RjiY', t: 'Parashat 13 Shemot', cat: 'SHORTS', isShort: true },
  { vId: 'SDqAXlAfFj4', t: 'Parashat 14 Vaera', cat: 'SHORTS', isShort: true },
  { vId: 'IFzPSegUYO4', t: 'Parsha en un minuto 15 Bo', cat: 'SHORTS', isShort: true },
  { vId: 'tWHKCkFBjvE', t: 'Parsha en un minuto 16 Beshalaj', cat: 'SHORTS', isShort: true },
  { vId: '1ieTbEKPlRs', t: 'Parsha en un minuto 17 Itró', cat: 'SHORTS', isShort: true },
  { vId: 'SOdBWtfb2hE', t: 'Parsha en un minuto 18 Mishapatim', cat: 'SHORTS', isShort: true },
  { vId: '3qsxRzFfggg', t: 'Parsha en un minuto 19 Terumah', cat: 'SHORTS', isShort: true },
  { vId: 'X6Y4-b4CG4M', t: 'Parsha en un minuto 20 Tetzaveh', cat: 'SHORTS', isShort: true },
  { vId: 'pNfv65TyKDY', t: 'Parsha en un minuto 21 Ki tisa', cat: 'SHORTS', isShort: true },
  { vId: 'hyr1-ef09HM', t: 'Parsha en un minuto 22 Vayakel', cat: 'SHORTS', isShort: true },
  { vId: 'rqyeTYOTRFM', t: 'Parsha en un minuto 23 Pekudei', cat: 'SHORTS', isShort: true },
  { vId: 'EC-Nnceu_ms', t: 'Parsha en un minuto 24 Vaikra', cat: 'SHORTS', isShort: true },
  { vId: 'uhGShtqf3l0', t: 'Parsha en un minuto 25 Tzav', cat: 'SHORTS', isShort: true },
  { vId: 'M4RI6h5RxyY', t: 'Parsha en un minuto 26 Sheminí', cat: 'SHORTS', isShort: true },
  { vId: 'MwNi34vieEQ', t: 'Parsha en un minuto 26 Sheminí resubido', cat: 'SHORTS', isShort: true },
  { vId: 'u5Xln4-oUMw', t: 'El Increíble Anuncio a Abraham', cat: 'SHORTS', isShort: true },
  { vId: '7kJmFPyS5xk', t: 'Jag Sukot Sameaj', cat: 'SHORTS', isShort: true },
  { vId: 'jmtF9wiiqso', t: 'Sukkot Chistosadas', cat: 'SHORTS', isShort: true },
  { vId: 'IlGe5gPb-ss', t: 'La promesa de Di-s a Abraham', cat: 'SHORTS', isShort: true },
  { vId: 'YHOHnafmPOg', t: 'La prueba de Fe: Akedat Izjak', cat: 'SHORTS', isShort: true },
  { vId: '2tNGQiZqfdQ', t: 'La sorprendente Historia de Noah', cat: 'SHORTS', isShort: true },
  { vId: 'BXHfjgtmiic', t: 'El pacto entre las partes', cat: 'SHORTS', isShort: true },
  { vId: 's4k_OBr2-aY', t: 'La travesía de Eliezer', cat: 'SHORTS', isShort: true },
  { vId: 'EmSOWR29G9w', t: 'La Historia de Abraham', cat: 'SHORTS', isShort: true },
  { vId: 'JgeYD242mdA', t: 'La Triste historia de Sarah en Hebron', cat: 'SHORTS', isShort: true }
];

const videosSource = videosList.map((v) => {
  let isShort = !!v.isShort;
  let sId = v.sId ? `"${v.sId}"` : "null";
  let epNum = isShort ? "null" : (v.ep || "null");
  return `  {
    "id": "${v.vId}",
    "title": "${v.t}",
    "youtubeId": "${v.vId}",
    "duration": 500,
    "views": ${Math.floor(Math.random() * 1000)},
    "category": "${v.cat}",
    "subcategory": null,
    "seriesId": ${sId},
    "isShort": ${isShort},
    "parashaNum": null,
    "seasonNum": 1,
    "publishedAt": "2023-01-01T00:00:00.000Z",
    "featured": false,
    "description": "${v.t}",
    "thumbnail": "https://img.youtube.com/vi/${v.vId}/maxresdefault.jpg",
    "episodeNum": ${epNum}
  }`;
});

const seriesSource = seriesList.map(s => {
  return "  { \"id\": \"" + s.id + "\", \"title\": \"" + s.title + "\", \"description\": \"" + s.description + "\", \"categoryId\": \"" + s.categoryId + "\", \"thumbnail\": \"/series/" + s.id + ".jpg\" }";
});

const fileContent = "// @ts-nocheck\n" + newCharacters + "\n\nexport const seriesData = [\n" + seriesSource.join(',\n') + "\n];\n\nexport const videos = [\n" + videosSource.join(',\n') + "\n];\n\nexport function getSeriesByCategory(categoryId) {\n  return seriesData.filter(s => s.categoryId === categoryId);\n}\n\nexport function getSeriesById(seriesId) {\n  return seriesData.find(s => s.id === seriesId);\n}\n\nexport const getVideosBySeries = (seriesId) => {\n  return videos.filter(v => v.seriesId === seriesId);\n};\n\nexport const getVideoById = (id) => {\n  if (!id) return null;\n  return videos.find(v => v.id === id) || videos.find(v => v.youtubeId === id);\n};\n\nexport const getShortVideos = () => {\n  const shorts = videos.filter(v => v.isShort);\n  return shorts.sort(() => Math.random() - 0.5);\n};\n\nexport const getFeaturedVideos = () => {\n  return videos.filter(v => v.featured).slice(0, 5);\n};\n";

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'seed.ts'), fileContent, 'utf-8');
console.log('Done generating seed.ts');
