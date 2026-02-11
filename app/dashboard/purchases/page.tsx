"use client";

import { useApp, StockReceipt } from "@/context/app-context";
import { format } from "date-fns";
import { FiSearch, FiCalendar, FiFilter, FiEye, FiDownload, FiTruck, FiCheck, FiX, FiClock, FiAlertCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function PurchasesPage() {
    const { getStockReceipts, currentBranch, suppliers, verifyStockReceipt, rejectStockReceipt, loading } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [receipts, setReceipts] = useState<StockReceipt[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchReceipts = async () => {
        setIsRefreshing(true);
        try {
            const data = await getStockReceipts();
            setReceipts(data);
        } catch (err) {
            toast.error("Failed to load purchases");
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, [currentBranch]);

    if (loading && receipts.length === 0) return <div className="p-10 text-center">Loading Purchases...</div>;

    const filteredPurchases = receipts.filter(r => {
        const receiptId = (r.receiptNumber || "").toLowerCase();
        const invoiceNum = (r.supplierInvoiceNumber || "").toLowerCase();
        const matchesSearch = receiptId.includes(searchTerm.toLowerCase()) || invoiceNum.includes(searchTerm.toLowerCase());

        const supplier = suppliers.find(s => (s._id || s.id) === r.supplierId);
        const matchesSupplier = supplier?.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch || matchesSupplier;
    });

    const handleVerify = async (id: string) => {
        try {
            await verifyStockReceipt(id);
            toast.success("Purchase verified and stock updated");
            fetchReceipts();
        } catch (err) {
            toast.error("Verification failed");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Purchase Tracking</h1>
                    <p className="text-foreground-muted text-sm">Monitor vendor deliveries, stock receipts, and procurement costs.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchReceipts} className="btn bg-background-secondary text-foreground border border-border px-4 py-2 text-sm flex items-center gap-2">
                        <FiTruck /> Refresh Data
                    </button>
                    <button className="btn bg-accent text-white px-4 py-2 text-sm flex items-center gap-2 rounded-xl shadow-lg shadow-accent/20">
                        <FiDownload /> Export Logs
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border p-5 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-foreground-muted tracking-widest mb-1">Total Purchases</p>
                    <h3 className="text-xl font-black">{receipts.length}</h3>
                </div>
                <div className="bg-card border border-border p-5 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-success tracking-widest mb-1">Verified</p>
                    <h3 className="text-xl font-black">{receipts.filter(r => r.status === 'VERIFIED').length}</h3>
                </div>
                <div className="bg-card border border-border p-5 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-1">Pending</p>
                    <h3 className="text-xl font-black">{receipts.filter(r => r.status === 'PENDING').length}</h3>
                </div>
                <div className="bg-card border border-border p-5 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-accent tracking-widest mb-1">Total Spent</p>
                    <h3 className="text-xl font-black">₦{receipts.filter(r => r.status === 'VERIFIED').reduce((acc, r) => acc + r.totalAmount, 0).toLocaleString()}</h3>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                        type="text"
                        placeholder="Search by Receipt #, Invoice or Supplier..."
                        className="w-full bg-background-secondary border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:border-accent outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-background-secondary border border-border rounded-xl px-4 py-2 text-sm hover:bg-border transition-colors">
                        <FiCalendar /> All Time
                    </button>
                </div>
            </div>

            {/* Purchases Table */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-background-secondary border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-bold text-foreground-muted uppercase tracking-widest text-[10px]">Receipt Number</th>
                                <th className="px-6 py-4 font-bold text-foreground-muted uppercase tracking-widest text-[10px]">Supplier / Invoice</th>
                                <th className="px-6 py-4 font-bold text-foreground-muted uppercase tracking-widest text-[10px]">Date</th>
                                <th className="px-6 py-4 font-bold text-foreground-muted uppercase tracking-widest text-[10px]">Total Amount</th>
                                <th className="px-6 py-4 font-bold text-foreground-muted uppercase tracking-widest text-[10px]">Status</th>
                                <th className="px-6 py-4 font-bold text-foreground-muted uppercase tracking-widest text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredPurchases.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-foreground-muted">
                                        <FiTruck className="mx-auto text-4xl mb-4 opacity-10" />
                                        <p className="font-bold">No purchase records found.</p>
                                        <p className="text-xs">Incoming stock receipts will appear here.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredPurchases.slice().reverse().map((r) => {
                                    const supplier = suppliers.find(s => (s._id || s.id) === r.supplierId);
                                    return (
                                        <tr key={r._id || r.id} className="hover:bg-background-secondary/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-black text-accent">{r.receiptNumber}</div>
                                                <div className="text-[10px] text-foreground-muted uppercase">{r.items.length} unique products</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold">{supplier?.name || 'Manual Adjustment'}</div>
                                                <div className="text-xs text-foreground-muted">{r.supplierInvoiceNumber || 'No Invoice Ref'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-xs">
                                                    {format(new Date(r.receivedDate || r.createdAt || new Date()), "MMM dd, yyyy")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-black text-sm">
                                                ₦{r.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${r.status === 'VERIFIED' ? 'bg-success/10 text-success' :
                                                        r.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' :
                                                            'bg-error/10 text-error'
                                                    }`}>
                                                    {r.status === 'VERIFIED' ? <FiCheck /> : r.status === 'PENDING' ? <FiClock /> : <FiAlertCircle />}
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {r.status === 'PENDING' && (
                                                        <button onClick={() => handleVerify(r._id || r.id || '')} className="p-2 bg-success text-white rounded-lg hover:scale-105 transition-transform" title="Verify & Apply Stock">
                                                            <FiCheck />
                                                        </button>
                                                    )}
                                                    <button className="p-2 hover:bg-background-secondary rounded-lg text-foreground-muted hover:text-accent transition-colors">
                                                        <FiEye />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
