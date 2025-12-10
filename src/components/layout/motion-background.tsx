"use client";

import { cn } from "~/lib/utils";

export function MotionBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-background">
            <div
                className={cn(
                    "absolute inset-[-50%] w-[200%] h-[200%]",
                    "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]",
                    "from-[oklch(var(--primary)/0.15)] via-transparent to-transparent",
                    "animate-subtle-spin opacity-100"
                )}
            />
            <div
                className={cn(
                    "absolute inset-[-50%] w-[200%] h-[200%]",
                    "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]",
                    "from-[oklch(var(--accent)/0.15)] via-transparent to-transparent",
                    "animate-subtle-wave opacity-100"
                )}
            />
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        </div>
    );
}
