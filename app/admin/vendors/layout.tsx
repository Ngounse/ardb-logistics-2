import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendors & Clients | ARDB",
  description:
    "Manage vendor directories, add new suppliers, and track client relationships all in one place. Streamline logistics with efficient vendor and client management.",
  keywords: [
    "Vendor Directory",
    "Add Vendor",
    "Clients List",
    "Client Feedback",
    "Vendor Management",
    "Client Management",
    "ARDB",
    "Logistics CRM",
    "Supplier Relationships",
    "Logistics Dashboard"
  ],
};

const VendorsClientsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default VendorsClientsLayout;
