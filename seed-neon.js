const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Data mobil yang sudah ada di sistem lokal (dari database SQLite sebelumnya)
const cars = [
  {
    name: "Brio",
    brand: "Honda",
    transmission: "Automatic",
    seats: 5,
    price_per_day: 300000,
    price_lepas_kunci: 300000,
    price_dengan_sopir: 600000,
    price_lepas_kunci_gp: 500000,
    price_dengan_sopir_gp: 900000,
    driver_duration_hours: 12,
    image_url: null,
    with_driver_available: true,
    with_keyless_available: true,
  },
  {
    name: "All New Avanza",
    brand: "Toyota",
    transmission: "Automatic",
    seats: 7,
    price_per_day: 350000,
    price_lepas_kunci: 350000,
    price_dengan_sopir: 700000,
    price_lepas_kunci_gp: 550000,
    price_dengan_sopir_gp: 900000,
    driver_duration_hours: 12,
    image_url: null,
    with_driver_available: true,
    with_keyless_available: true,
  },
  {
    name: "Xpander",
    brand: "Mitsubishi",
    transmission: "Automatic",
    seats: 7,
    price_per_day: 400000,
    price_lepas_kunci: 400000,
    price_dengan_sopir: 750000,
    price_lepas_kunci_gp: 600000,
    price_dengan_sopir_gp: 800000,
    driver_duration_hours: 12,
    image_url: null,
    with_driver_available: true,
    with_keyless_available: true,
  },
  {
    name: "Innova Reborn",
    brand: "Toyota",
    transmission: "Automatic",
    seats: 7,
    price_per_day: 450000,
    price_lepas_kunci: 450000,
    price_dengan_sopir: 800000,
    price_lepas_kunci_gp: null,
    price_dengan_sopir_gp: 1400000,
    driver_duration_hours: 12,
    image_url: null,
    with_driver_available: true,
    with_keyless_available: true,
  },
  {
    name: "All New Veloz",
    brand: "Toyota",
    transmission: "Automatic",
    seats: 7,
    price_per_day: 600000,
    price_lepas_kunci: 600000,
    price_dengan_sopir: 900000,
    price_lepas_kunci_gp: null,
    price_dengan_sopir_gp: null,
    driver_duration_hours: 12,
    image_url: null,
    with_driver_available: true,
    with_keyless_available: true,
  },
  {
    name: "Innova Zenix",
    brand: "Toyota",
    transmission: "Automatic",
    seats: 7,
    price_per_day: 650000,
    price_lepas_kunci: 650000,
    price_dengan_sopir: 1000000,
    price_lepas_kunci_gp: null,
    price_dengan_sopir_gp: 2400000,
    driver_duration_hours: 12,
    image_url: null,
    with_driver_available: true,
    with_keyless_available: true,
  },
  {
    name: "Fortuner GR",
    brand: "Toyota",
    transmission: "Automatic",
    seats: 7,
    price_per_day: 1100000,
    price_lepas_kunci: 1100000,
    price_dengan_sopir: 1500000,
    price_lepas_kunci_gp: null,
    price_dengan_sopir_gp: 2500000,
    driver_duration_hours: 12,
    image_url: null,
    with_driver_available: true,
    with_keyless_available: true,
  },
  {
    name: "Hiace Commuter",
    brand: "Toyota",
    transmission: "Manual",
    seats: 15,
    price_per_day: 1200000,
    price_lepas_kunci: null,
    price_dengan_sopir: 1200000,
    price_lepas_kunci_gp: null,
    price_dengan_sopir_gp: 1800000,
    driver_duration_hours: 12,
    image_url: null,
    with_driver_available: true,
    with_keyless_available: false,
  },
  {
    name: "Alphard",
    brand: "Toyota",
    transmission: "Automatic",
    seats: 7,
    price_per_day: 2000000,
    price_lepas_kunci: null,
    price_dengan_sopir: 2000000,
    price_lepas_kunci_gp: null,
    price_dengan_sopir_gp: 2800000,
    driver_duration_hours: 12,
    image_url: null,
    with_driver_available: true,
    with_keyless_available: false,
  },
];

async function main() {
  // Cek dulu apakah sudah ada data
  const count = await prisma.car.count();
  if (count > 0) {
    console.log(`Database sudah memiliki ${count} mobil. Lewati seeding.`);
    return;
  }

  for (const car of cars) {
    const created = await prisma.car.create({ data: car });
    console.log(`Created: ${created.name}`);
  }
  console.log('Seeding selesai!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
