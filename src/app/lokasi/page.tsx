export const metadata = {
  title: "Area Layanan Lombok - Diamond Trans",
  description:
    "Layanan rental mobil & antar-jemput Diamond Trans mencakup seluruh wilayah Pulau Lombok termasuk Bandara Internasional Lombok (BIL), Mataram, Senggigi, Mandalika, dan 3 Gili.",
};

const lombokRegions = [
  {
    title: "Lombok Tengah & Bandara",
    badge: "Pusat Kedatangan & Sirkuit GP",
    locations: [
      { name: "Bandara Internasional Lombok (BIL)", desc: "Terminal Kedatangan & Keberangkatan domestik/internasional" },
      { name: "Sirkuit Internasional Mandalika", desc: "Akses utama event MotoGP, WSBK & kawasan KEK Mandalika" },
      { name: "Pantai Kuta Lombok", desc: "Kawasan hotel, cafe, dan pusat aktivitas Mandalika" },
      { name: "Tanjung Aan & Bukit Merese", desc: "Destinasi sunset & pantai pasir merica terbaik" },
      { name: "Pantai Selong Belanak & Mawun", desc: "Surga surfing dan teluk eksotis Lombok Tengah" },
      { name: "Desa Adat Sade & Ende", desc: "Pusat budaya dan rumah adat suku Sasak Lombok" },
    ],
  },
  {
    title: "Lombok Barat & Kota Mataram",
    badge: "Pusat Bisnis & Resort Pantai",
    locations: [
      { name: "Kota Mataram", desc: "Pusat bisnis, kantor pemerintahan, mall & kuliner khas Lombok" },
      { name: "Kawasan Wisata Senggigi", desc: "Deretan hotel bintang 4 & 5, resort tepi pantai & restoran" },
      { name: "Pantai Batu Layar & Mangsit", desc: "Kawasan resort tenang dan makam bersejarah Batu Layar" },
      { name: "Pelabuhan Lembar", desc: "Pelabuhan penyeberangan kapal ferry utama Lombok – Bali / Banyuwangi" },
      { name: "Sekotong & Gili Nanggu", desc: "Wisata bahari pantai selatan barat Lombok" },
    ],
  },
  {
    title: "Lombok Utara & 3 Gili",
    badge: "Akses Gili & Pegunungan Rinjani",
    locations: [
      { name: "Pelabuhan Bangsal", desc: "Gerbang utama penyeberangan public boat & speed boat ke Gili Trawangan, Meno, Air" },
      { name: "Pelabuhan Teluk Nare", desc: "Dermaga privat speed boat eksklusif menuju 3 Gili" },
      { name: "Kawasan Senaru & Rinjani", desc: "Pintu gerbang pendakian Gn. Rinjani & Air Terjun Sindang Gila / Tiu Kelep" },
      { name: "Desa Adat & Masjid Kuno Bayan", desc: "Wisata sejarah peninggalan Islam kuno Lombok" },
    ],
  },
  {
    title: "Lombok Timur",
    badge: "Wisata Alam & Pelabuhan Ferry",
    locations: [
      { name: "Pelabuhan Kayangan", desc: "Pelabuhan ferry penyeberangan 24 jam menuju Pulau Sumbawa" },
      { name: "Kota Selong", desc: "Pusat administrasi dan perkantoran Lombok Timur" },
      { name: "Kawasan Sembalun", desc: "Lembah indah di kaki Rinjani, agrowisata stroberi & bukit paralayang" },
      { name: "Desa Wisata Tetebatu", desc: "Pemandangan sawah berundak dan udara sejuk pegunungan" },
    ],
  },
];

export default function LokasiPage() {
  return (
    <div className="bg-[#040404] min-h-screen">
      {/* Header */}
      <section className="bg-[#0a0a0a] py-16 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 px-3.5 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-widest mb-4">
            Cakupan Seluruh Pulau Lombok
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Area Layanan <span className="text-gold">Lombok</span>
          </h1>
          <p className="text-white/70 leading-relaxed text-base md:text-lg">
            Diamond Trans melayani rental mobil, pick up service bandara, dan paket tour di seluruh penjuru Pulau Lombok. Driver kami siap mengantar Anda dari bandara ke hotel, pelabuhan, hingga pelosok destinasi wisata.
          </p>
        </div>
      </section>

      {/* Map Info Banner */}
      <section className="py-10 bg-[#0a0a0a]/50 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl font-extrabold text-gold">100%</p>
              <p className="text-white/60 text-sm mt-1 uppercase tracking-wider">Cover Seluruh Lombok</p>
            </div>
            <div className="p-4 border-y sm:border-y-0 sm:border-x border-white/10">
              <p className="text-3xl font-extrabold text-gold">20+</p>
              <p className="text-white/60 text-sm mt-1 uppercase tracking-wider">Titik Penjemputan Utama</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-extrabold text-gold">24/7</p>
              <p className="text-white/60 text-sm mt-1 uppercase tracking-wider">Siap Melayani Kapan Saja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Regions Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {lombokRegions.map((region) => (
            <div
              key={region.title}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-gold/30 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{region.title}</h2>
                    <span className="text-xs text-gold font-semibold uppercase tracking-wider mt-1 block">
                      {region.badge}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {region.locations.map((loc) => (
                    <div
                      key={loc.name}
                      className="bg-[#040404] rounded-xl p-4 border border-white/5 flex items-start gap-3 hover:border-gold/20 transition-colors"
                    >
                      <div className="mt-1.5">
                        <div className="w-2 h-2 rotate-45 bg-gold rounded-xs"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{loc.name}</h3>
                        <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{loc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Not listed CTA */}
        <div className="mt-16 bg-[#0a0a0a] rounded-3xl p-8 md:p-12 text-center text-white border border-gold/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-3">Tujuan Anda tidak ada dalam daftar?</h3>
            <p className="text-white/70 mb-8 text-sm md:text-base leading-relaxed">
              Hubungi kami langsung melalui WhatsApp. Kami siap melayani rute khusus, pengantaran hotel terpencil, maupun paket keliling Lombok sesuai kebutuhan Anda.
            </p>
            <a
              href="https://wa.me/6287796017325?text=Halo%20Diamond%20Trans%2C%20saya%20ingin%20tanya%20layanan%20rute%20ke..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg text-base"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              <span>Chat WhatsApp Langsung</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
