import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipments | ARDB",
  description:
    "ARDB offers real-time shipment monitoring, driver assignments, order tracking, fleet status, and warehouse insights. Ideal for logistics companies, transportation services, and supply chain dashboards, this template ensures a seamless and intuitive admin experience..",
  keywords: [
    "fleet management",
    "vehicle tracking",
    "fleet status dashboard",
    "maintenance scheduling",
    "fuel efficiency tracking",
    "logistics dashboard",
    "vehicle monitoring",
    "fleet analytics",
    "transportation management",
    "ARDB tracking",
    "fleet optimization",
    "vehicle maintenance",
    "real-time tracking",
    "fleet performance",
    "logistics software",
  ],
};

const ShipmentsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default ShipmentsLayout;
