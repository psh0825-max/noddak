import sharp from 'sharp';

const sizes = [
  { name: 'icon-192.png', size: 192, padding: 24 },
  { name: 'icon-512.png', size: 512, padding: 64 },
  { name: 'icon-maskable-192.png', size: 192, padding: 48 },
  { name: 'icon-maskable-512.png', size: 512, padding: 128 },
  { name: 'favicon-32.png', size: 32, padding: 2 },
];

for (const { name, size, padding } of sizes) {
  const inner = size - padding * 2;
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#dc2626"/>
    <g transform="translate(${padding}, ${padding})">
      <!-- 딱지/문서 아이콘 -->
      <rect x="${inner*0.2}" y="${inner*0.08}" width="${inner*0.6}" height="${inner*0.75}" rx="${inner*0.04}" fill="white" opacity="0.95"/>
      <!-- 줄 -->
      <rect x="${inner*0.3}" y="${inner*0.22}" width="${inner*0.4}" height="${inner*0.04}" rx="${inner*0.02}" fill="#dc2626" opacity="0.3"/>
      <rect x="${inner*0.3}" y="${inner*0.32}" width="${inner*0.3}" height="${inner*0.04}" rx="${inner*0.02}" fill="#dc2626" opacity="0.3"/>
      <rect x="${inner*0.3}" y="${inner*0.42}" width="${inner*0.35}" height="${inner*0.04}" rx="${inner*0.02}" fill="#dc2626" opacity="0.3"/>
      <!-- X 마크 (No!) -->
      <circle cx="${inner*0.65}" cy="${inner*0.65}" r="${inner*0.22}" fill="#dc2626"/>
      <line x1="${inner*0.55}" y1="${inner*0.55}" x2="${inner*0.75}" y2="${inner*0.75}" stroke="white" stroke-width="${inner*0.05}" stroke-linecap="round"/>
      <line x1="${inner*0.75}" y1="${inner*0.55}" x2="${inner*0.55}" y2="${inner*0.75}" stroke="white" stroke-width="${inner*0.05}" stroke-linecap="round"/>
    </g>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(`public/${name}`);
  console.log(`✅ ${name}`);
}

// favicon
await sharp('public/favicon-32.png').toFile('public/favicon.ico');
console.log('✅ favicon.ico');
