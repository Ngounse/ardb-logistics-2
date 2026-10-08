// components/PermissionGuard.tsx

"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
    readonly permission: string;
    readonly children: ReactNode;
}

export default function PermissionGuard({
    permission,
    children,
}: Props) {
    const { hasPermission, loading } = useAuth();

    if (loading) return null;

    if (!hasPermission(permission)) {
        return null;
    }

    return <>{children} {`${process.env.NEXT_PUBLIC_APP_ENV === 'local' || process.env.NEXT_PUBLIC_APP_ENV === 'DEV' ? permission : ''}`} </>;
}