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

  const cars = await prisma.car.findMany({ orderBy: { created_at: "desc" } });
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
    let image_url: string | null = null;
    if (file instanceof File && file.size > 0) {
      image_url = await processCarImage(file);
    }

    const car = await prisma.car.create({
      data: { ...data, image_url },
    });

    revalidatePublic();
    return NextResponse.json({ success: true, car });
  } catch (error) {
    console.error("Create car error:", error);
    const message = error instanceof Error ? error.message : "Gagal menambah armada.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
