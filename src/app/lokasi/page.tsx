export const metadata = {
  title: "Area Layanan - Diamond Trans",
  description: "Layanan rental mobil Diamond Trans mencakup seluruh wilayah Lombok dan Bali termasuk bandara, hotel, dan destinasi wisata utama.",
};

const lombokLocations = [
  { name: "Bandara Internasional Lombok (BIL)", desc: "Jemput & antar di Terminal Kedatangan" },
  { name: "Mataram City", desc: "Seluruh area Kota Mataram" },
  { name: "Senggigi", desc: "Hotel & resort di kawasan Senggigi" },
  { name: "Sirkuit Mandalika", desc: "Termasuk paket khusus event MotoGP" },
  { name: "Kuta Lombok", desc: "Area pantai selatan Lombok" },
  { name: "Pelabuhan Bangsal", desc: "Akses ke Gili Trawangan & Gili Air" },
  { name: "Sembalun & Rinjani", desc: "Trek menuju Gunung Rinjani" },
  { name: "Selong Belanak", desc: "Pantai barat daya Lombok" },
];

const baliLocations = [
  { name: "Bandara Ngurah Rai (DPS)", desc: "Jemput & antar di Terminal Internasional/Domestik" },
  { name: "Kuta & Legian", desc: "Pusat wisata dan belanja" },
  { name: "Seminyak & Canggu", desc: "Kawasan hip dan beach club" },
  { name: "Ubud", desc: "Budaya dan alam pedesaan Bali" },
  { name: "Sanur", desc: "Akses pelabuhan ke Nusa Penida" },
  { name: "Nusa Dua & ITDC", desc: "Kawasan hotel berbintang" },
  { name: "Uluwatu & Jimbaran", desc: "Tebing ikonik dan sunset dinner" },
  { name: "Pelabuhan Padang Bai", desc: "Penyeberangan ke Lombok & Gili" },
];

export default function LokasiPage() {
  return (
    <div className="bg-[#040404] min-h-screen">
      {/* Header */}
      <section className="bg-[#0a0a0a] py-16 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">Area Layanan Kami</h1>
          <p className="text-white/70 leading-relaxed">
            Diamond Trans melayani penjemputan dan pengantaran di seluruh wilayah Lombok dan Bali. Mulai dari bandara, hotel, hingga destinasi wisata terpencil.
          </p>
        </div>
      </section>

      {/* Map Info Banner */}
      <section className="py-10 bg-[#0a0a0a]/50 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl font-bold text-gold">2</p>
              <p className="text-white/60 text-sm mt-1 uppercase tracking-wider">Pulau Tujuan</p>
            </div>
            <div className="p-4 border-x border-white/10">
              <p className="text-3xl font-bold text-gold">16+</p>
              <p className="text-white/60 text-sm mt-1 uppercase tracking-wider">Titik Penjemputan</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-gold">24/7</p>
              <p className="text-white/60 text-sm mt-1 uppercase tracking-wider">Siap Melayani</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Lombok */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Lombok</h2>
                <p className="text-sm text-gold/80 font-medium">Nusa Tenggara Barat</p>
              </div>
            </div>
            <div className="space-y-4">
              {lombokLocations.map((loc) => (
                <div key={loc.name} className="bg-[#0a0a0a] rounded-xl p-5 border border-white/10 flex items-start gap-4 hover:border-gold/30 transition-colors">
                  <div className="mt-1">
                    <div className="w-2 h-2 rotate-45 bg-gold rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{loc.name}</h3>
                    <p className="text-sm text-white/60 mt-1">{loc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bali */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Bali</h2>
                <p className="text-sm text-gold/80 font-medium">Provinsi Bali</p>
              </div>
            </div>
            <div className="space-y-4">
              {baliLocations.map((loc) => (
                <div key={loc.name} className="bg-[#0a0a0a] rounded-xl p-5 border border-white/10 flex items-start gap-4 hover:border-gold/30 transition-colors">
                  <div className="mt-1">
                    <div className="w-2 h-2 rotate-45 bg-gold rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{loc.name}</h3>
                    <p className="text-sm text-white/60 mt-1">{loc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Not listed CTA */}
        <div className="mt-20 bg-[#0a0a0a] rounded-3xl p-8 md:p-12 text-center text-white border border-gold/20">
          <h3 className="text-3xl font-bold mb-4">Tujuan tidak ada dalam daftar?</h3>
          <p className="text-white/70 mb-8 max-w-lg mx-auto text-lg">
            Hubungi kami langsung. Kami siap mengakomodasi rute khusus di luar daftar standar di atas.
          </p>
          <a
            href="https://wa.me/6283129442611?text=Halo%20Diamond%20Trans%2C%20saya%20ingin%20tanya%20apakah%20anda%20melayani%20rute%20ke..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gold hover:bg-gold/90 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-lg"
          >
            Tanya via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
