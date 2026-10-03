import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = { title: "Admin - Diamond Trans" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let cars: unknown[] = [];
  let events: unknown[] = [];
  try {
    cars = await prisma.car.findMany({ orderBy: { created_at: "desc" } });
    events = await prisma.gpEvent.findMany({ orderBy: { start_date: "asc" } });
  } catch (error) {
    console.error("Admin fetch error:", error);
  }

  return (
    <AdminDashboard
      cars={JSON.parse(JSON.stringify(cars))}
      events={JSON.parse(JSON.stringify(events))}
    />
  );
}
