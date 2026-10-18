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
