'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  const links = [
    { label: 'Beranda', href: '/' },
    { label: 'Armada Kami', href: '/armada' },
    { label: 'Lokasi', href: '/lokasi' },
    { label: 'Kontak', href: '/kontak' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#040404]/90 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center bg-white/10 p-2 rounded-lg">
            <Image src="/logo_cropped.png" alt="Diamond Trans Logo" width={200} height={60} className="h-10 w-auto object-contain brightness-0 invert" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  pathname === link.href
                    ? 'text-gold border-b-2 border-gold pb-0.5'
                    : 'text-white/60 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/6283129442611"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-md hover:bg-white/20 transition-colors font-medium shadow-sm"
            >
              Pesan via WA
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/80 hover:text-gold focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0a] shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-gold/10 text-gold'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/6283129442611"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-gold hover:bg-gold/90 text-white text-center px-5 py-3 rounded-md font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>Pesan via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
