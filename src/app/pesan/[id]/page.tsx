import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingClient from "./BookingClient";
import type { PublicGpEvent } from "@/lib/gp";

export const metadata = {
  title: "Formulir Pemesanan - Diamond Trans",
};

export const dynamic = "force-dynamic";

export default async function PesanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let car = null;
  let events: PublicGpEvent[] = [];
  
  try {
    car = await prisma.car.findUnique({
      where: { id: parseInt(id) }
    });
  } catch (error) {
    console.error("DB error:", error);
  }
  try {
    const gpEvents = await prisma.gpEvent.findMany({
      where: { is_active: true },
      orderBy: { start_date: "asc" },
    });
    events = JSON.parse(JSON.stringify(gpEvents));
  } catch {
    events = [];
  }

  if (!car) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Formulir Pemesanan</h1>
          <p className="text-white/70">Silakan lengkapi detail perjalanan Anda di bawah ini.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Car Details */}
          <div className="md:col-span-1">
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg text-white border-b border-white/10 pb-4 mb-4">Ringkasan Pesanan</h2>
              
              <div className="bg-transparent rounded-lg mb-4 overflow-hidden">
                {car.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={car.image_url} alt={car.name} className="w-full h-auto object-contain" />
                ) : (
                  <div className="h-32 bg-white/5 flex items-center justify-center">
                    <span className="text-xs text-white/40">Foto Mobil</span>
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-white text-xl mb-1">{car.name}</h3>
              <p className="text-sm text-white/60 capitalize mb-4">{car.brand} • {car.transmission}</p>
              
              <div className="flex justify-between items-center py-3 border-t border-white/10">
                <span className="text-sm text-white/80">Harga Mulai Dari</span>
                <span className="font-bold text-white">Rp {Number(car.price_per_day).toLocaleString('id-ID')} /hari</span>
              </div>
              
              <div className="mt-6 bg-gold/10 p-3 rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-white/80">
                  Pembayaran dilakukan setelah pesanan dikonfirmasi via WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="md:col-span-2">
            <div className="bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-white/10 shadow-sm">
              <BookingClient car={car} events={events} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
