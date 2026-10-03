import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    const booking = await prisma.booking.create({
      data: {
        car_id: parseInt(car_id),
        customer_name,
        customer_phone,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        pickup_location,
        dropoff_location: dropoff_location || pickup_location,
        rental_type,
        total_price: parseFloat(total_price) || 0,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, booking_id: booking.id });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
