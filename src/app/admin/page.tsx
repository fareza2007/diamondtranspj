import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getCars, getEvents, getPackages } from "@/lib/db";

export const metadata = { title: "Admin - Diamond Trans" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [cars, events, packages] = await Promise.all([
    getCars(),
    getEvents(),
    getPackages(),
  ]);

  return (
    <AdminDashboard
      cars={cars as any}
      events={events as any}
      packages={packages as any}
    />
  );
}
