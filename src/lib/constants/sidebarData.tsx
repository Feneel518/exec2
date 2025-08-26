import {
  LayoutDashboard,
  Boxes,
  Users,
  Factory,
  UserCog,
  ClipboardList,
  FileText,
  Receipt,
  IndianRupee,
  ShieldCheck,
  FileBadge2,
  CheckCircle2,
  FlaskConical,
  FolderArchive,
  BarChart3,
  Package,
  PackageCheck,
  Wrench,
} from "lucide-react";

export type SidebarChild = {
  title: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type SidebarGroup = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: SidebarChild[];
  defaultOpen?: boolean;
};

export const sidebarGroups: SidebarGroup[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { title: "Overview", href: "/dashboard", icon: BarChart3 },
      { title: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    ],
    defaultOpen: true,
  },
  {
    label: "Masters",
    icon: Boxes,
    children: [
      { title: "Products", href: "/dashboard/products", icon: Package },
      { title: "Categories", href: "/dashboard/categories", icon: Package },
      { title: "Customers", href: "/dashboard/customers", icon: Users },
      { title: "Suppliers", href: "/dashboard/suppliers", icon: Factory },
      { title: "Employees", href: "/dashboard/employees", icon: UserCog },
    ],
  },
  {
    label: "Manufacturing",
    icon: Wrench,
    children: [
      {
        title: "Raw Material Inward",
        href: "/dashboard/manufacturing/raw-inward",
        icon: ClipboardList,
      },
      {
        title: "Production Orders",
        href: "/dashboard/manufacturing/production-orders",
        icon: FileText,
      },
      {
        title: "WIP",
        href: "/dashboard/manufacturing/wip",
        icon: FlaskConical,
      },
      {
        title: "Finished Goods",
        href: "/dashboard/manufacturing/finished-goods",
        icon: PackageCheck,
      },
    ],
  },
  {
    label: "Sales",
    icon: Receipt,
    children: [
      { title: "Quotations", href: "/dashboard/quotations", icon: FileText },
      { title: "Orders", href: "/dashboard/orders", icon: ClipboardList },
      { title: "Invoices", href: "/dashboard/invoices", icon: Receipt },
      { title: "Payments", href: "/dashboard/payments", icon: IndianRupee },
    ],
  },
  {
    label: "Compliance",
    icon: ShieldCheck,
    children: [
      {
        title: "BIS Certificates",
        href: "/dashboard/compliance/bis",
        icon: FileBadge2,
      },
      { title: "PESO", href: "/dashboard/compliance/peso", icon: CheckCircle2 },
      {
        title: "Test Reports",
        href: "/dashboard/compliance/tests",
        icon: FlaskConical,
      },
      {
        title: "Documents",
        href: "/dashboard/compliance/docs",
        icon: FolderArchive,
      },
    ],
  },
];
