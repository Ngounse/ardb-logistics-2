"use client";

import api from '@/lib/axios';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export interface Permission {
    id: number
    name: string
    path: string
    httpMethod: string
}

export interface Role {
    id: number
    name: string
    description?: string
    permissions: Permission[]
}

export interface User {
    id: string;
    googleId: any
    name: string
    email: string
    firstName: string
    lastName: string
    gender: any
    enabled: boolean
    failedPinAttempts: number
    phone: string
    createdAt?: string
    updatedAt?: string
    roles: Role[];
    dateOfBirth?: string

}

interface AuthContextType {
    readonly user: User | null;
    readonly userInfo: User | null;
    readonly permissions: Set<string>;
    readonly loading: boolean;
    readonly hasPermission: (permission: string) => boolean;
    readonly login: (token: string) => Promise<void>;
    readonly logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userInfo: null,
    permissions: new Set<string>(),
    loading: false,
    hasPermission: () => false,
    login: async () => { },
    logout: () => { }
});

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const url = `auth-service/api/users/profile`;
    const urlUserInfo = `person-service/api/v1/persons/profile`;
    const [user, setUser] = useState<User | null>(null);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const login = useCallback(async (token: string) => {
        localStorage.setItem("token", token);

        const res = await api.get(`${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const userData = res.data.data;

        setUser(userData);

        setPermissions(
            new Set(
                userData.roles.flatMap((role: Role) =>
                    role.permissions.map((p) => p.name)
                )
            )
        );
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            if (!token) return;

            try {
                const res = await api.get(`${url}`, { headers: { Authorization: `Bearer ${token}`, }, });
                const resUserInfo = await api.get(`${urlUserInfo}`, { headers: { Authorization: `Bearer ${token}`, }, });

                const result = await res.data;
                const userInfoResult = await resUserInfo.data;

                const userData = result.data as User;

                setUser(userData);
                setUserInfo(userInfoResult.data);

                const perms = new Set<string>(
                    userData.roles.flatMap((role: Role) =>
                        role.permissions.map((p) => p.name)
                    )
                );

                setPermissions(perms);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const hasPermission = (permission: string) => {
        return permissions.has(permission);
    };

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setUser(null);
        setUserInfo(null);
        setPermissions(new Set());
    }, []);

    const contextValue = useMemo(
        () => ({
            user,
            userInfo,
            permissions,
            hasPermission,
            loading,
            login,
            logout,
        }),
        [user, userInfo, permissions, loading, login, logout]
    );

    return (
        <AuthContext.Provider
            value={contextValue}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};