import { NextResponse } from "next/server";
import { getEvents } from "@/lib/db";

export async function GET() {
  try {
    const events = await getEvents(true);
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}
