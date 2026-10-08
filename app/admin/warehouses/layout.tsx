import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warehouse Locations | ARDB",
  description:
    "Monitor and manage all warehouse facilities across your network. Track operational status, total capacity, and utilization in real-time.",
  keywords: [
    "Warehouse Management",
    "Warehouse Locations",
    "ARDB",
    "Logistics Dashboard",
    "Warehouse Capacity",
    "Operational Warehouses",
    "Inventory Tracking",
    "Supply Chain Visibility",
    "Fulfillment Centers",
    "Distribution Hub",
  ],
};

const WarehouseLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default WarehouseLayout;
