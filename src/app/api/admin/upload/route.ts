import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Upload handled client-side or direct URL" });
}
