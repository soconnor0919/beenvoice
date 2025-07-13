"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  LayoutDashboard,
  Users,
  FileText,
  Building,
} from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Businesses", href: "/dashboard/businesses", icon: Building },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-28 bottom-6 left-6 z-20 hidden w-64 flex-col justify-between rounded-xl border-0 bg-white/60 p-8 shadow-2xl backdrop-blur-md md:flex dark:bg-gray-900/60">
      <nav className="flex flex-col gap-1">
        <div className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
          Main
        </div>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-emerald-100 text-emerald-700 shadow-lg dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div>
        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
        <div className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
          Account
        </div>
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ${
            pathname === "/dashboard/settings"
              ? "bg-emerald-100 text-emerald-700 shadow-lg dark:bg-emerald-900/30 dark:text-emerald-400"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
