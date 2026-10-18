import Link from "next/link";
import Image from "next/image";
import HeroSearch from "@/components/ui/HeroSearch";
import { formatEventRange } from "@/lib/gp";
import { getCars, getEvents, getPackages } from "@/lib/db";

export const metadata = {
  title: "Beranda - Diamond Trans Rental Mobil Lombok & Bali",
  description: "Platform rental mobil terpercaya di Lombok dan Bali. Armada lengkap, paket tour hotel + travel, harga transparan, konfirmasi instan via WhatsApp.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cars, gpEvents, packages] = await Promise.all([
    getCars(true, 3),
    getEvents(true),
    getPackages(true),
  ]);

  const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WA || "6283129442611";

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
              <p className="text-gold text-sm font-semibold mb-2 tracking-[0.2em] uppercase">Informasi Event</p>
              <h2 className="text-3xl font-bold text-white mb-3">Event yang Sedang Berlangsung</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Saat tanggal sewa bertepatan dengan event di bawah, harga khusus event berlaku otomatis.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gpEvents.map((event) => (
                <div key={event.id} className="bg-[#0a0a0a] rounded-2xl p-5 border border-gold/20">
                  <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">Event Aktif</p>
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

      {/* Paket Wisata: Mobil + Hotel + Travel */}
      {packages.length > 0 && (
        <section className="py-20 bg-[#070707] border-y border-white/5 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-gold text-sm font-semibold mb-2 tracking-[0.2em] uppercase">All-in-One Experience</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Paket Liburan <span className="text-gold">Mobil + Hotel + Travel</span>
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
                Nikmati liburan tanpa pusing mengatur transportasi, penginapan, dan rute wisata. Semua sudah kami siapkan dengan standar terbaik Diamond Trans.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const waMessage = `Halo Diamond Trans! Saya tertarik untuk memesan:\n\n*${pkg.name}*\nDurasi: ${pkg.duration}\nHarga: Rp ${Number(pkg.price).toLocaleString('id-ID')}\n\nApakah paket ini masih tersedia untuk jadwal saya? Terima kasih.`;
                const waLink = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waMessage)}`;

                return (
                  <div
                    key={pkg.id}
                    className="bg-[#0c0c0c] rounded-2xl overflow-hidden border border-white/10 hover:border-gold/40 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image & Badge */}
                      <div className="relative h-48 w-full bg-white/5 overflow-hidden">
                        {pkg.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={pkg.image_url}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                            Diamond Trans Paket
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent"></div>
                        
                        {pkg.badge && (
                          <span className="absolute top-3 left-3 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {pkg.badge}
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white/90 text-xs px-2.5 py-1 rounded-lg border border-white/10">
                          {pkg.duration}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 md:p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">
                            {pkg.name}
                          </h3>
                          <p className="text-xs text-white/60 mt-1">{pkg.tagline}</p>
                        </div>

                        {/* 3 Pillars: Mobil, Hotel, Travel (SVG Silhouette Icons) */}
                        <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                          {/* Mobil / Armada */}
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zM3 9h18M5 14h14M4 14l1.5-6h13L20 14" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-white">Armada & Transport</p>
                              <p className="text-white/60 leading-relaxed mt-0.5">{pkg.car_details}</p>
                            </div>
                          </div>

                          {/* Hotel / Akomodasi */}
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-white">Akomodasi Hotel</p>
                              <p className="text-white/60 leading-relaxed mt-0.5">{pkg.hotel_details}</p>
                            </div>
                          </div>

                          {/* Tour / Rute Wisata */}
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-white">Rute Wisata & Tour</p>
                              <p className="text-white/60 leading-relaxed mt-0.5">{pkg.travel_details}</p>
                            </div>
                          </div>
                        </div>

                        {/* Highlights */}
                        {pkg.highlights && pkg.highlights.length > 0 && (
                          <div className="pt-2 border-t border-white/5">
                            <p className="text-[11px] font-semibold text-gold/90 uppercase tracking-wider mb-1.5">Fasilitas Termasuk:</p>
                            <ul className="grid grid-cols-1 gap-1.5 text-[11px] text-white/70">
                              {pkg.highlights.map((h, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer / Booking */}
                    <div className="p-5 md:p-6 pt-0 border-t border-white/10 mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-white/50">Mulai dari</p>
                        <p className="text-lg font-bold text-white">
                          Rp {Number(pkg.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gold hover:bg-gold/90 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-gold/20 flex items-center gap-1.5"
                      >
                        Pesan Paket
                      </a>
                    </div>
                  </div>
                );
              })}
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
                    <p className="text-xs text-gold/90 flex items-center gap-1.5 font-medium">
                      <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Lepas Kunci &amp; Dengan Sopir</span>
                    </p>
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
            href={`https://wa.me/${ADMIN_WA}?text=Halo%20Diamond%20Trans%2C%20saya%20ingin%20mengetahui%20ketersediaan%20armada%20dan%20paket%20wisata.`}
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
