"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { MenuIcon, Settings, LayoutDashboard, Users, FileText } from "lucide-react";
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
          className="md:hidden bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:bg-white h-8 w-8"
        >
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="p-0 w-80 max-w-[85vw] bg-white/95 border-0 backdrop-blur-sm"
      >
        <SheetHeader className="p-4 border-b border-gray-200">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        
        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-4">
          <div className="mb-2 text-xs font-semibold text-gray-400 tracking-wider uppercase">Main</div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all duration-200 ${
                  pathname === link.href 
                    ? "bg-emerald-100 text-emerald-700 shadow-lg" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
          
          <div className="border-t border-gray-200 my-4" />
          <div className="mb-2 text-xs font-semibold text-gray-400 tracking-wider uppercase">Account</div>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all duration-200 ${
              pathname === "/dashboard/settings"
                ? "bg-emerald-100 text-emerald-700 shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
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