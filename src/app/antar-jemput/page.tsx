import { getTransfers } from "@/lib/db";
import TransferSection from "@/components/ui/TransferSection";

export const metadata = {
  title: "Pick Up Service & Antar Jemput Bandara Lombok - Diamond Trans",
  description:
    "Layanan antar jemput Bandara Internasional Lombok (BIL) ke Mataram, Senggigi, Kuta Mandalika, Bangsal (Gili Trawangan), dan seluruh area Lombok. Tarif flat pasti, all-in sopir & BBM.",
};

export const dynamic = "force-dynamic";

export default async function AntarJemputPage() {
  const transfers = await getTransfers(true);
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WA || "6285137352454";

  return (
    <div className="bg-background min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Hero Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 px-3.5 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-widest mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Layanan Resmi Diamond Trans</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Pick Up Service <span className="text-gold">Bandara Lombok</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            Layanan penjemputan &amp; pengantaran bandara (*Airport Transfer*) terpercaya di Lombok. Tarif pasti, tanpa biaya tersembunyi, sudah termasuk mobil prima, pengemudi ramah, dan BBM.
          </p>
        </div>

        {/* Interactive Transfer Section & Full Pricing Table */}
        <TransferSection transfers={transfers} adminWa={adminWa} />
      </div>
    </div>
  );
}
