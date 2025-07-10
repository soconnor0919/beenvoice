"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [
    { name: "Dashboard", href: "/dashboard" },
    ...segments.slice(1).map((seg, i) => ({
      name: seg.charAt(0).toUpperCase() + seg.slice(1),
      href: "/dashboard/" + segments.slice(1, i + 2).join("/"),
    })),
  ];
  return (
    <nav className="flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center">
          {i > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-300" />}
          {i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="hover:underline text-gray-500">
              {crumb.name}
            </Link>
          ) : (
            <span className="font-medium text-gray-700">{crumb.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
} 