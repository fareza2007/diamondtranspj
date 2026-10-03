import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/armada");
  revalidatePath("/admin");
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.gpEvent.findMany({
    orderBy: { start_date: "asc" },
  });
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const start_date = body.start_date;
    const end_date = body.end_date;
    if (!name || !start_date || !end_date) {
      return NextResponse.json({ error: "Nama dan tanggal event wajib diisi." }, { status: 400 });
    }
    if (end_date < start_date) {
      return NextResponse.json({ error: "Tanggal selesai harus setelah tanggal mulai." }, { status: 400 });
    }

    const event = await prisma.gpEvent.create({
      data: {
        name,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        location: body.location ? String(body.location).trim() : null,
        description: body.description ? String(body.description).trim() : null,
        is_active: body.is_active !== false,
      },
    });

    revalidatePublic();
    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Gagal menambah event GP." }, { status: 500 });
  }
}
