"use client";

import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

// export const metadata = {
//   title: "ARDB Logistics Dashboard",
//   description: "Logistics Admin Dashboard",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
