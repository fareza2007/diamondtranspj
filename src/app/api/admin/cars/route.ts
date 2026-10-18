import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { parseOptionalNumber, parseRequiredNumber, processCarImage, startingPrice } from "@/lib/image";
import { getCars, addCar } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/armada");
  revalidatePath("/admin");
}

function carFromForm(form: FormData) {
  const name = String(form.get("name") || "").trim();
  const brand = String(form.get("brand") || "").trim();
  const transmission = String(form.get("transmission") || "matic").trim();
  const seats = parseRequiredNumber(form.get("seats"), 7);
  const price_lepas_kunci = parseOptionalNumber(form.get("price_lepas_kunci"));
  const price_dengan_sopir = parseOptionalNumber(form.get("price_dengan_sopir"));
  const price_lepas_kunci_gp = parseOptionalNumber(form.get("price_lepas_kunci_gp"));
  const price_dengan_sopir_gp = parseOptionalNumber(form.get("price_dengan_sopir_gp"));
  const driver_duration_hours = parseRequiredNumber(form.get("driver_duration_hours"), 12);
  const with_driver_available = form.get("with_driver_available") === "true";
  const with_keyless_available = form.get("with_keyless_available") === "true";
  const status = String(form.get("status") || "available");

  return {
    name,
    brand,
    transmission,
    seats,
    price_lepas_kunci,
    price_dengan_sopir,
    price_lepas_kunci_gp,
    price_dengan_sopir_gp,
    driver_duration_hours,
    with_driver_available,
    with_keyless_available,
    status,
    price_per_day: startingPrice({
      price_lepas_kunci,
      price_dengan_sopir,
      price_lepas_kunci_gp,
      price_dengan_sopir_gp,
    }),
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cars = await getCars();
  return NextResponse.json({ cars });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const data = carFromForm(form);
    if (!data.name || !data.brand) {
      return NextResponse.json({ error: "Nama dan merek wajib diisi." }, { status: 400 });
    }

    const file = form.get("image");
    const directUrl = form.get("image_url_direct") || form.get("image_url");
    let image_url: string | null = directUrl ? String(directUrl) : null;
    
    if (!image_url && file instanceof File && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;
      image_url = await uploadToCloudinary(base64, "diamond-trans/cars");
    } else if (image_url && image_url.startsWith("data:")) {
      image_url = await uploadToCloudinary(image_url, "diamond-trans/cars");
    }

    const id = await addCar({
      ...data,
      image_url,
    });

    revalidatePublic();
    return NextResponse.json({ success: true, car: { id, ...data, image_url } });
  } catch (error) {
    console.error("Create car error:", error);
    const message = error instanceof Error ? error.message : "Gagal menambah armada.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
