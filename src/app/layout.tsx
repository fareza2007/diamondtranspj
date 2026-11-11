import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://diamondtrans.cloud"),
  title: {
    default: "Diamond Trans - Rental Mobil Lombok & Bali Murah & Terpercaya",
    template: "%s | Diamond Trans",
  },
  description: "Layanan rental mobil terpercaya di Lombok & Bali lepas kunci atau dengan sopir. Paket tour wisata, hotel + travel, dan sewa mobil MotoGP Mandalika terbaik.",
  keywords: [
    "rental mobil lombok",
    "sewa mobil lombok",
    "rental mobil bali",
    "sewa mobil bali",
    "diamond trans",
    "rental mobil mandalika",
    "paket tour lombok",
    "paket wisata lombok",
  ],
  authors: [{ name: "Diamond Trans" }],
  creator: "Diamond Trans",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://diamondtrans.cloud",
    title: "Diamond Trans - Rental Mobil Lombok & Bali",
    description: "Platform rental mobil terpercaya di Lombok dan Bali. Armada lengkap, paket tour hotel + travel, konfirmasi instan via WhatsApp.",
    siteName: "Diamond Trans",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${montserrat.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
