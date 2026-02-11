"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiCheckCircle, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

import { Suspense } from "react";

function JoinForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");
    const role = searchParams.get("role") || "STAFF";
    const branchId = searchParams.get("branch");
    const companyId = searchParams.get("company");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (!token || !companyId) {
            toast.error("Invalid invitation link");
            // router.push("/login"); // Don't redirect immediately to allow the user to see the error
        }
    }, [token, companyId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !companyId) {
            toast.error("Invalid invitation link");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/auth/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    email: formData.email.trim().toLowerCase(),
                    token,
                    role,
                    branchId: branchId === 'all' ? undefined : branchId,
                    companyId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to join company');
            }

            setIsSuccess(true);
            toast.success("Welcome to the team!");

            // Redirect after a short delay
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background-secondary flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-card border border-border rounded-3xl p-10 text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-success/10 text-success rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-black mb-4">You're in!</h1>
                    <p className="text-foreground-muted mb-8 text-lg font-medium">
                        Your account has been created successfully. Redirecting you to login...
                    </p>
                    <div className="w-full bg-background-secondary h-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2 }}
                            className="h-full bg-accent"
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!token || !companyId) {
        return (
            <div className="min-h-screen bg-background-secondary flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card border border-border rounded-3xl p-10 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FiAlertCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-black mb-4">Invalid Link</h1>
                    <p className="text-foreground-muted mb-8 font-medium">
                        This invitation link is invalid or has expired. Please ask your administrator for a new one.
                    </p>
                    <Link
                        href="/login"
                        className="btn btn-primary w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 group"
                    >
                        Go to Login <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-secondary flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/20">
                        <span className="text-white font-black text-2xl">S</span>
                    </div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Join the Team</h1>
                    <p className="text-foreground-muted font-medium">Create your account to access the workspace</p>
                </div>

                <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-black/5">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-foreground-muted ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-accent transition-colors">
                                    <FiUser />
                                </div>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-background-secondary border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-foreground-muted ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-accent transition-colors">
                                    <FiMail />
                                </div>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full bg-background-secondary border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-foreground-muted ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-accent transition-colors">
                                    <FiLock />
                                </div>
                                <input
                                    required
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-background-secondary border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-foreground-muted ml-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-accent transition-colors">
                                    <FiLock />
                                </div>
                                <input
                                    required
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-background-secondary border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 group shadow-xl shadow-accent/20 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Complete Registration <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center mt-8 text-foreground-muted text-sm font-medium">
                    By joining, you agree to our <Link href="/terms" className="text-accent hover:underline">Terms</Link> and <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
                </p>
            </motion.div>
        </div>
    );
}

export default function JoinPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background-secondary flex items-center justify-center p-6 font-bold text-accent">
                Loading...
            </div>
        }>
            <JoinForm />
        </Suspense>
    );
}
