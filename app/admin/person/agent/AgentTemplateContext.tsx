"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { AgentParams } from "./utility";
import { AgentUrl } from "@/lib/ServiceUrl";

const AgentTemplateContext = createContext<AgentParams | null>(null);
export const AgentTemplateProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<AgentParams | null>(null);

    useEffect(() => {
        api.get(`${AgentUrl}/param`).then(res => setData(res.data.data));
    }, []);

    return (
        <AgentTemplateContext.Provider value={data}>
            {children}
        </AgentTemplateContext.Provider>
    );
};

export const useAgentTemplate = () => useContext(AgentTemplateContext);
