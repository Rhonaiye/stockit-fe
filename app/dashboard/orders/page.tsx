"use client";

import { useApp } from "@/context/app-context";
import { format } from "date-fns";
import { FiEye, FiDownload, FiFileText } from "react-icons/fi";
import Link from "next/link";

export default function OrdersPage({ filterMethod }: { filterMethod?: string }) {
    const { sales, currentBranch, loading } = useApp();

    if (loading) return <div className="p-10 text-center">Loading Orders...</div>;

    const branchKey = (currentBranch as any)?._id || currentBranch?.id;

    // Filter sales for the current branch
    let branchSales = sales.filter(s => (s as any).branchId === branchKey);

    // Apply method filter if provided
    if (filterMethod) {
        branchSales = branchSales.filter(s => s.paymentMethod === filterMethod);
    }

    const filteredOrders = branchSales;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">
                        {filterMethod ? `${filterMethod.charAt(0) + filterMethod.slice(1).toLowerCase()} Sales History` : "All Sales History"}
                    </h1>
                    <p className="text-foreground-muted text-sm">View and manage all {filterMethod ? filterMethod.toLowerCase() : ''} sales transactions for <span className="font-bold text-accent">{currentBranch?.name}</span></p>
                </div>
                <div className="flex gap-2">
                    <button className="btn bg-background-secondary text-foreground border border-border px-4 py-2 text-sm flex items-center gap-2">
                        <FiDownload /> Export
                    </button>
                </div>
            </div>


            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
                <div className="py-24 text-center bg-card border border-border rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiFileText className="text-5xl text-foreground-muted/30" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">
                        No {filterMethod ? filterMethod.toLowerCase() : ''} sales recorded yet
                    </h3>
                    <p className="text-foreground-muted text-sm max-w-md mx-auto">
                        There are currently no transactions found for <span className="font-bold">{currentBranch?.name}</span>.
                        Start selling to see your sales history here.
                    </p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    {/* List Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-background-secondary/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                        <div className="col-span-3">Order ID & Date</div>
                        <div className="col-span-3">Items Purchased</div>
                        <div className="col-span-2">Payment Method</div>
                        <div className="col-span-3 text-right">Total Amount</div>
                        <div className="col-span-1 text-right">View</div>
                    </div>

                    <div className="divide-y divide-border">
                        {filteredOrders.slice().reverse().map((order) => {
                            const orderDate = new Date(order.createdAt || (order as any).date || new Date());
                            return (
                                <div key={order._id || order.id} className="group p-4 md:px-6 md:py-4 hover:bg-background-secondary/20 transition-colors">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        {/* ID & Date */}
                                        <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                                            <div className="w-10 h-10 shrink-0 rounded-lg bg-accent/5 flex items-center justify-center text-accent text-sm font-black border border-accent/10">
                                                <FiFileText />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-mono font-bold text-accent text-sm block">
                                                    #{(order._id || order.id || "").slice(-8).toUpperCase()}
                                                </span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs font-bold text-foreground">{format(orderDate, "MMM dd, yyyy")}</span>
                                                    <span className="text-[10px] text-foreground-muted">{format(orderDate, "hh:mm a")}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="col-span-1 md:col-span-3">
                                            <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">Items</span>
                                            <div className="flex flex-wrap gap-1">
                                                <span className="text-xs font-bold text-foreground-muted bg-background-secondary px-2 py-1 rounded-md border border-border">
                                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Payment */}
                                        <div className="col-span-1 md:col-span-2">
                                            <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">Payment</span>
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${order.paymentMethod === 'CASH' ? 'bg-success/10 text-success' :
                                                    order.paymentMethod === 'POS' ? 'bg-accent/10 text-accent' :
                                                        order.paymentMethod === 'TRANSFER' ? 'bg-accent/10 text-accent' :
                                                            'bg-foreground-muted/10 text-foreground-muted'
                                                }`}>
                                                {order.paymentMethod}
                                            </span>
                                        </div>

                                        {/* Amount */}
                                        <div className="col-span-1 md:col-span-3 text-left md:text-right">
                                            <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">Total Amount</span>
                                            <span className="font-black text-lg md:text-xl text-foreground">₦{order.totalAmount.toLocaleString()}</span>
                                        </div>

                                        {/* Action */}
                                        <div className="col-span-1 md:col-span-1 flex items-center justify-end">
                                            <Link
                                                href={`/dashboard/orders/${order._id || order.id}`}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-background-secondary text-foreground-muted hover:bg-accent/10 hover:text-accent border border-transparent hover:border-accent/20 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            >
                                                <FiEye size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
