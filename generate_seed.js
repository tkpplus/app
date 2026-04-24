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
  { id: 'bereshit', title: 'Bereshit', description: 'Génesis - Historias del origen y los patriarcas.', categoryId: 'PARASHOT' },
  { id: 'shemot', title: 'Shemot', description: 'Éxodo - Desde la esclavitud en Egipto hasta la entrega de la Torah.', categoryId: 'PARASHOT' },
  { id: 'vaikra', title: 'Vaikra', description: 'Levítico - Leyes, santidad y servicio en el Mishkán.', categoryId: 'PARASHOT' },
  { id: 'bamidbar', title: 'Bamidbar', description: 'Números - El pueblo en el desierto lleno de lecciones.', categoryId: 'PARASHOT' },
  { id: 'debarim', title: 'Debarim', description: 'Deuteronomio - Los discursos finales de Moshé.', categoryId: 'PARASHOT' },
  { id: 'especiales', title: 'Especiales', description: 'Parashot especiales como Shekalim, Zajor y más.', categoryId: 'PARASHOT' },
  { id: 'rosh-hashana', title: 'Rosh Hashaná', description: 'Cabeza del año judío.', categoryId: 'FESTIVIDADES' },
  { id: 'yom-kipur', title: 'Yom Kipur', description: 'Día del perdón.', categoryId: 'FESTIVIDADES' },
  { id: 'sukot', title: 'Sucot', description: 'La festividad de las cabañas.', categoryId: 'FESTIVIDADES' },
  { id: 'januca', title: 'Janucá', description: 'La luz que nunca se apaga.', categoryId: 'FESTIVIDADES' },
  { id: 'tu-bishvat', title: 'Tu Bishvat', description: 'El año nuevo de los árboles.', categoryId: 'FESTIVIDADES' },
  { id: 'purim', title: 'Purim', description: 'La historia de Ester y la salvación.', categoryId: 'FESTIVIDADES' },
  { id: 'pesaj', title: 'Pesaj', description: 'Libertad y redención en Egipto.', categoryId: 'FESTIVIDADES' },
  { id: 'lag-baomer', title: 'Lag Baomer', description: 'Celebración y luz de Rabí Shimón bar Yojai.', categoryId: 'FESTIVIDADES' },
  { id: 'shavuot', title: 'Shavuot', description: 'La entrega de la Torá en el Monte Sinaí.', categoryId: 'FESTIVIDADES' },
  { id: 'tisha-bav', title: 'Tisha B\'Av', description: 'Día de duelo y recuerdo.', categoryId: 'FESTIVIDADES' },
  { id: 'cuentos-jag', title: 'Cuentos del Jag', description: 'Historias inspiradoras para las festividades.', categoryId: 'CUENTOS E HISTORIAS' },
  { id: 'cuentos-tradicion', title: 'Cuentos de la Tradición', description: 'Cuentos hermosos de nuestra tradición.', categoryId: 'CUENTOS E HISTORIAS' },
  { id: 'cuentos-parashot', title: 'Cuentos de las Parashot', description: 'Historias con las enseñanzas de cada semana.', categoryId: 'CUENTOS E HISTORIAS' },
  { id: 'sipurei-pesaj', title: 'Sipurei Pesaj', description: 'Historias milagrosas sobre la salida de Egipto.', categoryId: 'CUENTOS E HISTORIAS' }
];

