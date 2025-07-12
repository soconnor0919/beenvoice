"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LayoutDashboard, Users, FileText, Building } from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Businesses", href: "/dashboard/businesses", icon: Building },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
      <aside className="hidden md:flex flex-col justify-between fixed left-6 top-28 bottom-6 w-64 z-20 bg-white/60 backdrop-blur-md shadow-2xl rounded-xl border-0 p-8">
        <nav className="flex flex-col gap-1">
          <div className="mb-2 text-xs font-semibold text-gray-400 tracking-wider uppercase">Main</div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ${
                  pathname === link.href 
                    ? "bg-emerald-100 text-emerald-700 shadow-lg" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div>
          <div className="border-t border-gray-200 my-4" />
          <div className="mb-2 text-xs font-semibold text-gray-400 tracking-wider uppercase">Account</div>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ${
              pathname === "/dashboard/settings"
                ? "bg-emerald-100 text-emerald-700 shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </aside>
  );
} 