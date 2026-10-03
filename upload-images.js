const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const prisma = new PrismaClient();

// Mapping nama mobil ke file gambar
const imageMap = {
  'Brio': 'public/cars/brio.jpg',
  'All New Avanza': 'public/cars/avanza.jpg',
  'Xpander': 'public/cars/xpander.jpg',
  'Innova Reborn': 'public/cars/innova-reborn.jpg',
  'All New Veloz': 'public/cars/veloz.png',
  'Innova Zenix': 'public/cars/innova-zenix.jpg',
  'Fortuner GR': 'public/cars/fortuner-gr.jpg',
  'Hiace Commuter': 'public/cars/hiace.jpg',
  'Alphard': 'public/cars/alphard.jpg',
};

async function processImage(filePath) {
  const input = fs.readFileSync(filePath);
  const output = await sharp(input)
    .rotate()
    .resize(1400, 900, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72 })
    .toBuffer();
  return `data:image/webp;base64,${output.toString('base64')}`;
}

async function main() {
  const cars = await prisma.car.findMany();

  for (const car of cars) {
    const imgPath = imageMap[car.name];
    if (!imgPath || !fs.existsSync(imgPath)) {
      console.log(`Gambar tidak ditemukan untuk ${car.name}, lewati.`);
      continue;
    }

    // Skip jika sudah ada gambar
    if (car.image_url) {
      console.log(`${car.name} sudah punya gambar, lewati.`);
      continue;
    }

    console.log(`Memproses gambar ${car.name}...`);
    const imageUrl = await processImage(imgPath);
    await prisma.car.update({
      where: { id: car.id },
      data: { image_url: imageUrl },
    });
    console.log(`Selesai: ${car.name}`);
  }
  console.log('Semua gambar selesai diproses!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
