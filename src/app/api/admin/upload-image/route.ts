import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const contentType = req.headers.get("content-type") || "";
    let imageToUpload = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      imageToUpload = body.image || "";
    } else if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("image");
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        imageToUpload = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    }

    if (!imageToUpload) {
      return NextResponse.json({ error: "Tidak ada gambar yang dikirim." }, { status: 400 });
    }

    const secureUrl = await uploadToCloudinary(imageToUpload);
    return NextResponse.json({ success: true, url: secureUrl });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    const msg = error instanceof Error ? error.message : "Gagal mengupload gambar ke Cloudinary.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
