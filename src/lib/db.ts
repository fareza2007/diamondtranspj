import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

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
    const carsCol = collection(db, "cars");
    const q = onlyAvailable
      ? query(carsCol, where("status", "==", "available"))
      : carsCol;
    const snap = await getDocs(q);
    const cars: Car[] = [];
    snap.forEach((d) => {
      cars.push({ id: d.id, ...d.data() } as Car);
    });
    // Urutkan berdasarkan harga termurah
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
    const docRef = doc(db, "cars", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Car;
  } catch (error) {
    console.error(`Error fetching car ${id}:`, error);
    return null;
  }
}

export async function addCar(data: Omit<Car, "id">): Promise<string> {
  const carsCol = collection(db, "cars");
  const res = await addDoc(carsCol, {
    ...data,
    created_at: new Date().toISOString(),
  });
  return res.id;
}

export async function updateCar(id: string, data: Partial<Car>): Promise<void> {
  const docRef = doc(db, "cars", id);
  await updateDoc(docRef, { ...data });
}

export async function deleteCar(id: string): Promise<void> {
  const docRef = doc(db, "cars", id);
  await deleteDoc(docRef);
}

// ========================
// EVENTS
// ========================
export async function getEvents(onlyActive = false): Promise<GpEvent[]> {
  try {
    const eventsCol = collection(db, "gp_events");
    const snap = await getDocs(eventsCol);
    const events: GpEvent[] = [];
    snap.forEach((d) => {
      events.push({ id: d.id, ...d.data() } as GpEvent);
    });
    const filtered = onlyActive ? events.filter((e) => e.is_active) : events;
    filtered.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    return filtered;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function addEvent(data: Omit<GpEvent, "id">): Promise<string> {
  const eventsCol = collection(db, "gp_events");
  const res = await addDoc(eventsCol, {
    ...data,
    created_at: new Date().toISOString(),
  });
  return res.id;
}

export async function updateEvent(id: string, data: Partial<GpEvent>): Promise<void> {
  const docRef = doc(db, "gp_events", id);
  await updateDoc(docRef, { ...data });
}

export async function deleteEvent(id: string): Promise<void> {
  const docRef = doc(db, "gp_events", id);
  await deleteDoc(docRef);
}

// ========================
// TOUR PACKAGES (Mobil + Hotel + Travel)
// ========================
export async function getPackages(onlyActive = false): Promise<TourPackage[]> {
  try {
    const pkgCol = collection(db, "packages");
    const snap = await getDocs(pkgCol);
    const pkgs: TourPackage[] = [];
    snap.forEach((d) => {
      pkgs.push({ id: d.id, ...d.data() } as TourPackage);
    });
    const filtered = onlyActive ? pkgs.filter((p) => p.is_active) : pkgs;
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    return filtered;
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

export async function getPackageById(id: string): Promise<TourPackage | null> {
  try {
    const docRef = doc(db, "packages", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as TourPackage;
  } catch (error) {
    console.error(`Error fetching package ${id}:`, error);
    return null;
  }
}

export async function addPackage(data: Omit<TourPackage, "id">): Promise<string> {
  const pkgCol = collection(db, "packages");
  const res = await addDoc(pkgCol, {
    ...data,
    created_at: new Date().toISOString(),
  });
  return res.id;
}

export async function updatePackage(id: string, data: Partial<TourPackage>): Promise<void> {
  const docRef = doc(db, "packages", id);
  await updateDoc(docRef, { ...data });
}

export async function deletePackage(id: string): Promise<void> {
  const docRef = doc(db, "packages", id);
  await deleteDoc(docRef);
}

// ========================
// BOOKINGS
// ========================
export async function addBooking(data: Booking): Promise<string> {
  const bookingCol = collection(db, "bookings");
  const res = await addDoc(bookingCol, {
    ...data,
    status: data.status || "pending",
    created_at: new Date().toISOString(),
  });
  return res.id;
}
