import { NextRequest, NextResponse } from "next/server";
import {
  adminCookieOptions,
  ADMIN_COOKIE,
  createAdminToken,
  validateAdminLogin,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const result = validateAdminLogin(username, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, createAdminToken(result.username), adminCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Gagal masuk." }, { status: 500 });
  }
}
