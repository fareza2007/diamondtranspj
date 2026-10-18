const { PrismaClient } = require('@prisma/client');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyB1TSPc1wtvylgrCmaqbMlEVbxgrGHmGb0",
  authDomain: "diamontrans-2ba21.firebaseapp.com",
  projectId: "diamontrans-2ba21",
  storageBucket: "diamontrans-2ba21.firebasestorage.app",
  messagingSenderId: "714453070274",
  appId: "1:714453070274:web:730cd7d9ac3c5c5e4ba65b",
  measurementId: "G-CFVWLSHVEQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const prisma = new PrismaClient();

async function migrate() {
  console.log('Mengambil data dari Neon PostgreSQL...');
  const cars = await prisma.car.findMany({ orderBy: { id: 'asc' } });
  console.log(`Ditemukan ${cars.length} mobil di Neon.`);

  const carsCol = collection(db, 'cars');
  const existingSnap = await getDocs(carsCol);
  console.log(`Jumlah mobil saat ini di Firestore: ${existingSnap.size}`);

  if (existingSnap.size === 0) {
    for (const car of cars) {
      const carData = {
        name: car.name,
        brand: car.brand,
        transmission: car.transmission,
        seats: car.seats,
        price_per_day: car.price_per_day,
        price_lepas_kunci: car.price_lepas_kunci,
        price_dengan_sopir: car.price_dengan_sopir,
        price_lepas_kunci_gp: car.price_lepas_kunci_gp,
        price_dengan_sopir_gp: car.price_dengan_sopir_gp,
        driver_duration_hours: car.driver_duration_hours,
        image_url: car.image_url,
        with_driver_available: car.with_driver_available,
        with_keyless_available: car.with_keyless_available,
        status: car.status || 'available',
        created_at: car.created_at ? car.created_at.toISOString() : new Date().toISOString()
      };
      const docRef = await addDoc(carsCol, carData);
      console.log(`✓ Mobil ${car.name} berhasil dimigrasikan ke Firestore! (ID: ${docRef.id})`);
    }
  } else {
    console.log('Mobil sudah ada di Firestore.');
  }

  // Migrasikan sample paket wisata juga!
  const packagesCol = collection(db, 'packages');
  const pkgSnap = await getDocs(packagesCol);
  if (pkgSnap.size === 0) {
    console.log('Menambahkan sample Paket Wisata (Mobil + Hotel + Travel)...');
    const initialPackages = [
      {
        name: "Paket Eksplor Mandalika & Pantai Selatan",
        tagline: "Mobil + Hotel Bintang 4 + Tour Wisata Lengkap",
        duration: "3 Hari 2 Malam",
        price: 2750000,
        badge: "Paling Populer",
        image_url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
        car_details: "Toyota All New Avanza / Veloz (Termasuk Sopir & BBM)",
        hotel_details: "Hotel Bintang 4 di Kuta Mandalika (2 Malam + Sarapan Pagi)",
        travel_details: "Sirkuit Mandalika, Pantai Kuta, Tanjung Aan, Bukit Merese, Desa Adat Sade",
        highlights: [
          "Antar-jemput Bandara Lombok (BIL)",
          "Sopir merangkap pemandu wisata ramah",
          "Tiket masuk semua destinasi wisata",
          "Bebas tentukan waktu perjalanan"
        ],
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        name: "Paket Eksklusif Gili Trawangan & Sunset Senggigi",
        tagline: "Mobil Nyaman + Resort Tepi Pantai + Snorkeling Trip",
        duration: "4 Hari 3 Malam",
        price: 3950000,
        badge: "Rekomendasi",
        image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        car_details: "Toyota Innova Reborn (Full AC, Sopir Profesional & BBM)",
        hotel_details: "Resort Pantai Senggigi & Hotel Gili Trawangan (3 Malam + Sarapan)",
        travel_details: "Private Speedboat ke 3 Gili (Trawangan, Meno, Air), Snorkeling trip, Sunset Senggigi & Malimbu",
        highlights: [
          "Private Speedboat PP Gili Trawangan",
          "Alat snorkeling & dokumentasi underwater",
          "Makan malam khas Ayam Taliwang",
          "Jadwal fleksibel & VIP treatment"
        ],
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        name: "Paket Wisata Keluarga Sembalun & Rinjani View",
        tagline: "Mobil Lega + Villa Sejuk Sembalun + Agrowisata",
        duration: "3 Hari 2 Malam",
        price: 3200000,
        badge: "Keluarga",
        image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        car_details: "Mitsubishi Xpander / Innova (Sopir Berpengalaman Jalur Pegunungan)",
        hotel_details: "Glamping / Villa Bernuansa Alam Sembalun (2 Malam + Sarapan)",
        travel_details: "Bukit Selong, Kebun Strawberry, Air Terjun Sendang Gile & Tiu Kelep, Desa Adat Senaru",
        highlights: [
          "Pemandu lokal Sembalun",
          "Petik buah strawberry langsung di kebun",
          "Tiket masuk kawasan taman nasional",
          "Mobil prima siap tanjakan pegunungan"
        ],
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];

    for (const pkg of initialPackages) {
      const docRef = await addDoc(packagesCol, pkg);
      console.log(`✓ Paket "${pkg.name}" berhasil ditambahkan! (ID: ${docRef.id})`);
    }
  }

  console.log('Migrasi selesai!');
  process.exit(0);
}

migrate().catch(e => {
  console.error('Error migrasi:', e);
  process.exit(1);
});
