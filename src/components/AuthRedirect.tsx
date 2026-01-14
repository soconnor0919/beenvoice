"use client";

import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthRedirect() {
  const { data: session, isPending } = authClient.useSession();
  // const session = { user: null }; const isPending = false;
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure the user is authenticated
    if (!isPending && session?.user) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  // This component doesn't render anything
  return null;
}
