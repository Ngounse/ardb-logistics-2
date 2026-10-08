import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Management | ARDB",
  description:
    "Manage and configure automated emails, templates, and notification settings to keep vendors and clients informed across your logistics operations.",
  keywords: [
    "Email Notifications",
    "Email Templates",
    "ARDB Email System",
    "Logistics Alerts",
    "Client Notifications",
    "Vendor Communication",
    "Automated Emails",
    "Email Management Dashboard",
    "Email Settings",
    "Notification Center"
  ],
};

const EmailLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default EmailLayout;
