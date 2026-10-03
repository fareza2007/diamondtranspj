export const metadata = {
  title: "Kontak - Diamond Trans",
  description: "Hubungi Diamond Trans untuk reservasi rental mobil di Lombok dan Bali.",
};

export default function KontakPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-sand/20 py-14 border-b border-sand/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Hubungi Kami</h1>
          <p className="text-charcoal/70 leading-relaxed">
            Ada pertanyaan atau ingin reservasi langsung? Tim kami siap melayani Anda.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Informasi Kontak</h2>
            
            {[
              {
                icon: "📱",
                title: "WhatsApp (Utama)",
                detail: "0877-3969-4731",
                sub: "Respons cepat, tersedia 07.00 – 22.00 WITA",
                href: "https://wa.me/6283129442611",
                cta: "Chat Sekarang",
              },
              {
                icon: "📧",
                title: "Email",
                detail: "diamondtrans2026@gmail.com",
                sub: "Untuk permintaan resmi atau invoice",
                href: "mailto:diamondtrans2026@gmail.com",
                cta: "Kirim Email",
              },
              {
                icon: "📍",
                title: "Kantor Operasional",
                detail: "Lombok, Nusa Tenggara Barat",
                sub: "Wilayah operasional: Lombok & Bali",
                href: null,
                cta: null,
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-sand/30 shadow-sm flex gap-4 items-start">
                <div className="text-3xl shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal">{item.title}</h3>
                  <p className="text-charcoal font-bold mt-1">{item.detail}</p>
                  <p className="text-sm text-charcoal/60 mt-0.5">{item.sub}</p>
                  {item.href && item.cta && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm font-semibold text-gold hover:text-charcoal transition-colors"
                    >
                      {item.cta} →
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Business Hours */}
            <div className="bg-sand/20 rounded-2xl p-6 border border-sand/30">
              <h3 className="font-bold text-charcoal mb-4">🕐 Jam Operasional</h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: "Senin – Jumat", hours: "07.00 – 22.00 WITA" },
                  { day: "Sabtu – Minggu", hours: "07.00 – 22.00 WITA" },
                  { day: "Hari Libur Nasional", hours: "08.00 – 20.00 WITA" },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between">
                    <span className="text-charcoal/70">{row.day}</span>
                    <span className="font-semibold text-charcoal">{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Kirim Pesan Langsung</h2>

            <div className="bg-white rounded-2xl p-8 border border-sand/30 shadow-sm text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-charcoal mb-2">WhatsApp adalah cara tercepat</h3>
              <p className="text-charcoal/70 text-sm mb-6">
                Sebagian besar konfirmasi pesanan kami selesaikan dalam 5 menit via WhatsApp. Tidak perlu isi formulir panjang — cukup chat langsung!
              </p>
              <a
                href="https://wa.me/6283129442611?text=Halo%20Diamond%20Trans%2C%20saya%20ingin%20bertanya%20tentang%20rental%20mobil."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-4 rounded-xl transition-colors text-lg shadow-md"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Chat WhatsApp Sekarang
              </a>

              <div className="mt-6 pt-6 border-t border-sand/30 grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Respons", value: "< 5 Menit" },
                  { label: "Rating", value: "⭐ 4.9/5" },
                  { label: "Pelanggan", value: "1.000+" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-bold text-charcoal text-sm">{stat.value}</p>
                    <p className="text-xs text-charcoal/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="bg-gold/10 rounded-2xl p-6 border border-gold/20">
              <h3 className="font-bold text-charcoal mb-3">💡 Pertanyaan Umum</h3>
              <ul className="text-sm text-charcoal/80 space-y-2">
                <li>→ Apakah ada biaya antar-jemput ke bandara? <strong>Tidak ada biaya tambahan.</strong></li>
                <li>→ Berapa minimal durasi sewa? <strong>Minimal 1 hari (24 jam).</strong></li>
                <li>→ Apakah tersedia untuk event MotoGP? <strong>Ya, dengan harga paket GP.</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
