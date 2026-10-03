const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.car.deleteMany();

  const cars = [
    {
      name: 'All New Avanza',
      brand: 'Toyota',
      transmission: 'matic',
      seats: 7,
      price_per_day: 350000,
      price_lepas_kunci: 350000,
      price_lepas_kunci_gp: 500000,
      price_dengan_sopir: 700000,
      price_dengan_sopir_gp: 1200000,
      driver_duration_hours: 12,
      image_url: '/cars/avanza.jpg',
      with_driver_available: true,
      with_keyless_available: true,
    },
    {
      name: 'Brio',
      brand: 'Honda',
      transmission: 'matic',
      seats: 5,
      price_per_day: 300000,
      price_lepas_kunci: 300000,
      price_lepas_kunci_gp: 500000,
      price_dengan_sopir: 600000,
      price_dengan_sopir_gp: 800000,
      driver_duration_hours: 12,
      image_url: '/cars/brio.jpg',
      with_driver_available: true,
      with_keyless_available: true,
    },
    {
      name: 'Innova Reborn',
      brand: 'Toyota',
      transmission: 'matic',
      seats: 7,
      price_per_day: 450000,
      price_lepas_kunci: 450000,
      price_lepas_kunci_gp: null,
      price_dengan_sopir: 900000,
      price_dengan_sopir_gp: 1500000,
      driver_duration_hours: 12,
      image_url: '/cars/innova-reborn.jpg',
      with_driver_available: true,
      with_keyless_available: true,
    },
    {
      name: 'Innova Zenix',
      brand: 'Toyota',
      transmission: 'matic',
      seats: 7,
      price_per_day: 650000,
      price_lepas_kunci: 650000,
      price_lepas_kunci_gp: null,
      price_dengan_sopir: 1000000,
      price_dengan_sopir_gp: 1600000,
      driver_duration_hours: 12,
      image_url: '/cars/innova-zenix.jpg',
      with_driver_available: true,
      with_keyless_available: true,
    },
    {
      name: 'Fortuner GR',
      brand: 'Toyota',
      transmission: 'matic',
      seats: 7,
      price_per_day: 1100000,
      price_lepas_kunci: 1100000,
      price_lepas_kunci_gp: null,
      price_dengan_sopir: 1500000,
      price_dengan_sopir_gp: 2500000,
      driver_duration_hours: 12,
      image_url: '/cars/fortuner-gr.jpg',
      with_driver_available: true,
      with_keyless_available: true,
    },
    {
      name: 'Xpander',
      brand: 'Mitsubishi',
      transmission: 'matic',
      seats: 7,
      price_per_day: 400000,
      price_lepas_kunci: 400000,
      price_lepas_kunci_gp: 600000,
      price_dengan_sopir: 750000,
      price_dengan_sopir_gp: 800000,
      driver_duration_hours: 12,
      image_url: '/cars/xpander.jpg',
      with_driver_available: true,
      with_keyless_available: true,
    },
    {
      name: 'Hiace Commuter',
      brand: 'Toyota',
      transmission: 'manual',
      seats: 15,
      price_per_day: 1200000,
      price_lepas_kunci: null,
      price_lepas_kunci_gp: null,
      price_dengan_sopir: 1200000,
      price_dengan_sopir_gp: 2000000,
      driver_duration_hours: 12,
      image_url: '/cars/hiace.jpg',
      with_driver_available: true,
      with_keyless_available: false,
    },
    {
      name: 'Alphard',
      brand: 'Toyota',
      transmission: 'matic',
      seats: 7,
      price_per_day: 2500000,
      price_lepas_kunci: null,
      price_lepas_kunci_gp: null,
      price_dengan_sopir: 2500000,
      price_dengan_sopir_gp: 2800000,
      driver_duration_hours: 12,
      image_url: '/cars/alphard.jpg',
      with_driver_available: true,
      with_keyless_available: false,
    },
    {
      name: 'All New Veloz',
      brand: 'Toyota',
      transmission: 'matic',
      seats: 7,
      price_per_day: 500000,
      price_lepas_kunci: 500000,
      price_lepas_kunci_gp: 700000,
      price_dengan_sopir: 800000,
      price_dengan_sopir_gp: 1300000,
      driver_duration_hours: 12,
      image_url: '/cars/veloz.png',
      with_driver_available: true,
      with_keyless_available: true,
    },
  ];

  for (const car of cars) {
    await prisma.car.create({ data: car });
  }

  console.log('Database seeded with cars!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
