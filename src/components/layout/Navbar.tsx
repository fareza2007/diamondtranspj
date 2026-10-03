'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
              className="mt-2 bg-gold text-white text-center px-5 py-3 rounded-md font-medium"
            >
              📱 Pesan via WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
