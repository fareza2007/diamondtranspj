import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { parseOptionalNumber, parseRequiredNumber, processCarImage, startingPrice } from "@/lib/image";

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
    const carId = parseInt(id, 10);
    if (!Number.isFinite(carId)) {
      return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
    }

    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const brand = String(form.get("brand") || "").trim();
    if (!name || !brand) {
      return NextResponse.json({ error: "Nama dan merek wajib diisi." }, { status: 400 });
    }

    const price_lepas_kunci = parseOptionalNumber(form.get("price_lepas_kunci"));
    const price_dengan_sopir = parseOptionalNumber(form.get("price_dengan_sopir"));
    const price_lepas_kunci_gp = parseOptionalNumber(form.get("price_lepas_kunci_gp"));
    const price_dengan_sopir_gp = parseOptionalNumber(form.get("price_dengan_sopir_gp"));

    const file = form.get("image");
    let image_url: string | undefined;
    if (file instanceof File && file.size > 0) {
      image_url = await processCarImage(file);
    }

    const car = await prisma.car.update({
      where: { id: carId },
      data: {
        name,
        brand,
        transmission: String(form.get("transmission") || "matic").trim(),
        seats: parseRequiredNumber(form.get("seats"), 7),
        price_lepas_kunci,
        price_dengan_sopir,
        price_lepas_kunci_gp,
        price_dengan_sopir_gp,
        driver_duration_hours: parseRequiredNumber(form.get("driver_duration_hours"), 12),
        with_driver_available: form.get("with_driver_available") === "true",
        with_keyless_available: form.get("with_keyless_available") === "true",
        status: String(form.get("status") || "available"),
        price_per_day: startingPrice({
          price_lepas_kunci,
          price_dengan_sopir,
          price_lepas_kunci_gp,
          price_dengan_sopir_gp,
        }),
        ...(image_url ? { image_url } : {}),
      },
    });

    revalidatePublic();
    return NextResponse.json({ success: true, car });
  } catch (error) {
    console.error("Update car error:", error);
    const message = error instanceof Error ? error.message : "Gagal memperbarui armada.";
    return NextResponse.json({ error: message }, { status: 500 });
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
    const carId = parseInt(id, 10);
    await prisma.car.delete({ where: { id: carId } });
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete car error:", error);
    return NextResponse.json({ error: "Gagal menghapus armada." }, { status: 500 });
  }
}
