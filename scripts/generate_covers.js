import fs from 'fs';
import path from 'path';
import { createCanvas } from '@napi-rs/canvas';

const coversDir = path.resolve('src/assets/series-covers');
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

const filenames = [
  'bamidbar_1.jpg',
  'basic.jpg',
  'bereshit_0.jpg',
  'bereshit_1.jpg',
  'bereshit_2.jpg',
  'bereshit_3.jpg',
  'bereshit_4.jpg',
  'cuentos-jag_1.jpg',
  'cuentos-jag_2.jpg',
  'cuentos-jag_4.jpg',
  'cuentos-perasha_1.jpg',
  'cuentos-perasha_2.jpg',
  'cuentos-perasha_3.jpg',
  'cuentos-tradicion_0.jpg',
  'devarim_1.jpg',
  'devarim_2.jpeg',
  'devarim_2.jpg',
  'devarim_3.jpg',
  'januca_1.jpg',
  'januca_2.jpg',
  'januca_3.jpg',
  'januca_4.jpg',
  'lag-baomer_1.jpg',
  'parashot-especiales_1.jpg',
  'pesaj_1.jpg',
  'pesaj_2.jpg',
  'pesaj_3.jpg',
  'pesaj_4.jpg',
  'purim_1.jpg',
  'purim_2.jpg',
  'rosh-hashana_1.jpg',
  'shavuot_1.jpg',
  'shemot_0.jpg',
  'shemot_1.jpg',
  'shemot_2.jpg',
  'shemot_3.jpg',
  'sipurei-pesaj_1.jpg',
  'sipurei-pesaj_2.jpg',
  'sipurei-pesaj_3.jpg',
  'sucot_1.jpg',
  'sucot_2.jpg',
  'tisha-beav_1.jpg',
  'tu-bishvat_1.jpg',
  'tu-bishvat_2.jpg',
  'vaikra.jpg',
  'vaikra_0.jpg',
  'vaikra_1.jpg',
  'vaikra_2.jpg',
  'vaikra_3.jpg',
  'vaikra_4.jpg',
  'vaikra_5.jpg',
  'vaikra_6.jpg',
  'yom-kipur_1.jpg'
];

const colorSchemes = [
  ['#1A103C', '#2B125B', '#E5A93B'], // Royal Purple & Gold
  ['#0F2027', '#203A43', '#2C5364'], // Deep Teal
  ['#3A1C71', '#D76D77', '#FFAF7B'], // Twilight Warmth
  ['#141E30', '#243B55', '#45B69C'], // Midnight Emerald
  ['#130CB7', '#52E5E7', '#F2A023'], // Electric Azure
  ['#200122', '#6f0000', '#F5C463'], // Crimson Gold
  ['#000000', '#152331', '#00D2FF'], // Deep Space Cyber
];

const titlesMap = {
  bamidbar: 'Bamidbar (Números)',
  basic: 'Torah Kids Puppets',
  bereshit: 'Bereshit (Génesis)',
  'cuentos-jag': 'Cuentos de las Festividades',
  'cuentos-perasha': 'Cuentos de la Perashá',
  'cuentos-tradicion': 'Cuentos de la Tradición',
  devarim: 'Devarim (Deuteronomio)',
  januca: 'Janucá Especial',
  'lag-baomer': 'Lag BaOmer',
  'parashot-especiales': 'Parashot Especiales',
  pesaj: 'Pesaj Especial',
  purim: 'Purim Especial',
  'rosh-hashana': 'Rosh Hashaná',
  shavuot: 'Shavuot Especial',
  shemot: 'Shemot (Éxodo)',
  'sipurei-pesaj': 'Sipurei Pesaj',
  sucot: 'Sucot Especial',
  'tisha-beav': 'Tisha BeAv',
  'tu-bishvat': 'Tu Bishvat',
  vaikra: 'Vaikrá (Levítico)',
  'yom-kipur': 'Yom Kipur'
};

function getSeriesTitle(filename) {
  const base = filename.replace(/\.(jpg|jpeg)$/i, '');
  const key = base.split('_')[0].split('-')[0];
  for (const [k, v] of Object.entries(titlesMap)) {
    if (base.toLowerCase().startsWith(k)) return { title: v, key: k };
  }
  return { title: 'Torah Kids Puppets', key: 'basic' };
}

console.log('Generating 53 cover images...');

for (let i = 0; i < filenames.length; i++) {
  const filename = filenames[i];
  const width = 1280;
  const height = 720;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const scheme = colorSchemes[i % colorSchemes.length];
  const { title, key } = getSeriesTitle(filename);

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, scheme[0]);
  grad.addColorStop(0.5, scheme[1]);
  grad.addColorStop(1, '#08080C');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle background pattern circles
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = scheme[2];
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.3, 350, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.15, height * 0.8, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Decorative border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 12;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  // Top Badge
  ctx.fillStyle = scheme[2];
  ctx.fillRect(80, 80, 180, 4);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('TORAH KIDS PUPPETS', 80, 115);

  // Main Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 64px sans-serif';
  
  // Wrap text if needed
  const words = title.split(' ');
  let line = '';
  let y = 320;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 900 && n > 0) {
      ctx.fillText(line, 80, y);
      line = words[n] + ' ';
      y += 80;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 80, y);

  // Variant badge
  const baseName = filename.replace(/\.(jpg|jpeg)$/i, '');
  const variantMatch = baseName.match(/_(\d+|[a-z]+)$/);
  const variantText = variantMatch ? `VOL. ${variantMatch[1].toUpperCase()}` : 'COLECCIÓN OFICIAL';

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(80, y + 40, 220, 48);
  ctx.fillStyle = scheme[2];
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(variantText, 100, y + 72);

  // Save to file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(coversDir, filename), buffer);
}

console.log('Successfully generated all 53 covers in src/assets/series-covers/');
