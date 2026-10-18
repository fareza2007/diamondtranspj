import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { updatePackage, deletePackage, getPackageById } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

function revalidatePublic() {
  revalidatePath("/");
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
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.tagline !== undefined) updateData.tagline = String(body.tagline).trim();
    if (body.duration !== undefined) updateData.duration = String(body.duration).trim();
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.badge !== undefined) updateData.badge = String(body.badge).trim();
    if (body.image_url !== undefined) {
      let img = body.image_url ? String(body.image_url).trim() : null;
      if (img && img.startsWith("data:")) {
        img = await uploadToCloudinary(img, "diamond-trans/packages");
      }
      updateData.image_url = img;
    }
    if (body.car_details !== undefined) updateData.car_details = String(body.car_details).trim();
    if (body.hotel_details !== undefined) updateData.hotel_details = String(body.hotel_details).trim();
    if (body.travel_details !== undefined) updateData.travel_details = String(body.travel_details).trim();
    if (body.highlights !== undefined) updateData.highlights = Array.isArray(body.highlights) ? body.highlights : [];
    if (body.is_active !== undefined) updateData.is_active = Boolean(body.is_active);

    await updatePackage(id, updateData);
    revalidatePublic();

    const updated = await getPackageById(id);
    return NextResponse.json({ success: true, package: updated });
  } catch (error) {
    console.error("Update package error:", error);
    return NextResponse.json({ error: "Gagal memperbarui paket wisata." }, { status: 500 });
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
    await deletePackage(id);
    revalidatePublic();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete package error:", error);
    return NextResponse.json({ error: "Gagal menghapus paket wisata." }, { status: 500 });
  }
}
