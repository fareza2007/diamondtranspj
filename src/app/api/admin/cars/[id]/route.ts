import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { parseOptionalNumber, parseRequiredNumber, processCarImage, startingPrice } from "@/lib/image";
import { updateCar, deleteCar, getCarById } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

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
    const directUrl = form.get("image_url_direct") || form.get("image_url");
    let image_url: string | undefined;

    if (directUrl) {
      const urlStr = String(directUrl);
      if (urlStr.startsWith("data:")) {
        image_url = await uploadToCloudinary(urlStr, "diamond-trans/cars");
      } else {
        image_url = urlStr;
      }
    } else if (file instanceof File && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;
      image_url = await uploadToCloudinary(base64, "diamond-trans/cars");
    }

    const updateData: any = {
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
    };

    if (image_url) {
      updateData.image_url = image_url;
    }

    await updateCar(id, updateData);

    revalidatePublic();
    const updated = await getCarById(id);
    return NextResponse.json({ success: true, car: updated });
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
    await deleteCar(id);
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete car error:", error);
    return NextResponse.json({ error: "Gagal menghapus armada." }, { status: 500 });
  }
}
