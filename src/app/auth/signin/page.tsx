import { Suspense } from "react";
import { env } from "~/env";
import { SignInForm } from "./signin-form";

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm allowRegistration={env.DISABLE_SIGNUPS !== true} />
    </Suspense>
  );
}
