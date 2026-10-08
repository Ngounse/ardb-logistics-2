"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { MerchantParams } from "./utility";
import { MerchantUrl } from "@/lib/ServiceUrl";

const AgentTemplateContext = createContext<MerchantParams | null>(null);
export const AgentTemplateProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<MerchantParams | null>(null);

    useEffect(() => {
        api.get(`${MerchantUrl}/param`).then(res => setData(res.data.data));
    }, []);

    return (
        <AgentTemplateContext.Provider value={data}>
            {children}
        </AgentTemplateContext.Provider>
    );
};

export const useAgentTemplate = () => useContext(AgentTemplateContext);
