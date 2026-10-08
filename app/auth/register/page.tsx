"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from '@/lib/axios';
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Register() {
    const router = useRouter();
    const url = `person-service/api/v1/register`;
    const pathname = new URLSearchParams(globalThis.location?.search).get("$redirect") || undefined;
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState<"email" | "phone">("phone");
    const [step, setStep] = useState<'phone' | 'phone-otp' | 'phone-success'>('phone');
    const [mailStep, setMailStep] = useState<'mail' | 'mail-otp' | 'mail-success'>('mail');
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [otpExpireTime, setOtpExpireTime] = useState<Date | null>(null);
    const [confirmExpire, setConfirmExpire] = useState<Date | null>(null);
    const [tokenKey, setTokenKey] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countryCode, setCountryCode] = useState("+855")
    const [phoneTemplate, setPhoneTemplate] = useState<PhoneParams>();
    const [cooldown, setCooldown] = useState(0);

    const handlePhoneSendOTP = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleResendOTP();
    }

    const handleResendOTP = () => {
        console.log("click::");
        setError("");
        const fullPhone = `${countryCode}${phone}`;
        api.post(`${url}/phone`, {
            phone: fullPhone
        }).then((res) => {
            setStep('phone-otp');
            const data = res.data.data;
            setOtpExpireTime(new Date(data.otpExpire));
        }).catch((error) => {
            setError(error.response.data.message || "Error sending OTP. Please try again.");
            console.error("Error sending OTP:", error);
        }).finally(() => {

        });
    }

    const handlePhoneVerifyOTP = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        api.post(`${url}/phone/verify`, {
            phone: `${countryCode}${phone}`,
            otp: otp
        }).then((res) => {
            setError("");
            setStep('phone-success');
            const data = res.data.data;
            setConfirmExpire(new Date(data.confirmExpire));
            setTokenKey(data.tokenKey);

        }).catch((error) => {
            setError("Invalid OTP.");
            console.error("Error verifying OTP:", error);
        }
        ).finally(() => {

        });
    }

    const handlePhoneConfirm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const data: any = {
            token: tokenKey
        };
        formData.forEach((value, key) => {
            data[key] = value;
        });
        data.phone = `${countryCode}${phone}`

        setIsSubmitting(true);
        api.post(`${url}/confirm`, data)
            .then((res) => {
                router.push(pathname || "/");
                setError(res.data.message || "Registration successful!");
            })
            .catch((error) => {
                console.error("There was an error!", error);
                setError(error.response.data.message || "Registration failed. Please try again.");
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    useEffect(() => {
        api.get(`${url}/phone/param`).then((res) => {
            setPhoneTemplate(res.data.data);
            setCountryCode(res.data.data.country[0].phoneCode);
        }).catch((error) => {
            console.error("Error fetching phone template:", error);
        });
        localStorage.removeItem("token");
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpExpireTime) {
            interval = setInterval(() => {
                const now = new Date();
                if (otpExpireTime > now) {
                    setCooldown(Math.ceil((otpExpireTime.getTime() - now.getTime()) / 1000));
                } else {
                    setCooldown(0);
                    clearInterval(interval);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpExpireTime]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (confirmExpire && confirmExpire < new Date()) {
                setError("Registration confirmation has expired.");
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [confirmExpire]);

    const handleMailSendOTP = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleMailResendOTP();
    };

    const handleMailResendOTP = () => {
        setError("");
        setLoading(true);
        api.post(`${url}/mail`, {
            email: email
        }).then((res) => {
            setMailStep('mail-otp');
            const data = res.data.data;
            setOtpExpireTime(new Date(data.otpExpire));
        }).catch((error) => {
            console.error("Error sending OTP:", error);
            console.log(error.response, "Error sending OTP:::");
            setError(error.response.data.message || "Error sending OTP. Please try again.");
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleMailVerifyOTP = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        api.post(`${url}/mail/verify`, {
            email: `${email}`,
            otp: otp
        }).then((res) => {
            if (res.status === 200) {
                setError("");
                setMailStep('mail-success');
                const data = res.data.data;
                setConfirmExpire(new Date(data.confirmExpire));
                setTokenKey(data.tokenKey);
            } else {
                setError("Invalid OTP.");
            }
        }).catch((error) => {
            setError("Invalid OTP.");
            console.error("Error verifying OTP:", error);
        }).finally(() => {

        });
    }

    const handleMailConfirm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const data: any = {
            phone: `${countryCode}${phone}`,
            token: tokenKey,
        };
        formData.forEach((value, key) => {
            data[key] = value;
        });

        data.phone = `${countryCode}${phone}`;

        setIsSubmitting(true);
        api.post(`${url}/confirm`, data)
            .then((res) => {
                setError(res.data.message || "Registration successful!");
                router.push(pathname || "/");
            })
            .catch((error) => {
                console.error("There was an error!", error);
                setError(error.response.data.message || "Registration failed. Please try again.");
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 ">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    ARDB Logistics Register
                </h2>
                {error && (
                    <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
                )}
                <div className="flex items-center justify-center gap-2">
                    <Tabs
                        value={viewMode}
                        onValueChange={(value) => setViewMode(value as "phone" | "email")}
                    >
                        <TabsList>
                            <TabsTrigger value="email">Mail</TabsTrigger>
                            <TabsTrigger value="phone">Phone</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                {viewMode === "email" && mailStep === "mail" && (
                    <form onSubmit={handleMailSendOTP} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Mail
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="you@example.com"
                            />
                            <button
                                disabled={loading}
                                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                            >
                                {loading ? "Sending... " : "Send OTP"}
                            </button>
                        </div>
                    </form>
                )}

                {viewMode === "email" && mailStep === "mail-otp" && (
                    <form onSubmit={handleMailVerifyOTP} className="space-y-6">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 pt-4">
                            Enter OTP sent to {email.substring(0, 3)}****{email.substring(email.length - 9)}
                        </label>

                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replaceAll(/\D/g, ''))}
                            placeholder="••••••"
                            className="w-full px-4 py-2 text-center tracking-widest text-lg border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />

                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 mt-2">
                                OTP expires at {otpExpireTime ? otpExpireTime.toLocaleTimeString() : "Unknown time"} <span className={cooldown > 30 ? "text-green-500" : "text-red-500"}>{cooldown > 0 && `(in ${cooldown}s)`}</span>
                            </p>

                            <button
                                type="button"
                                onClick={(e) => handleMailResendOTP()}
                                disabled={cooldown > 0}
                                className=" mt-2 text-sm text-green-600 underline disabled:opacity-50"
                            >
                                Resend OTP
                            </button>
                        </div>

                        <button
                            disabled={otp.length !== 6 || cooldown === 0}
                            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            Verify OTP
                        </button>

                        <button
                            type="button"
                            onClick={() => setMailStep('mail')}
                            className="w-full mt-3 text-sm text-gray-600 underline "
                        >
                            Change email
                        </button>
                    </form>
                )}

                {viewMode === "email" && mailStep === "mail-success" && (
                    <form onSubmit={handleMailConfirm} className="space-y-6">
                        <div className="grid gap-4 py-4">
                            <div className="grid sm:grid-cols-1 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" required placeholder="Enter first name" name="firstName" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" placeholder="Enter last name" name="lastName" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" required >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key="male" value="M">
                                                Male
                                            </SelectItem>
                                            <SelectItem key="female" value="F">
                                                Female
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input id="dateOfBirth" required placeholder="Enter date of birth" type="date" name="dateOfBirth" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-1 gap-4">
                                <Input id="email" type="hidden" defaultValue={email} name="email" />
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone number</Label>
                                    <div className="flex w-full max-w-md">
                                        <Select value={phoneTemplate?.country[0]?.phoneCode || "+855"} defaultValue={phoneTemplate?.country[0]?.phoneCode || "+855"} onValueChange={setCountryCode}>
                                            <SelectTrigger className="w-[120px] rounded-r-none px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                                                <SelectValue placeholder="Code" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {phoneTemplate?.country.map((c) => (
                                                    <SelectItem key={c.alpha2} value={c.phoneCode}>
                                                        <div className="flex items-center gap-2 ">
                                                            <span>{c.alpha2}</span>
                                                            <span className="ml-auto text-muted-foreground">
                                                                ({c.phoneCode})
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <input
                                            type="tel"
                                            value={phone}
                                            minLength={8}
                                            maxLength={9}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="12xxxxxx"
                                            className="w-full rounded-l-none px-4 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={otp.length !== 6 || isSubmitting}
                            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </form>
                )}

                {viewMode === "phone" && step === "phone" && (
                    <form onSubmit={handlePhoneSendOTP}>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <div className="flex w-full max-w-md">
                            <Select value={phoneTemplate?.country[0]?.phoneCode || "+855"} defaultValue={phoneTemplate?.country[0]?.phoneCode || "+855"} onValueChange={setCountryCode} name="contryCode">
                                <SelectTrigger className="w-[120px] rounded-r-none px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    {phoneTemplate?.country.map((c) => (
                                        <SelectItem key={c.alpha2} value={c.phoneCode}>
                                            <div className="flex items-center gap-2">
                                                <span>{c.alpha2}</span>
                                                {/* <span>{c.name}</span> */}
                                                <span className="ml-auto text-muted-foreground">
                                                    ({c.phoneCode})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input
                                type="tel"
                                value={phone}
                                maxLength={9}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="12xxxxxx"
                                className="w-full px-4 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                        </div>

                        <button
                            disabled={!phone || phone.length < 8}
                            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            Send OTP
                        </button>

                        <p className="text-xs text-gray-500 mt-2">
                            We'll send a 6-digit code to your phone
                        </p>
                    </form>
                )}
                {viewMode === "phone" && step === "phone-otp" && (
                    <form onSubmit={handlePhoneVerifyOTP}>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 pt-4">
                            Enter OTP sent to {countryCode}{phone.substring(0, 3)}****{phone.substring(phone.length - 2)}
                        </label>

                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replaceAll(/\D/g, ''))}
                            placeholder="••••••"
                            className="w-full px-4 py-2 text-center tracking-widest text-lg border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />

                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 mt-2">
                                OTP expires at {otpExpireTime ? otpExpireTime.toLocaleTimeString() : "Unknown time"} <span className={cooldown > 30 ? "text-green-500" : "text-red-500"}>{cooldown > 0 && `(in ${cooldown}s)`}</span>
                            </p>

                            <button
                                type="button"
                                onClick={() => handleResendOTP()}
                                disabled={cooldown > 0}
                                className=" mt-2 text-sm text-green-600 underline disabled:opacity-50"
                            >
                                Resend OTP
                            </button>
                        </div>

                        <button
                            disabled={otp.length !== 6 || cooldown === 0}
                            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            Verify OTP
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('phone')}
                            className="w-full mt-3 text-sm text-gray-600 underline "
                        >
                            Change phone number
                        </button>
                    </form>
                )}
                {viewMode === "phone" && step === "phone-success" && (
                    <form onSubmit={handlePhoneConfirm}>
                        <div className="grid gap-4 py-4">
                            <div className="grid sm:grid-cols-1 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" required placeholder="Enter first name" name="firstName" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" placeholder="Enter last name" name="lastName" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" required >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key="male" value="M">
                                                Male
                                            </SelectItem>
                                            <SelectItem key="female" value="F">
                                                Female
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input id="dateOfBirth" required placeholder="Enter date of birth" type="date" name="dateOfBirth" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-1 gap-4">
                                <Input id="phone" type="hidden" defaultValue={phone} name="phone" />
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" placeholder="Enter email address" name="email" type="email" />
                                </div>
                            </div>

                        </div>

                        <button
                            disabled={otp.length !== 6 || isSubmitting}
                            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>

                    </form>
                )}

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link href="/auth/login" className="text-green-600 hover:underline">Login here</Link>
                </p>

            </div>
        </div>
    );
}

export interface PhoneParams {
    registrationType: string[]
    country: Country[]
}

export interface Country {
    alpha3: string
    officialName: string
    numeric: number
    alpha2: string
    phoneCode: string
}
