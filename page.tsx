"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { route } from "@/lib/routes";

export default function Home() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            router.replace(route("/dashboard"));
        } else {
            router.replace(
                route(`/auth/login?redirect=${pathname}`)
            );
        }
    }, [router, pathname]);

    return null;
}

//  "predev": "node scripts/copy-maplibre-worker.mjs",
//"prebuild": "node scripts/copy-maplibre-worker.mjs",