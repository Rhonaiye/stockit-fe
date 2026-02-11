"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/context/app-context";
import { FiLock, FiMail, FiUser, FiBriefcase, FiZap, FiCheck, FiShield, FiLayers, FiBarChart2 } from "react-icons/fi";
import { toast } from "sonner";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: ''
    });
    const { register } = useApp();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await register(formData);
        setIsLoading(false);
        if (success) {
            toast.success("Account created! Please log in.");
            router.push("/login");
        } else {
            toast.error("Registration failed. Email might already exist.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-[45%] bg-accent relative overflow-hidden flex-col justify-between p-12">
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
                            Build Your<br />
                            <span className="text-white/50">Empire Today</span>
                        </h1>
                        <p className="text-white/60 text-lg mt-6 max-w-md font-medium leading-relaxed">
                            Join thousands of businesses using Stockit to manage inventory, track sales, and scale operations.
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-4">
                        {[
                            { icon: FiLayers, text: 'Multi-branch support from day one' },
                            { icon: FiBarChart2, text: 'Real-time analytics & reports' },
                            { icon: FiShield, text: 'Bank-level data security' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center text-white">
                                    <item.icon />
                                </div>
                                <span className="text-white/80 font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                        <FiShield />
                        <span>No Credit Card Required</span>
                    </div>
                    <div className="text-white/30 text-xs font-medium">
                        © {new Date().getFullYear()} Stockit
                    </div>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
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
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-md mb-2">
                                <FiZap className="text-xs" /> Free Forever Plan
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Create Account</h2>
                            <p className="text-foreground-muted font-medium">Start your inventory management journey</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Your Name</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full border border-border rounded-md px-12 py-4 bg-background outline-none focus:border-accent transition-colors font-bold"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Business</label>
                                    <div className="relative">
                                        <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                        <input
                                            type="text"
                                            placeholder="Acme Ltd."
                                            className="w-full border border-border rounded-md px-12 py-4 bg-background outline-none focus:border-accent transition-colors font-bold"
                                            value={formData.companyName}
                                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        className="w-full border border-border rounded-md px-12 py-4 bg-background outline-none focus:border-accent transition-colors font-bold"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                    <input
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        className="w-full border border-border rounded-md px-12 py-4 bg-background outline-none focus:border-accent transition-colors font-bold"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 py-2">
                                <div className="mt-0.5 w-5 h-5 rounded border border-accent bg-accent/10 flex items-center justify-center shrink-0">
                                    <FiCheck className="text-accent text-xs" />
                                </div>
                                <p className="text-xs text-foreground-muted leading-relaxed">
                                    By signing up, I agree to the{" "}
                                    <Link href="/terms" className="text-foreground font-bold hover:text-accent transition-colors">Terms of Service</Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="text-foreground font-bold hover:text-accent transition-colors">Privacy Policy</Link>.
                                </p>
                            </div>

                            <button
                                disabled={isLoading}
                                className="btn btn-primary w-full py-4 font-black shadow-xl shadow-accent/20 hover:shadow-accent/40 transition-all"
                            >
                                {isLoading ? "Creating Account..." : "Get Started Free"}
                            </button>
                        </form>

                        <div className="text-center pt-6 border-t border-border">
                            <p className="text-foreground-muted text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="text-accent font-bold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
