import {
  Settings,
  LayoutDashboard,
  Users,
  FileText,
  Building,
} from "lucide-react";

export interface NavLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export const navigationConfig: NavSection[] = [
  {
    title: "Main",
    links: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Clients", href: "/dashboard/clients", icon: Users },
      { name: "Businesses", href: "/dashboard/businesses", icon: Building },
      { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];
