import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | ARDB",
  description:
    "Manage and track all orders including scheduled deliveries, returns, and cancellations. Streamline your logistics workflow with real-time visibility.",
  keywords: [
    "Orders Management",
    "Scheduled Deliveries",
    "Order Tracking",
    "Returns Management",
    "Order Cancellations",
    "ARDB Orders",
    "Logistics Platform",
    "Shipment Tracking",
    "Order Fulfillment",
    "Fleet Coordination"
  ],
};

const OrdersLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default OrdersLayout;
