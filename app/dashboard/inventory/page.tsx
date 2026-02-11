"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FiPlus,
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiLoader,
    FiTruck,
    FiClock,
    FiArrowUp,
    FiArrowDown,
    FiTrendingUp,
    FiX
} from "react-icons/fi";
import { useApp, Product, StockTransaction } from "@/context/app-context";
import { toast } from "sonner";

export default function InventoryPage() {
    const {
        products, currentBranch, currentCompany, deleteProduct,
        getProductTransactions, adjustStock
    } = useApp();

    const [searchTerm, setSearchTerm] = useState("");

    // Modals
    const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false);
    const [isQuickAdjustOpen, setIsQuickAdjustOpen] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Transaction History State
    const [transactions, setTransactions] = useState<StockTransaction[]>([]);

    // Quick Adjust State
    const [adjustForm, setAdjustForm] = useState({
        quantity: 0,
        type: 'STOCK_OUT' as 'STOCK_OUT' | 'ADJUSTMENT',
        reason: ''
    });

    if (!currentBranch) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <FiLoader className="animate-spin text-accent text-3xl" />
        </div>
    );

    const branchKey = (currentBranch as any)?._id || currentBranch.id;

    const filteredProducts = products.filter(p => {
        const isForThisBranch = !p.branchId || (p as any).branchId === branchKey;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
        return isForThisBranch && matchesSearch;
    });

    // Simple Stats
    const stats = {
        total: filteredProducts.length,
        low: filteredProducts.filter(p => {
            const stock = p.stock?.[branchKey] || 0;
            const threshold = p.minStockLevel || currentCompany?.settings?.lowStockThreshold || 0;
            return stock > 0 && stock <= threshold;
        }).length,
        out: filteredProducts.filter(p => (p.stock?.[branchKey] || 0) === 0).length,
        value: filteredProducts.reduce((acc, p) => acc + (p.sellingPrice * (p.stock?.[branchKey] || 0)), 0)
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                toast.success("Product deleted successfully.");
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete product.");
            }
        }
    };

    const viewTransactionHistory = async (product: Product) => {
        setSelectedProduct(product);
        try {
            const data = await getProductTransactions(product._id || product.id || '');
            setTransactions(data);
            setIsTransactionHistoryOpen(true);
        } catch (err) {
            console.error('Failed to load transactions', err);
        }
    };

    const openQuickAdjust = (product: Product) => {
        setSelectedProduct(product);
        setAdjustForm({ quantity: 0, type: 'STOCK_OUT', reason: '' });
        setIsQuickAdjustOpen(true);
    };

    const handleQuickAdjust = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || adjustForm.quantity <= 0 || !adjustForm.reason) return;

        setIsProcessing(true);
        try {
            await adjustStock(
                selectedProduct._id || selectedProduct.id || '',
                branchKey,
                adjustForm.type === 'STOCK_OUT' ? -adjustForm.quantity : adjustForm.quantity,
                adjustForm.type,
                adjustForm.reason
            );
            toast.success('Inventory adjusted');
            setIsQuickAdjustOpen(false);
        } catch (err) {
            toast.error('Failed to adjust stock');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-full overflow-hidden space-y-6 pb-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">
                        Inventory
                    </h1>
                    <p className="text-sm text-foreground-muted">
                        Manage products and levels for <span className="font-semibold">{currentBranch.name}</span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Link href="/dashboard/inventory/categories" className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-background-secondary transition-colors">
                        Categories
                    </Link>
                    <Link href="/dashboard/inventory/stock-receipts" className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-background-secondary transition-colors">
                        Receipt History
                    </Link>
                    <Link href="/dashboard/inventory/stock-receipts/new" className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success border border-success/20 rounded-lg text-sm font-semibold hover:bg-success/20 transition-colors">
                        <FiTruck />
                        Receive Stock
                    </Link>
                    <Link href="/dashboard/inventory/products/new" className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-sm">
                        <FiPlus />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Products", value: stats.total, color: "text-foreground" },
                    { label: "Low Stock", value: stats.low, color: stats.low > 0 ? "text-orange-500" : "text-foreground" },
                    { label: "Out of Stock", value: stats.out, color: stats.out > 0 ? "text-error" : "text-foreground" },
                    { label: "Total Value", value: `₦${stats.value.toLocaleString()}`, color: "text-success" },
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                        <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{stat.label}</p>
                        <h3 className={`text-xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Product List */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                {/* Filters */}
                <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-background-secondary/30">
                    <div className="relative w-full sm:w-80">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-accent transition-all"
                        />
                    </div>
                    <div className="text-xs text-foreground-muted font-medium">
                        Showing {filteredProducts.length} items
                    </div>
                </div>

                {/* Table Container - This handles overflow */}
                {/* Product List Rows */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-background-secondary/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                    <div className="col-span-4">Product Details</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2 text-center">Price / Cost</div>
                    <div className="col-span-2 text-center">Stock</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-border">
                    {filteredProducts.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-foreground-muted font-bold italic">No products match your search.</p>
                        </div>
                    ) : (
                        filteredProducts.map((item) => {
                            const stock = item.stock?.[branchKey] || 0;
                            const threshold = item.minStockLevel || currentCompany?.settings?.lowStockThreshold || 0;
                            const status = stock === 0 ? 'Out of Stock' : stock <= threshold ? 'Low Stock' : 'In Stock';

                            return (
                                <div key={item._id || item.id} className="group p-4 md:px-6 md:py-4 hover:bg-background-secondary/20 transition-colors">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        {/* Product Info */}
                                        <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                                            <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center font-black text-xs shadow-inner ${stock === 0 ? 'bg-error/10 text-error' :
                                                    stock <= threshold ? 'bg-orange-500/10 text-orange-500' : 'bg-success/10 text-success'
                                                }`}>
                                                {item.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-sm text-foreground leading-tight truncate">{item.name}</h3>
                                                <span className="text-[10px] text-foreground-muted font-mono mt-1 block">{item.sku}</span>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="col-span-1 md:col-span-2">
                                            <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">Category</span>
                                            <span className="text-xs text-foreground-muted bg-background-secondary border border-border px-2 py-1 rounded-md inline-block max-w-full truncate">
                                                {item.category || 'Uncategorized'}
                                            </span>
                                        </div>

                                        {/* Pricing */}
                                        <div className="col-span-1 md:col-span-2 md:text-center">
                                            <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">Price / Cost</span>
                                            <div className="flex flex-col md:items-center">
                                                <span className="text-sm font-black text-foreground tabular-nums">₦{item.sellingPrice.toLocaleString()}</span>
                                                <span className="text-[10px] text-foreground-muted opacity-60">Cost: ₦{item.costPrice.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Stock Level */}
                                        <div className="col-span-1 md:col-span-2 text-left md:text-center">
                                            <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">In Stock</span>
                                            <div className="flex flex-row md:flex-col items-center md:items-center gap-2 md:gap-1">
                                                <span className="text-lg font-black tabular-nums leading-none">{stock}</span>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${status === 'In Stock' ? 'bg-success/10 text-success' :
                                                    status === 'Low Stock' ? 'bg-orange-500/10 text-orange-500' :
                                                        'bg-error/10 text-error'
                                                    }`}>
                                                    {status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-1 mt-2 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => viewTransactionHistory(item)} title="History" className="p-2 text-foreground-muted hover:text-accent hover:bg-accent/5 rounded-lg transition-all"><FiClock size={16} /></button>
                                            <button onClick={() => openQuickAdjust(item)} title="Adjust Stock" className="p-2 text-foreground-muted hover:text-orange-500 hover:bg-orange-500/5 rounded-lg transition-all"><FiTrendingUp size={16} /></button>
                                            <Link href={`/dashboard/inventory/products/${item._id || item.id}/edit`} className="p-2 text-foreground-muted hover:text-accent hover:bg-accent/5 rounded-lg transition-all"><FiEdit2 size={16} /></Link>
                                            <button onClick={() => handleDelete(item._id || item.id || '')} title="Delete" className="p-2 text-foreground-muted hover:text-error hover:bg-error/5 rounded-lg transition-all"><FiTrash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* History Modal */}
            {isTransactionHistoryOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/5 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <div>
                                <h3 className="font-bold text-lg">Transaction History</h3>
                                <p className="text-xs text-foreground-muted uppercase tracking-wider">{selectedProduct.name}</p>
                            </div>
                            <button onClick={() => setIsTransactionHistoryOpen(false)} className="p-2 hover:bg-background-secondary rounded-full transition-colors">
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
                            {transactions.length === 0 ? (
                                <p className="text-center py-8 text-sm text-foreground-muted">No transactions found.</p>
                            ) : (
                                transactions.map((tx, i) => (
                                    <div key={tx._id || i} className="flex items-center gap-4 p-4 border border-border rounded-xl bg-background-secondary/30">
                                        <div className={`p-2 rounded-lg ${tx.type === 'IN' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                            {tx.type === 'IN' ? <FiArrowUp /> : <FiArrowDown />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold uppercase tracking-wide">{tx.type === 'IN' ? 'Stock In' : tx.type === 'OUT' ? 'Stock Out' : 'Adjustment'}</p>
                                            <p className="text-xs text-foreground-muted mt-0.5">{tx.reason}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-black ${tx.type === 'IN' ? 'text-success' : 'text-error'}`}>
                                                {tx.type === 'IN' ? '+' : '-'}{Math.abs(tx.quantity)}
                                            </p>
                                            <p className="text-[10px] text-foreground-muted font-medium mt-1">
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Adjust Stock Modal */}
            {isQuickAdjustOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/5 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-border bg-orange-500/[0.02]">
                            <div>
                                <h3 className="font-black text-lg">Adjust Stock</h3>
                                <p className="text-xs text-foreground-muted uppercase tracking-wider">{selectedProduct.name}</p>
                            </div>
                            <button onClick={() => setIsQuickAdjustOpen(false)} className="p-2 hover:bg-background-secondary rounded-full transition-colors">
                                <FiX size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleQuickAdjust} className="p-6 space-y-6">
                            <div className="bg-background-secondary/50 p-4 rounded-xl text-center border border-border">
                                <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">Available Stock</p>
                                <p className="text-4xl font-black mt-1 tabular-nums">{selectedProduct.stock?.[branchKey] || 0}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Action</label>
                                    <select
                                        required
                                        className="w-full bg-background border border-border rounded-xl p-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all cursor-pointer"
                                        value={adjustForm.type}
                                        onChange={e => setAdjustForm({ ...adjustForm, type: e.target.value as any })}
                                    >
                                        <option value="STOCK_OUT">Remove Stock (Damage/Expired)</option>
                                        <option value="ADJUSTMENT">Manual Correction</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Quantity</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        placeholder="Input amount"
                                        className="w-full bg-background border border-border rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all font-mono"
                                        value={adjustForm.quantity || ''}
                                        onChange={e => setAdjustForm({ ...adjustForm, quantity: Number(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Reason</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Broken item, system error..."
                                        className="w-full bg-background border border-border rounded-xl p-3 text-sm font-medium outline-none focus:border-orange-500 transition-all"
                                        value={adjustForm.reason}
                                        onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isProcessing || adjustForm.quantity <= 0 || !adjustForm.reason}
                                className="w-full py-4 bg-orange-500 text-white font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                            >
                                {isProcessing ? "Processing..." : "Update Stock"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
