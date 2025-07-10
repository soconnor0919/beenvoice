"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Logo } from "./logo";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="fixed top-6 left-6 right-6 z-30">
      <div className="bg-white/60 backdrop-blur-md shadow-2xl rounded-xl border-0">
        <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
                <span className="text-sm text-gray-700 hidden sm:inline font-medium">
                  {session.user.name ?? session.user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
                    className="text-gray-700 hover:bg-gray-100"
                  >
                    Sign In
                  </Button>
              </Link>
              <Link href="/auth/register">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
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
               