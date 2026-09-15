import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin Dashboard — Veruthe Alla Kudumba Unit",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue selection:text-white">
      <AdminSidebar />
      <main className="flex-grow p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-[1600px]">
        {children}
      </main>
    </div>
  );
}
