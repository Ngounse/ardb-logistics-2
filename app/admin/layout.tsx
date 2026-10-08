"use client";
import { DashboardShell } from "@/components/DashboardShell";
import ProtectedRoute from "../AuthGuard";
import { VehicleTemplateProvider } from "@/components/shipments/VehicleTemplateContext";
import { AuthProvider } from "@/stores/AuthProvider";


const AdminLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <ProtectedRoute>
      <VehicleTemplateProvider>
        <AuthProvider>
          <DashboardShell>
            {children}
          </DashboardShell>
        </AuthProvider>
      </VehicleTemplateProvider>
    </ProtectedRoute>
  );
};

export default AdminLayout;
