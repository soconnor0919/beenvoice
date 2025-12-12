"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "~/lib/auth-client";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import {
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Settings
} from "lucide-react";
import { navigationConfig } from "~/lib/navigation";
import { useSidebar } from "./sidebar-provider";
import { cn } from "~/lib/utils";
import { Logo } from "~/components/branding/logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getGravatarUrl } from "~/lib/gravatar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const { isCollapsed, toggleCollapse } = useSidebar();

  // If mobile, always expanded
  const collapsed = mobile ? false : isCollapsed;

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Header / Logo */}
        <div className={cn(
          "flex items-center h-14 px-4 mb-2",
          collapsed ? "justify-center px-2" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Logo size="sm" />
            </div>
          )}
          {collapsed && <Logo size="icon" />}

          {!mobile && !collapsed && (
            <div className="h-8 w-8" /> // Spacer to keep alignment if needed, or just remove
          )}
        </div>

        {/* Navigation */}
        <nav className={cn("flex flex-col px-2 gap-6 mt-4", collapsed && "items-center")}>
          {navigationConfig.map((section, sectionIndex) => (
            <div key={section.title}>
              {!collapsed && (
                <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground/60 tracking-wider uppercase">
                  {section.title}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    if (collapsed) {
                      return (
                        <TooltipProvider key={link.href} delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={link.href}
                                className={cn(
                                  "flex items-center justify-center h-10 w-10 rounded-md transition-colors",
                                  isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                              >
                                <Icon className="h-5 w-5" />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">
                              {link.name}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    }

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={mobile ? onClose : undefined}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / User */}
      <div className="p-2 mt-auto space-y-2">
        {!mobile && (
          <div className={cn("flex", collapsed ? "justify-center" : "justify-end px-2")}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={toggleCollapse}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
        )}

        <div className={cn(
          "border-t border-border/50 pt-4",
          collapsed ? "flex flex-col items-center gap-2" : "px-2"
        )}>
          {isPending ? (
            <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "px-2")}>
              <Skeleton className="h-9 w-9 rounded-full" />
              {!collapsed && (
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-2 w-24" />
                </div>
              )}
            </div>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("w-full justify-start p-0 hover:bg-transparent", collapsed && "justify-center")}>
                  {/* FIXED: Changed div to span to prevent hydration error */}
                  <span className={cn("flex items-center gap-3", collapsed ? "justify-center" : "w-full")}>
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={getGravatarUrl(session.user.email)} alt={session.user.name ?? "User"} />
                      <AvatarFallback>{session.user.name?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <span className="flex-1 min-w-0 text-left">
                        <span className="block text-sm font-medium truncate">{session.user.name}</span>
                        <span className="block text-xs text-muted-foreground truncate">{session.user.email}</span>
                      </span>
                    )}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                className="w-56 bg-background/80 backdrop-blur-xl border-border/50"
                sideOffset={10}
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await authClient.signOut();
                    window.location.href = "/";
                  }}
                  className="text-red-600 focus:text-red-600 focus:bg-red-100/50 dark:focus:bg-red-900/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <div className="h-full bg-background">
        {SidebarContent}
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "fixed top-4 bottom-4 left-4 z-30 hidden md:flex flex-col",
        "bg-background/80 backdrop-blur-xl border-border/50 border shadow-xl rounded-3xl transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {SidebarContent}
    </aside>
  );
}
