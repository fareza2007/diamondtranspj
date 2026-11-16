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

type TransferRecord = {
  id: string;
  destination: string;
  price_avanza: number;
  price_innova: number;
  price_hiace: number;
  price_bus: number;
  note?: string | null;
  order_index?: number;
  is_active: boolean;
};

const emptyTransfer = {
  destination: "",
  price_avanza: "",
  price_innova: "",
  price_hiace: "",
  price_bus: "",
  note: "",
  order_index: "1",
  is_active: true,
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
          className="text-[11px] text-white/50 hover:text-gold transition-colors inline-flex items-center gap-1.5"
        >
          <svg className="w-3 h-3 text-gold/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>{showUrl ? "Sembunyikan input URL" : "Atau masukkan link URL gambar langsung"}</span>
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
  transfers = [],
}: {
  cars: CarRecord[];
  events: EventRecord[];
  packages?: PackageRecord[];
  transfers?: TransferRecord[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"armada" | "transfer" | "paket" | "event">("armada");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Transfers state
  const [editingTransferId, setEditingTransferId] = useState<string | "new" | null>(null);
  const [transferForm, setTransferForm] = useState(emptyTransfer);

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

  // Transfer actions
  const resetTransferForm = () => {
    setEditingTransferId(null);
    setTransferForm(emptyTransfer);
  };

  const openCreateTransfer = () => {
    setEditingTransferId("new");
    setTransferForm({
      ...emptyTransfer,
      order_index: String(transfers.length + 1),
    });
  };

  const openEditTransfer = (t: TransferRecord) => {
    setEditingTransferId(t.id);
    setTransferForm({
      destination: t.destination,
      price_avanza: String(t.price_avanza || 0),
      price_innova: String(t.price_innova || 0),
      price_hiace: String(t.price_hiace || 0),
      price_bus: String(t.price_bus || 0),
      note: t.note || "",
      order_index: String(t.order_index ?? 99),
      is_active: t.is_active,
    });
  };

  const submitTransfer = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        destination: transferForm.destination.trim(),
        price_avanza: Number(transferForm.price_avanza) || 0,
        price_innova: Number(transferForm.price_innova) || 0,
        price_hiace: Number(transferForm.price_hiace) || 0,
        price_bus: Number(transferForm.price_bus) || 0,
        note: transferForm.note.trim() || null,
        order_index: Number(transferForm.order_index) || 99,
        is_active: transferForm.is_active,
      };

      const url = editingTransferId === "new" ? "/api/admin/transfers" : `/api/admin/transfers/${editingTransferId}`;
      const method = editingTransferId === "new" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menyimpan rute antar-jemput.");
        return;
      }
      setMessage(editingTransferId === "new" ? "Rute antar-jemput berhasil ditambahkan." : "Rute antar-jemput diperbarui.");
      resetTransferForm();
      router.refresh();
    } catch {
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTransferActive = async (t: TransferRecord) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/transfers/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !t.is_active }),
      });
      if (res.ok) {
        setMessage(`Status rute "${t.destination}" diubah menjadi ${!t.is_active ? "Aktif" : "Nonaktif"}.`);
        router.refresh();
      }
    } catch {
      setMessage("Gagal mengubah status rute.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTransfer = async (t: TransferRecord) => {
    if (!confirm(`Hapus rute "${t.destination}"?`)) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/transfers/${t.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menghapus rute.");
        return;
      }
      if (editingTransferId === t.id) resetTransferForm();
      setMessage(`Rute "${t.destination}" telah dihapus.`);
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
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              tab === "armada" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zM3 9h18M5 14h14M4 14l1.5-6h13L20 14" />
            </svg>
            Armada ({cars.length})
          </button>
          <button
            onClick={() => {
              setTab("transfer");
              setEditingTransferId(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              tab === "transfer" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Pick Up Service ({transfers.length})
          </button>
          <button
            onClick={() => {
              setTab("paket");
              setEditingPkgId(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              tab === "paket" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Paket Wisata ({packages.length})
          </button>
          <button
            onClick={() => {
              setTab("event");
              setIsAddingEvent(false);
              setEditingEventId(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              tab === "event" ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Event Khusus ({activeEvents.length})
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="mb-6 bg-gold/10 border border-gold/40 text-white text-sm px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-white/50 hover:text-white p-1 rounded-md transition-colors ml-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Tutup Form</span>
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
                      className="flex-1 text-xs bg-white/10 hover:bg-gold hover:text-white text-white/90 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
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
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Tutup Form</span>
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
                      <label className="block text-xs text-white/70 mb-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zM3 9h18M5 14h14M4 14l1.5-6h13L20 14" />
                        </svg>
                        Transport & Mobil
                      </label>
                      <input className={inputClass} placeholder="Cth: Toyota All New Avanza / Veloz (Termasuk Sopir & BBM)" value={pkgForm.car_details} onChange={(e) => setPkgForm({ ...pkgForm, car_details: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Penginapan & Hotel
                      </label>
                      <input className={inputClass} placeholder="Cth: Hotel Bintang 4 di Mandalika (2 Malam + Sarapan Pagi)" value={pkgForm.hotel_details} onChange={(e) => setPkgForm({ ...pkgForm, hotel_details: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 mb-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Rute & Wisata
                      </label>
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
                      <p className="line-clamp-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zM3 9h18M5 14h14M4 14l1.5-6h13L20 14" />
                        </svg>
                        {pkg.car_details}
                      </p>
                      <p className="line-clamp-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {pkg.hotel_details}
                      </p>
                      <p className="line-clamp-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        {pkg.travel_details}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/10 mt-2">
                    <button
                      onClick={() => openEditPkg(pkg)}
                      className="flex-1 text-xs bg-white/10 hover:bg-gold hover:text-white text-white/90 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
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
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Tutup Form</span>
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

                    <p className="text-xs text-gold font-medium mb-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatEventRange(event.start_date, event.end_date)}
                    </p>
                    {event.location && (
                      <p className="text-xs text-white/60 mb-2 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </p>
                    )}
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
                      className="flex-1 text-xs bg-white/10 hover:bg-gold hover:text-white text-white/90 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
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

        {/* ===================== TAB: PICK UP / TRANSFER SERVICE ===================== */}
        {tab === "transfer" && (
          <div>
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Pick Up Service / Antar-Jemput Bandara</span>
                  <span className="text-xs bg-gold/20 text-gold px-2.5 py-0.5 rounded-full font-semibold">
                    {transfers.length} Rute
                  </span>
                </h2>
                <p className="text-xs text-white/60 mt-1">
                  Kelola daftar destinasi dan tarif flat antar-jemput bandara (Avanza, Innova, Hiace, Bus 3/4).
                </p>
              </div>

              {editingTransferId === null && (
                <button
                  onClick={openCreateTransfer}
                  className="bg-gold hover:bg-gold/90 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Rute Baru
                </button>
              )}
            </div>

            {/* Create / Edit Form */}
            {editingTransferId !== null && (
              <div className="bg-[#0a0a0a] border border-gold/30 rounded-2xl p-6 mb-8 shadow-xl">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold"></span>
                    {editingTransferId === "new" ? "Tambah Rute Antar-Jemput Baru" : "Edit Tarif Rute Antar-Jemput"}
                  </h3>
                  <button
                    onClick={resetTransferForm}
                    className="text-white/40 hover:text-white text-xs px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Batal (Esc)
                  </button>
                </div>

                <form onSubmit={submitTransfer} className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">
                        Nama Destinasi / Rute <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Airport – Senggigi"
                        className={inputClass}
                        value={transferForm.destination}
                        onChange={(e) => setTransferForm({ ...transferForm, destination: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">
                        Urutan Tampilan
                      </label>
                      <input
                        type="number"
                        min="1"
                        className={inputClass}
                        value={transferForm.order_index}
                        onChange={(e) => setTransferForm({ ...transferForm, order_index: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      Tarif per Jenis Kendaraan (Rp) <span className="text-gold text-[11px] font-normal">(Sudah termasuk Mobil + Sopir + BBM)</span>
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-[#040404] p-3 rounded-xl border border-white/10">
                        <span className="text-[11px] text-gold font-semibold block mb-1">Avanza / Ertiga</span>
                        <input
                          type="number"
                          placeholder="Contoh: 225000"
                          className={inputClass}
                          value={transferForm.price_avanza}
                          onChange={(e) => setTransferForm({ ...transferForm, price_avanza: e.target.value })}
                        />
                      </div>

                      <div className="bg-[#040404] p-3 rounded-xl border border-white/10">
                        <span className="text-[11px] text-gold font-semibold block mb-1">Innova Reborn</span>
                        <input
                          type="number"
                          placeholder="Contoh: 275000"
                          className={inputClass}
                          value={transferForm.price_innova}
                          onChange={(e) => setTransferForm({ ...transferForm, price_innova: e.target.value })}
                        />
                      </div>

                      <div className="bg-[#040404] p-3 rounded-xl border border-white/10">
                        <span className="text-[11px] text-gold font-semibold block mb-1">Elf / Hiace</span>
                        <input
                          type="number"
                          placeholder="Contoh: 550000"
                          className={inputClass}
                          value={transferForm.price_hiace}
                          onChange={(e) => setTransferForm({ ...transferForm, price_hiace: e.target.value })}
                        />
                      </div>

                      <div className="bg-[#040404] p-3 rounded-xl border border-white/10">
                        <span className="text-[11px] text-gold font-semibold block mb-1">Bus 3/4</span>
                        <input
                          type="number"
                          placeholder="Contoh: 950000"
                          className={inputClass}
                          value={transferForm.price_bus}
                          onChange={(e) => setTransferForm({ ...transferForm, price_bus: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      Keterangan / Area Cakupan (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Area hotel pantai Senggigi, Batu Layar, Mangsit"
                      className={inputClass}
                      value={transferForm.note}
                      onChange={(e) => setTransferForm({ ...transferForm, note: e.target.value })}
                    />
                  </div>

                  <label className="flex items-center gap-2.5 text-xs text-white/90 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-gold"
                      checked={transferForm.is_active}
                      onChange={(e) => setTransferForm({ ...transferForm, is_active: e.target.checked })}
                    />
                    Tampilkan rute ini di website publik
                  </label>

                  <div className="flex gap-3 pt-3">
                    <button
                      disabled={saving}
                      className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-gold/20 text-sm"
                    >
                      {saving ? "Menyimpan ke Database..." : editingTransferId === "new" ? "Tambahkan Rute" : "Simpan Perubahan"}
                    </button>
                    <button
                      type="button"
                      onClick={resetTransferForm}
                      className="px-5 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden md:block bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-white/70 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 w-12 text-center">#</th>
                      <th className="py-3.5 px-4">Destinasi / Rute</th>
                      <th className="py-3.5 px-4">Avanza / Ertiga</th>
                      <th className="py-3.5 px-4">Innova</th>
                      <th className="py-3.5 px-4">Elf / Hiace</th>
                      <th className="py-3.5 px-4">Bus 3/4</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transfers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-white/50 text-sm">
                          Belum ada data tarif rute antar-jemput. Klik &ldquo;Tambah Rute Baru&rdquo; untuk memulai.
                        </td>
                      </tr>
                    ) : (
                      transfers.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 text-center text-white/40 font-mono">
                            {item.order_index ?? idx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white text-sm block">
                              {item.destination}
                            </span>
                            {item.note && (
                              <span className="text-[11px] text-white/50 block mt-0.5">
                                {item.note}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-white font-medium">
                            {money(item.price_avanza)}
                          </td>
                          <td className="py-3.5 px-4 text-white font-medium">
                            {money(item.price_innova)}
                          </td>
                          <td className="py-3.5 px-4 text-white font-medium">
                            {money(item.price_hiace)}
                          </td>
                          <td className="py-3.5 px-4 text-white font-medium">
                            {money(item.price_bus)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => toggleTransferActive(item)}
                              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                                item.is_active
                                  ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                                  : "bg-white/10 text-white/50 hover:bg-white/20"
                              }`}
                              title="Klik untuk ubah status"
                            >
                              {item.is_active ? "Aktif" : "Nonaktif"}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditTransfer(item)}
                                className="text-[11px] bg-white/10 hover:bg-gold hover:text-white text-white/90 font-medium px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteTransfer(item)}
                                className="text-[11px] bg-red-500/15 hover:bg-red-500/30 text-red-300 px-2.5 py-1.5 rounded-lg transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {transfers.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 text-center text-white/50 text-sm">
                  Belum ada data tarif rute antar-jemput.
                </div>
              ) : (
                transfers.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                            #{item.order_index ?? idx + 1}
                          </span>
                          <h4 className="font-bold text-white text-sm">{item.destination}</h4>
                        </div>
                        {item.note && <p className="text-xs text-white/50 mt-1">{item.note}</p>}
                      </div>
                      <button
                        onClick={() => toggleTransferActive(item)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          item.is_active ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/50"
                        }`}
                      >
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-black/40 p-2.5 rounded-lg border border-white/5">
                      <div>
                        <span className="text-white/40 block text-[10px]">Avanza/Ertiga:</span>
                        <span className="font-semibold text-white">{money(item.price_avanza)}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Innova:</span>
                        <span className="font-semibold text-white">{money(item.price_innova)}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Elf/Hiace:</span>
                        <span className="font-semibold text-white">{money(item.price_hiace)}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Bus 3/4:</span>
                        <span className="font-semibold text-white">{money(item.price_bus)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => openEditTransfer(item)}
                        className="flex-1 text-xs bg-white/10 hover:bg-gold hover:text-white text-white/90 font-medium py-1.5 rounded-lg transition-colors text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTransfer(item)}
                        className="text-xs bg-red-500/15 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
