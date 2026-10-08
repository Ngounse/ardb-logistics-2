"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sendBeacon } from "@/lib/beacon";

export function useBeaconNavigation() {
    const pathname = usePathname();

    useEffect(() => {
        sendBeacon({
            event: "PAGE_VIEW",
            page: pathname,
            action: "NAVIGATE",
        });
    }, [pathname]);
}