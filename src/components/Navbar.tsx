"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Logo } from "./logo";
import { SidebarTrigger } from "./SidebarTrigger";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="fixed top-2 right-2 left-2 z-30 md:top-3 md:right-3 md:left-3">
      <div className="bg-background/60 border-border/40 relative rounded-2xl border shadow-lg backdrop-blur-xl backdrop-saturate-150">
        <div className="flex h-14 items-center justify-between px-4 md:h-16 md:px-8">
          <div className="flex items-center gap-4 md:gap-6">
            <SidebarTrigger
              isOpen={isMobileNavOpen}
              onToggle={() => setIsMobileNavOpen(!isMobileNavOpen)}
            />
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {status === "loading" ? (
              <>
                <Skeleton className="bg-muted/20 hidden h-5 w-20 sm:inline" />
                <Skeleton className="bg-muted/20 h-8 w-16" />
              </>
            ) : session?.user ? (
              <>
                <span className="text-muted-foreground hidden text-xs font-medium sm:inline md:text-sm">
                  {session.user.name ?? session.user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="border-border/40 hover:bg-accent/50 text-xs md:text-sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-accent/50 text-xs md:text-sm"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-medium text-white shadow-md transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg md:text-sm"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
