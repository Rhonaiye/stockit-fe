"use client";

import Link from "next/link";
import { FiPlus, FiMapPin, FiEdit2, FiArrowRight } from "react-icons/fi";
import { useApp } from "@/context/app-context";

export default function BranchesPage() {
    const { branches, currentUser } = useApp();

    if (currentUser?.role !== 'OWNER' && currentUser?.role !== 'ADMIN') {
        return <div className="p-10 text-center">Access Denied. Only Owners can manage branches.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Branch Management</h1>
                    <p className="text-foreground-muted">Manage your store locations, warehouses, and geographic hubs.</p>
                </div>
                <Link
                    href="/dashboard/branches/new"
                    className="h-12 px-6 bg-accent text-white rounded-2xl flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-accent/20 hover:bg-accent-dark transition-all"
                >
                    <FiPlus /> Establish New Branch
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                    <div key={branch._id || branch.id} className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm relative group hover:shadow-xl hover:shadow-black/5 transition-all overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="w-14 h-14 bg-background-secondary border border-border text-accent rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                                <FiMapPin />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-xl text-foreground-muted hover:text-accent transition-all"><FiEdit2 size={16} /></button>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-black text-xl tracking-tight leading-none mb-2">{branch.name}</h3>
                            <p className="text-foreground-muted text-sm font-medium leading-relaxed">{branch.address}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-success">Active Protocol</span>
                            </div>
                            <Link href={`/dashboard/branches/${branch._id || branch.id}`} className="p-2 text-foreground-muted hover:text-accent transition-colors">
                                <FiArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Card */}
                <Link
                    href="/dashboard/branches/new"
                    className="group border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center p-8 min-h-[250px] hover:border-accent/30 hover:bg-accent/[0.02] transition-all"
                >
                    <div className="w-14 h-14 rounded-2xl bg-background-secondary flex items-center justify-center text-foreground-muted group-hover:text-accent group-hover:bg-accent/10 transition-all mb-4">
                        <FiPlus size={24} />
                    </div>
                    <p className="font-black uppercase tracking-widest text-[10px] text-foreground-muted group-hover:text-accent transition-colors">Add Location</p>
                </Link>
            </div>
        </div>
    );
}
