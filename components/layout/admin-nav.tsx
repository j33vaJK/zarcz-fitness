"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, BarChart3, Receipt, Boxes, Tags, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const adminNavItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Categories",
        href: "/admin/categories",
        icon: Tags,
    },
    {
        title: "Stock Management",
        href: "/admin/stock",
        icon: Boxes,
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
    },
    {
        title: "Billing",
        href: "/admin/billing",
        icon: Receipt,
    },
];

export function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const response = await fetch("/api/admin/logout", { method: "POST" });
        if (response.ok) {
            router.push("/admin/login");
            router.refresh();
        }
    };

    return (
        <div className="w-full h-full bg-background md:bg-transparent">
            <div className="h-full py-1 md:py-6 px-0 md:px-4 w-full">
                <nav className="flex items-center justify-between md:flex-col md:items-stretch w-full h-full px-1 md:px-0 gap-0 md:gap-2">
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        const isExactlyActive = pathname === item.href && item.href === '/admin';
                        const isPathActive = item.href !== '/admin' && pathname?.startsWith(item.href);
                        const active = isExactlyActive || isPathActive;
                        const mobileTitle = item.title === "Stock Management" ? "Stock" : item.title;

                        return (
                            <Link
                                key={item.href}
                                /* @ts-ignore Next.js strict Typed Routes override */
                                href={item.href as any}
                                className={cn(
                                    "flex flex-col md:flex-row items-center justify-center md:items-center md:justify-start gap-1 md:gap-3 rounded-none md:rounded-lg px-2 md:px-4 py-2 md:py-3 transition-colors flex-1 md:flex-none",
                                    active
                                        ? "text-primary md:bg-primary md:text-primary-foreground md:shadow-sm"
                                        : "text-muted-foreground hover:text-foreground md:hover:bg-muted"
                                )}
                            >
                                <Icon className="h-5 w-5 md:h-5 md:w-5 mb-0.5 md:mb-0" />
                                <span className={cn(
                                    "text-[9px] md:text-sm font-medium text-center md:text-left leading-tight whitespace-nowrap",
                                    active ? "font-bold md:font-medium text-primary md:text-primary-foreground" : ""
                                )}>
                                    <span className="md:hidden">{mobileTitle}</span>
                                    <span className="hidden md:inline">{item.title}</span>
                                </span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex flex-col md:flex-row items-center justify-center md:items-center md:justify-start gap-1 md:gap-3 rounded-none md:rounded-lg px-2 md:px-4 py-2 md:py-3 transition-colors flex-1 md:flex-none text-muted-foreground hover:text-destructive md:hover:bg-destructive/10 mt-0 md:mt-auto"
                        )}
                    >
                        <LogOut className="h-5 w-5 md:h-5 md:w-5 mb-0.5 md:mb-0" />
                        <span className="text-[9px] md:text-sm font-medium text-center md:text-left leading-tight whitespace-nowrap">
                            Logout
                        </span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
