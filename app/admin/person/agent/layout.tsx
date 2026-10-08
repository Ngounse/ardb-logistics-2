"use client";
import { AgentTemplateProvider } from "./AgentTemplateContext";

const AgentLayout = async ({ children }: { children: React.ReactNode }) => {


  return (
    <AgentTemplateProvider>
      {children}
    </AgentTemplateProvider>
  );
};

export default AgentLayout;
