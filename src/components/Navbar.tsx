"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Logo } from "./logo";
import { SidebarTrigger } from "./SidebarTrigger";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="fixed top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 z-30">
      <div className="bg-white/60 backdrop-blur-md shadow-2xl rounded-xl border-0">
        <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 md:gap-6">
            <SidebarTrigger />
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>
        </div>
          <div className="flex items-center gap-2 md:gap-4">
          {session?.user ? (
            <>
                <span className="text-xs md:text-sm text-gray-700 hidden sm:inline font-medium">
                  {session.user.name ?? session.user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs md:text-sm"
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
                    className="text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
                  >
                    Sign In
                  </Button>
              </Link>
              <Link href="/auth/register">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-xs md:text-sm"
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
               