"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function withAuth<P extends {}>(Component: React.ComponentType<P>) {
    return function AuthWrapper(props: P) {
        const router = useRouter();
        const isLoggedIn = !!localStorage.getItem("token"); // example only

        useEffect(() => {
            if (!isLoggedIn) {
                router.push("/auth/login");
            }
        }, [isLoggedIn, router]);

        if (!isLoggedIn) return null; // or spinner

        return <Component {...props} />;
    };
}
