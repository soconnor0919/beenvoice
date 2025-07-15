"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "~/components/ui/skeleton";
import { navigationConfig } from "~/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();

  return (
    <aside className="border-border/40 bg-background/60 fixed top-[5.75rem] bottom-3 left-3 z-20 hidden w-64 flex-col justify-between rounded-2xl border p-6 shadow-lg backdrop-blur-xl backdrop-saturate-150 md:flex">
      <nav className="flex flex-col">
        {navigationConfig.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
            {sectionIndex > 0 && (
              <div className="border-border/40 my-4 border-t" />
            )}
            <div className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              {section.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {status === "loading" ? (
                <>
                  {Array.from({ length: section.links.length }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                    >
                      <Skeleton className="bg-muted/20 h-4 w-4" />
                      <Skeleton className="bg-muted/20 h-4 w-20" />
                    </div>
                  ))}
                </>
              ) : (
                section.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        pathname === link.href
                          ? "bg-gradient-to-r from-emerald-600/10 to-teal-600/10 text-emerald-700 shadow-sm dark:from-emerald-500/20 dark:to-teal-500/20 dark:text-emerald-400"
                          : "text-foreground hover:bg-accent/50 hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
