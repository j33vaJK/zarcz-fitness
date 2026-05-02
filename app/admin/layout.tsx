"use client";

import { AdminNav } from "@/components/layout/admin-nav";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-muted/10 pb-16 md:pb-0">
      <div className="hidden md:block w-64 flex-shrink-0 border-r bg-background">
        <AdminNav />
      </div>
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">
        <div className="container mx-auto max-w-6xl">
          {children}
        </div>
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)]">
        <AdminNav />
      </div>
    </div>
  );
}
