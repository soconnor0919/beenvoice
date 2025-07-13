"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import {
  MenuIcon,
  Settings,
  LayoutDashboard,
  Users,
  FileText,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
];

export function SidebarTrigger() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Open sidebar"
          className="h-8 w-8 border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm hover:bg-white md:hidden dark:border-gray-600 dark:bg-gray-900/80 dark:hover:bg-gray-800"
        >
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 max-w-[85vw] border-0 bg-white/95 p-0 backdrop-blur-sm dark:bg-gray-900/95"
      >
        <SheetHeader className="border-b border-gray-200 p-4 dark:border-gray-700">
          <SheetTitle className="dark:text-white">Navigation</SheetTitle>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 p-4">
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
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-emerald-100 text-emerald-700 shadow-lg dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}

          <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
          <div className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
            Account
          </div>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all duration-200 ${
              pathname === "/dashboard/settings"
                ? "bg-emerald-100 text-emerald-700 shadow-lg dark:bg-emerald-900/30 dark:text-emerald-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
            onClick={() => setOpen(false)}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
