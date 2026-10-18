import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { updateEvent, deleteEvent } from "@/lib/db";

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
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
    }
    const body = await req.json();
    const name = String(body.name || "").trim();
    const start_date = body.start_date;
    const end_date = body.end_date;
    if (!name || !start_date || !end_date) {
      return NextResponse.json({ error: "Nama dan tanggal event wajib diisi." }, { status: 400 });
    }

    const updateData = {
      name,
      start_date,
      end_date,
      location: body.location ? String(body.location).trim() : null,
      description: body.description ? String(body.description).trim() : null,
      is_active: body.is_active !== false,
    };

    await updateEvent(id, updateData);

    revalidatePublic();
    return NextResponse.json({ success: true, event: { id, ...updateData } });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Gagal memperbarui event." }, { status: 500 });
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
    await deleteEvent(id);
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Gagal menghapus event." }, { status: 500 });
  }
}
