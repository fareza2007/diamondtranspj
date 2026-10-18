import { NextRequest, NextResponse } from "next/server";
import { addBooking } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      car_id,
      customer_name,
      customer_phone,
      start_date,
      end_date,
      pickup_location,
      dropoff_location,
      rental_type,
      total_price,
    } = body;

    if (!car_id || !customer_name || !customer_phone || !start_date || !end_date || !pickup_location) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const bookingId = await addBooking({
      car_id: String(car_id),
      customer_name,
      customer_phone,
      start_date,
      end_date,
      pickup_location,
      dropoff_location: dropoff_location || pickup_location,
      rental_type: rental_type || "lepas_kunci",
      total_price: parseFloat(total_price) || 0,
      status: "pending",
    });

    return NextResponse.json({ success: true, booking_id: bookingId });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
