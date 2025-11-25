"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { LogOut, User } from "lucide-react";
import { navigationConfig } from "~/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <aside className="bg-sidebar border-sidebar-border text-sidebar-foreground fixed top-[4rem] bottom-0 left-0 z-20 hidden w-64 flex-col justify-between border-r p-6 md:flex">
      <nav className="flex flex-col">
        {navigationConfig.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
            {sectionIndex > 0 && (
              <div className="border-border/40 my-4 border-t" />
            )}
            <div className="text-sidebar-foreground/60 mb-3 text-xs font-semibold tracking-wider uppercase">
              {section.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {status === "loading" ? (
                <>
                  {Array.from({ length: section.links.length }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <Skeleton className="bg-sidebar-accent/20 h-4 w-4" />
                      <Skeleton className="bg-sidebar-accent/20 h-4 w-20" />
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
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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

      {/* User Section */}
      <div className="border-sidebar-border border-t pt-4">
        {status === "loading" ? (
          <div className="space-y-3">
            <Skeleton className="bg-sidebar-accent/20 h-8 w-full" />
            <Skeleton className="bg-sidebar-accent/20 h-8 w-full" />
            <div className="flex items-center gap-3 p-3">
              <Skeleton className="bg-sidebar-accent/20 h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="bg-sidebar-accent/20 mb-1 h-4 w-24" />
                <Skeleton className="bg-sidebar-accent/20 h-3 w-32" />
              </div>
            </div>
          </div>
        ) : session?.user ? (
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent w-full justify-start px-3"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            <div className="flex items-center gap-3 px-3 pt-2">
              <div className="bg-sidebar-accent flex h-8 w-8 items-center justify-center rounded-full">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sidebar-foreground truncate text-sm font-medium">
                  {session.user.name ?? "User"}
                </p>
                <p className="text-sidebar-foreground/60 truncate text-xs">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
