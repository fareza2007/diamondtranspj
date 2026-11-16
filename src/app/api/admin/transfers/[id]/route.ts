import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { updateTransfer, deleteTransfer, getTransferById } from "@/lib/db";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/antar-jemput");
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
      return NextResponse.json({ error: "ID rute tidak valid." }, { status: 400 });
    }

    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.destination !== undefined) updateData.destination = String(body.destination).trim();
    if (body.price_avanza !== undefined) updateData.price_avanza = Number(body.price_avanza);
    if (body.price_innova !== undefined) updateData.price_innova = Number(body.price_innova);
    if (body.price_hiace !== undefined) updateData.price_hiace = Number(body.price_hiace);
    if (body.price_bus !== undefined) updateData.price_bus = Number(body.price_bus);
    if (body.note !== undefined) updateData.note = body.note ? String(body.note).trim() : null;
    if (body.order_index !== undefined) updateData.order_index = Number(body.order_index);
    if (body.is_active !== undefined) updateData.is_active = Boolean(body.is_active);

    await updateTransfer(id, updateData);
    revalidatePublic();

    const updated = await getTransferById(id);
    return NextResponse.json({ success: true, transfer: updated });
  } catch (error) {
    console.error("Update transfer error:", error);
    return NextResponse.json({ error: "Gagal memperbarui rute antar-jemput." }, { status: 500 });
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
    await deleteTransfer(id);
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete transfer error:", error);
    return NextResponse.json({ error: "Gagal menghapus rute antar-jemput." }, { status: 500 });
  }
}
