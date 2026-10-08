import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications Setup | ARDB",
  description:
    "Configure system notifications to stay informed about shipments, restocks, deliveries, and system alerts in real-time.",
  keywords: [
    "Notifications Setup",
    "ARDB Alerts",
    "Logistics Notifications",
    "Warehouse Alerts",
    "Shipment Updates",
    "Delivery Notifications",
    "System Alerts",
    "Real-Time Updates",
    "Warehouse Management System",
    "ARDB Dashboard"
  ],
};

const NotificationsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default NotificationsLayout;
