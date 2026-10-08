"use client";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { PERMISSIONS } from "@/src/constants/permissions";
import {
  BarChart2,
  Bell,
  BoxesIcon,
  Bus,
  CarIcon,
  CirclePercent,
  LayoutDashboard,
  Map,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SquareSquare,
  Truck,
  User,
  UserPlus,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { Button } from "./ui/button";

interface SidebarProps {
  readonly open: boolean;
  readonly toggleSidebar: () => void;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
  permission?: string
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function Sidebar({ open, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  const navGroups: NavGroup[] = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          icon: LayoutDashboard,
          href: "/admin/",
        },
        // {
        //   title: "Live Shipment Map",
        //   icon: Map,
        //   href: "/admin/dashboard/map",
        //   permission: "TODO"
        // },
        // {
        //   title: "Fleet Status",
        //   icon: Activity,
        //   href: "/admin/dashboard/fleet-status",
        //   permission: "TODO"
        // },
      ],
    },
    {
      title: "Shipments",
      items: [
        {
          title: "Shipment",
          icon: Truck,
          href: "/admin/shipments",
        },
        // {
        //   title: "Track Shipment",
        //   icon: Navigation,
        //   href: "/admin/shipments/track",
        // },
        // {
        //   title: "Create Shipment",
        //   icon: PlusSquare,
        //   href: "/admin/shipments/create",
        // },
        // {
        //   title: "Delayed Shipments",
        //   icon: Clock,
        //   href: "/admin/shipments/delayed",
        // },
      ],
    },

    {
      title: "Pricing Management",
      items: [
        {
          title: "Base Fee",
          icon: CirclePercent,
          href: "/admin/delivery/base-fee",
          permission: PERMISSIONS.BASE_FEE_READ
        },
        {
          title: "Commission Rule",
          icon: CirclePercent,
          href: "/admin/utility/commission-rule",
          permission: PERMISSIONS.GET_COMMISSION_RULE
        },
        {
          title: "Commission Transaction",
          icon: BarChart2,
          href: "/admin/financial",
          permission: PERMISSIONS.GET_COMMISSION_TRANSACTION
        },
      ],
    },
    {
      title: "Fleet Management",
      items: [
        {
          title: "Vehicle Category",
          icon: SquareSquare,
          href: "/admin/fleet/categories",
          permission: PERMISSIONS.VEHICLE_CATEGORY_READ
        },
        {
          title: "Vehicle List",
          icon: Bus,
          href: "/admin/fleet/vehicles",
          permission: PERMISSIONS.VEHICLE_CATEGORY_READ
        },
        // {
        //   title: "Maintenance Logs",
        //   icon: Wrench,
        //   href: "/admin/fleet/maintenance",
        // },
        // {
        //   title: "Driver Assignments",
        //   icon: UserCog,
        //   href: "/admin/fleet/drivers",
        // },
        {
          title: "Zone",
          icon: SquareSquare,
          href: "/admin/fleet/zone",
          permission: PERMISSIONS.ZONE_READ
        },
        // {
        //   title: "My Zone",
        //   icon: TrainTrack,
        //   href: "/admin/fleet/my-zone",
        //   permission: PERMISSIONS.DRIVER_MY_ZONES
        // },
      ],
    },
    // {
    //   title: "Warehouses",
    //   items: [
    //     {
    //       title: "Warehouse Locations",
    //       icon: Warehouse,
    //       href: "/admin/warehouses",
    //     },
    //     {
    //       title: "Inventory Levels",
    //       icon: BoxesIcon,
    //       href: "/admin/warehouses/inventory",
    //     },
    //     {
    //       title: "Restock Requests",
    //       icon: PackagePlus,
    //       href: "/admin/warehouses/restock",
    //     },
    //   ],
    // },
    {
      title: "Settings & Utilities",
      items: [

        {
          title: "Package",
          icon: BoxesIcon,
          href: "/admin/delivery/packaging",
          permission: PERMISSIONS.PACKAGE_READ
        },
        {
          title: "Address",
          icon: Map,
          href: "/admin/utility/address",
          permission: PERMISSIONS.ADDRESS_SELF_READ || PERMISSIONS.ADDRESS_READ
        },
      ],
    },
    // {
    //   title: "Wallet & Payments",
    //   items: [
    //     {
    //       title: "Wallet",
    //       icon: CardSim,
    //       href: "/admin/utility/wallet",
    //     },
    //     {
    //       title: "Exchange Rates",
    //       icon: Coins,
    //       href: "/admin/utility/exchange-rates",
    //     },
    //     {
    //       title: "Currency",
    //       icon: DollarSign,
    //       href: "/admin/utility/currency",
    //     },
    //   ],
    // },
    {
      title: "Users & Clients",
      items: [
        {
          title: "Person",
          icon: UserPlus,
          href: "/admin/person",
          permission: PERMISSIONS.PERSON_READ
        }, {
          title: "Driver",
          icon: CarIcon,
          href: "/admin/person/driver",
          permission: PERMISSIONS.DRIVER_READ
        }, {
          title: "Agent",
          icon: User,
          href: "/admin/person/agent",
          permission: PERMISSIONS.AGENT_READ_ALL
        }, {
          title: "Merchant",
          icon: ShoppingBag,
          href: "/admin/person/merchant",
          permission: PERMISSIONS.GET_MERCHANTS
        },
        // {
        //   title: "Vendor Directory",
        //   icon: Building2,
        //   href: "/admin/vendors",
        // },
        // {
        //   title: "Add Vendor",
        //   icon: UserPlus,
        //   href: "/admin/vendors/add",
        // },
        // {
        //   title: "Clients List",
        //   icon: Users,
        //   href: "/admin/clients",
        // },
        // {
        //   title: "Client Feedback",
        //   icon: MessagesSquare,
        //   href: "/admin/clients/feedback",
        // },
      ],
    },
    // {
    //   title: "Orders",
    //   items: [
    //     {
    //       title: "All Orders",
    //       icon: ClipboardList,
    //       href: "/admin/orders",
    //     },
    //     {
    //       title: "Scheduled Deliveries",
    //       icon: Calendar,
    //       href: "/admin/orders/scheduled",
    //     },
    //     {
    //       title: "Returns",
    //       icon: RotateCcw,
    //       href: "/admin/orders/returns",
    //     },
    //     {
    //       title: "Cancellations",
    //       icon: XSquare,
    //       href: "/admin/orders/cancellations",
    //     },
    //   ],
    // },
    // {
    //   title: "Reports",
    //   items: [
    //     {
    //       title: "Delivery Performance",
    //       icon: BarChart,
    //       href: "/admin/reports/delivery",
    //     },
    //     {
    //       title: "Revenue Analysis",
    //       icon: LineChart,
    //       href: "/admin/reports/revenue",
    //     },
    //     {
    //       title: "Fleet Efficiency",
    //       icon: PieChart,
    //       href: "/admin/reports/fleet",
    //     },
    //   ],
    // },
    {
      title: "System Tools",
      items: [
        {
          title: "Settings",
          icon: Settings,
          href: "/admin/settings",
        },
        {
          title: "Roles & Permissions",
          icon: ShieldCheck,
          href: "/admin/settings/roles",
          permission: PERMISSIONS.ROLE_READ || PERMISSIONS.USER_READ || PERMISSIONS.PERMISSION_READ || PERMISSIONS.GROUP_WRITE,
        },
        {
          title: "Notifications Setup",
          icon: Bell,
          href: "/admin/settings/notifications",
        },
      ],
    },
    // {
    //   title: "Driver Tools",
    //   items: [
    //     {
    //       title: "List Driver",
    //       icon: CarIcon,
    //       href: "/admin/drivers",
    //     },
    //   ]
    // },
    // {
    //   title: "Help & Logs",
    //   items: [
    //     // {
    //     //   title: "Help Center",
    //     //   icon: LifeBuoy,
    //     //   href: "/admin/help",
    //     // },
    //     // {
    //     //   title: "Contact",
    //     //   icon: ContactRound,
    //     //   href: "/admin/contact",
    //     // },
    //     // {
    //     //   title: "Email",
    //     //   icon: Mail,
    //     //   href: "/admin/email",
    //     // },
    //     {
    //       title: "Email Template",
    //       icon: Mail,
    //       href: "/admin/email-template",
    //       permission: PERMISSIONS.MAIL_TEMPLATE_READ || PERMISSIONS.REGISTER_MAIL
    //     },
    //     {
    //       title: "Chat",
    //       icon: MessageCircle,
    //       href: "/admin/chat",
    //     },
    //     // {
    //     //   title: "Support Tickets",
    //     //   icon: Ticket,
    //     //   href: "/admin/help/tickets",
    //     // },
    //     // {
    //     //   title: "Audit Logs",
    //     //   icon: Scroll,
    //     //   href: "/admin/help/logs",
    //     // },
    //     // {
    //     //   title: "Widgets",
    //     //   icon: Grid2x2,
    //     //   href: "/admin/widgets",
    //     // },
    //   ],
    // },
  ];

  const filteredNavGroups = navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        !item.permission ||
        hasPermission(item.permission)
      ),
    }))
    .filter(group => group.items.length > 0);

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex justify-between  items-center border-b px-4">
        <Link href="/admin" className="flex items-center  gap-2 font-semibold h-16">
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-xl">ARDB Logistic</span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="overflow-auto py-2">
        {filteredNavGroups.map((group) => (
          <div key={group.title} className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h2>
            <div className="space-y-1 x">
              {group.items
                .filter((item) =>
                  item.permission
                    ? hasPermission(item.permission)
                    : true
                )
                .map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    )}
                    onClick={toggleSidebar}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
