"use client";

import * as React from "react";
import { Sidebar } from "~/components/layout/sidebar";
import { SidebarProvider, useSidebar } from "~/components/layout/sidebar-provider";
import { cn } from "~/lib/utils";
import { Menu } from "lucide-react";
import { Logo } from "~/components/branding/logo";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { DashboardBreadcrumbs } from "~/components/navigation/dashboard-breadcrumbs";

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    return (
        <div className="bg-dashboard relative min-h-screen flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar (Sheet) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b z-50 px-4 flex items-center">
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 bg-background shadow-sm" suppressHydrationWarning>
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    {/* Mobile Link / Logo */}
                    <div className="ml-4 flex items-center gap-2">
                        <Logo size="sm" />
                    </div>
                    <SheetContent side="left" className="p-0 w-72">
                        <div className="sr-only">
                            <h2 id="mobile-nav-title">Navigation Menu</h2>
                        </div>
                        <Sidebar mobile onClose={() => setIsMobileOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main
                suppressHydrationWarning
                className={cn(
                    "flex-1 min-h-screen min-w-0 transition-all duration-300 ease-in-out",
                    // Desktop margins based on collapsed state
                    "md:ml-0",
                    // Sidebar is fixed at left: 1rem (16px), width: 16rem (256px) or 4rem (64px)
                    // We need margin-left = left + width + gap
                    // Expanded: 16px + 256px + 16px (gap) = 288px (18rem)
                    // Collapsed: 16px + 64px + 16px (gap) = 96px (6rem)
                    isCollapsed ? "md:ml-24" : "md:ml-[18rem]"
                )}
            >
                <div className="p-4 pt-16 md:pt-4">
                    {/* Mobile header spacer is handled by pt-16 on mobile */}
                    <div className="md:hidden mb-4">
                        {/* Mobile Breadcrumbs could go here or be part of the page */}
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardContent>{children}</DashboardContent>
        </SidebarProvider>
    );
}