const videosList = [
  // PARASHOT - BERESHIT
  { vId: '8rAPAkIKRHE', t: 'Estudiemos las Parashot - Parashat 1 Bereshit פרשת א בראשית', cat: 'PARASHOT', sId: 'bereshit', ep: 1, views: 358 },
  { vId: 'XCP6sLsrT6Q', t: 'Parashá 1 Bereshit - Parashá en un minuto.', cat: 'PARASHOT', sId: 'bereshit', ep: 1, views: 367 },
  { vId: 'sMd0opDs2Ss', t: 'Estudiemos las Parashot - Parashat 2 Nóaj פרשת ב נח', cat: 'PARASHOT', sId: 'bereshit', ep: 2, views: 244 },
  { vId: 'oLAULPrPEj8', t: 'Parashá 2 Noaj - Parashá en un minuto', cat: 'PARASHOT', sId: 'bereshit', ep: 2, views: 553 },
  { vId: 've0VT8f00fY', t: 'Estudiemos las Parashot - Parashat 3 Lej Lejá פרשת ג לך לך', cat: 'PARASHOT', sId: 'bereshit', ep: 3, views: 244 },
  { vId: 'hh4ppg7E5yI', t: 'Parashat 3 Lej Lejá - Parashá en un minuto', cat: 'PARASHOT', sId: 'bereshit', ep: 3, views: 1003 },
  { vId: '--Z6J-rIgrk', t: 'Estudiemos las Parashot - Parashat 4 Vaierá פרשת ד וירא', cat: 'PARASHOT', sId: 'bereshit', ep: 4, views: 477 },
  { vId: 'oGBrpfV6Wug', t: 'Parashá 4 Vaierá - Parashá en un minuto', cat: 'PARASHOT', sId: 'bereshit', ep: 4, views: 429 },
  { vId: 'msarrAETqGI', t: 'Parashá 5 Jaié Sará', cat: 'PARASHOT', sId: 'bereshit', ep: 5, views: 387 },
  { vId: 'zkBk1z0u5-Q', t: 'Estudiemos las Parashot - Parashat 5 Jaié Saráh פרשת ה חיי שרה', cat: 'PARASHOT', sId: 'bereshit', ep: 5, views: 230 },
  { vId: '-wxWR4UiXXI', t: 'Parashá 6 Toldot', cat: 'PARASHOT', sId: 'bereshit', ep: 6, views: 1022 },
  { vId: '5GJFMWdIGbo', t: 'Parashat 6 Toldot פרשת ו תולדות', cat: 'PARASHOT', sId: 'bereshit', ep: 6, views: 272 },
  { vId: 'Olinh9ZgvYk', t: 'Parashá 7 Vaietzé', cat: 'PARASHOT', sId: 'bereshit', ep: 7, views: 478 },
  { vId: 'biWskHeVKpU', t: 'Parashat 7 Vaietzé פרשת ז ויצא', cat: 'PARASHOT', sId: 'bereshit', ep: 7, views: 170 },
  { vId: 'pow5BUl1A5M', t: 'Parashá 8 Vaishlaj', cat: 'PARASHOT', sId: 'bereshit', ep: 8, views: 701 },
  { vId: 'GOfB9q9vb_8', t: 'Parashat 8 Vaishlaj פרשת ח וישלח', cat: 'PARASHOT', sId: 'bereshit', ep: 8, views: 232 },
  { vId: 'mNPB8ICD0i8', t: 'Parashá 9 Vaieshev', cat: 'PARASHOT', sId: 'bereshit', ep: 9, views: 273 },
  { vId: 'LeF_n_OXbNo', t: 'Parashat 9 Vaieshev', cat: 'PARASHOT', sId: 'bereshit', ep: 9, views: 178 },
  { vId: 'upcJnnNbcO8', t: 'Parashá 10 Miketz', cat: 'PARASHOT', sId: 'bereshit', ep: 10, views: 349 },
  { vId: 'C3NQV3plamY', t: 'Parashat 10 Miketz - פרשת י מקץ', cat: 'PARASHOT', sId: 'bereshit', ep: 10, views: 155 },
  { vId: 'w4GK3pplW_Y', t: 'Parashá 11 Vaigash', cat: 'PARASHOT', sId: 'bereshit', ep: 11, views: 1480 },
  { vId: 'VfLg8ivtdFU', t: 'Parashat 11 Vaigash - פרשת יא ויגש', cat: 'PARASHOT', sId: 'bereshit', ep: 11, views: 161 },
  { vId: 'p4gsg2bZ3jo', t: 'Parashá 12 Vaiejí', cat: 'PARASHOT', sId: 'bereshit', ep: 12, views: 560 },
  { vId: 'WsR2TAyVZoY', t: 'Parashat 12 Vaieji - פרשת יב ויחי', cat: 'PARASHOT', sId: 'bereshit', ep: 12, views: 186 },

  // PARASHOT - SHEMOT
  { vId: 'wWVrrqyVRls', t: 'Parashat 13 Shemot - פרשת יג שמות', cat: 'PARASHOT', sId: 'shemot', ep: 13, views: 405 },
  { vId: '0ZJUre6RjiY', t: 'Parashat 13 Shemot - פרשת יג שמות', cat: 'PARASHOT', sId: 'shemot', ep: 13, views: 335 },
  { vId: 'SDqAXlAfFj4', t: 'Parashat 14 Vaera', cat: 'PARASHOT', sId: 'shemot', ep: 14, views: 222 },
  { vId: 'r7fX55dNlqc', t: 'Parashat 14 Vaerá - פרשת יד וארא', cat: 'PARASHOT', sId: 'shemot', ep: 14, views: 221 },
  { vId: 'FAgIYC7KhpU', t: 'Parashat 15 Bo - פרשת טו בא', cat: 'PARASHOT', sId: 'shemot', ep: 15, views: 236 },
  { vId: 'IFzPSegUYO4', t: 'Parsha en un minuto 15 Bo', cat: 'PARASHOT', sId: 'shemot', ep: 15, views: 116 },
  { vId: 'AwKQLzKyW5s', t: 'Parashat 16 Beshalaj - פרשת טז בשלח', cat: 'PARASHOT', sId: 'shemot', ep: 16, views: 230 },
  { vId: 'tWHKCkFBjvE', t: 'Parsha en un minuto 16 Beshalaj', cat: 'PARASHOT', sId: 'shemot', ep: 16, views: 86 },
  { vId: 'sHnaggaoroY', t: 'Parashat 17 Itró - פרשת יז יתרו', cat: 'PARASHOT', sId: 'shemot', ep: 17, views: 261 },
  { vId: '1ieTbEKPlRs', t: 'Parsha en un minuto 17 Itró', cat: 'PARASHOT', sId: 'shemot', ep: 17, views: 73 },
  { vId: '8UBu-rCS5sA', t: 'Parashat 18 Mishpatim - פרשת יח משפטים', cat: 'PARASHOT', sId: 'shemot', ep: 18, views: 205 },
  { vId: 'SOdBWtfb2hE', t: 'Parsha en un minuto 18 Mishapatim', cat: 'PARASHOT', sId: 'shemot', ep: 18, views: 100 },
  { vId: 'VdY9Giv2laY', t: 'Parashat 19 Terumáh - פרשת יט תרומה', cat: 'PARASHOT', sId: 'shemot', ep: 19, views: 138 },
  { vId: '3qsxRzFfggg', t: 'Parsha en un minuto 19 Terumah', cat: 'PARASHOT', sId: 'shemot', ep: 19, views: 96 },
  { vId: 'g2akTy5BB0Q', t: 'Parashat 20 Tetzavé - פרשת כ תצוה', cat: 'PARASHOT', sId: 'shemot', ep: 20, views: 209 },
  { vId: 'X6Y4-b4CG4M', t: 'Parsha en un minuto 20 Tetzaveh', cat: 'PARASHOT', sId: 'shemot', ep: 20, views: 101 },
  { vId: 'Bd4lU_MYILU', t: 'Parashat 21 Ki Tisá - פרשת כא כי תשא', cat: 'PARASHOT', sId: 'shemot', ep: 21, views: 130 },
  { vId: 'pNfv65TyKDY', t: 'Parsha en un minuto 21 Ki tisa', cat: 'PARASHOT', sId: 'shemot', ep: 21, views: 148 },
  { vId: 'DfeuzcRBfto', t: 'Parashat 22 Vayakel - פרשת כב ויקהל', cat: 'PARASHOT', sId: 'shemot', ep: 22, views: 231 },
  { vId: 'hyr1-ef09HM', t: 'Parsha en un minuto 22 Vayakel', cat: 'PARASHOT', sId: 'shemot', ep: 22, views: 172 },
  { vId: 'yk8hXQzolOM', t: 'Parashat 23 Pekudéi - פרשת כג פקודי', cat: 'PARASHOT', sId: 'shemot', ep: 23, views: 208 },
  { vId: 'rqyeTYOTRFM', t: 'Parsha en un minuto 23 Pekudei', cat: 'PARASHOT', sId: 'shemot', ep: 23, views: 149 },

  // PARASHOT - VAIKRA
  { vId: 'NwwUrSSDRvQ', t: 'Parashat 24 Vaikrá - פרשת כד ויקרא', cat: 'PARASHOT', sId: 'vaikra', ep: 24, views: 216 },
  { vId: 'EC-Nnceu_ms', t: 'Parsha en un minuto 24 Vaikra', cat: 'PARASHOT', sId: 'vaikra', ep: 24, views: 369 },
  { vId: '1mDsNbou-Eg', t: 'Parashat 25 Tzav - פרשת כה צו', cat: 'PARASHOT', sId: 'vaikra', ep: 25, views: 247 },
  { vId: 'uhGShtqf3l0', t: 'Parsha en un minuto 25 Tzav', cat: 'PARASHOT', sId: 'vaikra', ep: 25, views: 128 },
  { vId: '9Nhcw27C7fU', t: 'Parashat 26 Sheminí - פרשת כו שמיני', cat: 'PARASHOT', sId: 'vaikra', ep: 26, views: 881 },
  { vId: 'M4RI6h5RxyY', t: 'Parsha en un minuto 26 Sheminí', cat: 'PARASHOT', sId: 'vaikra', ep: 26, views: 161 },
  { vId: 'MwNi34vieEQ', t: 'Parsha en un minuto 26 Sheminí (Alt)', cat: 'PARASHOT', sId: 'vaikra', ep: 26, views: 104 },
  { vId: 'cUGfwEKJB_w', t: 'Parashat 27-28 Tazría-Metzorá  פרשת כז-כח תזריע-מצורע', cat: 'PARASHOT', sId: 'vaikra', ep: 27, views: 331 },
  { vId: '-ORflM1R4H4', t: 'Parashat 27 Tazria - פרשת כז תזריע', cat: 'PARASHOT', sId: 'vaikra', ep: 27, views: 129 },
  { vId: '7LN0uQYABmU', t: 'Parashat 28 Metzora - פרשת כח מצורע', cat: 'PARASHOT', sId: 'vaikra', ep: 28, views: 131 },

  // PARASHOT - ESPECIALES
  { vId: 'nvzRK0GQZgk', t: '¿Qué hacía un Rebe en un Casino de París? 🎰🇫🇷 | Cuentos de la Parashá', cat: 'PARASHOT', sId: 'especiales', ep: 1, views: 973 },
  { vId: 'h10wQ1V3yt0', t: 'Un cuento que enciende el corazón | Parashá Ajarei Mot | Torah Kids Puppets', cat: 'PARASHOT', sId: 'especiales', ep: 2, views: 913 },
  { vId: 'NLB8leKLO4k', t: '¿Etrog o Caballo? 🐴🍋 | La decisión más difícil (Parashat Vaijí)', cat: 'PARASHOT', sId: 'especiales', ep: 3, views: 840 },
  { vId: 'MIhXjY5Fo7c', t: '¿Noaj fue egoísta? 🤨 | El Tzadik del abrigo de piel (Parashat Noaj)', cat: 'PARASHOT', sId: 'especiales', ep: 4, views: 430 },
  { vId: 'cqd6YZU86nM', t: '¿Por qué el Rabino NO quiso rezar? 🛑 | El enemigo invisible (Parashat Bereshit)', cat: 'PARASHOT', sId: 'especiales', ep: 5, views: 430 },
  { vId: 'IhFRnooopPo', t: 'Parsha HaJodesh', cat: 'PARASHOT', sId: 'especiales', ep: 6, views: 271 },
  { vId: 'ntU9gSXIU9w', t: 'Cuentos de la Tradición - Todo es para bien', cat: 'PARASHOT', sId: 'especiales', ep: 7, views: 244 },
  { vId: '0Fx9rKWegsc', t: '¿Por qué salir de Egipto NO fue el final? ⚔️ | Cuento de Pesaj para niños', cat: 'PARASHOT', sId: 'especiales', ep: 8, views: 221 },
  { vId: '1XCQgq6Eouo', t: 'Perashá especial Parshá HaJodesh', cat: 'PARASHOT', sId: 'especiales', ep: 9, views: 193 },
  { vId: 'bUu2W_fGqo8', t: 'Estudiemos las Parashot - El Resumen de la Parashat con el Doc 1 Bereshit', cat: 'PARASHOT', sId: 'especiales', ep: 10, views: 161 },
  { vId: 'Koao7Pp7CwI', t: '💎 Un Experto - Cuento de la Parashá Kedoshim | Torah Kids Puppets', cat: 'PARASHOT', sId: 'especiales', ep: 11, views: 131 },
  { vId: 's4k_OBr2-aY', t: 'La travesía de Eliezer: La búsqueda de la esposa perfecta para Isaac', cat: 'PARASHOT', sId: 'especiales', ep: 12, views: 123 },
  { vId: '6YoVDp5Jeqs', t: 'Estudiemos las Parashot - El Resumen de la Parashat con el Doc 2 Nóaj', cat: 'PARASHOT', sId: 'especiales', ep: 13, views: 117 },
  { vId: 'hccDm7RF-Ls', t: 'Parshá Especial - Shabat Shekalim', cat: 'PARASHOT', sId: 'especiales', ep: 14, views: 95 },
  { vId: 'Yja7jteJ3d4', t: 'Parshá Especial - Shabat Zajor', cat: 'PARASHOT', sId: 'especiales', ep: 15, views: 85 },
  { vId: '81122QbTN70', t: 'Parashat Va\'Yikrá | פרשת ויקרא', cat: 'PARASHOT', sId: 'especiales', ep: 16, views: 81 },
  { vId: 'SlWuko2q-Y0', t: 'Parshá Especial - Shabat Shekalim 2', cat: 'PARASHOT', sId: 'especiales', ep: 17, views: 68 },
  { vId: 'LWITMNQEWTo', t: 'Parshá Especial - Shabat Zajor 2', cat: 'PARASHOT', sId: 'especiales', ep: 18, views: 64 },
  { vId: 'X9IApkMzbSw', t: 'Parashat Tzav | פרשת צו', cat: 'PARASHOT', sId: 'especiales', ep: 19, views: 54 },

  // FESTIVIDADES - PESAJ
  { vId: 'Defyt5gOBQo', t: 'Hagadá, Puppets y Matzá | La historia de Pesaj contada como nunca antes | Hagadá Animada', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 1, views: 3051 },
  { vId: 'GHcExyGsd4o', t: 'Hagadá De Pesaj Animada | Hagadah Shel Pesaj Le Yeladim | הגדה של פסח', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 2, views: 472 },
  { vId: 'NeQJdLIVj0A', t: 'Matzah ¿Qué es el Matzah? | מצה', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 3, views: 326 },
  { vId: 'abrhe9Rg-EI', t: 'Pesaj ¿Que significa la Palabra Pesaj? | פסח', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 4, views: 235 },
  { vId: 'EW5JWXBlC78', t: 'Pesaj | פסח', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 5, views: 189 },
  { vId: 'aTa3lcWLwQ0', t: '¿Cómo empezó la esclavitud? 🧱 La trampa secreta del Faraón | Sipurei Pesaj Ep.1', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 6, views: 218 },
  { vId: 'FnzQmTU-2jU', t: '¿Por qué Moshé no podía hablar bien? 💎🔥 | La prueba de fuego | Sipurei Pesaj Ep.3', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 7, views: 104 },
  { vId: 'RzqvBDyrt2g', t: '¡La espada de Faraón se ROMPIÓ! ⚔️😲 | El milagro de Moshé | Sipurei Pesaj Ep.4', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 8, views: 71 },

  // FESTIVIDADES - JANUCA
  { vId: '5wE1ZTeTOIU', t: '¡La Chispa de Janucá!', cat: 'FESTIVIDADES', sId: 'januca', ep: 1, views: 571 },
  { vId: 'vS3C7F1Okm4', t: 'Benny Has a Little Dreidel - Hanukkah Children\'s Song -', cat: 'FESTIVIDADES', sId: 'januca', ep: 2, views: 200 },
  { vId: 'rP9CG-5NV1o', t: 'El Milagroso Aceite de Janucá', cat: 'FESTIVIDADES', sId: 'januca', ep: 3, views: 4 },

  // FESTIVIDADES - SUKOT
  { vId: 'o9mvIBnXtxE', t: 'Sukot', cat: 'FESTIVIDADES', sId: 'sukot', ep: 1, views: 342 },
  { vId: '7kJmFPyS5xk', t: 'חג סוכות שמח | Jag Sukot Sameaj', cat: 'FESTIVIDADES', sId: 'sukot', ep: 2, views: 290 },
  { vId: 'jmtF9wiiqso', t: 'Sukkot Chistosadas - Yosef come los dátiles del Doc', cat: 'FESTIVIDADES', sId: 'sukot', ep: 3, views: 146 },
  { vId: 'irjPXPav8dY', t: 'Sukot Trailer 🌴🍋 🌿', cat: 'FESTIVIDADES', sId: 'sukot', ep: 4, views: 74 },

  // CUENTOS E HISTORIAS
  { vId: 'uQdfLlJ98IQ', t: 'Cuentos de la Tradición: Tesoros de Pureza', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-tradicion', ep: 1, views: 615 },
  { vId: 'pIgwPuIPzPQ', t: 'Cuentos de la Tradición: David, el Buen Pastor.', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-tradicion', ep: 2, views: 297 },
  { vId: 'EmSOWR29G9w', t: 'La Historia de Abraham: Lecciones de Fe y Familia', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-parashot', ep: 1, views: 147 },
  { vId: 'JgeYD242mdA', t: 'La Triste historia de la muerte de Sarah en Hebron', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-parashot', ep: 2, views: 133 },
  { vId: 'u5Xln4-oUMw', t: '¡El Increíble Anuncio a Abraham: El Nacimiento de isaac!', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-parashot', ep: 3, views: 120 },
  { vId: 'IlGe5gPb-ss', t: 'La promesa de Di-s a Abraham: El viaje a Canaan', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-parashot', ep: 4, views: 95 },
  { vId: 'YHOHnafmPOg', t: 'La prueba de Fe: Sacrificio de Abraham e Isaac - Akedat Izjak', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-parashot', ep: 5, views: 82 },
  { vId: '2tNGQiZqfdQ', t: 'La sorprendente Historia de Noah contada por marionetas', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-parashot', ep: 6, views: 76 },
  { vId: 'BXHfjgtmiic', t: 'El pacto entre las partes Legado de Abraham', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-parashot', ep: 7, views: 64 },
  { vId: 'ndf9CmDBHWY', t: 'Yosef y el Shabat', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-tradicion', ep: 3, views: 378 },
  { vId: 'EuWL4xrCQy0', t: '¿Cómo una niña de 3 años salvó al pueblo judío? 👧✨ | La profecía de Miriam', cat: 'CUENTOS E HISTORIAS', sId: 'cuentos-parashot', ep: 8, views: 120 },

  // FESTIVIDADES EXTRAS
  { vId: 'K8MVkjuptEo', t: 'El Mar Rojo ¿Por que se abrió? | ים סוף', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 9, views: 217 },
  { vId: 'CblSXOlt6Vw', t: 'Rosh Ha\'Shana Abib | ראש השנה אביב 🍎🍯', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 10, views: 57 },
  { vId: 'SsW9fe9eWvs', t: 'Abib o Aviv ¿Que es? ¿Que significa? Con Arush | ראש חודש אביב \ ניסן | 🌿🌼', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 11, views: 180 },
  { vId: 'X2ACDIpXbI8', t: 'Rosh Jodesh Abib o Aviv | ראש חודש אביב 🌒🌙🌼', cat: 'FESTIVIDADES', sId: 'pesaj', ep: 12, views: 41 },
  
  // PARASHOT EXTRAS
  { vId: 'ZwxOaHvYZ1Y', t: 'Parsha Pará', cat: 'PARASHOT', sId: 'especiales', ep: 20, views: 143 },
  { vId: 'J_h86yuU4Vo', t: 'Parsha Pará 2', cat: 'PARASHOT', sId: 'especiales', ep: 21, views: 92 },
  { vId: 'ROVgp6HBYgI', t: 'Vayikrá ¿Que es Va\'Yikrá? | ויקרא 📜📖', cat: 'PARASHOT', sId: 'vaikra', ep: 29, views: 148 }
];

const videosSource = videosList.map((v, i) => {
  let isShort = v.t.toLowerCase().includes('en un minuto');
  let sId = isShort ? "null" : `"${v.sId}"`;
  let ep = isShort ? "null" : v.ep;
  return `  {
    "id": "${v.vId}",
    "title": "${v.t}",
    "youtubeId": "${v.vId}",
    "duration": 500,
    "views": ${v.views},
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
    "episodeNum": ${ep}
  }`;
});

const seriesSource = seriesList.map(s => {
  return "  { \"id\": \"" + s.id + "\", \"title\": \"" + s.title + "\", \"description\": \"" + s.description + "\", \"categoryId\": \"" + s.categoryId + "\", \"thumbnail\": \"/series/" + s.id + ".jpg\" }";
});

const fileContent = "// @ts-nocheck\n" + newCharacters + "\n\nexport const seriesData = [\n" + seriesSource.join(',\n') + "\n];\n\nexport const videos = [\n" + videosSource.join(',\n') + "\n];\n\nexport function getSeriesByCategory(categoryId) {\n  return seriesData.filter(s => s.categoryId === categoryId);\n}\n\nexport function getSeriesById(seriesId) {\n  return seriesData.find(s => s.id === seriesId);\n}\n\nexport const getVideosBySeries = (seriesId) => {\n  return videos.filter(v => v.seriesId === seriesId);\n};\n\nexport const getVideoById = (id) => {\n  if (!id) return null;\n  return videos.find(v => v.id === id) || videos.find(v => v.youtubeId === id);\n};\n\nexport const getShortVideos = () => {\n  const shorts = videos.filter(v => v.isShort);\n  return shorts.sort(() => Math.random() - 0.5);\n};\n\nexport const getFeaturedVideos = () => {\n  return videos.filter(v => v.featured).slice(0, 5);\n};\n";

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'seed.ts'), fileContent, 'utf-8');
console.log('Done generating seed.ts');
