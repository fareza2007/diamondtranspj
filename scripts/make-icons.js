const sharp = require('sharp');
const fs = require('fs');

async function generate() {
  const { data, info } = await sharp('public/logo_cropped.png')
    .extract({ left: 300, top: 0, width: 162, height: 142 })
    .trim()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Pure white version
  const whiteData = Buffer.from(data);
  for (let i = 0; i < whiteData.length; i += 4) {
    if (whiteData[i + 3] > 30) {
      whiteData[i] = 255;
      whiteData[i + 1] = 255;
      whiteData[i + 2] = 255;
    }
  }
  const whiteDiamond = await sharp(whiteData, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer();

  // Gold version: #E5A93C or #D4AF37
  const goldData = Buffer.from(data);
  for (let i = 0; i < goldData.length; i += 4) {
    if (goldData[i + 3] > 30) {
      goldData[i] = 229;
      goldData[i + 1] = 169;
      goldData[i + 2] = 60;
    }
  }
  const goldDiamond = await sharp(goldData, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer();

  // Create 512x512 dark squircle
  const bgSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="110" fill="#0a0a0a" />
      <rect x="10" y="10" width="492" height="492" rx="100" fill="none" stroke="#E5A93C" stroke-width="14" stroke-opacity="0.8" />
    </svg>
  `);

  const resizedWhite = await sharp(whiteDiamond)
    .resize(320, 280, { fit: 'inside' })
    .toBuffer();

  const resizedGold = await sharp(goldDiamond)
    .resize(320, 280, { fit: 'inside' })
    .toBuffer();

  // Also transparent version (just the gold diamond with subtle dark glow/halo or pure diamond)
  const transparentGold = await sharp(goldDiamond)
    .resize(440, 380, { fit: 'inside' })
    .extend({
      top: 66,
      bottom: 66,
      left: 36,
      right: 36,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .resize(512, 512)
    .png()
    .toBuffer();

  // Generate 512x512 app icon
  const icon512 = await sharp(bgSvg)
    .composite([{ input: resizedGold, gravity: 'center' }])
    .png()
    .toBuffer();

  // Also save sizes: 512, 192, 32
  await sharp(icon512).toFile('public/icon-512.png');
  await sharp(icon512).resize(192, 192).toFile('public/icon-192.png');
  await sharp(icon512).resize(32, 32).toFile('public/favicon-32x32.png');

  // Next.js App Router metadata icon
  await sharp(icon512).resize(180, 180).toFile('src/app/apple-icon.png');
  await sharp(icon512).resize(32, 32).toFile('src/app/icon.png');

  // Convert to ico format or replace src/app/favicon.ico
  // Sharp can output png, and Next.js can serve icon.png or favicon.ico
  // Let's create favicon.ico as a valid 32x32 ICO/PNG
  const icon32 = await sharp(icon512).resize(32, 32).png().toBuffer();
  fs.writeFileSync('src/app/favicon.ico', icon32);
  fs.writeFileSync('public/favicon.ico', icon32);

  console.log('Successfully generated all favicons and icons!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
