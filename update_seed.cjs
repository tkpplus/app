const fs = require('fs');

const data = [
  { series: "Bereshit", match: "Bereshit", desc: "El inicio de todo. La creación del mundo y la enseñanza de que incluso en el comienzo, la misericordia ya estaba presente.", dur: "6:11", chars: ["Avraham"] },
  { series: "Bereshit", match: "Nóaj", desc: "Un mundo en crisis y una oportunidad de reconstrucción. La historia del arca y la importancia de hacer lo correcto incluso cuando nadie más lo hace.", dur: "6:45", chars: ["Aharón"] },
  { series: "Bereshit", match: "Lejá", desc: "El llamado a salir de lo conocido y confiar en un propósito mayor. Un viaje que transforma identidad y destino.", dur: "5:58", chars: ["Ezra"] },
  { series: "Bereshit", match: "Vaierá", desc: "Hospitalidad, bondad y momentos decisivos que revelan el verdadero carácter de una persona.", dur: "6:20", chars: ["Yosef"] },
  { series: "Bereshit", match: "Sará", desc: "Historias de continuidad, legado y decisiones que construyen el futuro.", dur: "6:05", chars: ["Doctor", "Aharón"] },
  { series: "Bereshit", match: "Toldot", desc: "Dos caminos, dos formas de vivir. Una historia sobre identidad, decisiones y consecuencias.", dur: "6:30", chars: ["Yosef", "Benny"] },
  { series: "Bereshit", match: "Vaietzé", desc: "Un viaje lleno de desafíos que enseña perseverancia, trabajo y crecimiento personal.", dur: "6:15", chars: ["Ezra"] },
  { series: "Bereshit", match: "Vaishlaj", desc: "Enfrentar el pasado, reconciliarse y avanzar con una nueva visión.", dur: "6:40", chars: ["Aharón"] },
  { series: "Bereshit", match: "Vaieshev", desc: "Sueños, dificultades y el inicio de una historia que transformará todo.", dur: "6:10", chars: ["Yosef"] },
  { series: "Bereshit", match: "Miketz", desc: "De la oscuridad a la oportunidad. Cuando todo cambia en el momento menos esperado.", dur: "6:25", chars: ["Yosef"] },
  { series: "Bereshit", match: "Vaigash", desc: "El poder del encuentro, la empatía y la reconciliación familiar.", dur: "6:35", chars: ["Yosef"] },
  { series: "Bereshit", match: "Vaiejí", desc: "Cierre de una historia llena de aprendizajes, legado y continuidad.", dur: "6:00", chars: ["Yosef"] },

  { series: "Shemot", match: "Shemot", desc: "Un nuevo comienzo en Egipto. El crecimiento del pueblo y el inicio de un periodo que cambiaría su historia.", dur: "6:05", chars: ["Yosef", "Benny"] },
  { series: "Shemot", match: "Vaerá", desc: "Las primeras señales de cambio aparecen. Una confrontación que empieza a revelar que la realidad puede transformarse.", dur: "6:20", chars: ["Doctor", "Ezra"] },
  { series: "Shemot", match: "Bo", desc: "Momentos decisivos que marcan el camino hacia la libertad. Prepararse para lo que está por venir.", dur: "6:10", chars: ["Doctor"] },
  { series: "Shemot", match: "Beshalaj", desc: "Salir no es el final, es el inicio. Un desafío frente al mar que requiere confianza absoluta.", dur: "6:30", chars: ["Yosef"] },
  { series: "Shemot", match: "Itró", desc: "Escuchar, aprender y estructurar. La importancia de recibir guía en el momento correcto.", dur: "6:00", chars: ["Ezra"] },
  { series: "Shemot", match: "Mishpatim", desc: "Las reglas que construyen una sociedad. Cómo los detalles definen la convivencia.", dur: "6:25", chars: ["Aharón"] },
  { series: "Shemot", match: "Terumáh", desc: "Dar con intención. La construcción de algo más grande comienza con pequeñas aportaciones.", dur: "6:10", chars: ["Benny"] },
  { series: "Shemot", match: "Tetzavé", desc: "El detalle, el orden y la constancia en lo que se construye día a día.", dur: "6:15", chars: ["Aharón"] },
  { series: "Shemot", match: "Tisá", desc: "Un momento de crisis y la importancia de saber reconstruir después de caer.", dur: "6:35", chars: ["Yosef"] },
  { series: "Shemot", match: "Vayakel", desc: "Cuando todos participan, algo extraordinario sucede. La fuerza de la comunidad.", dur: "6:05", chars: ["Benny", "Ezra"] },
  { series: "Shemot", match: "Pekudéi", desc: "El cierre de un proceso. Orden, balance y la satisfacción de ver algo terminado.", dur: "6:00", chars: ["Keter"] },

  { series: "Vaikra", match: "Vaikrá", desc: "Un llamado que invita a acercarse. Entender que la conexión comienza con la intención.", dur: "6:00", chars: ["Doctor", "Ezra"] },
  { series: "Vaikra", match: "Tzav", desc: "La constancia en las acciones transforma lo cotidiano en algo significativo.", dur: "6:10", chars: ["Aharón"] },
  { series: "Vaikra", match: "Sheminí", desc: "Momentos de intensidad que enseñan la importancia del equilibrio y la responsabilidad.", dur: "6:20", chars: ["Yosef"] },
  { series: "Vaikra", match: "Tazría", desc: "El inicio de nuevos procesos y la importancia de lo que ocurre desde el principio.", dur: "6:05", chars: ["Benny"] },
  { series: "Vaikra", match: "Metzorá", desc: "Las palabras tienen impacto. Aprender a cuidar lo que decimos y cómo lo decimos.", dur: "6:15", chars: ["Keter"] },

  { series: "Sipurei Pesaj", match: "Pe-Raj", desc: "El inicio del sufrimiento en Egipto y cómo comenzó la esclavitud del pueblo.", dur: "5:30", chars: ["Doctor"] },
  { series: "Sipurei Pesaj", match: "Señales", desc: "Las plagas comienzan a cambiar la historia y mostrar que nada es casualidad.", dur: "5:50", chars: ["Doctor"] },
  { series: "Sipurei Pesaj", match: "Noche", desc: "Una noche distinta a todas, llena de significado y preparación para la libertad.", dur: "6:10", chars: ["Doctor"] },
  { series: "Sipurei Pesaj", match: "Mar", desc: "El momento decisivo: cruzar hacia lo desconocido y confiar completamente.", dur: "6:20", chars: ["Doctor"] },
  { series: "Sipurei Pesaj", match: "Hashgajá", desc: "Las plagas comienzan a cambiar la historia y mostrar que nada es casualidad. (¿Cómo una niña de 3 años salvó al pueblo judío?)", dur: "5:50", chars: ["Doctor"] },
  { series: "Sipurei Pesaj", match: "Augurio", desc: "Una noche distinta a todas, llena de significado y preparación para la libertad. (¿Por qué Moshé no podía hablar bien?)", dur: "6:10", chars: ["Doctor"] },
  { series: "Sipurei Pesaj", match: "Gezerá", desc: "El momento decisivo: cruzar hacia lo desconocido y confiar completamente. (¡La espada de Faraón se ROMPIÓ!)", dur: "6:20", chars: ["Doctor"] },

  { series: "Cuentos", match: "diamante", desc: "Un objeto valioso… y una lección sobre lo que realmente tiene valor.", dur: "5:15", chars: ["Keter"] },
  { series: "Cuentos", match: "París", desc: "A veces, una sola acción puede cambiarlo todo.", dur: "5:07", chars: ["Keter"] },
  { series: "Cuentos", match: "abrigo", desc: "¿Es suficiente salvarse uno mismo… o hay algo más? (Calor para todos)", dur: "4:21", chars: ["Keter"] },
  { series: "Cuentos", match: "silencio", desc: "No siempre actuar es la respuesta… a veces entender lo es. (Estropear las cosas sagradas)", dur: "6:07", chars: ["Keter"] },
  { series: "Cuentos", match: "caballo", desc: "Elegir entre lo correcto y lo fácil nunca es sencillo.", dur: "5:46", chars: ["Keter"] },
  { series: "Cuentos", match: "chispa", desc: "Cada persona tiene una luz… solo necesita descubrirla. (Pies congelados)", dur: "5:46", chars: ["Keter"] },
  { series: "Cuentos", match: "experto", desc: "El conocimiento no siempre es lo que parece.", dur: "5:15", chars: ["Keter"] },
  { series: "Cuentos", match: "Todo es para bien", desc: "Una historia que revela cómo incluso lo inesperado tiene un propósito.", dur: "4:40", chars: ["Keter"] },
  
  { series: "Pesaj", match: "Hagadá, Puppets", desc: "La historia de Pesaj como nunca la has vivido: libertad, identidad y tradición en una experiencia completa.", dur: "20:34" },
  { series: "Januca", match: "Dreidel", desc: "Un momento divertido que captura el espíritu de Janucá.", dur: "2:05", chars: ["Benny"] },
  { series: "Januca", match: "Chispa", desc: "Una historia sobre luz, resistencia y esperanza.", dur: "11:10" }
];

