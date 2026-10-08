import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ARDB",
  description:
    "Get in touch with the ARDB team for support, inquiries, or partnership opportunities. We're here to help with your logistics and warehouse needs.",
  keywords: [
    "Contact ARDB",
    "Customer Support",
    "Logistics Help",
    "Warehouse Inquiries",
    "ARDB Support",
    "Logistics Assistance",
    "Partnership Inquiries",
    "Contact Page",
    "Reach ARDB",
    "Support Center"
  ],
};

const ContactLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default ContactLayout;
