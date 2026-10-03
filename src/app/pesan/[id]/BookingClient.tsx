'use client';

import { useState, useRef, useEffect } from 'react';
import { datesOverlapEvent, formatEventRange, type PublicGpEvent } from '@/lib/gp';

export default function BookingClient({ car, events = [] }: { car: any; events?: PublicGpEvent[] }) {
  const defaultType = car.with_keyless_available ? 'lepas_kunci' : 'dengan_sopir';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    startDate: '',
    endDate: '',
    pickup: 'Bandara Internasional Lombok (BIL)',
    dropoff: '',
    type: defaultType,
    isGpEvent: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Clear error saat user mulai mengisi
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap tidak boleh kosong.';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor WhatsApp tidak boleh kosong.';
    if (!formData.startDate) newErrors.startDate = 'Tanggal mulai tidak boleh kosong.';
    if (!formData.endDate) newErrors.endDate = 'Tanggal selesai tidak boleh kosong.';
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'Tanggal selesai harus setelah tanggal mulai.';
    }
    if (!formData.pickup.trim()) newErrors.pickup = 'Lokasi penjemputan tidak boleh kosong.';
    return newErrors;
  };

  const matchedEvent = datesOverlapEvent(formData.startDate, formData.endDate, events);
  const isGpEvent = formData.isGpEvent || Boolean(matchedEvent);

  const getDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const diff = new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getBasePrice = () => {
    if (formData.type === 'lepas_kunci') {
      return isGpEvent
        ? (car.price_lepas_kunci_gp ?? car.price_lepas_kunci)
        : car.price_lepas_kunci;
    } else {
      return isGpEvent
        ? (car.price_dengan_sopir_gp ?? car.price_dengan_sopir)
        : car.price_dengan_sopir;
    }
  };

  const totalPrice = getDays() * (getBasePrice() || 0);

  const isGpKeylessBlocked =
    isGpEvent &&
    formData.type === 'lepas_kunci' &&
    car.price_lepas_kunci_gp === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll ke error pertama
      const firstKey = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (isGpKeylessBlocked) {
      alert('Maaf, lepas kunci tidak tersedia untuk event MotoGP pada mobil ini. Silakan pilih "Dengan Sopir".');
      return;
    }

    const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WA || '6285923634253';
    const days = getDays();
    const durationNote = formData.type === 'dengan_sopir'
      ? ` (Per ${car.driver_duration_hours} Jam/Hari)`
      : ' (24 Jam/Hari)';

    // Save to DB in background (fire and forget)
    setIsSaving(true);
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: car.id,
          customer_name: formData.name,
          customer_phone: formData.phone,
          start_date: formData.startDate,
          end_date: formData.endDate,
          pickup_location: formData.pickup,
          dropoff_location: formData.dropoff || formData.pickup,
          rental_type: formData.type,
          total_price: totalPrice,
        }),
      });
    } catch (err) {
      // Non-blocking — still proceed to WA
      console.error('Failed to save booking', err);
    } finally {
      setIsSaving(false);
    }

    const message = `Halo Diamond Trans! Saya ingin menyewa mobil:

🚗 *DETAIL MOBIL*
- Mobil: ${car.name} (${car.brand})
- Tipe: ${formData.type === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir'}${durationNote}
- Event MotoGP: ${isGpEvent ? `✅ Ya${matchedEvent ? ` (${matchedEvent.name})` : ''}` : '❌ Tidak'}

👤 *DATA PENYEWA*
- Nama: ${formData.name}
- No. HP: ${formData.phone}

📅 *JADWAL & LOKASI*
- Tanggal Mulai: ${formData.startDate}
- Tanggal Selesai: ${formData.endDate} (${days} Hari)
- Lokasi Jemput: ${formData.pickup}
- Lokasi Kembali: ${formData.dropoff || formData.pickup}

💰 *ESTIMASI TOTAL*
Rp ${totalPrice.toLocaleString('id-ID')}

Apakah unit ini tersedia? Terima kasih 🙏`;

    window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {events.length > 0 && (
        <div className="bg-gold/10 border border-gold/30 p-4 rounded-xl space-y-3">
          <p className="font-bold text-white text-sm">🏁 Event GP yang sedang / akan berlangsung</p>
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="text-xs text-white/80">
                <span className="font-semibold text-gold">{event.name}</span>
                <span className="text-white/60"> · {formatEventRange(event.start_date, event.end_date)}</span>
                {event.location ? <span className="text-white/50"> · {event.location}</span> : null}
              </li>
            ))}
          </ul>
          {matchedEvent ? (
            <p className="text-xs text-gold">
              Tanggal sewa Anda masuk periode <strong>{matchedEvent.name}</strong>. Harga khusus event diterapkan otomatis.
            </p>
          ) : (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isGpEvent"
                checked={formData.isGpEvent}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-gold shrink-0"
              />
              <span className="text-xs text-white/70">
                Centang jika sewa tetap di periode event GP meski tanggal di luar daftar di atas.
              </span>
            </label>
          )}
        </div>
      )}

      {events.length === 0 && (
        <label className="flex items-start gap-3 bg-gold/10 border border-gold/30 p-4 rounded-xl cursor-pointer hover:bg-gold/20 transition-colors">
          <input
            type="checkbox"
            name="isGpEvent"
            checked={formData.isGpEvent}
            onChange={handleChange}
            className="mt-1 w-4 h-4 accent-gold shrink-0"
          />
          <div>
            <p className="font-bold text-white text-sm">🏁 Sewa di Periode Event MotoGP?</p>
            <p className="text-xs text-white/70 mt-0.5">
              Harga khusus event berlaku. Beberapa mobil wajib menggunakan sopir saat event GP.
            </p>
          </div>
        </label>
      )}

      {/* Personal Info */}
      <div>
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-2 mb-4">Informasi Pribadi</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Nama Lengkap *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-white outline-none bg-[#040404] transition-all ${errors.name ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-gold'}`}
              placeholder="Cth: Budi Santoso" />
            {errors.name && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0"></span>{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">No. WhatsApp *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-white outline-none bg-[#040404] transition-all ${errors.phone ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-gold'}`}
              placeholder="Cth: 08123456789" />
            {errors.phone && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0"></span>{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Booking Detail */}
      <div>
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-2 mb-4">Detail Sewa</h3>
        <div className="space-y-4">
          {/* Custom Tipe Layanan Dropdown */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-3">Tipe Layanan *</label>
            <div ref={typeRef} className="relative">

              {/* Pilihan kartu side-by-side */}
              <div className="grid grid-cols-2 gap-3">
                {car.with_keyless_available && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'lepas_kunci' }))}
                    className={`relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 transition-all text-left ${
                      formData.type === 'lepas_kunci'
                        ? 'border-gold bg-gold/10 shadow-[0_0_12px_rgba(181,136,67,0.15)]'
                        : 'border-white/10 bg-[#040404] hover:border-white/30'
                    }`}
                  >
                    {formData.type === 'lepas_kunci' && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold"></span>
                    )}
                    {/* Icon kunci */}
                    <svg className={`w-5 h-5 ${formData.type === 'lepas_kunci' ? 'text-gold' : 'text-white/40'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span className={`text-sm font-bold ${formData.type === 'lepas_kunci' ? 'text-white' : 'text-white/60'}`}>Lepas Kunci</span>
                    <span className={`text-xs ${formData.type === 'lepas_kunci' ? 'text-gold/80' : 'text-white/30'}`}>24 Jam / Hari</span>
                  </button>
                )}

                {car.with_driver_available && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'dengan_sopir' }))}
                    className={`relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 transition-all text-left ${
                      formData.type === 'dengan_sopir'
                        ? 'border-gold bg-gold/10 shadow-[0_0_12px_rgba(181,136,67,0.15)]'
                        : 'border-white/10 bg-[#040404] hover:border-white/30'
                    }`}
                  >
                    {formData.type === 'dengan_sopir' && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold"></span>
                    )}
                    {/* Icon sopir */}
                    <svg className={`w-5 h-5 ${formData.type === 'dengan_sopir' ? 'text-gold' : 'text-white/40'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className={`text-sm font-bold ${formData.type === 'dengan_sopir' ? 'text-white' : 'text-white/60'}`}>Dengan Sopir</span>
                    <span className={`text-xs ${formData.type === 'dengan_sopir' ? 'text-gold/80' : 'text-white/30'}`}>{car.driver_duration_hours} Jam / Hari</span>
                  </button>
                )}
              </div>

            </div>
            {isGpKeylessBlocked && (
              <p className="text-red-400 text-xs mt-3 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                Lepas kunci tidak tersedia untuk event GP pada unit ini.
              </p>
            )}
          </div>


          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Tanggal Mulai *</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-white outline-none bg-[#040404] transition-all ${errors.startDate ? 'border-red-500' : 'border-white/20 focus:border-gold'}`} />
              {errors.startDate && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0"></span>{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Tanggal Selesai *</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-white outline-none bg-[#040404] transition-all ${errors.endDate ? 'border-red-500' : 'border-white/20 focus:border-gold'}`} />
              {errors.endDate && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0"></span>{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Lokasi Penjemputan *</label>
            <input type="text" name="pickup" value={formData.pickup} onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-white outline-none bg-[#040404] transition-all ${errors.pickup ? 'border-red-500' : 'border-white/20 focus:border-gold'}`}
              placeholder="Cth: Bandara Lombok, Hotel Santika Senggigi..." />
            {errors.pickup && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0"></span>{errors.pickup}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Lokasi Pengembalian</label>
            <input type="text" name="dropoff" value={formData.dropoff} onChange={handleChange}
              className="w-full rounded-lg border border-white/20 bg-[#040404] px-4 py-2.5 text-sm text-white outline-none focus:border-gold transition-all"
              placeholder="Kosongkan jika sama dengan lokasi jemput" />
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Harga per unit</span>
          <span className="font-medium text-white">Rp {(getBasePrice() || 0).toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Durasi</span>
          <span className="font-medium text-white">{getDays()} Hari</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-white/10">
          <span className="text-white">Total Estimasi</span>
          <span className="text-white">Rp {totalPrice.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSaving || isGpKeylessBlocked}
        className="w-full bg-[#25D366] hover:bg-[#20bd5a] disabled:bg-gray-300 text-white rounded-xl px-4 py-4 font-bold transition-colors shadow-sm flex justify-center items-center gap-2 text-base"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        {isSaving ? 'Memproses...' : 'Pesan Sekarang via WhatsApp'}
      </button>
      <p className="text-center text-xs text-white/50">
        Anda akan diarahkan ke WhatsApp. Pembayaran dilakukan setelah konfirmasi.
      </p>
    </form>
  );
}
