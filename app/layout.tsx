"use client";

import BeaconTracker from "@/components/BeaconTracker";
import { ErrorProvider } from "@/components/ErrorProvider/ErrorProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { LoadScript } from "@react-google-maps/api";
import { Inter } from "next/font/google";
import "./globals.css";

// export const metadata = {
//   title: "ARDB Logistics Dashboard",
//   description: "Logistics Admin Dashboard",
// };

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BeaconTracker />
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || ""}
            libraries={libraries}
          >
            <ErrorProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </ErrorProvider>
          </LoadScript>
        </ThemeProvider>
      </body>
    </html>
  );
}

const libraries: ("places")[] = ["places"];
