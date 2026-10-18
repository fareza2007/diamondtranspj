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
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "WhatsApp (Utama)",
                detail: "0831-2944-2611",
                sub: "Respons cepat, tersedia 07.00 – 22.00 WITA",
                href: "https://wa.me/6283129442611",
                cta: "Chat Sekarang",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Email",
                detail: "diamondtrans2026@gmail.com",
                sub: "Untuk permintaan resmi atau invoice",
                href: "mailto:diamondtrans2026@gmail.com",
                cta: "Kirim Email",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Kantor Operasional",
                detail: "Lombok, Nusa Tenggara Barat",
                sub: "Wilayah operasional: Lombok & Bali",
                href: null,
                cta: null,
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-sand/30 shadow-sm flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal">{item.title}</h3>
                  <p className="text-charcoal font-bold mt-1">{item.detail}</p>
                  <p className="text-sm text-charcoal/60 mt-0.5">{item.sub}</p>
                  {item.href && item.cta && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-gold hover:text-charcoal transition-colors"
                    >
                      <span>{item.cta}</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Business Hours */}
            <div className="bg-sand/20 rounded-2xl p-6 border border-sand/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-charcoal">Jam Operasional</h3>
              </div>
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
              <div className="w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
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
                <div>
                  <p className="font-bold text-charcoal text-sm">&lt; 5 Menit</p>
                  <p className="text-xs text-charcoal/50">Respons</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 font-bold text-charcoal text-sm">
                    <svg className="w-4 h-4 text-gold fill-gold" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>4.9/5</span>
                  </div>
                  <p className="text-xs text-charcoal/50">Rating</p>
                </div>
                <div>
                  <p className="font-bold text-charcoal text-sm">1.000+</p>
                  <p className="text-xs text-charcoal/50">Pelanggan</p>
                </div>
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="bg-gold/10 rounded-2xl p-6 border border-gold/20">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-bold text-charcoal">Pertanyaan Umum</h3>
              </div>
              <ul className="text-sm text-charcoal/80 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0"></span>
                  <span>Apakah ada biaya antar-jemput ke bandara? <strong>Tidak ada biaya tambahan.</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0"></span>
                  <span>Berapa minimal durasi sewa? <strong>Minimal 1 hari (24 jam).</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0"></span>
                  <span>Apakah tersedia untuk event MotoGP? <strong>Ya, dengan harga paket GP.</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
