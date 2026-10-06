const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Mengosongkan harga event untuk semua mobil...');
  
  const result = await prisma.car.updateMany({
    data: {
      price_lepas_kunci_gp: null,
      price_dengan_sopir_gp: null,
    },
  });

  console.log(`Berhasil memperbarui ${result.count} mobil. Semua harga event sekarang kosong.`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
