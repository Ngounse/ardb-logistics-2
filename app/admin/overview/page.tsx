import OverviewPage from "@/components/overview/overviewPage";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Overview - ARDB",
  description:
    "ARDB is a modern and responsive Shipping & Logistics Admin Dashboard Template designed for ARDB management, freight tracking, warehouse control, and logistics operations.",
};
const Overview = () => {
  return (
    <div>
      <OverviewPage />
    </div>
  );
};

export default Overview;
