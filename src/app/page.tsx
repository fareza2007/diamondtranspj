import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import HeroSearch from "@/components/ui/HeroSearch";
import { formatEventRange } from "@/lib/gp";

export const metadata = {
  title: "Beranda - Diamond Trans Rental Mobil Lombok & Bali",
  description: "Platform rental mobil terpercaya di Lombok dan Bali. Armada lengkap, harga transparan, konfirmasi instan via WhatsApp.",
};

export const dynamic = "force-dynamic";

const reviews = [
  {
    name: "Rizal A.",
    rating: 5,
    comment: "Pelayanan sangat memuaskan! Mobil bersih dan sopir sangat ramah. Akan booking lagi saat ke Lombok.",
    date: "Agustus 2024",
    location: "Jakarta",
  },
  {
    name: "Sarah M.",
    rating: 5,
    comment: "Proses booking via WA sangat cepat dan responsif. Harga sesuai dan tidak ada biaya tersembunyi.",
    date: "September 2024",
    location: "Surabaya",
  },
  {
    name: "David K.",
    rating: 5,
    comment: "Sewa Alphard untuk acara pernikahan. Tepat waktu dan kondisi mobil sangat prima. Highly recommended!",
    date: "Oktober 2024",
    location: "Denpasar",
  },
];

export default async function Home() {
  let cars: any[] = [];
  let gpEvents: any[] = [];
  try {
    cars = await prisma.car.findMany({
      where: { status: "available" },
      orderBy: { price_per_day: 'asc' },
      take: 3,
    });
  } catch (e) {
    // DB not connected, use empty
  }
  try {
    gpEvents = await prisma.gpEvent.findMany({
      where: { is_active: true },
      orderBy: { start_date: "asc" },
    });
  } catch {
    gpEvents = [];
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/hero-landscape.jpg"
          alt="Keindahan Lombok dan Bali"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-charcoal/60"></div>
        {/* Bottom fade to blend smoothly into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <p className="text-gold text-sm font-semibold mb-4 tracking-[0.2em] uppercase">
              Diamond Trans
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Eksplorasi Keindahan <span className="text-gold">Lombok & Bali</span> Bersama Kami
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Pilih dari armada terawat kami, siap memberikan Anda pengalaman perjalanan yang aman, nyaman, dan bebas ribet.
            </p>

            {/* Quick Search Card */}
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-12 bg-background relative -mt-8 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-[#0a0a0a] rounded-xl p-5 shadow-sm border border-white/10 flex items-center gap-4 hover:shadow-md hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Layanan 24 Jam</h3>
                <p className="text-xs text-white/60 mt-0.5">Siap melayani kapan saja</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0a0a0a] rounded-xl p-5 shadow-sm border border-white/10 flex items-center gap-4 hover:shadow-md hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Tepat Waktu</h3>
                <p className="text-xs text-white/60 mt-0.5">Antar jemput lokasi</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0a0a0a] rounded-xl p-5 shadow-sm border border-white/10 flex items-center gap-4 hover:shadow-md hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Staf Ramah</h3>
                <p className="text-xs text-white/60 mt-0.5">Pengemudi profesional</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0a0a0a] rounded-xl p-5 shadow-sm border border-white/10 flex items-center gap-4 hover:shadow-md hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Armada Terawat</h3>
                <p className="text-xs text-white/60 mt-0.5">Bersih dan nyaman</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {gpEvents.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-gold text-sm font-semibold mb-2 tracking-[0.2em] uppercase">Event GP</p>
              <h2 className="text-3xl font-bold text-white mb-3">Periode Event MotoGP</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Saat tanggal sewa bertepatan dengan event di bawah, harga khusus GP berlaku otomatis.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gpEvents.map((event) => (
                <div key={event.id} className="bg-[#0a0a0a] rounded-2xl p-5 border border-gold/20">
                  <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">MotoGP</p>
                  <h3 className="text-lg font-bold text-white">{event.name}</h3>
                  <p className="text-sm text-white/80 mt-2">{formatEventRange(event.start_date, event.end_date)}</p>
                  {event.location && <p className="text-xs text-white/50 mt-1">{event.location}</p>}
                  {event.description && <p className="text-sm text-white/60 mt-3">{event.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Cars Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Armada Favorit</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Pilihan mobil terbaik kami yang sering disewa oleh wisatawan lokal maupun mancanegara.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car.id} className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <div className="w-full bg-transparent overflow-hidden">
                  {car.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={car.image_url} alt={car.name} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="text-center text-white/30 h-48 flex flex-col justify-center bg-white/5">
                      <svg className="w-12 h-12 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                      </svg>
                      <span className="text-sm font-medium">{car.name}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{car.name}</h3>
                    <span className="bg-gold/20 text-gold text-xs font-semibold px-2 py-1 rounded capitalize">{car.brand}</span>
                  </div>
                  <p className="text-sm text-white/60 mb-1 capitalize">{car.transmission} • {car.seats} Kursi</p>
                  {car.with_keyless_available && car.with_driver_available && (
                    <p className="text-xs text-gold/80">✓ Lepas Kunci & Dengan Sopir</p>
                  )}
                  {!car.with_keyless_available && (
                    <p className="text-xs text-white/50">Wajib Dengan Sopir</p>
                  )}
                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-white/60">Mulai dari</p>
                      <p className="text-lg font-bold text-white">
                        Rp {Number(car.price_per_day).toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-white/60">/hari</span>
                      </p>
                    </div>
                    <Link href={`/pesan/${car.id}`} className="bg-gold text-white hover:bg-gold/80 px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
                      Pesan
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/armada" className="inline-block bg-gold/10 hover:bg-gold/20 text-gold font-semibold px-8 py-3 rounded-xl transition-colors border border-gold/20">
              Lihat Semua Armada →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Siap Memulai Perjalanan?</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Hubungi kami sekarang dan dapatkan konfirmasi ketersediaan armada dalam hitungan menit.
          </p>
          <a
            href="https://wa.me/6285923634253?text=Halo%20Diamond%20Trans%2C%20saya%20ingin%20mengetahui%20ketersediaan%20armada."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg text-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Hubungi Kami via WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
