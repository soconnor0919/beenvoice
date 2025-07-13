"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure the user is authenticated
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // This component doesn't render anything
  return null;
}
