import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Management | ARDB",
  description:
    "ARDB is a modern and responsive Shipping & Logistics Admin Dashboard Template designed for ARDB management, freight tracking, warehouse control, and logistics operations.",
};

const ManagementLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default ManagementLayout;
