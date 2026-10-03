import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.gpEvent.findMany({
      where: { is_active: true },
      orderBy: { start_date: "asc" },
    });
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}
