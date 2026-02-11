"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPlus, FiTrash2, FiLoader, FiSearch } from "react-icons/fi";
import { useApp } from "@/context/app-context";
import { toast } from "sonner";

export default function NewStockReceiptPage() {
    const { products, suppliers, currentBranch, createStockReceipt } = useApp();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [supplierId, setSupplierId] = useState("");
    const [items, setItems] = useState<any[]>([]);

    const branchKey = (currentBranch as any)?._id || currentBranch?.id;

    const addItem = () => {
        setItems([...items, { productId: "", quantity: 1, costPrice: 0 }]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;

        // Auto-fill cost price if product is selected
        if (field === 'productId') {
            const product = products.find(p => (p._id || p.id) === value);
            if (product) {
                newItems[index].costPrice = product.costPrice;
            }
        }

        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierId || items.length === 0) {
            toast.error("Please select a supplier and add at least one item.");
            return;
        }

        setIsSaving(true);
        try {
            await createStockReceipt({
                supplierId,
                branchId: branchKey,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    costPrice: item.costPrice
                }))
            });
            toast.success("Stock receipt created successfully!");
            router.push("/dashboard/inventory/stock-receipts");
        } catch (error) {
            toast.error("Failed to create stock receipt.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/inventory/stock-receipts" className="p-2 hover:bg-background-secondary rounded-lg transition-colors">
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-foreground">Receive Stock</h1>
                    <p className="text-sm text-foreground-muted">Record new stock arriving from suppliers</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Supplier Selection */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-foreground-muted mb-4">Supplier Information</h2>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Select Supplier</label>
                        <select
                            required
                            className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-accent transition-all"
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                        >
                            <option value="">Choose a supplier...</option>
                            {suppliers.map(s => (
                                <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-background-secondary/30">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Products Received</h2>
                        <button
                            type="button"
                            onClick={addItem}
                            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                        >
                            <FiPlus /> Add Item
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-background-secondary/50 text-[10px] font-bold uppercase text-foreground-muted tracking-widest leading-none">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4 w-32">Quantity</th>
                                    <th className="px-6 py-4 w-40">Unit Cost (₦)</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                    <th className="px-6 py-4 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-foreground-muted text-sm italic">
                                            No items added. Click "Add Item" to start.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4">
                                                <select
                                                    required
                                                    className="w-full bg-background border border-border rounded-lg p-2 text-sm outline-none focus:border-accent"
                                                    value={item.productId}
                                                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                                >
                                                    <option value="">Select product...</option>
                                                    {products.map(p => (
                                                        <option key={p._id || p.id} value={p._id || p.id}>{p.name} ({p.sku})</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    required
                                                    type="number"
                                                    min="1"
                                                    className="w-full bg-background border border-border rounded-lg p-2 text-sm outline-none focus:border-accent text-center font-bold"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    required
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full bg-background border border-border rounded-lg p-2 text-sm outline-none focus:border-accent text-right"
                                                    value={item.costPrice}
                                                    onChange={(e) => updateItem(index, 'costPrice', Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-right tabular-nums">
                                                ₦{(item.quantity * item.costPrice).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-foreground-muted hover:text-error transition-colors"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {items.length > 0 && (
                                <tfoot className="bg-background-secondary/20">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-sm font-bold text-right uppercase tracking-wider text-foreground-muted">Total Value</td>
                                        <td className="px-6 py-4 text-right text-lg font-black text-accent tabular-nums">
                                            ₦{items.reduce((acc, item) => acc + (item.quantity * item.costPrice), 0).toLocaleString()}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/dashboard/inventory/stock-receipts" className="px-6 py-3 border border-border rounded-xl text-sm font-bold hover:bg-background-secondary transition-all">
                        Cancel
                    </Link>
                    <button
                        disabled={isSaving || items.length === 0 || !supplierId}
                        className="px-10 py-3 bg-accent text-white font-black rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-accent/20"
                    >
                        {isSaving ? <FiLoader className="animate-spin text-lg" /> : "Save Receipt"}
                    </button>
                </div>
            </form>
        </div>
    );
}
