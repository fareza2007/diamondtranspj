"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatEventRange } from "@/lib/gp";
import { upload } from '@vercel/blob/client';

type CarRecord = {
  id: number;
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
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  location: string | null;
  description: string | null;
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
};

function money(n: number | null) {
  if (n == null) return "-";
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
}

function toDateInput(value: string) {
  return value ? value.slice(0, 10) : "";
}

export default function AdminDashboard({
  cars,
  events,
}: {
  cars: CarRecord[];
  events: EventRecord[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"armada" | "event">("armada");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [carForm, setCarForm] = useState(emptyCar);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [eventForm, setEventForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
    is_active: true,
  });
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const activeEvents = useMemo(() => events.filter((e) => e.is_active), [events]);

  const resetCarForm = () => {
    setEditingId(null);
    setCarForm(emptyCar);
    setImageFile(null);
    setImagePreview(null);
  };

  const openCreateCar = () => {
    setEditingId("new");
    setCarForm(emptyCar);
    setImageFile(null);
    setImagePreview(null);
  };

  const openEditCar = (car: CarRecord) => {
    setEditingId(car.id);
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
    });
    setImageFile(null);
    setImagePreview(car.image_url);
  };

  const onPickImage = (file: File | null) => {
    setImageFile(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result || ""));
    reader.readAsDataURL(file);
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

      if (imageFile) {
        try {
          const newBlob = await upload(imageFile.name, imageFile, {
            access: 'public',
            handleUploadUrl: '/api/admin/upload',
          });
          form.set("image_url_direct", newBlob.url);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setMessage(`Gagal mengupload: ${errorMessage}`);
          setSaving(false);
          return;
        }
      }

      const url = editingId === "new" ? "/api/admin/cars" : `/api/admin/cars/${editingId}`;
      const method = editingId === "new" ? "POST" : "PATCH";
      const res = await fetch(url, { method, body: form });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menyimpan armada.");
        return;
      }
      setMessage(editingId === "new" ? "Armada berhasil ditambahkan." : "Armada berhasil diperbarui.");
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
      if (editingId === car.id) resetCarForm();
      setMessage(`${car.name} telah dihapus.`);
      router.refresh();
    } catch {
      setMessage("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  const submitEvent = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...eventForm,
        location: eventForm.location || null,
        description: eventForm.description || null,
      };
      const url = editingEventId ? `/api/admin/events/${editingEventId}` : "/api/admin/events";
      const method = editingEventId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const editEvent = (event: EventRecord) => {
    setEditingEventId(event.id);
    setEventForm({
      name: event.name,
      start_date: toDateInput(event.start_date),
      end_date: toDateInput(event.end_date),
      location: event.location || "",
      description: event.description || "",
      is_active: event.is_active,
    });
  };

  const deleteEvent = async (event: EventRecord) => {
    if (!confirm(`Hapus event ${event.name}?`)) return;
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
      <header className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-gold text-xs uppercase tracking-widest">Diamond Trans</p>
            <h1 className="text-white font-bold">Panel Admin</h1>
          </div>
          <button onClick={logout} className="text-sm text-white/70 hover:text-white border border-white/20 px-4 py-2 rounded-lg">
            Keluar
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab("armada")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "armada" ? "bg-gold text-white" : "bg-white/5 text-white/70"}`}
          >
            Armada ({cars.length})
          </button>
          <button
            onClick={() => setTab("event")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "event" ? "bg-gold text-white" : "bg-white/5 text-white/70"}`}
          >
            Event Aktif ({activeEvents.length})
          </button>
        </div>

        {message && (
          <div className="mb-6 bg-gold/10 border border-gold/30 text-white text-sm px-4 py-3 rounded-xl">
            {message}
          </div>
        )}

        {tab === "armada" && (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white">{editingId === "new" ? "Tambah Armada" : editingId ? "Edit Armada" : "Form Armada"}</h2>
                {editingId !== "new" && (
                  <button onClick={openCreateCar} className="text-xs bg-gold text-white px-3 py-1.5 rounded-lg font-semibold">
                    + Unit baru
                  </button>
                )}
              </div>
              <form onSubmit={submitCar} className="space-y-3">
                <input className={inputClass} placeholder="Nama unit, cth: All New Avanza" value={carForm.name} onChange={(e) => setCarForm({ ...carForm, name: e.target.value })} required />
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputClass} placeholder="Merek" value={carForm.brand} onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })} required />
                  <select className={inputClass} value={carForm.transmission} onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}>
                    <option value="matic">Matic</option>
                    <option value="manual">Manual</option>
                  </select>
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
                
                <p className="text-sm font-semibold text-white/80 pt-2 border-t border-white/10 mt-2">Harga Hari Biasa</p>
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
                
                <p className="text-sm font-semibold text-white/80 pt-2 border-t border-white/10 mt-2">Harga Event Khusus <span className="text-xs font-normal text-white/40">(Kosongkan jika sama)</span></p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Lepas Kunci (Event)</label>
                    <input className={inputClass} type="number" min={0} placeholder="Rp" value={carForm.price_lepas_kunci_gp} onChange={(e) => setCarForm({ ...carForm, price_lepas_kunci_gp: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Dengan Sopir (Event)</label>
                    <input className={inputClass} type="number" min={0} placeholder="Rp" value={carForm.price_dengan_sopir_gp} onChange={(e) => setCarForm({ ...carForm, price_dengan_sopir_gp: e.target.value })} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input type="checkbox" checked={carForm.with_keyless_available} onChange={(e) => setCarForm({ ...carForm, with_keyless_available: e.target.checked })} />
                  Tersedia lepas kunci
                </label>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input type="checkbox" checked={carForm.with_driver_available} onChange={(e) => setCarForm({ ...carForm, with_driver_available: e.target.checked })} />
                  Tersedia dengan sopir
                </label>
                <select className={inputClass} value={carForm.status} onChange={(e) => setCarForm({ ...carForm, status: e.target.value })}>
                  <option value="available">Tampil di katalog</option>
                  <option value="unavailable">Sembunyikan</option>
                </select>
                <div>
                  <label className="block text-xs text-white/70 mb-1">Foto unit</label>
                  <input type="file" accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0] || null)} className="block w-full text-xs text-white/70" />
                  {imagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="Preview" className="mt-3 w-full rounded-lg border border-white/10" />
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <button disabled={saving || !editingId} className="flex-1 bg-gold disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl">
                    {saving ? "Menyimpan..." : editingId === "new" ? "Tambah unit" : "Simpan perubahan"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetCarForm} className="px-4 py-2.5 rounded-xl border border-white/20 text-white/70">
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-3 space-y-3">
              {cars.length === 0 && <p className="text-white/60">Belum ada armada.</p>}
              {cars.map((car) => (
                <div key={car.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex gap-4">
                  <div className="w-28 shrink-0 rounded-lg overflow-hidden bg-white/5">
                    {car.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={car.image_url} alt={car.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="h-20 flex items-center justify-center text-xs text-white/40">Tanpa foto</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white">{car.name}</h3>
                        <p className="text-xs text-white/50 capitalize">{car.brand} · {car.transmission} · {car.seats} kursi</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded h-fit ${car.status === "available" ? "bg-gold/20 text-gold" : "bg-white/10 text-white/50"}`}>
                        {car.status === "available" ? "Aktif" : "Disembunyikan"}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 mt-2">
                      Hari biasa: {money(car.price_lepas_kunci)} / {money(car.price_dengan_sopir)} · Event: {money(car.price_lepas_kunci_gp)} / {money(car.price_dengan_sopir_gp)}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openEditCar(car)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg">Edit</button>
                      <button onClick={() => deleteCar(car)} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "event" && (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5">
              <h2 className="font-bold text-white mb-4">{editingEventId ? "Edit Event" : "Tambah Event"}</h2>
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
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input type="checkbox" checked={eventForm.is_active} onChange={(e) => setEventForm({ ...eventForm, is_active: e.target.checked })} />
                  Tampilkan di website
                </label>
                <div className="flex gap-2">
                  <button disabled={saving} className="flex-1 bg-gold disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl">
                    {saving ? "Menyimpan..." : editingEventId ? "Simpan event" : "Tambah event"}
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
              {events.length === 0 && <p className="text-white/60">Belum ada event aktif. Tambahkan periode event agar harga khusus muncul di form pemesanan.</p>}
              {events.map((event) => (
                <div key={event.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white">{event.name}</h3>
                      <p className="text-sm text-gold/90 mt-1">{formatEventRange(event.start_date, event.end_date)}</p>
                      {event.location && <p className="text-xs text-white/50 mt-1">{event.location}</p>}
                      {event.description && <p className="text-sm text-white/70 mt-2">{event.description}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded h-fit ${event.is_active ? "bg-gold/20 text-gold" : "bg-white/10 text-white/50"}`}>
                      {event.is_active ? "Tayang" : "Disembunyikan"}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => editEvent(event)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg">Edit</button>
                    <button onClick={() => deleteEvent(event)} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg">Hapus</button>
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
