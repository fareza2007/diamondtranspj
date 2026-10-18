"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatEventRange } from "@/lib/gp";

type CarRecord = {
  id: string;
  name: string;
  brand: string;
  transmission: string;
  seats: number;
  price_per_day: number;
  price_lepas_kunci: number | null;
  price_dengan_sopir: number | null;
  price_lepas_kunci_gp: number | null;
  price_dengan_sopir_gp: number | null;
  driver_duration_hours: number;
  image_url: string | null;
  with_driver_available: boolean;
  with_keyless_available: boolean;
  status: string;
};

type EventRecord = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string | null;
  description: string | null;
  is_active: boolean;
};

type PackageRecord = {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  price: number;
  badge?: string;
  image_url?: string | null;
  car_details: string;
  hotel_details: string;
  travel_details: string;
  highlights?: string[];
  is_active: boolean;
};

const emptyCar = {
  name: "",
  brand: "",
  transmission: "matic",
  seats: "7",
  price_lepas_kunci: "",
  price_dengan_sopir: "",
  price_lepas_kunci_gp: "",
  price_dengan_sopir_gp: "",
  driver_duration_hours: "12",
  with_driver_available: true,
  with_keyless_available: true,
  status: "available",
  image_url: "",
};

const emptyPackage = {
  name: "",
  tagline: "",
  duration: "3 Hari 2 Malam",
  price: "",
  badge: "Paling Populer",
  car_details: "Toyota All New Avanza / Veloz (Termasuk Sopir & BBM)",
  hotel_details: "Hotel Bintang 4 di Mandalika (2 Malam + Sarapan Pagi)",
  travel_details: "Sirkuit Mandalika, Pantai Kuta, Tanjung Aan, Bukit Merese, Desa Sade",
  highlights: "Antar-jemput Bandara Lombok (BIL), Sopir & Pemandu Wisata, Tiket masuk semua destinasi",
  image_url: "",
  is_active: true,
};

