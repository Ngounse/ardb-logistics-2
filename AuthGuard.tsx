"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { route } from "./lib/routes";

export default function ProtectedRoute({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(Boolean(token));

        if (!token) {
            router.replace(
                route(`/auth/login?redirect=${pathname}`)
            );
        }
    }, [router, pathname]);

    // While checking auth (prevents flicker + SSR crash)
    if (isLoggedIn === null) return null;

    return <>{children}</>;
}
