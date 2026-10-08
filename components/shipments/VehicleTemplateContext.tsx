"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { VehicleParam } from "@/app/admin/fleet/vehicles/utility";

const VehicleTemplateContext = createContext<VehicleParam | null>(null);

export const VehicleTemplateProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<VehicleParam | null>(null);

    useEffect(() => {
        // api.get(`vehicle-service/api/v1/vehicle/param`)
        //     .then(res => setData(res.data.data));
    }, []);

    return (
        <VehicleTemplateContext.Provider value={data}>
            {children}
        </VehicleTemplateContext.Provider>
    );
};

export const useVehicleTemplate = () => useContext(VehicleTemplateContext);
