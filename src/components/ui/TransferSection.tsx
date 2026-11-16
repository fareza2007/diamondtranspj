"use client";

import { useState, useMemo } from "react";
import type { TransferRate } from "@/lib/db";

interface TransferSectionProps {
  transfers: TransferRate[];
  adminWa: string;
}

type CarType = "avanza" | "innova" | "hiace" | "bus";

const CAR_OPTIONS: { id: CarType; name: string; capacity: string; tag: string }[] = [
  { id: "avanza", name: "Avanza / Ertiga", capacity: "4-5 Penumpang", tag: "Hemat & Praktis" },
  { id: "innova", name: "Innova Reborn", capacity: "5-6 Penumpang", tag: "Paling Nyaman" },
  { id: "hiace", name: "Elf / Hiace", capacity: "12-14 Penumpang", tag: "Keluarga / Group" },
  { id: "bus", name: "Bus 3/4", capacity: "25-30 Penumpang", tag: "Rombongan Besar" },
];

function formatRupiah(amount: number): string {
  if (!amount || amount === 0) return "-";
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function TransferSection({ transfers, adminWa }: TransferSectionProps) {
  const activeTransfers = useMemo(() => transfers.filter((t) => t.is_active), [transfers]);

  // Calculator state
  const [selectedDestId, setSelectedDestId] = useState<string>(
    activeTransfers.length > 0 ? activeTransfers[0].id : ""
  );
  const [selectedCar, setSelectedCar] = useState<CarType>("innova");
  const [direction, setDirection] = useState<"pickup" | "dropoff">("pickup");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("");
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Search filter for table
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentTransfer = useMemo(() => {
    return activeTransfers.find((t) => t.id === selectedDestId) || activeTransfers[0];
  }, [activeTransfers, selectedDestId]);

  const currentPrice = useMemo(() => {
    if (!currentTransfer) return 0;
    switch (selectedCar) {
      case "avanza":
        return currentTransfer.price_avanza;
      case "innova":
        return currentTransfer.price_innova;
      case "hiace":
        return currentTransfer.price_hiace;
      case "bus":
        return currentTransfer.price_bus;
      default:
        return 0;
    }
  }, [currentTransfer, selectedCar]);

  const filteredTransfers = useMemo(() => {
    if (!searchQuery.trim()) return activeTransfers;
    const q = searchQuery.toLowerCase();
    return activeTransfers.filter(
      (t) =>
        t.destination.toLowerCase().includes(q) ||
        (t.note && t.note.toLowerCase().includes(q))
    );
  }, [activeTransfers, searchQuery]);

  const createWaLink = (
    destName: string,
    carName: string,
    price: number,
    dir: "pickup" | "dropoff",
    date?: string,
    time?: string,
    flight?: string,
    extraNotes?: string
  ) => {
    const dirText = dir === "pickup" ? "Penjemputan dari Bandara (Pick Up)" : "Pengantaran ke Bandara (Drop Off)";
    let msg = `Halo Diamond Trans, saya ingin memesan layanan *Pick Up Service / Antar-Jemput Bandara Lombok*:\n\n`;
    msg += `📍 *Rute*: ${destName}\n`;
    msg += `🔄 *Layanan*: ${dirText}\n`;
    msg += `🚗 *Armada*: ${carName}\n`;
    msg += `💰 *Tarif*: ${formatRupiah(price)} (All-in Mobil + Sopir + BBM)\n`;

    if (date) msg += `📅 *Tanggal*: ${date}\n`;
    if (time) msg += `⏰ *Waktu*: ${time}\n`;
    if (flight) msg += `✈️ *No. Penerbangan*: ${flight}\n`;
    if (extraNotes) msg += `📝 *Catatan*: ${extraNotes}\n`;

    msg += `\nMohon konfirmasi ketersediaan armada dan driver. Terima kasih!`;
    return `https://wa.me/${adminWa}?text=${encodeURIComponent(msg)}`;
  };

  const calculatorWaLink = currentTransfer
    ? createWaLink(
        currentTransfer.destination,
        CAR_OPTIONS.find((c) => c.id === selectedCar)?.name || "Mobil",
        currentPrice,
        direction,
        pickupDate,
        pickupTime,
        flightNumber,
        notes
      )
    : `https://wa.me/${adminWa}`;

  return (
    <div className="space-y-16">
      {/* 1. INTERACTIVE CALCULATOR & DIRECT BOOKING */}
      <section className="bg-gradient-to-b from-[#0d0d0d] to-[#050505] border border-gold/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.2em] inline-block mb-1">
                Kalkulator Tarif Instan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Hitung &amp; Pesan Antar-Jemput Bandara
              </h2>
              <p className="text-white/60 text-sm mt-1">
                Pilih tujuan dan armada favorit Anda untuk melihat tarif pasti tanpa biaya tambahan.
              </p>
            </div>

            {/* Direction toggle */}
            <div className="bg-white/5 p-1 rounded-xl flex items-center border border-white/10 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setDirection("pickup")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  direction === "pickup"
                    ? "bg-gold text-white shadow-md shadow-gold/20"
                    : "text-white/60 hover:text-white"
                }`}
              >
                🛫 Dari Bandara (Pick Up)
              </button>
              <button
                type="button"
                onClick={() => setDirection("dropoff")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  direction === "dropoff"
                    ? "bg-gold text-white shadow-md shadow-gold/20"
                    : "text-white/60 hover:text-white"
                }`}
              >
                🛬 Menuju Bandara (Drop Off)
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Form Left */}
            <div className="lg:col-span-7 space-y-6">
              {/* Destination selector */}
              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
                  1. Pilih Rute / Destinasi
                </label>
                <div className="relative">
                  <select
                    value={selectedDestId}
                    onChange={(e) => setSelectedDestId(e.target.value)}
                    className="w-full bg-[#040404] border border-white/20 focus:border-gold rounded-xl px-4 py-3.5 text-sm text-white font-medium outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {activeTransfers.map((item) => (
                      <option key={item.id} value={item.id} className="bg-[#111] text-white">
                        {item.destination} {item.note ? `— (${item.note})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Car selection cards */}
              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
                  2. Pilih Jenis Kendaraan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CAR_OPTIONS.map((car) => {
                    const isSelected = selectedCar === car.id;
                    return (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => setSelectedCar(car.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? "bg-gold/15 border-gold shadow-md shadow-gold/10"
                            : "bg-[#040404] border-white/10 hover:border-white/25"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded block w-fit mb-1.5 ${
                            isSelected ? "bg-gold text-white" : "bg-white/10 text-white/60"
                          }`}
                        >
                          {car.tag}
                        </span>
                        <h4 className="font-bold text-white text-xs sm:text-sm">{car.name}</h4>
                        <p className="text-[11px] text-white/50 mt-0.5">{car.capacity}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Schedule details (Optional) */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Tanggal Penjemputan
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-[#040404] border border-white/20 focus:border-gold rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Waktu / Jam
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-[#040404] border border-white/20 focus:border-gold rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    No. Penerbangan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: GA-432 / JT-650"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full bg-[#040404] border border-white/20 focus:border-gold rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  Nama Hotel / Alamat Lengkap / Catatan Khusus
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Hotel Sheraton Senggigi, 4 koper besar"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#040404] border border-white/20 focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Price Summary Right Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#121212] to-[#080808] border border-gold/40 rounded-2xl p-6 lg:p-7 shadow-xl flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Ringkasan Pemesanan
                  </span>
                  <span className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Tarif Pasti (Flat Rate)
                  </span>
                </div>

                <div className="space-y-3 text-xs mb-6">
                  <div className="flex justify-between items-start">
                    <span className="text-white/50">Rute:</span>
                    <span className="font-bold text-white text-right max-w-[200px]">
                      {currentTransfer ? currentTransfer.destination : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Layanan:</span>
                    <span className="font-medium text-white">
                      {direction === "pickup" ? "Penjemputan dari Bandara" : "Pengantaran ke Bandara"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Armada Pilihan:</span>
                    <span className="font-semibold text-gold">
                      {CAR_OPTIONS.find((c) => c.id === selectedCar)?.name}
                    </span>
                  </div>
                  {pickupDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/50">Jadwal:</span>
                      <span className="font-medium text-white">
                        {pickupDate} {pickupTime ? `• ${pickupTime}` : ""}
                      </span>
                    </div>
                  )}
                  {flightNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/50">Flight:</span>
                      <span className="font-medium text-white">{flightNumber}</span>
                    </div>
                  )}
                </div>

                <div className="bg-black/50 p-4 rounded-xl border border-white/5 mb-6">
                  <span className="text-xs text-white/50 block mb-1">Total Tarif (All-In):</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gold tracking-tight">
                      {formatRupiah(currentPrice)}
                    </span>
                    <span className="text-[11px] text-white/40">/ sekali jalan</span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sudah termasuk Mobil, Sopir, &amp; BBM. Tidak ada biaya tersembunyi.</span>
                  </p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div>
                <a
                  href={calculatorWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2.5 text-sm group"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  <span>Pesan Sekarang via WhatsApp</span>
                </a>
                <p className="text-center text-[11px] text-white/40 mt-2">
                  Konfirmasi cepat • Driver standby tepat waktu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FULL PRICING TABLE (MATCHING ORIGINAL IMAGE) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-gold text-xs font-semibold uppercase tracking-[0.2em] block mb-1">
              Daftar Tarif Lengkap
            </span>
            <h3 className="text-2xl font-bold text-white">
              Tabel Harga Pick Up Service Bandara Lombok
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Tarif flat sekali jalan (Airport ke Destinasi atau sebaliknya). Sudah termasuk Mobil, Driver, dan BBM.
            </p>
          </div>

          {/* Search box */}
          <div className="relative sm:w-64">
            <input
              type="text"
              placeholder="Cari destinasi / hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/15 focus:border-gold rounded-xl px-3.5 py-2 text-xs text-white outline-none pl-9"
            />
            <svg
              className="w-4 h-4 text-white/40 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white/80 font-bold uppercase tracking-wider text-xs">
                  <th className="py-4 px-6">Destination</th>
                  <th className="py-4 px-5 text-center">
                    <div>Avanza / Ertiga</div>
                    <span className="text-[10px] text-white/40 font-normal lowercase">(4-5 seats)</span>
                  </th>
                  <th className="py-4 px-5 text-center">
                    <div>Innova Reborn</div>
                    <span className="text-[10px] text-white/40 font-normal lowercase">(5-6 seats)</span>
                  </th>
                  <th className="py-4 px-5 text-center">
                    <div>Elf / Hiace</div>
                    <span className="text-[10px] text-white/40 font-normal lowercase">(12-14 seats)</span>
                  </th>
                  <th className="py-4 px-5 text-center">
                    <div>Bus 3/4</div>
                    <span className="text-[10px] text-white/40 font-normal lowercase">(25-30 seats)</span>
                  </th>
                  <th className="py-4 px-6 text-right">Pesan Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-white/50 text-sm">
                      Tidak ada rute yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="py-4 px-6">
                        <span className="font-bold text-white group-hover:text-gold transition-colors block">
                          {item.destination}
                        </span>
                        {item.note && (
                          <span className="text-xs text-white/50 block mt-0.5">
                            {item.note}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center font-semibold text-white/90">
                        {formatRupiah(item.price_avanza)}
                      </td>
                      <td className="py-4 px-5 text-center font-bold text-gold">
                        {formatRupiah(item.price_innova)}
                      </td>
                      <td className="py-4 px-5 text-center font-semibold text-white/90">
                        {formatRupiah(item.price_hiace)}
                      </td>
                      <td className="py-4 px-5 text-center font-semibold text-white/90">
                        {formatRupiah(item.price_bus)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <a
                          href={createWaLink(
                            item.destination,
                            "Innova / Avanza",
                            item.price_innova || item.price_avanza,
                            "pickup"
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gold/15 hover:bg-gold text-gold hover:text-white border border-gold/40 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all inline-flex items-center gap-1.5"
                        >
                          <span>Pesan WA</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile / Tablet Cards View */}
        <div className="lg:hidden space-y-4">
          {filteredTransfers.map((item) => (
            <div
              key={item.id}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3 pb-2 border-b border-white/10">
                <div>
                  <h4 className="font-bold text-white text-base">{item.destination}</h4>
                  {item.note && <p className="text-xs text-white/50 mt-0.5">{item.note}</p>}
                </div>
                <span className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                  Flat Rate
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#040404] p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[10px]">Avanza / Ertiga:</span>
                  <span className="font-bold text-white text-sm">{formatRupiah(item.price_avanza)}</span>
                </div>
                <div className="bg-[#040404] p-2.5 rounded-xl border border-gold/30">
                  <span className="text-gold block text-[10px] font-semibold">Innova Reborn:</span>
                  <span className="font-bold text-gold text-sm">{formatRupiah(item.price_innova)}</span>
                </div>
                <div className="bg-[#040404] p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[10px]">Elf / Hiace:</span>
                  <span className="font-bold text-white text-sm">{formatRupiah(item.price_hiace)}</span>
                </div>
                <div className="bg-[#040404] p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[10px]">Bus 3/4:</span>
                  <span className="font-bold text-white text-sm">{formatRupiah(item.price_bus)}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={createWaLink(
                    item.destination,
                    "Innova / Avanza",
                    item.price_innova || item.price_avanza,
                    "pickup"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gold hover:bg-gold/90 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-gold/15 transition-all"
                >
                  <span>Pesan Rute Ini via WhatsApp</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BENEFITS & VALUE PROPOSITIONS */}
      <section className="border-t border-white/10 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold text-xs font-semibold uppercase tracking-[0.2em] block mb-1">
            Kenapa Memilih Kami?
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Kenyamanan Penjemputan Diamond Trans
          </h3>
          <p className="text-white/60 text-sm mt-2">
            Perjalanan Anda di Lombok dimulai dengan sambutan hangat dan layanan profesional.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-white text-base mb-2">Driver Standby Tepat Waktu</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Driver kami sudah siap di terminal kedatangan sebelum pesawat Anda mendarat, lengkap dengan papan nama (*nameboard*).
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-bold text-white text-base mb-2">Harga All-In Transparan</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Tarif flat sekali jalan sudah mencakup sewa mobil, jasa sopir, dan BBM. Bebas biaya tersembunyi.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h4 className="font-bold text-white text-base mb-2">Bantuan Bawa Bagasi</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Driver ramah kami siap membantu mengangkat koper dan barang bawaan Anda ke bagasi dengan aman dan rapi.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h4 className="font-bold text-white text-base mb-2">Armada Bersih &amp; Terawat</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Kabin harum, interior bersih, dan AC dingin maksimal untuk menjamin kesegaran Anda setelah perjalanan udara.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="border-t border-white/10 pt-16 pb-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-gold text-xs font-semibold uppercase tracking-[0.2em] block mb-1">
            FAQ
          </span>
          <h3 className="text-2xl font-bold text-white">Pertanyaan yang Sering Diajukan</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
            <h5 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <span className="text-gold">Q:</span> Bagaimana jika pesawat saya mengalami keterlambatan (delay)?
            </h5>
            <p className="text-xs text-white/60 leading-relaxed">
              Driver kami memantau jadwal kedatangan penerbangan secara berkala menggunakan aplikasi radar penerbangan. Driver akan tetap menunggu Anda di bandara tanpa biaya penalti keterlambatan jadwal terbang.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
            <h5 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <span className="text-gold">Q:</span> Apakah bisa dijemput dari hotel menuju bandara (Drop Off)?
            </h5>
            <p className="text-xs text-white/60 leading-relaxed">
              Bisa! Tarif Pick Up (Bandara ke Hotel) dan Drop Off (Hotel ke Bandara) berlaku sama untuk rute yang sama. Anda cukup memilih arah &ldquo;Menuju Bandara&rdquo; saat pemesanan.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
            <h5 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <span className="text-gold">Q:</span> Apakah harga sudah termasuk biaya parkir bandara &amp; tol?
            </h5>
            <p className="text-xs text-white/60 leading-relaxed">
              Harga paket sudah all-in termasuk bensin dan jasa sopir. Tiket parkir bandara standar kedatangan biasanya sudah termasuk dalam pelayanan kami.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
            <h5 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <span className="text-gold">Q:</span> Bagaimana cara pembayaran pemesanan ini?
            </h5>
            <p className="text-xs text-white/60 leading-relaxed">
              Pembayaran sangat fleksibel: bisa melalui transfer bank sebelum keberangkatan atau pembayaran tunai langsung kepada driver saat tiba di tempat tujuan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
