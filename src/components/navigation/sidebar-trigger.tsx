"use client";

import { MenuIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { navigationConfig } from "~/lib/navigation";

interface SidebarTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SidebarTrigger({ isOpen, onToggle }: SidebarTriggerProps) {
  const pathname = usePathname();
  const { status } = useSession();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle navigation"
        onClick={onToggle}
        className="bg-card/80 h-8 w-8 shadow-lg backdrop-blur-sm md:hidden"
      >
        {isOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
      </Button>

      {/* Mobile dropdown navigation */}
      {isOpen && (
        <div className="bg-background/95 border-border/40 absolute top-full right-0 left-0 z-40 mt-2 rounded-2xl border shadow-2xl backdrop-blur-xl md:hidden">
          {/* Navigation content */}
          <nav className="flex flex-col p-4">
            {navigationConfig.map((section, sectionIndex) => (
              <div
                key={section.title}
                className={sectionIndex > 0 ? "mt-4" : ""}
              >
                {sectionIndex > 0 && (
                  <div className="border-border/40 my-3 border-t" />
                )}
                <div className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  {section.title}
                </div>
                <div className="flex flex-col gap-0.5">
                  {status === "loading" ? (
                    <>
                      {Array.from({ length: section.links.length }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                          >
                            <Skeleton className="bg-muted/20 h-4 w-4" />
                            <Skeleton className="bg-muted/20 h-4 w-20" />
                          </div>
                        ),
                      )}
                    </>
                  ) : (
                    section.links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          aria-current={
                            pathname === link.href ? "page" : undefined
                          }
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            pathname === link.href
                              ? "bg-gradient-to-r from-emerald-600/10 to-teal-600/10 text-emerald-700 shadow-sm dark:from-emerald-500/20 dark:to-teal-500/20 dark:text-emerald-400"
                              : "text-foreground hover:bg-accent/50 hover:text-accent-foreground"
                          }`}
                          onClick={onToggle}
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
        </div>
      )}
    </>
  );
}
