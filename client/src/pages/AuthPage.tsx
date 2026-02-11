import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const phoneSchema = z.object({
    phoneNumber: z.string().min(10, "Valid phone number required"),
});

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});

const adminSchema = z.object({
    username: z.string().min(1, "Username required"),
    password: z.string().min(1, "Password required"),
});

export default function AuthPage() {
    const { user, requestOtpMutation, loginMutation, adminLoginMutation } = useAuth();
    const [step, setStep] = useState<"phone" | "otp" | "admin-login">("phone");
    const [phoneNumber, setPhoneNumber] = useState("");

    const phoneForm = useForm({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phoneNumber: "" },
    });

    const otpForm = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    const adminForm = useForm({
        resolver: zodResolver(adminSchema),
        defaultValues: { username: "", password: "" },
    });

    if (user) {
        if (user.role === "admin") {
            return <Redirect to="/admin" />;
        }
        return <Redirect to="/" />;
    }

    const onPhoneSubmit = (data: { phoneNumber: string }) => {
        requestOtpMutation.mutate(data.phoneNumber, {
            onSuccess: () => {
                setPhoneNumber(data.phoneNumber);
                otpForm.reset();
                setStep("otp");
            },
        });
    };

    const onOtpSubmit = (data: { otp: string }) => {
        loginMutation.mutate({ phoneNumber, otp: data.otp });
    };

    const onAdminSubmit = (data: z.infer<typeof adminSchema>) => {
        adminLoginMutation.mutate(data);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Hero Section */}
            <div className="hidden lg:flex flex-col justify-center bg-slate-900 p-12 text-white">
                <h1 className="text-4xl font-bold mb-4">District Stray Dog Management</h1>
                <p className="text-lg text-slate-300">
                    A comprehensive platform for reporting, tracking, and managing stray dog populations humanely.
                </p>
            </div>

            {/* Login Form */}
            <div className="flex items-center justify-center p-8 bg-slate-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>
                            {step === "phone" ? "Login" : step === "otp" ? "Verify OTP" : "Admin Login"}
                        </CardTitle>
                        <CardDescription>
                            {step === "phone"
                                ? "Enter your phone number to continue"
                                : step === "otp"
                                    ? `Enter the 6-digit code sent to ${phoneNumber}`
                                    : "Enter your admin credentials"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === "phone" ? (
                            <Form {...phoneForm}>
                                <form key="phone-form" onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                                    <FormField
                                        control={phoneForm.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+91 98765 43210" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={requestOtpMutation.isPending}>
                                        {requestOtpMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send OTP
                                    </Button>
                                    <Button variant="ghost" className="w-full text-slate-500" onClick={() => setStep("admin-login")}>
                                        Admin Access
                                    </Button>
                                </form>
                            </Form>
                        ) : step === "otp" ? (
                            <Form {...otpForm}>
                                <form key="otp-form" onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                                    <FormField
                                        control={otpForm.control}
                                        name="otp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>One-Time Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="123456"
                                                        {...field}
                                                        maxLength={6}
                                                        inputMode="numeric"
                                                        pattern="\d*"
                                                        type="text"
                                                        autoComplete="one-time-code"
                                                        autoFocus
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                                        {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Verify & Login
                                    </Button>
                                    <Button variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                                        Change Phone Number
                                    </Button>
                                </form>
                            </Form>
                        ) : (
                            <Form {...adminForm}>
                                <form key="admin-form" onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
                                    <FormField
                                        control={adminForm.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="admin" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={adminForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="•••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={adminLoginMutation.isPending}>
                                        {adminLoginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Login as Admin
                                    </Button>
                                    <Button variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                                        Back to Phone Login
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