let fileContent = fs.readFileSync('src/data/seed.ts', 'utf-8');

function parseDuration(durStr) {
  if (!durStr) return 500;
  const parts = durStr.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return 500;
}

const lines = fileContent.split('\n');
const startVideos = lines.findIndex(l => l.includes('export const videos = ['));
if (startVideos !== -1) {
  const codeToEval = fileContent.slice(startVideos).replace('export const videos =', 'const _videos =');
  const evalCode = codeToEval.substring(0, codeToEval.lastIndexOf('];') + 2);
  
  let videos;
  try {
     eval(evalCode + '; videos = _videos;');
  } catch(e) {
     console.error(e);
     process.exit(1);
  }
  
  videos.forEach(v => {
     let matchFound = false;
     for (let d of data) {
        if (v.title.includes(d.match)) {
           v.description = d.desc;
           v.duration = parseDuration(d.dur);
           if (d.chars) {
              v.characters = d.chars;
           }
           matchFound = true;
           break;
        }
     }
  });

  const newVideosStr = 'export const videos = ' + JSON.stringify(videos, null, 2) + ';\n';
  const prefix = fileContent.slice(0, startVideos);
  fs.writeFileSync('src/data/seed.ts', prefix + newVideosStr);
  console.log("Updated seed data successfully.");
}
