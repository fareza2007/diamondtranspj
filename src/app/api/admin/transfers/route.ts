import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getTransfers, addTransfer } from "@/lib/db";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/antar-jemput");
  revalidatePath("/admin");
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const transfers = await getTransfers();
  return NextResponse.json({ transfers });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const destination = String(body.destination || "").trim();
    const price_avanza = Number(body.price_avanza || 0);
    const price_innova = Number(body.price_innova || 0);
    const price_hiace = Number(body.price_hiace || 0);
    const price_bus = Number(body.price_bus || 0);

    if (!destination) {
      return NextResponse.json({ error: "Nama destinasi / rute wajib diisi." }, { status: 400 });
    }

    const transferData = {
      destination,
      price_avanza,
      price_innova,
      price_hiace,
      price_bus,
      note: body.note ? String(body.note).trim() : null,
      order_index: Number(body.order_index) || 99,
      is_active: body.is_active !== false,
    };

    const id = await addTransfer(transferData);
    revalidatePublic();

    return NextResponse.json({ success: true, transfer: { id, ...transferData } });
  } catch (error) {
    console.error("Create transfer error:", error);
    return NextResponse.json({ error: "Gagal menambah rute antar-jemput." }, { status: 500 });
  }
}
