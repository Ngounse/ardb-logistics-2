import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Widgets | ARDB",
  description:
    "ARDB is a modern and responsive Shipping & Logistics Admin Dashboard Template designed for ARDB management, freight tracking, warehouse control, and logistics operations. Built with clean UI components and advanced features, ARDB offers real-time shipment monitoring, driver assignments, order tracking, fleet status, and warehouse insights.",
};

const WidgetsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default WidgetsLayout;
