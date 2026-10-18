import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getPackages, addPackage } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const packages = await getPackages();
  return NextResponse.json({ packages });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const price = Number(body.price || 0);

    if (!name || !price) {
      return NextResponse.json({ error: "Nama paket dan harga wajib diisi." }, { status: 400 });
    }

    let image_url = body.image_url ? String(body.image_url).trim() : null;
    if (image_url && image_url.startsWith("data:")) {
      image_url = await uploadToCloudinary(image_url, "diamond-trans/packages");
    }

    const packageData = {
      name,
      tagline: String(body.tagline || "").trim(),
      duration: String(body.duration || "3 Hari 2 Malam").trim(),
      price,
      badge: body.badge ? String(body.badge).trim() : "",
      image_url,
      car_details: String(body.car_details || "").trim(),
      hotel_details: String(body.hotel_details || "").trim(),
      travel_details: String(body.travel_details || "").trim(),
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      is_active: body.is_active !== false,
    };

    const id = await addPackage(packageData);
    revalidatePublic();

    return NextResponse.json({ success: true, package: { id, ...packageData } });
  } catch (error) {
    console.error("Create package error:", error);
    return NextResponse.json({ error: "Gagal menambah paket wisata." }, { status: 500 });
  }
}
