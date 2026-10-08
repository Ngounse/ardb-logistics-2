"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { Countries, normalizePhone } from "@/lib/models/contry";
import "flag-icons/css/flag-icons.min.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MockLogin } from "./mock";
import { LogIn } from "lucide-react";

const userTypes = [
    // { value: "CUSTOMER", label: "Customer" },
    // { value: "DRIVER", label: "Driver" },
    { value: "OPERATOR", label: "Operator" },
    // { value: "MERCHANT", label: "Merchant" },
    // { value: "AGENT", label: "Agent" },
];

export default function LoginPage() {
    const router = useRouter();
    const urlToken = `delivery-service/api/v1/base-fee/param`;
    const authUrl = `auth-service/api/auth`;

    const pathname = new URLSearchParams(globalThis.location?.search).get("$redirect") || undefined;
    const [email, setEmail] = useState(MockLogin?.email || undefined);
    const [password, setPassword] = useState(MockLogin?.password || "");
    const [pin, setPin] = useState(MockLogin?.pin || "");
    const [token, setToken] = useState(process.env.NEXT_PUBLIC_TOKEN || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState<"email" | "token" | "phone">("phone");
    const [country, setCountry] = useState(Countries[0]);
    const [userType, setUserType] = useState("OPERATOR");
    const { login } = useAuth();
    const [phone, setPhone] = useState(normalizePhone(MockLogin?.phone || "", country.dialCode));

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        localStorage.removeItem("token");
        localStorage.setItem("userType", userType);
        if (viewMode === "token") {
            localStorage.setItem("token", token);
            // Validate token with a test
            api.get(`${urlToken}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(async response => {
                const data = response.data.data;
                await login(data.accessToken).then(() => {
                    router.push("/admin");
                });
                localStorage.setItem("refreshToken", data.refreshToken);
            }).catch((error) => {
                localStorage.removeItem("token");
                setError("Invalid token.");
            });
            setLoading(false);
            return
        }

        if (viewMode === "email") {
            api.post(`${authUrl}/sign-in/pin-email`, {
                email: email,
                pin: password,
                userType: userType
            }).then(async response => {
                const data = response.data.data;
                localStorage.setItem("refreshToken", data.refreshToken);
                await login(data.accessToken).then(() => {
                    router.push("/admin");
                });
            }).finally(() => {
                setLoading(false);
            });
            // ?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}
        }

        if (viewMode === "phone") {
            api.post(`${authUrl}/sign-in/pin-phone`, {
                phone: country.dialCode + phone,
                pin: pin,
                userType: userType
            }).then(async response => {
                const data = response.data.data;
                localStorage.setItem("refreshToken", data.refreshToken);
                await login(data.accessToken).then(() => {
                    router.push("/admin");
                });
            }).finally(() => {
                setLoading(false);
            });
            // ?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}
        }

    }

    function handleForgotPIN() {
        if (loading) return
        if (viewMode === "phone") {
            if (!phone || phone == '') {
                toast({
                    variant: "destructive",
                    title: "Phone is required."
                })
                return
            }
            setLoading(true);
            api.post(`${authUrl}/forgot-pin/sms`, {
                phone: country.dialCode + phone,
            }).then(async response => {
                toast({
                    description: "Please check your new PIN in your SMS."
                })
            }).finally(() => {
                setLoading(false);
            });
        }
        // router.push(pathname || `/admin`);
        if (viewMode === "email") {
            if (!email || email == '') {
                toast({
                    variant: "destructive",
                    title: "Email is required."
                })
                return
            }
            setLoading(true);
            api.post(`${authUrl}/forgot-pin/email`, {
                email: email,
            }).then(async response => {
                toast({
                    description: "Please check your new PIN in your Inbox."
                })
            }).finally(() => {
                setLoading(false);
            });
            // ?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}
        }
    }

    function handleResponseToken(response: any) {
        const data = response.data.data;
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        router.push(pathname || `/admin`);
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg rounded-xl p-8 ">
                <h2 className="text-2xl font-bold text-green-800 text-center mb-6 ">
                    Welcome to ARDB Logistics         <ThemeToggle />
                </h2>
                {error && (
                    <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
                )}
                <div className="flex items-center justify-center gap-2">
                    <Tabs
                        value={viewMode}
                        onValueChange={(value) => setViewMode(value as "email" | "token" | "phone")}
                    >
                        <TabsList>
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="phone">Phone</TabsTrigger>
                            {/* <TabsTrigger value="token">Token</TabsTrigger> */}
                        </TabsList>
                    </Tabs>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* <div className="space-y-3 pt-4 ">
                        <Label>Who are you?</Label>
                        <RadioGroup value={userType} onValueChange={setUserType} className="grid grid-cols-2 gap-4">
                            {userTypes.map((type) => (
                                <div key={type.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={type.value} id={type.value} />
                                    <Label htmlFor={type.value}>{type.label}</Label>
                                </div>
                            ))} 
                        </RadioGroup>
                    </div> */}
                    {viewMode == "email" && (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="you@example.com"
                            />

                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                PIN
                            </label>
                            <Input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="•••••••••"
                            />
                        </div>
                    )}

                    {viewMode == "phone" && (
                        <div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>

                                <div className="flex">
                                    <div className="flex items-center ">
                                        <Select
                                            value={country.code}
                                            onValueChange={(value) => {
                                                const selected = Countries.find((c) => c.code === value);
                                                if (selected) setCountry(selected);
                                            }}
                                        >
                                            <SelectTrigger className="w-[160px] ">
                                                <div className="flex items-center gap-2">
                                                    <span className={`fi fi-${country.code}`} />
                                                    <span>{country.dialCode}</span>
                                                </div>
                                            </SelectTrigger>

                                            <SelectContent>
                                                {Countries.map((c) => (
                                                    <SelectItem key={c.code} value={c.code}>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`fi fi-${c.code}`} />
                                                            <span>
                                                                {c.code.toUpperCase()} ({c.dialCode})
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={phone}
                                        maxLength={9}
                                        max={9}
                                        onChange={(e) => setPhone(normalizePhone(e.target.value, country.dialCode))}
                                        className="flex-1 px-4 py-2 border border-l-0 rounded-r-lg"
                                        placeholder="12345678"
                                    />
                                </div>
                            </div>
                            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                                PIN
                            </label>
                            <Input
                                type="password"
                                required
                                minLength={6}
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Enter your PIN"
                            />
                        </div>
                    )}

                    {viewMode == "token" && (
                        <div >
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                                URL
                            </label>
                            <Input
                                type="text"
                                disabled
                                value={authUrl}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Enter your URL"
                            />
                            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                                Token
                            </label>
                            <Input
                                type="password"
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Enter your token"
                            />
                        </div>
                    )}
                    <p className={`!m-0 !text-end text-sm ${loading ? "text-gray-600 " : " text-green-600 "} 
                     ${loading || (viewMode === "email" ? !email || !password : viewMode === "phone" ? !phone || !pin : !token) ? "cursor-not-allowed" : " cursor-pointer "} hover:underline `} onClick={handleForgotPIN}>
                        Forget PIN.
                    </p>
                    <input type="button" />
                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading || (viewMode === "email" ? !email || !password : viewMode === "phone" ? !phone || !pin : !token)}
                        // className="!m-0 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                        className="w-full"
                    >
                        {loading ?
                            <>
                                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg> Logging in
                            </>
                            :
                            <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Login
                            </>
                        }
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600 hidden">
                    Don't have an account? <Link href="/auth/register" className="text-green-600 hover:underline">Register here</Link>
                </p>

            </Card>
        </div>
    );
}
