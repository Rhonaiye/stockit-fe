"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowLeft, FiPlus, FiLoader, FiEye, FiCheck, FiX } from "react-icons/fi";
import { useApp } from "@/context/app-context";
import { toast } from "sonner";

export default function StockReceiptsPage() {
    const { getStockReceipts, verifyStockReceipt, rejectStockReceipt, currentBranch } = useApp();
    const [receipts, setReceipts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadReceipts();
    }, []);

    const loadReceipts = async () => {
        try {
            const data = await getStockReceipts();
            setReceipts(data);
        } catch (error) {
            toast.error("Failed to load receipts");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this receipt?`)) return;

        try {
            if (status === 'VERIFIED') {
                await verifyStockReceipt(id);
            } else {
                const reason = prompt("Please provide a reason for rejection:", "Incorrect items");
                if (!reason) return;
                await rejectStockReceipt(id, reason);
            }
            toast.success(`Receipt ${status.toLowerCase()} successfully`);
            loadReceipts();
        } catch (error) {
            toast.error(`Failed to ${status.toLowerCase()} receipt`);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <FiLoader className="animate-spin text-accent text-3xl" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/inventory" className="p-2 hover:bg-background-secondary rounded-lg transition-colors">
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-foreground">Stock Receipts</h1>
                        <p className="text-sm text-foreground-muted">History of all stock received across branches</p>
                    </div>
                </div>
                <Link href="/dashboard/inventory/stock-receipts/new" className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                    <FiPlus />
                    Receive Stock
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-medium">
                        <thead>
                            <tr className="bg-background-secondary/50 border-b border-border text-[10px] font-bold uppercase text-foreground-muted tracking-widest leading-none">
                                <th className="px-6 py-4">Receipt ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Supplier</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {receipts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-foreground-muted text-sm italic">
                                        No stock receipts found.
                                    </td>
                                </tr>
                            ) : (
                                receipts.map((receipt) => (
                                    <tr key={receipt._id} className="hover:bg-background-secondary/10 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-foreground-muted">
                                            #{receipt._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground">
                                            {new Date(receipt.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-foreground">
                                            {receipt.supplierId?.name || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground-muted">
                                            {receipt.items?.length || 0} Products
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-bold ${receipt.status === 'VERIFIED' ? 'bg-success/10 text-success' :
                                                receipt.status === 'REJECTED' ? 'bg-error/10 text-error' :
                                                    'bg-orange-500/10 text-orange-500'
                                                }`}>
                                                {receipt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {receipt.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(receipt._id, 'VERIFIED')}
                                                            title="Verify"
                                                            className="p-2 text-success hover:bg-success/5 rounded-lg transition-all"
                                                        >
                                                            <FiCheck size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(receipt._id, 'REJECTED')}
                                                            title="Reject"
                                                            className="p-2 text-error hover:bg-error/5 rounded-lg transition-all"
                                                        >
                                                            <FiX size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button title="View Details" className="p-2 text-foreground-muted hover:text-accent hover:bg-accent/5 rounded-lg transition-all">
                                                    <FiEye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
