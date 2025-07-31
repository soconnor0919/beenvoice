"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Clients", href: "/dashboard/clients" },
  { name: "Invoices", href: "/dashboard/invoices" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2">
      {navigation.map((item) => (
        <Link key={item.name} href={item.href}>
          <Button
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {item.name}
          </Button>
        </Link>
      ))}
    </nav>
  );
}
