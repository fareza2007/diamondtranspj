import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "dt_admin";
const SESSION_DAYS = 7;

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

function hmac(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createAdminToken(username: string) {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${username}.${exp}`;
  return `${payload}.${hmac(payload)}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!token || !secret()) return null;
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  if (!safeEqual(hmac(payload), sig)) return null;
  const [username, expStr] = payload.split(".");
  const exp = Number(expStr);
  if (!username || !Number.isFinite(exp) || Date.now() > exp) return null;
  return { username };
}

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;
  return { username, password };
}

export function validateAdminLogin(username: string, password: string) {
  const creds = getAdminCredentials();
  if (!creds.password) {
    return { ok: false as const, error: "ADMIN_PASSWORD belum diatur di environment Vercel." };
  }
  const userOk = safeEqual(
    Buffer.from(username).toString("hex").padEnd(64, "0"),
    Buffer.from(creds.username).toString("hex").padEnd(64, "0")
  ) && username === creds.username;
  const passOk = safeEqual(
    Buffer.from(password).toString("hex").padEnd(128, "0"),
    Buffer.from(creds.password).toString("hex").padEnd(128, "0")
  ) && password === creds.password;
  if (!userOk || !passOk) {
    return { ok: false as const, error: "Username atau password salah." };
  }
  return { ok: true as const, username: creds.username };
}

export async function getAdminSession() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false as const, session: null };
  }
  return { ok: true as const, session };
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