function money(n: number | null) {
  if (n == null) return "-";
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 1200;
        const maxH = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxW || h > maxH) {
          if (w / h > maxW / maxH) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          } else {
            w = Math.round((w * maxH) / h);
            h = maxH;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(String(e.target?.result));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/webp", 0.78));
      };
      img.onerror = reject;
      img.src = String(e.target?.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ImageUploadZone({
  preview,
  onPick,
  onUrlChange,
  urlValue,
  title = "Pilih Foto",
}: {
  preview: string | null;
  onPick: (file: File | null) => void;
  onUrlChange: (url: string) => void;
  urlValue: string;
  title?: string;
}) {
  const [showUrl, setShowUrl] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-white/80">{title}</label>

      {preview ? (
        <div className="relative rounded-2xl border-2 border-gold/40 bg-black/60 p-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full h-44 object-contain rounded-xl mx-auto mb-3"
          />
          <div className="flex items-center justify-center gap-3">
            <label className="cursor-pointer bg-gold hover:bg-gold/90 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Ganti Foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPick(e.target.files?.[0] || null)}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                onPick(null);
                onUrlChange("");
              }}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs px-4 py-2 rounded-xl transition-colors border border-red-500/30"
            >
              Hapus Foto
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gold/40 hover:border-gold bg-[#0e0e0e] hover:bg-[#161616] rounded-2xl p-7 cursor-pointer transition-all group">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] || null)}
          />
          <div className="w-16 h-16 rounded-2xl bg-gold/15 group-hover:bg-gold/25 text-gold flex items-center justify-center mb-3 transition-transform group-hover:scale-105">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-bold text-white group-hover:text-gold transition-colors text-center">
            Klik di Sini untuk Pilih Foto
          </p>
          <p className="text-xs text-white/50 mt-1 text-center">
            Pilih gambar dari galeri HP atau komputer<br />
            <span className="text-[11px] text-gold/80 font-medium">Bebas ukuran · Otomatis dioptimalkan & disimpan di Cloudinary</span>
          </p>
        </label>
      )}

      {/* URL Option */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowUrl(!showUrl)}
          className="text-[11px] text-white/40 hover:text-gold transition-colors"
        >
          {showUrl ? "▲ Sembunyikan input URL" : "🔗 Atau masukkan link URL gambar langsung"}
        </button>
        {showUrl && (
          <input
            type="url"
            placeholder="https://..."
            value={urlValue}
            onChange={(e) => onUrlChange(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#040404] px-3 py-2 text-xs text-white outline-none focus:border-gold"
          />
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard({
  cars,
  events,
  packages = [],
}: {
  cars: CarRecord[];
  events: EventRecord[];
  packages?: PackageRecord[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"armada" | "paket" | "event">("armada");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Cars state
  const [editingCarId, setEditingCarId] = useState<string | "new" | null>(null);
  const [carForm, setCarForm] = useState(emptyCar);
  const [carImagePreview, setCarImagePreview] = useState<string | null>(null);

  // Packages state
  const [editingPkgId, setEditingPkgId] = useState<string | "new" | null>(null);
  const [pkgForm, setPkgForm] = useState(emptyPackage);
  const [pkgImagePreview, setPkgImagePreview] = useState<string | null>(null);

  // Events state
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
    is_active: true,
  });

  const activeEvents = useMemo(() => events.filter((e) => e.is_active), [events]);

  // Car actions
  const resetCarForm = () => {
    setEditingCarId(null);
    setCarForm(emptyCar);
    setCarImagePreview(null);
  };

  const openCreateCar = () => {
    setEditingCarId("new");
    setCarForm(emptyCar);
    setCarImagePreview(null);
  };

  const openEditCar = (car: CarRecord) => {
    setEditingCarId(car.id);
    setCarForm({
      name: car.name,
      brand: car.brand,
      transmission: car.transmission,
      seats: String(car.seats),
      price_lepas_kunci: car.price_lepas_kunci != null ? String(car.price_lepas_kunci) : "",
      price_dengan_sopir: car.price_dengan_sopir != null ? String(car.price_dengan_sopir) : "",
      price_lepas_kunci_gp: car.price_lepas_kunci_gp != null ? String(car.price_lepas_kunci_gp) : "",
      price_dengan_sopir_gp: car.price_dengan_sopir_gp != null ? String(car.price_dengan_sopir_gp) : "",
      driver_duration_hours: String(car.driver_duration_hours),
      with_driver_available: car.with_driver_available,
      with_keyless_available: car.with_keyless_available,
      status: car.status,
      image_url: car.image_url || "",
    });
    setCarImagePreview(car.image_url);
  };

  const onPickCarImage = async (file: File | null) => {
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setCarImagePreview(compressed);
      setCarForm((prev) => ({ ...prev, image_url: compressed }));
    } catch (e) {
      console.error("Image compress error:", e);
    }
  };

  const submitCar = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const form = new FormData();
      Object.entries(carForm).forEach(([key, value]) => {
        form.set(key, String(value));
      });

      const url = editingCarId === "new" ? "/api/admin/cars" : `/api/admin/cars/${editingCarId}`;
      const method = editingCarId === "new" ? "POST" : "PATCH";
      const res = await fetch(url, { method, body: form });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menyimpan armada.");
        return;
      }
      setMessage(editingCarId === "new" ? "Armada berhasil ditambahkan ke Firebase & Cloudinary." : "Armada berhasil diperbarui.");
      resetCarForm();
      router.refresh();
    } catch {
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCar = async (car: CarRecord) => {
    if (!confirm(`Hapus unit ${car.name}? Data ini akan hilang dari katalog.`)) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/cars/${car.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menghapus armada.");
        return;
      }
      if (editingCarId === car.id) resetCarForm();
      setMessage(`${car.name} telah dihapus.`);
      router.refresh();
    } catch {
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  // Package actions
  const resetPkgForm = () => {
    setEditingPkgId(null);
    setPkgForm(emptyPackage);
    setPkgImagePreview(null);
  };

  const openCreatePkg = () => {
    setEditingPkgId("new");
    setPkgForm(emptyPackage);
    setPkgImagePreview(null);
  };

  const openEditPkg = (pkg: PackageRecord) => {
    setEditingPkgId(pkg.id);
    setPkgForm({
      name: pkg.name,
      tagline: pkg.tagline,
      duration: pkg.duration,
      price: String(pkg.price),
      badge: pkg.badge || "",
      car_details: pkg.car_details,
      hotel_details: pkg.hotel_details,
      travel_details: pkg.travel_details,
      highlights: (pkg.highlights || []).join(", "),
      image_url: pkg.image_url || "",
      is_active: pkg.is_active,
    });
    setPkgImagePreview(pkg.image_url || null);
  };

  const onPickPkgImage = async (file: File | null) => {
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setPkgImagePreview(compressed);
      setPkgForm((prev) => ({ ...prev, image_url: compressed }));
    } catch (e) {
      console.error("Pkg image compress error:", e);
    }
  };

  const submitPackage = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        name: pkgForm.name,
        tagline: pkgForm.tagline,
        duration: pkgForm.duration,
        price: Number(pkgForm.price),
        badge: pkgForm.badge,
        car_details: pkgForm.car_details,
        hotel_details: pkgForm.hotel_details,
        travel_details: pkgForm.travel_details,
        highlights: pkgForm.highlights
          .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean),
        image_url: pkgForm.image_url || null,
        is_active: pkgForm.is_active,
      };

      const url = editingPkgId === "new" ? "/api/admin/packages" : `/api/admin/packages/${editingPkgId}`;
      const method = editingPkgId === "new" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menyimpan paket wisata.");
        return;
      }
      setMessage(editingPkgId === "new" ? "Paket wisata berhasil ditambahkan ke Firebase." : "Paket wisata diperbarui.");
      resetPkgForm();
      router.refresh();
    } catch {
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  const deletePackage = async (pkg: PackageRecord) => {
    if (!confirm(`Hapus paket "${pkg.name}"?`)) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menghapus paket.");
        return;
      }
      if (editingPkgId === pkg.id) resetPkgForm();
      setMessage(`Paket "${pkg.name}" telah dihapus.`);
      router.refresh();
    } catch {
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  // Event actions
  const submitEvent = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const url = editingEventId ? `/api/admin/events/${editingEventId}` : "/api/admin/events";
      const method = editingEventId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menyimpan event.");
        return;
      }
      setMessage(editingEventId ? "Event diperbarui." : "Event berhasil ditambahkan.");
      setEditingEventId(null);
      setIsAddingEvent(false);
      setEventForm({ name: "", start_date: "", end_date: "", location: "", description: "", is_active: true });
      router.refresh();
    } catch {
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (event: EventRecord) => {
    if (!confirm(`Hapus event "${event.name}"?`)) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menghapus event.");
        return;
      }
      if (editingEventId === event.id) {
        setEditingEventId(null);
        setIsAddingEvent(false);
        setEventForm({ name: "", start_date: "", end_date: "", location: "", description: "", is_active: true });
      }
      setMessage(`${event.name} telah dihapus.`);
      router.refresh();
    } catch {
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const inputClass =
    "w-full rounded-xl border border-white/20 bg-[#040404] px-3.5 py-2.5 text-sm text-white outline-none focus:border-gold transition-colors";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-gold text-xs uppercase tracking-widest font-semibold">Diamond Trans</p>
            <h1 className="text-white font-bold text-lg">Panel Manajemen Firebase</h1>
          </div>
          <button
            onClick={logout}
            className="text-sm text-white/70 hover:text-white border border-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          <button
            onClick={() => {
              setTab("armada");
              setEditingCarId(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === "armada" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            🚗 Armada ({cars.length})
          </button>
          <button
            onClick={() => {
              setTab("paket");
              setEditingPkgId(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === "paket" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            🌴 Paket Wisata ({packages.length})
          </button>
          <button
            onClick={() => {
              setTab("event");
              setIsAddingEvent(false);
              setEditingEventId(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === "event" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            📅 Event Khusus ({activeEvents.length})
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="mb-6 bg-gold/10 border border-gold/40 text-white text-sm px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-white/50 hover:text-white text-xs ml-4">
              ✕
            </button>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 1: ARMADA                             */}
        {/* ========================================= */}
        {tab === "armada" && (
          <div className="space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Daftar Armada Mobil</h2>
                <p className="text-xs text-white/50 mt-0.5">Kelola mobil, harga rental, dan foto unit</p>
              </div>
              {editingCarId === null && (
                <button
                  onClick={openCreateCar}
                  className="bg-gold hover:bg-gold/90 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span className="text-lg leading-none">+</span> Unit Baru
                </button>
              )}
            </div>

            {/* Form appears ONLY when "+ Unit Baru" or "Edit" is clicked */}
            {editingCarId !== null && (
              <div className="bg-[#0a0a0a] border-2 border-gold/40 rounded-2xl p-6 shadow-2xl relative animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                  <h3 className="font-bold text-white text-lg">
                    {editingCarId === "new" ? "Tambah Unit Mobil Baru" : `Edit Armada: ${carForm.name}`}
                  </h3>
                  <button
                    onClick={resetCarForm}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    ✕ Tutup Form
                  </button>
                </div>

                <form onSubmit={submitCar} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Nama Mobil</label>
                    <input className={inputClass} placeholder="Cth: All New Avanza" value={carForm.name} onChange={(e) => setCarForm({ ...carForm, name: e.target.value })} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">Merek</label>
                      <input className={inputClass} placeholder="Cth: Toyota" value={carForm.brand} onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">Transmisi</label>
                      <select className={inputClass} value={carForm.transmission} onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}>
                        <option value="matic">Matic</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">Jumlah Kursi</label>
                      <input className={inputClass} type="number" min={2} placeholder="Cth: 7" value={carForm.seats} onChange={(e) => setCarForm({ ...carForm, seats: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">Durasi Sopir (Jam/Hari)</label>
                      <input className={inputClass} type="number" min={1} placeholder="Cth: 12" value={carForm.driver_duration_hours} onChange={(e) => setCarForm({ ...carForm, driver_duration_hours: e.target.value })} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <p className="text-xs font-bold text-gold uppercase tracking-wider">Harga Hari Biasa</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/60 mb-1">Lepas Kunci</label>
                        <input className={inputClass} type="number" min={0} placeholder="Rp" value={carForm.price_lepas_kunci} onChange={(e) => setCarForm({ ...carForm, price_lepas_kunci: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1">Dengan Sopir</label>
                        <input className={inputClass} type="number" min={0} placeholder="Rp" value={carForm.price_dengan_sopir} onChange={(e) => setCarForm({ ...carForm, price_dengan_sopir: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <p className="text-xs font-bold text-gold uppercase tracking-wider">Harga Event Khusus <span className="text-[10px] text-white/40 font-normal">(Opsional)</span></p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/60 mb-1">Lepas Kunci Event</label>
                        <input className={inputClass} type="number" min={0} placeholder="Rp" value={carForm.price_lepas_kunci_gp} onChange={(e) => setCarForm({ ...carForm, price_lepas_kunci_gp: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1">Dengan Sopir Event</label>
                        <input className={inputClass} type="number" min={0} placeholder="Rp" value={carForm.price_dengan_sopir_gp} onChange={(e) => setCarForm({ ...carForm, price_dengan_sopir_gp: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 text-xs text-white/90 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-gold" checked={carForm.with_keyless_available} onChange={(e) => setCarForm({ ...carForm, with_keyless_available: e.target.checked })} />
                      Tersedia layanan Lepas Kunci
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-white/90 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-gold" checked={carForm.with_driver_available} onChange={(e) => setCarForm({ ...carForm, with_driver_available: e.target.checked })} />
                      Tersedia layanan Dengan Sopir
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Status Tampilan</label>
                    <select className={inputClass} value={carForm.status} onChange={(e) => setCarForm({ ...carForm, status: e.target.value })}>
                      <option value="available">Tampil di katalog (Aktif)</option>
                      <option value="unavailable">Sembunyikan dari katalog</option>
                    </select>
                  </div>

                  {/* Big Image Upload Zone */}
                  <ImageUploadZone
                    title="Foto Unit Mobil"
                    preview={carImagePreview}
                    onPick={onPickCarImage}
                    onUrlChange={(url) => {
                      setCarForm((prev) => ({ ...prev, image_url: url }));
                      setCarImagePreview(url || null);
                    }}
                    urlValue={carForm.image_url}
                  />

                  <div className="flex gap-3 pt-3">
                    <button
                      disabled={saving}
                      className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-gold/20 text-sm"
                    >
                      {saving ? "Menyimpan ke Cloud..." : editingCarId === "new" ? "Simpan Unit Baru" : "Simpan Perubahan"}
                    </button>
                    <button
                      type="button"
                      onClick={resetCarForm}
                      className="px-5 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Car Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map((car) => (
                <div key={car.id} className="bg-[#0a0a0a] border border-white/10 hover:border-gold/30 rounded-2xl p-4 flex flex-col justify-between transition-all">
                  <div>
                    <div className="w-full h-36 bg-black/40 rounded-xl overflow-hidden flex items-center justify-center mb-3 border border-white/5">
                      {car.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={car.image_url} alt={car.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className="text-xs text-white/30">Belum ada foto</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-bold text-white text-base">{car.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        car.status === "available" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                      }`}>
                        {car.status === "available" ? "Aktif" : "Sembunyi"}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 capitalize mb-3">
                      {car.brand} · {car.transmission} · {car.seats} Kursi
                    </p>

                    <div className="text-xs space-y-1 py-2 border-t border-white/10 text-white/70">
                      <div className="flex justify-between">
                        <span>Lepas Kunci:</span>
                        <span className="font-semibold text-white">{money(car.price_lepas_kunci)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dengan Sopir:</span>
                        <span className="font-semibold text-white">{money(car.price_dengan_sopir)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/10 mt-2">
                    <button
                      onClick={() => openEditCar(car)}
                      className="flex-1 text-xs bg-white/10 hover:bg-gold hover:text-white text-white/90 font-semibold py-2 rounded-lg transition-colors text-center"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteCar(car)}
                      className="text-xs bg-red-500/15 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: PAKET WISATA                       */}
        {/* ========================================= */}
        {tab === "paket" && (
          <div className="space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Daftar Paket Wisata</h2>
                <p className="text-xs text-white/50 mt-0.5">Paket All-in-One: Mobil + Hotel + Tour Travel</p>
              </div>
              {editingPkgId === null && (
                <button
                  onClick={openCreatePkg}
                  className="bg-gold hover:bg-gold/90 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span className="text-lg leading-none">+</span> Paket Baru
                </button>
              )}
            </div>

            {/* Form appears ONLY when "+ Paket Baru" or "Edit" is clicked */}
            {editingPkgId !== null && (
              <div className="bg-[#0a0a0a] border-2 border-gold/40 rounded-2xl p-6 shadow-2xl relative animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                  <h3 className="font-bold text-white text-lg">
                    {editingPkgId === "new" ? "Tambah Paket Wisata Baru" : `Edit Paket: ${pkgForm.name}`}
                  </h3>
                  <button
                    onClick={resetPkgForm}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ✕ Tutup Form
                  </button>
                </div>

                <form onSubmit={submitPackage} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Nama Paket Wisata</label>
                    <input className={inputClass} placeholder="Cth: Paket Eksplor Mandalika 3D2N" value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} required />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Tagline / Deskripsi Singkat</label>
                    <input className={inputClass} placeholder="Cth: Mobil + Hotel Bintang 4 + Tour Wisata Lengkap" value={pkgForm.tagline} onChange={(e) => setPkgForm({ ...pkgForm, tagline: e.target.value })} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">Durasi</label>
                      <input className={inputClass} placeholder="Cth: 3 Hari 2 Malam" value={pkgForm.duration} onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">Harga Total (Rp)</label>
                      <input className={inputClass} type="number" min={0} placeholder="Cth: 2750000" value={pkgForm.price} onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Badge Promosi (Opsional)</label>
                    <input className={inputClass} placeholder="Cth: Paling Populer / Rekomendasi / Hemat" value={pkgForm.badge} onChange={(e) => setPkgForm({ ...pkgForm, badge: e.target.value })} />
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <p className="text-xs font-bold text-gold uppercase tracking-wider">3 Komponen Utama Paket</p>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">🚗 Transport & Mobil</label>
                      <input className={inputClass} placeholder="Cth: Toyota All New Avanza / Veloz (Termasuk Sopir & BBM)" value={pkgForm.car_details} onChange={(e) => setPkgForm({ ...pkgForm, car_details: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">🏨 Penginapan & Hotel</label>
                      <input className={inputClass} placeholder="Cth: Hotel Bintang 4 di Mandalika (2 Malam + Sarapan Pagi)" value={pkgForm.hotel_details} onChange={(e) => setPkgForm({ ...pkgForm, hotel_details: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1">🧭 Rute & Wisata</label>
                      <textarea rows={2} className={inputClass} placeholder="Cth: Sirkuit Mandalika, Pantai Kuta, Tanjung Aan, Bukit Merese, Desa Sade" value={pkgForm.travel_details} onChange={(e) => setPkgForm({ ...pkgForm, travel_details: e.target.value })} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Fasilitas Termasuk (Pisahkan dengan koma)</label>
                    <input className={inputClass} placeholder="Antar jemput bandara, Tiket masuk wisata, Pemandu wisata" value={pkgForm.highlights} onChange={(e) => setPkgForm({ ...pkgForm, highlights: e.target.value })} />
                  </div>

                  {/* Big Image Upload Zone */}
                  <ImageUploadZone
                    title="Foto Paket Wisata"
                    preview={pkgImagePreview}
                    onPick={onPickPkgImage}
                    onUrlChange={(url) => {
                      setPkgForm((prev) => ({ ...prev, image_url: url }));
                      setPkgImagePreview(url || null);
                    }}
                    urlValue={pkgForm.image_url}
                  />

                  <label className="flex items-center gap-2.5 text-xs text-white/90 cursor-pointer pt-1">
                    <input type="checkbox" className="w-4 h-4 accent-gold" checked={pkgForm.is_active} onChange={(e) => setPkgForm({ ...pkgForm, is_active: e.target.checked })} />
                    Tampilkan paket ini di beranda website
                  </label>

                  <div className="flex gap-3 pt-3">
                    <button
                      disabled={saving}
                      className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-gold/20 text-sm"
                    >
                      {saving ? "Menyimpan ke Cloud..." : editingPkgId === "new" ? "Tambah Paket" : "Simpan Paket"}
                    </button>
                    <button
                      type="button"
                      onClick={resetPkgForm}
                      className="px-5 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Packages Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-[#0a0a0a] border border-white/10 hover:border-gold/30 rounded-2xl p-4 flex flex-col justify-between transition-all">
                  <div>
                    <div className="w-full h-40 bg-black/40 rounded-xl overflow-hidden mb-3 relative border border-white/5">
                      {pkg.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-white/30">Belum ada foto</div>
                      )}
                      {pkg.badge && (
                        <span className="absolute top-2 left-2 bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-white text-base">{pkg.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        pkg.is_active ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                      }`}>
                        {pkg.is_active ? "Tampil" : "Sembunyi"}
                      </span>
                    </div>

                    <p className="text-xs text-gold/90 font-semibold mb-2">{pkg.duration} · {money(pkg.price)}</p>
                    <p className="text-xs text-white/60 mb-3 line-clamp-2">{pkg.tagline}</p>

                    <div className="text-[11px] space-y-1.5 py-2.5 border-t border-white/10 text-white/70">
                      <p className="line-clamp-1">🚗 {pkg.car_details}</p>
                      <p className="line-clamp-1">🏨 {pkg.hotel_details}</p>
                      <p className="line-clamp-1">🧭 {pkg.travel_details}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/10 mt-2">
                    <button
                      onClick={() => openEditPkg(pkg)}
                      className="flex-1 text-xs bg-white/10 hover:bg-gold hover:text-white text-white/90 font-semibold py-2 rounded-lg transition-colors text-center"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deletePackage(pkg)}
                      className="text-xs bg-red-500/15 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: EVENT KHUSUS                       */}
        {/* ========================================= */}
        {tab === "event" && (
          <div className="space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Daftar Event Khusus</h2>
                <p className="text-xs text-white/50 mt-0.5">Event khusus di mana tarif spesial event berlaku</p>
              </div>
              {!isAddingEvent && editingEventId === null && (
                <button
                  onClick={() => {
                    setIsAddingEvent(true);
                    setEditingEventId(null);
                    setEventForm({ name: "", start_date: "", end_date: "", location: "", description: "", is_active: true });
                  }}
                  className="bg-gold hover:bg-gold/90 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-gold/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span className="text-lg leading-none">+</span> Event Baru
                </button>
              )}
            </div>

            {/* Form appears ONLY when "+ Event Baru" or "Edit" is clicked */}
            {(isAddingEvent || editingEventId !== null) && (
              <div className="bg-[#0a0a0a] border-2 border-gold/40 rounded-2xl p-6 shadow-2xl relative animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                  <h3 className="font-bold text-white text-lg">
                    {editingEventId ? "Edit Event" : "Tambah Event Baru"}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingEvent(false);
                      setEditingEventId(null);
                    }}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ✕ Tutup Form
                  </button>
                </div>

                <form onSubmit={submitEvent} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Nama Event</label>
                    <input className={inputClass} placeholder="Cth: Konser Mandalika 2026" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">Tanggal Mulai</label>
                      <input className={inputClass} type="date" value={eventForm.start_date} onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">Tanggal Selesai</label>
                      <input className={inputClass} type="date" value={eventForm.end_date} onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Lokasi Event</label>
                    <input className={inputClass} placeholder="Cth: Sirkuit Mandalika / Mataram" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Catatan Tambahan (Opsional)</label>
                    <textarea rows={2} className={inputClass} placeholder="Catatan singkat seputar event..." value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
                  </div>

                  <label className="flex items-center gap-2.5 text-xs text-white/90 cursor-pointer pt-1">
                    <input type="checkbox" className="w-4 h-4 accent-gold" checked={eventForm.is_active} onChange={(e) => setEventForm({ ...eventForm, is_active: e.target.checked })} />
                    Tampilkan event ini di website
                  </label>

                  <div className="flex gap-3 pt-3">
                    <button
                      disabled={saving}
                      className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-gold/20 text-sm"
                    >
                      {saving ? "Menyimpan ke Cloud..." : editingEventId ? "Simpan Perubahan" : "Tambah Event"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingEvent(false);
                        setEditingEventId(null);
                      }}
                      className="px-5 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Events List Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.length === 0 && (
                <p className="text-white/60 text-sm col-span-full">Belum ada event khusus.</p>
              )}
              {events.map((event) => (
                <div key={event.id} className="bg-[#0a0a0a] border border-white/10 hover:border-gold/30 rounded-2xl p-4 flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-base">{event.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        event.is_active ? "bg-gold/20 text-gold" : "bg-white/10 text-white/50"
                      }`}>
                        {event.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    <p className="text-xs text-gold font-medium mb-1">
                      📅 {formatEventRange(event.start_date, event.end_date)}
                    </p>
                    {event.location && <p className="text-xs text-white/60 mb-2">📍 {event.location}</p>}
                    {event.description && <p className="text-xs text-white/40 line-clamp-2">{event.description}</p>}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/10 mt-3">
                    <button
                      onClick={() => {
                        setIsAddingEvent(false);
                        setEditingEventId(event.id);
                        setEventForm({
                          name: event.name,
                          start_date: event.start_date.slice(0, 10),
                          end_date: event.end_date.slice(0, 10),
                          location: event.location || "",
                          description: event.description || "",
                          is_active: event.is_active,
                        });
                      }}
                      className="flex-1 text-xs bg-white/10 hover:bg-gold hover:text-white text-white/90 font-semibold py-2 rounded-lg transition-colors text-center"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(event)}
                      className="text-xs bg-red-500/15 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
