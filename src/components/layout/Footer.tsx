"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) return null;

  const lombokAreas = [
    "Bandara Internasional Lombok (BIL)",
    "Mataram City",
    "Senggigi",
    "Sirkuit Mandalika",
    "Gili Trawangan (Pelabuhan Bangsal)",
    "Kuta Lombok",
  ];

  const baliAreas = [
    "Bandara Ngurah Rai (DPS)",
    "Kuta & Legian",
    "Seminyak & Canggu",
    "Ubud",
    "Sanur & Nusa Dua",
    "Pelabuhan Padang Bai",
  ];

  return (
    <footer className="bg-charcoal text-white/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block bg-white/10 px-4 py-2 rounded-xl shadow-sm">
              <Image src="/logo_cropped.png" alt="Diamond Trans Logo" width={200} height={60} className="h-10 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Layanan rental mobil terpercaya untuk wisatawan di Lombok dan Bali. Armada terawat, harga transparan, konfirmasi cepat via WhatsApp.
            </p>
            <a
              href="https://wa.me/6285923634253"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Chat WhatsApp
            </a>
          </div>

          {/* Lombok Area */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Area Layanan Lombok</h3>
            <ul className="space-y-2">
              {lombokAreas.map((area) => (
                <li key={area} className="text-sm text-white/60 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/60 shrink-0"></span>
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Bali Area */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Area Layanan Bali</h3>
            <ul className="space-y-2">
              {baliAreas.map((area) => (
                <li key={area} className="text-sm text-white/60 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sand/60 shrink-0"></span>
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Navigasi</h3>
            <ul className="space-y-2 mb-6">
              {[
                { label: "Beranda", href: "/" },
                { label: "Katalog Armada", href: "/armada" },
                { label: "Area Layanan", href: "/lokasi" },
                { label: "Kontak Kami", href: "/kontak" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Kontak</h3>
            <p className="text-sm text-white/60">
              📞 0859-2363-4253<br />
              📧 diamondtrans2026@gmail.com<br />
              📍 Lombok, Nusa Tenggara Barat
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <p>&copy; {currentYear} Diamond Trans. Semua hak dilindungi.</p>
          <p>Rental Mobil Lombok & Bali · Terpercaya sejak 2018</p>
        </div>
      </div>
    </footer>
  );
}
