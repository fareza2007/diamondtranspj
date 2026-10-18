import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getEvents, addEvent } from "@/lib/db";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/armada");
  revalidatePath("/admin");
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await getEvents();
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

    const eventData = {
      name,
      start_date,
      end_date,
      location: body.location ? String(body.location).trim() : null,
      description: body.description ? String(body.description).trim() : null,
      is_active: body.is_active !== false,
    };

    const id = await addEvent(eventData);

    revalidatePublic();
    return NextResponse.json({ success: true, event: { id, ...eventData } });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Gagal menambah event." }, { status: 500 });
  }
}
