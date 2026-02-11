"use client";

import { useState } from "react";
import { FiArrowLeft, FiMapPin, FiCheckCircle, FiLoader } from "react-icons/fi";
import { useApp } from "@/context/app-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NewBranchPage() {
    const { addBranch, currentUser } = useApp();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: ''
    });

    if (currentUser?.role !== 'OWNER' && currentUser?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
                    <FiMapPin size={32} />
                </div>
                <h1 className="text-2xl font-black">Access Denied</h1>
                <p className="text-foreground-muted mt-2">Only authorized personnel can establish new branch protocols.</p>
                <Link href="/dashboard/branches" className="mt-6 text-accent font-bold flex items-center gap-2 hover:underline">
                    <FiArrowLeft /> Back to Command Center
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await addBranch(formData);
            toast.success("Branch established successfully!");
            router.push('/dashboard/branches');
        } catch (err) {
            toast.error("Failed to establish branch. Verify system logs.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/branches"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-background border border-border hover:bg-background-secondary transition-all"
                >
                    <FiArrowLeft />
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Establish New Branch</h1>
                    <p className="text-foreground-muted">Register a new physical location or warehouse into the system.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-black/5"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-foreground-muted ml-1 tracking-[0.2em]">Branch Designation (Name)</label>
                                    <div className="relative mt-2">
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Lagos Mainland Hub"
                                            className="w-full bg-background-secondary border border-border rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all text-sm font-bold placeholder:font-medium"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-foreground-muted ml-1 tracking-[0.2em]">Geographic Protocol (Address)</label>
                                    <div className="relative mt-2">
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Enter the full physical location address..."
                                            className="w-full bg-background-secondary border border-border rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all text-sm font-bold placeholder:font-medium resize-none"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={isProcessing}
                                className="w-full py-6 bg-accent text-white rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-lg shadow-accent/20 hover:bg-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isProcessing ? (
                                    <>
                                        <FiLoader className="animate-spin text-lg" /> Establishing...
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle className="text-lg" /> Create Branch location
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div className="bg-background-secondary border border-border rounded-[2rem] p-8">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FiMapPin className="text-accent" /> Why a New Branch?
                        </h3>
                        <p className="text-xs text-foreground-muted leading-relaxed">
                            Branches allow you to track inventory, sales, and employee performance across different geographic locations. Each branch has its own stock levels and staff assignments.
                        </p>
                    </div>

                    <div className="bg-accent/5 border border-accent/10 rounded-[2rem] p-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">Pro Tip</h4>
                        <p className="text-[10px] text-accent/80 font-bold uppercase tracking-tight">
                            You can assign a specific Manager to this branch in the "Staff" section after creation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
