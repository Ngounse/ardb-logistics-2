"use client";

import {
    createContext,
    useContext,
    useEffect,
    useCallback,
    useMemo,
    useState,
} from "react";

interface Permission {
    id: number;
    name: string;
    path: string;
    httpMethod: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface User {
    id: string;
    name: string;
    email: string;
    roles: Role[];
}

interface AuthContextType {
    readonly user: User | null;
    readonly loading: boolean;
    readonly permissions: string[];
    readonly hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    permissions: [],
    hasPermission: () => false,
});

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const url = `auth-service/api/users/profile`;

    const [user, setUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/${url}`,
                    {
                        headers: { Authorization: `Bearer ${token}`, },
                    }
                );
                console.log("error:: log ", res);

                const result = await res.json();

                const userData = result.data;

                setUser(userData);

                const perms =
                    userData.roles?.flatMap((role: Role) =>
                        role.permissions.map((p) => p.name)
                    ) || [];

                setPermissions(perms);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const hasPermission = useCallback(
        (permission: string) => permissions.includes(permission),
        [permissions]
    );

    const contextValue = useMemo(
        () => ({
            user,
            loading,
            permissions,
            hasPermission,
        }),
        [user, loading, permissions, hasPermission]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);