"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Logo } from "./logo";
import { SidebarTrigger } from "./SidebarTrigger";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="fixed top-4 right-4 left-4 z-30 md:top-6 md:right-6 md:left-6">
      <div className="rounded-xl border-0 bg-white/60 shadow-2xl backdrop-blur-md dark:bg-gray-900/60">
        <div className="flex h-14 items-center justify-between px-4 md:h-16 md:px-8">
          <div className="flex items-center gap-4 md:gap-6">
            <SidebarTrigger />
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {session?.user ? (
              <>
                <span className="hidden text-xs font-medium text-gray-700 sm:inline md:text-sm dark:text-gray-300">
                  {session.user.name ?? session.user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="border-gray-300 text-xs text-gray-700 hover:bg-gray-50 md:text-sm dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
                    className="text-xs text-gray-700 hover:bg-gray-100 md:text-sm dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-medium text-white hover:from-emerald-700 hover:to-teal-700 md:text-sm dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600"
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
