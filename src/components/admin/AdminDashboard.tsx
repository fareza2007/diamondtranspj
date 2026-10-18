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
  const activePackages = useMemo(() => packages.filter((p) => p.is_active), [packages]);

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
      setMessage(editingCarId === "new" ? "Armada berhasil ditambahkan ke Firebase." : "Armada berhasil diperbarui.");
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
    "w-full rounded-lg border border-white/20 bg-[#040404] px-3 py-2 text-sm text-white outline-none focus:border-gold";

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
            onClick={() => setTab("armada")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === "armada" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            🚗 Armada ({cars.length})
          </button>
          <button
            onClick={() => setTab("paket")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === "paket" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            🌴 Paket Wisata ({packages.length})
          </button>
          <button
            onClick={() => setTab("event")}
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
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-base">
                  {editingCarId === "new" ? "Tambah Armada Baru" : editingCarId ? "Edit Armada" : "Form Armada"}
                </h2>
                {editingCarId !== "new" && (
                  <button onClick={openCreateCar} className="text-xs bg-gold text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-gold/90 transition-all">
                    + Unit Baru
                  </button>
                )}
              </div>

              <form onSubmit={submitCar} className="space-y-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Nama Mobil</label>
                  <input className={inputClass} placeholder="Cth: All New Avanza" value={carForm.name} onChange={(e) => setCarForm({ ...carForm, name: e.target.value })} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Merek</label>
                    <input className={inputClass} placeholder="Cth: Toyota" value={carForm.brand} onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Transmisi</label>
                    <select className={inputClass} value={carForm.transmission} onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}>
                      <option value="matic">Matic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Jumlah Kursi</label>
                    <input className={inputClass} type="number" min={2} placeholder="Cth: 7" value={carForm.seats} onChange={(e) => setCarForm({ ...carForm, seats: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Durasi Sopir (Jam/Hari)</label>
                    <input className={inputClass} type="number" min={1} placeholder="Cth: 12" value={carForm.driver_duration_hours} onChange={(e) => setCarForm({ ...carForm, driver_duration_hours: e.target.value })} />
                  </div>
                </div>

                <p className="text-xs font-semibold text-white/80 pt-2 border-t border-white/10 mt-2">Harga Hari Biasa</p>
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

                <p className="text-xs font-semibold text-white/80 pt-2 border-t border-white/10 mt-2">Harga Event Khusus <span className="text-[10px] font-normal text-white/40">(Opsional)</span></p>
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

                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                    <input type="checkbox" checked={carForm.with_keyless_available} onChange={(e) => setCarForm({ ...carForm, with_keyless_available: e.target.checked })} />
                    Tersedia lepas kunci
                  </label>
                  <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                    <input type="checkbox" checked={carForm.with_driver_available} onChange={(e) => setCarForm({ ...carForm, with_driver_available: e.target.checked })} />
                    Tersedia dengan sopir
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Status Katalog</label>
                  <select className={inputClass} value={carForm.status} onChange={(e) => setCarForm({ ...carForm, status: e.target.value })}>
                    <option value="available">Tampil di katalog</option>
                    <option value="unavailable">Sembunyikan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Foto Mobil (Bebas Ukuran - Otomatis Dioptimalkan)</label>
                  <input type="file" accept="image/*" onChange={(e) => onPickCarImage(e.target.files?.[0] || null)} className="block w-full text-xs text-white/70" />
                  <p className="text-[11px] text-white/40 my-1">Atau masukkan URL gambar langsung:</p>
                  <input className={inputClass} placeholder="https://..." value={carForm.image_url} onChange={(e) => { setCarForm({ ...carForm, image_url: e.target.value }); setCarImagePreview(e.target.value); }} />
                  {carImagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={carImagePreview} alt="Preview" className="mt-3 w-full h-36 object-contain rounded-lg border border-white/10 bg-black/40" />
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button disabled={saving} className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all">
                    {saving ? "Menyimpan ke Firebase..." : editingCarId === "new" ? "Simpan Unit Baru" : "Simpan Perubahan"}
                  </button>
                  {editingCarId && (
                    <button type="button" onClick={resetCarForm} className="px-4 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white">
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <h2 className="font-bold text-white text-base mb-2">Daftar Armada di Firebase ({cars.length})</h2>
              {cars.map((car) => (
                <div key={car.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex gap-4 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-20 h-14 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                      {car.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={car.image_url} alt={car.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-white/30">No Image</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{car.name}</h3>
                        <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded capitalize">{car.brand}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${car.status === "available" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                          {car.status === "available" ? "Aktif" : "Sembunyi"}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        Mulai {money(car.price_per_day)}/hari · Lepas Kunci: {money(car.price_lepas_kunci)} · Sopir: {money(car.price_dengan_sopir)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEditCar(car)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg">
                      Edit
                    </button>
                    <button onClick={() => deleteCar(car)} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg">
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: PAKET WISATA (MOBIL + HOTEL + TOUR)*/}
        {/* ========================================= */}
        {tab === "paket" && (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-base">
                  {editingPkgId === "new" ? "Tambah Paket Wisata" : editingPkgId ? "Edit Paket Wisata" : "Form Paket Wisata"}
                </h2>
                {editingPkgId !== "new" && (
                  <button onClick={openCreatePkg} className="text-xs bg-gold text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-gold/90 transition-all">
                    + Paket Baru
                  </button>
                )}
              </div>

              <form onSubmit={submitPackage} className="space-y-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Nama Paket Wisata</label>
                  <input className={inputClass} placeholder="Cth: Paket Eksplor Mandalika 3D2N" value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} required />
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Tagline / Deskripsi Singkat</label>
                  <input className={inputClass} placeholder="Cth: Mobil + Hotel Bintang 4 + Tour Wisata Lengkap" value={pkgForm.tagline} onChange={(e) => setPkgForm({ ...pkgForm, tagline: e.target.value })} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Durasi</label>
                    <input className={inputClass} placeholder="Cth: 3 Hari 2 Malam" value={pkgForm.duration} onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Harga Total (Rp)</label>
                    <input className={inputClass} type="number" min={0} placeholder="Cth: 2750000" value={pkgForm.price} onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })} required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Badge Promosi (Opsional)</label>
                  <input className={inputClass} placeholder="Cth: Paling Populer / Rekomendasi / Hemat" value={pkgForm.badge} onChange={(e) => setPkgForm({ ...pkgForm, badge: e.target.value })} />
                </div>

                <p className="text-xs font-semibold text-gold pt-2 border-t border-white/10 mt-2">Detail 3 Komponen Utama:</p>

                <div>
                  <label className="block text-xs text-white/70 mb-1">🚗 Detail Mobil & Transport</label>
                  <input className={inputClass} placeholder="Cth: Toyota All New Avanza / Veloz (Termasuk Sopir & BBM)" value={pkgForm.car_details} onChange={(e) => setPkgForm({ ...pkgForm, car_details: e.target.value })} required />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1">🏨 Detail Hotel & Akomodasi</label>
                  <input className={inputClass} placeholder="Cth: Hotel Bintang 4 di Mandalika (2 Malam + Sarapan Pagi)" value={pkgForm.hotel_details} onChange={(e) => setPkgForm({ ...pkgForm, hotel_details: e.target.value })} required />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1">🧭 Detail Rute Wisata & Tour</label>
                  <textarea rows={2} className={inputClass} placeholder="Cth: Sirkuit Mandalika, Pantai Kuta, Tanjung Aan, Bukit Merese, Desa Sade" value={pkgForm.travel_details} onChange={(e) => setPkgForm({ ...pkgForm, travel_details: e.target.value })} required />
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1">Fasilitas Termasuk (Pisahkan dengan koma)</label>
                  <input className={inputClass} placeholder="Antar jemput bandara, Tiket masuk, Tour guide" value={pkgForm.highlights} onChange={(e) => setPkgForm({ ...pkgForm, highlights: e.target.value })} />
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Foto Paket Wisata</label>
                  <input type="file" accept="image/*" onChange={(e) => onPickPkgImage(e.target.files?.[0] || null)} className="block w-full text-xs text-white/70" />
                  <p className="text-[11px] text-white/40 my-1">Atau masukkan URL gambar langsung:</p>
                  <input className={inputClass} placeholder="https://..." value={pkgForm.image_url} onChange={(e) => { setPkgForm({ ...pkgForm, image_url: e.target.value }); setPkgImagePreview(e.target.value); }} />
                  {pkgImagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pkgImagePreview} alt="Preview" className="mt-3 w-full h-36 object-cover rounded-lg border border-white/10" />
                  )}
                </div>

                <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer pt-1">
                  <input type="checkbox" checked={pkgForm.is_active} onChange={(e) => setPkgForm({ ...pkgForm, is_active: e.target.checked })} />
                  Tampilkan paket ini di beranda website
                </label>

                <div className="flex gap-2 pt-2">
                  <button disabled={saving} className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all">
                    {saving ? "Menyimpan ke Firebase..." : editingPkgId === "new" ? "Tambah Paket" : "Simpan Paket"}
                  </button>
                  {editingPkgId && (
                    <button type="button" onClick={resetPkgForm} className="px-4 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white">
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <h2 className="font-bold text-white text-base mb-2">Daftar Paket Wisata ({packages.length})</h2>
              {packages.length === 0 && (
                <p className="text-white/60 text-sm">Belum ada paket wisata. Klik "+ Paket Baru" untuk menambahkan.</p>
              )}
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex gap-4 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                      {pkg.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-white/30">No Image</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{pkg.name}</h3>
                        {pkg.badge && <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded">{pkg.badge}</span>}
                        <span className={`text-[10px] px-2 py-0.5 rounded ${pkg.is_active ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                          {pkg.is_active ? "Tampil di Beranda" : "Sembunyi"}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">{pkg.duration} · {money(pkg.price)}</p>
                      <p className="text-[11px] text-white/40 mt-1 line-clamp-1">🚗 {pkg.car_details} | 🏨 {pkg.hotel_details}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEditPkg(pkg)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg">
                      Edit
                    </button>
                    <button onClick={() => deletePackage(pkg)} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg">
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
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 h-fit">
              <h2 className="font-bold text-white mb-4">{editingEventId ? "Edit Event" : "Tambah Event Baru"}</h2>
              <form onSubmit={submitEvent} className="space-y-3">
                <input className={inputClass} placeholder="Nama event, cth: Konser Mandalika 2026" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} required />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Mulai</label>
                    <input className={inputClass} type="date" value={eventForm.start_date} onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Selesai</label>
                    <input className={inputClass} type="date" value={eventForm.end_date} onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })} required />
                  </div>
                </div>
                <input className={inputClass} placeholder="Lokasi, cth: Sirkuit Mandalika" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
                <textarea className={inputClass} rows={3} placeholder="Catatan singkat (opsional)" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
                <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                  <input type="checkbox" checked={eventForm.is_active} onChange={(e) => setEventForm({ ...eventForm, is_active: e.target.checked })} />
                  Tampilkan di website
                </label>
                <div className="flex gap-2 pt-2">
                  <button disabled={saving} className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all">
                    {saving ? "Menyimpan ke Firebase..." : editingEventId ? "Simpan Perubahan" : "Tambah Event"}
                  </button>
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEventId(null);
                        setEventForm({ name: "", start_date: "", end_date: "", location: "", description: "", is_active: true });
                      }}
                      className="px-4 py-2.5 rounded-xl border border-white/20 text-white/70"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <h2 className="font-bold text-white text-base mb-2">Daftar Event ({events.length})</h2>
              {events.length === 0 && <p className="text-white/60 text-sm">Belum ada event aktif.</p>}
              {events.map((event) => (
                <div key={event.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex justify-between gap-3 items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{event.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${event.is_active ? "bg-gold/20 text-gold" : "bg-white/10 text-white/50"}`}>
                        {event.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <p className="text-xs text-gold/90 mt-1">{formatEventRange(event.start_date, event.end_date)}</p>
                    {event.location && <p className="text-xs text-white/50 mt-0.5">📍 {event.location}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
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
                      className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg"
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteEvent(event)} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg">
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
