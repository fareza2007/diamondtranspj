import { adminDb } from "./firebase-admin";

export interface Car {
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
  created_at?: string;
}

export interface GpEvent {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location?: string | null;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface TourPackage {
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
  created_at?: string;
}

export interface TransferRate {
  id: string;
  destination: string;
  price_avanza: number;
  price_innova: number;
  price_hiace: number;
  price_bus: number;
  note?: string | null;
  order_index?: number;
  is_active: boolean;
  created_at?: string;
}

export interface Booking {
  id?: string;
  car_id?: string;
  package_id?: string;
  customer_name: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
  rental_type: string;
  total_price: number;
  status?: string;
  created_at?: string;
}

// ========================
// CARS
// ========================
export async function getCars(onlyAvailable = false, limitCount?: number): Promise<Car[]> {
  try {
    let q = adminDb.collection("cars") as any;
    if (onlyAvailable) {
      q = q.where("status", "==", "available");
    }
    const snap = await q.get();
    const cars: Car[] = [];
    snap.forEach((d: any) => {
      cars.push({ id: d.id, ...d.data() } as Car);
    });
    cars.sort((a, b) => (a.price_per_day || 0) - (b.price_per_day || 0));
    if (limitCount && limitCount > 0) {
      return cars.slice(0, limitCount);
    }
    return cars;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

export async function getCarById(id: string): Promise<Car | null> {
  try {
    const docRef = adminDb.collection("cars").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() } as Car;
  } catch (error) {
    console.error(`Error fetching car ${id}:`, error);
    return null;
  }
}

export async function addCar(data: Omit<Car, "id">): Promise<string> {
  const res = await adminDb.collection("cars").add({
    ...data,
    created_at: new Date().toISOString(),
  });
  return res.id;
}

export async function updateCar(id: string, data: Partial<Car>): Promise<void> {
  await adminDb.collection("cars").doc(id).update({ ...data });
}

export async function deleteCar(id: string): Promise<void> {
  await adminDb.collection("cars").doc(id).delete();
}

// ========================
// EVENTS
// ========================
export async function getEvents(onlyActive = false): Promise<GpEvent[]> {
  try {
    let q = adminDb.collection("gp_events") as any;
    if (onlyActive) {
      q = q.where("is_active", "==", true);
    }
    const snap = await q.get();
    const events: GpEvent[] = [];
    snap.forEach((d: any) => {
      events.push({ id: d.id, ...d.data() } as GpEvent);
    });
    events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function addEvent(data: Omit<GpEvent, "id">): Promise<string> {
  const res = await adminDb.collection("gp_events").add({
    ...data,
    created_at: new Date().toISOString(),
  });
  return res.id;
}

export async function updateEvent(id: string, data: Partial<GpEvent>): Promise<void> {
  await adminDb.collection("gp_events").doc(id).update({ ...data });
}

export async function deleteEvent(id: string): Promise<void> {
  await adminDb.collection("gp_events").doc(id).delete();
}

// ========================
// TOUR PACKAGES (Mobil + Hotel + Travel)
// ========================
export async function getPackages(onlyActive = false): Promise<TourPackage[]> {
  try {
    let q = adminDb.collection("packages") as any;
    if (onlyActive) {
      q = q.where("is_active", "==", true);
    }
    const snap = await q.get();
    const pkgs: TourPackage[] = [];
    snap.forEach((d: any) => {
      pkgs.push({ id: d.id, ...d.data() } as TourPackage);
    });
    pkgs.sort((a, b) => (a.price || 0) - (b.price || 0));
    return pkgs;
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

export async function getPackageById(id: string): Promise<TourPackage | null> {
  try {
    const docRef = adminDb.collection("packages").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() } as TourPackage;
  } catch (error) {
    console.error(`Error fetching package ${id}:`, error);
    return null;
  }
}

export async function addPackage(data: Omit<TourPackage, "id">): Promise<string> {
  const res = await adminDb.collection("packages").add({
    ...data,
    created_at: new Date().toISOString(),
  });
  return res.id;
}

export async function updatePackage(id: string, data: Partial<TourPackage>): Promise<void> {
  await adminDb.collection("packages").doc(id).update({ ...data });
}

export async function deletePackage(id: string): Promise<void> {
  await adminDb.collection("packages").doc(id).delete();
}

// ========================
// BOOKINGS
// ========================
export async function addBooking(data: Booking): Promise<string> {
  const res = await adminDb.collection("bookings").add({
    ...data,
    status: data.status || "pending",
    created_at: new Date().toISOString(),
  });
  return res.id;
}

// ========================
// PICK UP / TRANSFER SERVICE
// ========================
export const DEFAULT_TRANSFERS: Omit<TransferRate, "id">[] = [
  {
    destination: "Airport – Mataram",
    price_avanza: 175000,
    price_innova: 225000,
    price_hiace: 500000,
    price_bus: 850000,
    note: "Pusat kota Mataram, kantor pemerintahan & hotel bisnis",
    order_index: 1,
    is_active: true,
  },
  {
    destination: "Airport – Senggigi",
    price_avanza: 225000,
    price_innova: 275000,
    price_hiace: 550000,
    price_bus: 950000,
    note: "Kawasan resort pantai Senggigi, Batu Layar & Mangsit",
    order_index: 2,
    is_active: true,
  },
  {
    destination: "Airport – Kuta Area",
    price_avanza: 200000,
    price_innova: 250000,
    price_hiace: 600000,
    price_bus: 1150000,
    note: "Kuta Mandalika, Sirkuit GP, Tanjung Aan & Bukit Merese",
    order_index: 3,
    is_active: true,
  },
  {
    destination: "Airport – Bangsal",
    price_avanza: 300000,
    price_innova: 350000,
    price_hiace: 650000,
    price_bus: 1100000,
    note: "Pelabuhan penyeberangan ke Gili Trawangan, Meno & Air",
    order_index: 4,
    is_active: true,
  },
  {
    destination: "Airport – Bayan",
    price_avanza: 400000,
    price_innova: 450000,
    price_hiace: 800000,
    price_bus: 1450000,
    note: "Lombok Utara, masjid kuno Bayan & desa adat",
    order_index: 5,
    is_active: true,
  },
  {
    destination: "Airport – Selong",
    price_avanza: 200000,
    price_innova: 250000,
    price_hiace: 600000,
    price_bus: 800000,
    note: "Pusat pemerintahan Lombok Timur",
    order_index: 6,
    is_active: true,
  },
  {
    destination: "Airport – Kayangan",
    price_avanza: 450000,
    price_innova: 500000,
    price_hiace: 850000,
    price_bus: 1500000,
    note: "Pelabuhan penyeberangan kapal ferry menuju Sumbawa",
    order_index: 7,
    is_active: true,
  },
  {
    destination: "Airport – Senaru",
    price_avanza: 450000,
    price_innova: 500000,
    price_hiace: 850000,
    price_bus: 1550000,
    note: "Kawasan air terjun Sendang Gile & jalur pendakian Gn. Rinjani",
    order_index: 8,
    is_active: true,
  },
];

export async function getTransfers(onlyActive = false): Promise<TransferRate[]> {
  try {
    // Cek apakah koleksi kosong dulu tanpa filter
    const countSnap = await adminDb.collection("transfers").limit(1).get();
    if (countSnap.empty) {
      console.log("Koleksi transfers kosong, melakukan auto-seed default transfers...");
      const batch = adminDb.batch();
      const colRef = adminDb.collection("transfers");
      const seeded: TransferRate[] = [];

      for (const item of DEFAULT_TRANSFERS) {
        const docRef = colRef.doc();
        const payload = {
          ...item,
          created_at: new Date().toISOString(),
        };
        batch.set(docRef, payload);
        seeded.push({ id: docRef.id, ...payload });
      }

      await batch.commit();
      return seeded;
    }

    let q: FirebaseFirestore.Query = adminDb.collection("transfers");
    if (onlyActive) {
      q = q.where("is_active", "==", true);
    }
    const snap = await q.get();

    const items: TransferRate[] = [];
    snap.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as TransferRate);
    });

    if (items.length === 0) {
      return DEFAULT_TRANSFERS.map((item, idx) => ({
        id: `default-${idx + 1}`,
        ...item,
      }));
    }

    items.sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
    return items;
  } catch (error) {
    console.error("Error fetching transfers:", error);
    // Fallback ke default transfers jika ada kendala koneksi
    return DEFAULT_TRANSFERS.map((item, idx) => ({
      id: `default-${idx + 1}`,
      ...item,
    }));
  }
}

export async function getTransferById(id: string): Promise<TransferRate | null> {
  try {
    const docRef = adminDb.collection("transfers").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() } as TransferRate;
  } catch (error) {
    console.error(`Error fetching transfer ${id}:`, error);
    return null;
  }
}

export async function addTransfer(data: Omit<TransferRate, "id">): Promise<string> {
  const res = await adminDb.collection("transfers").add({
    ...data,
    created_at: new Date().toISOString(),
  });
  return res.id;
}

export async function updateTransfer(id: string, data: Partial<TransferRate>): Promise<void> {
  await adminDb.collection("transfers").doc(id).update({ ...data });
}

export async function deleteTransfer(id: string): Promise<void> {
  await adminDb.collection("transfers").doc(id).delete();
}
