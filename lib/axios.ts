import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from "@/hooks/use-toast";
// Base URL
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}` || 'http://localhost:5000';

// 🔹 Main instance (used everywhere)
const instance = axios.create({
    baseURL: BASE_URL,
});

// 🔹 Separate instance for auth (NO interceptors)
const authInstance = axios.create({
    baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// ================= REQUEST INTERCEPTOR =================
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => { throw error; }
);

// ================= RESPONSE INTERCEPTOR =================
instance.interceptors.response.use(
    response => response,

    async (error: AxiosError<any>) => {

        const originalRequest: any = error.config;

        if (!originalRequest) {
            showErrorToast(error);
            throw error;
        }


        const status = error.response?.status;

        const message =
            error.response?.data?.message?.toLowerCase() || "";


        const tokenExpired =
            status === 401 &&
            (
                message.includes("expired") ||
                message.includes("invalid token") ||
                message.includes("jwt")
            );


        // =========================
        // Refresh token handling
        // =========================
        if (
            tokenExpired &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("refresh-token")
        ) {

            const refreshToken =
                localStorage.getItem("refreshToken");

            const userType =
                localStorage.getItem("userType");


            if (!refreshToken) {
                logout();
                showErrorToast(error);
                throw error;
            }


            if (isRefreshing) {

                return new Promise((resolve, reject) => {

                    failedQueue.push({
                        resolve,
                        reject
                    });

                })
                    .then(token => {

                        originalRequest.headers.Authorization =
                            `Bearer ${token}`;

                        return instance(originalRequest);

                    });

            }


            originalRequest._retry = true;
            isRefreshing = true;


            try {

                const res = await authInstance.post(
                    "auth-service/api/auth/refresh-token",
                    {
                        refreshToken,
                        userType
                    }
                );


                const data = res.data.data;


                localStorage.setItem(
                    "token",
                    data.accessToken
                );

                localStorage.setItem(
                    "refreshToken",
                    data.refreshToken
                );


                processQueue(null, data.accessToken);


                originalRequest.headers.Authorization =
                    `Bearer ${data.accessToken}`;


                return instance(originalRequest);


            } catch (refreshError) {

                processQueue(refreshError, null);

                logout();

                showErrorToast(error);

                throw refreshError;


            } finally {

                isRefreshing = false;

            }
        }


        // =========================
        // ALL OTHER API ERRORS
        // =========================

        showErrorToast(error);

        throw error;

    }
);
export default instance;

export function getErrorMessage(error: AxiosError<any>) {
    const data = error.response?.data;

    if (data?.details) {
        return Object.entries(data.details)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
    }

    return data?.message || error.message || "Something went wrong";
}

function showErrorToast(error: AxiosError<any>) {

    toast({
        title: "",
        description: getErrorMessage(error),
        variant: "destructive",
    });

}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");

    window.location.href = "/auth/login";

}