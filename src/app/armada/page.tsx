import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Katalog Armada - Diamond Trans",
  description: "Pilih mobil terbaik untuk perjalanan Anda di Lombok dan Bali.",
};

export default async function ArmadaPage() {
  // Fetch cars from database
  let cars: any[] = [];
  try {
    cars = await prisma.car.findMany({
      where: { status: "available" },
      orderBy: { price_per_day: 'asc' }
    });
  } catch (error) {
    console.error("Failed to fetch cars:", error);
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Katalog Armada</h1>
          <p className="text-white/70">
            Temukan kendaraan yang paling sesuai dengan kebutuhan perjalanan Anda. Kami menyediakan berbagai pilihan mulai dari city car hingga premium MPV.
          </p>
        </div>


        {/* Grid Catalog */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
              {/* Image container - full width, no padding, no fixed height so it hugs the image exactly */}
              <div className="w-full bg-transparent overflow-hidden">
                {car.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={car.image_url}
                    alt={car.name}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-white/30 h-52 bg-white/5">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span className="text-sm font-medium">{car.name}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-white">{car.name}</h3>
                  <span className="bg-gold/20 text-gold text-xs font-semibold px-2 py-1 rounded-md capitalize shrink-0 ml-2">{car.brand}</span>
                </div>
                <p className="text-sm text-white/60 mb-1 capitalize">{car.transmission} • {car.seats} Kursi</p>
                {car.with_keyless_available && car.with_driver_available && (
                  <p className="text-xs text-gold/80 mb-3">✓ Lepas Kunci &amp; Dengan Sopir</p>
                )}
                {!car.with_keyless_available && (
                  <p className="text-xs text-white/40 mb-3">Wajib Dengan Sopir</p>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-white/60">Mulai dari</p>
                    <p className="text-lg font-bold text-white">
                      Rp {Number(car.price_per_day).toLocaleString('id-ID')}
                      <span className="text-sm font-normal text-white/60">/hari</span>
                    </p>
                  </div>
                  <Link href={`/pesan/${car.id}`} className="bg-gold text-white hover:bg-gold/80 transition-colors px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm">
                    Pesan
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
