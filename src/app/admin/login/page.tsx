import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Masuk Admin - Diamond Trans" };

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
        <p className="text-gold text-xs uppercase tracking-[0.2em] mb-2">Diamond Trans</p>
        <h1 className="text-2xl font-bold text-white mb-1">Masuk Admin</h1>
        <p className="text-sm text-white/60 mb-6">Kelola armada, harga, foto, dan event GP.</p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
