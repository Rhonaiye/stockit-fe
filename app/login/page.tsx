"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiZap, FiShield, FiTrendingUp, FiPackage } from "react-icons/fi";
import { useApp } from "@/context/app-context";
import { toast } from "sonner";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useApp();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(email.trim().toLowerCase(), password);
        setIsLoading(false);
        if (success) {
            // Check if user needs onboarding (new user with no branches)
            const storedUser = JSON.parse(localStorage.getItem('stockit_user') || '{}');
            if (storedUser.needsOnboarding) {
                router.push("/onboarding");
            } else {
                router.push("/dashboard");
            }
        } else {
            toast.error("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-[50%] bg-accent relative overflow-hidden flex-col justify-between p-12">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%)]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 blur-[100px] rounded-full -ml-48 -mb-48" />

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <FiZap className="text-accent text-2xl" />
                        </div>
                        <span className="text-white font-black text-2xl tracking-tight">Stockit</span>
                    </Link>
                </div>

                {/* Central Content */}
                <div className="relative z-10 space-y-10">
                    <div>
                        <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1]">
                            Welcome<br />
                            <span className="text-white/50">Back, Boss</span>
                        </h1>
                        <p className="text-white/60 text-lg mt-6 max-w-md font-medium leading-relaxed">
                            Your inventory empire awaits. Sign in to access real-time analytics, manage your team, and grow your business.
                        </p>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3">
                        {[
                            { icon: FiPackage, label: 'Smart Inventory' },
                            { icon: FiTrendingUp, label: 'Live Analytics' },
                            { icon: FiShield, label: '256-bit Secure' }
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-md text-white/80 text-sm font-bold">
                                <f.icon className="text-white" />
                                {f.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                        <FiShield />
                        <span>Enterprise Security</span>
                    </div>
                    <div className="text-white/30 text-xs font-medium">
                        © {new Date().getFullYear()} Stockit
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-10">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center text-white">
                                <FiZap />
                            </div>
                            <span className="font-black text-xl">Stockit</span>
                        </Link>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Sign In</h2>
                            <p className="text-foreground-muted font-medium">Enter your credentials to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        className="w-full border border-border rounded-md px-12 py-4 bg-background outline-none focus:border-accent transition-colors font-bold"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Password</label>
                                    <Link href="#" className="text-[10px] font-bold text-accent hover:underline uppercase tracking-widest">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full border border-border rounded-md px-12 py-4 bg-background outline-none focus:border-accent transition-colors font-bold"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="btn btn-primary w-full py-4 font-black shadow-xl shadow-accent/20 hover:shadow-accent/40 transition-all"
                            >
                                {isLoading ? "Authenticating..." : "Sign In"}
                            </button>
                        </form>

                        <div className="text-center pt-6 border-t border-border">
                            <p className="text-foreground-muted text-sm">
                                New to Stockit?{" "}
                                <Link href="/signup" className="text-accent font-bold hover:underline">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
