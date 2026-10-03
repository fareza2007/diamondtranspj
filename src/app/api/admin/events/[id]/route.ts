import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/armada");
  revalidatePath("/admin");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const eventId = parseInt(id, 10);
    const body = await req.json();
    const name = String(body.name || "").trim();
    const start_date = body.start_date;
    const end_date = body.end_date;
    if (!name || !start_date || !end_date) {
      return NextResponse.json({ error: "Nama dan tanggal event wajib diisi." }, { status: 400 });
    }

    const event = await prisma.gpEvent.update({
      where: { id: eventId },
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
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Gagal memperbarui event GP." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.gpEvent.delete({ where: { id: parseInt(id, 10) } });
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Gagal menghapus event GP." }, { status: 500 });
  }
}
