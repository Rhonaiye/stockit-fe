"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiLoader, FiPlus, FiTrash2 } from "react-icons/fi";
import { useApp } from "@/context/app-context";
import { toast } from "sonner";

export default function AddProductPage() {
    const { categories, suppliers, addProduct, currentBranch } = useApp();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [form, setForm] = useState<{
        name: string;
        category: string;
        sku: string;
        barcode: string;
        costPrice: number;
        sellingPrice: number;
        minStockLevel: number;
        initialStock: number;
        description: string;
        supplierId: string;
        variants: any[];
    }>({
        name: "",
        category: "",
        sku: "", // Will be auto-generated if empty
        barcode: "",
        costPrice: 0,
        sellingPrice: 0,
        minStockLevel: 5,
        initialStock: 0,
        description: "",
        supplierId: "",
        variants: []
    });

    const generateSku = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const sku = `SKU-${timestamp}-${random}`;
        setForm({ ...form, sku });
    };

    const addVariant = () => {
        setForm({
            ...form,
            variants: [...form.variants, { name: "", price: form.sellingPrice } as any]
        });
    };

    const removeVariant = (index: number) => {
        setForm({
            ...form,
            variants: form.variants.filter((_, i) => i !== index)
        });
    };

    const updateVariant = (index: number, field: string, value: any) => {
        const newVariants = [...form.variants];
        (newVariants[index] as any)[field] = field === 'price' ? Number(value) : value;
        setForm({ ...form, variants: newVariants });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Auto-generate SKU if empty
        let finalSku = form.sku;
        if (!finalSku) {
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            finalSku = `SKU-${timestamp}-${random}`;
        }

        try {
            const branchKey = (currentBranch as any)?._id || currentBranch?.id;

            await addProduct({
                ...form,
                sku: finalSku,
                branchId: branchKey,
                costPrice: Number(form.costPrice),
                sellingPrice: Number(form.sellingPrice),
                minStockLevel: Number(form.minStockLevel),
                initialStock: Number(form.initialStock)
            });
            toast.success("Product created successfully!");
            router.push("/dashboard/inventory");
        } catch (error) {
            toast.error("Failed to create product.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/inventory" className="p-2 hover:bg-background-secondary rounded-lg transition-colors">
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-foreground">Add New Product</h1>
                    <p className="text-sm text-foreground-muted">Register a new item in your inventory</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground-muted">General Details</h2>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Product Name</label>
                            <input required placeholder="e.g. Coca Cola 35cl" className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-accent transition-all"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Category</label>
                            <select required className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-accent transition-all"
                                value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c._id || c.id} value={c.name}>{c.name}</option>)}
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Description (Optional)</label>
                            <textarea placeholder="Briefly describe the product..." className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-accent transition-all h-24"
                                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Pricing & Stock</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Cost Price (₦)</label>
                                <input required type="number" step="0.01" className="w-full bg-background border border-border rounded-lg p-3 text-sm font-bold outline-none focus:border-accent transition-all"
                                    value={form.costPrice || ''} onChange={e => setForm({ ...form, costPrice: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Selling Price (₦)</label>
                                <input required type="number" step="0.01" className="w-full bg-background border border-border rounded-lg p-3 text-sm font-bold outline-none focus:border-accent transition-all"
                                    value={form.sellingPrice || ''} onChange={e => setForm({ ...form, sellingPrice: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Low Stock Alert Level</label>
                            <input required type="number" className="w-full bg-background border border-border rounded-lg p-3 text-sm font-bold outline-none focus:border-accent transition-all"
                                value={form.minStockLevel || ''} onChange={e => setForm({ ...form, minStockLevel: Number(e.target.value) })}
                            />
                            <p className="text-[10px] text-foreground-muted">We'll notify you when stock falls below this number.</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Current Stock Level</label>
                            <input required type="number" className="w-full bg-background border border-border rounded-lg p-3 text-sm font-bold outline-none focus:border-accent transition-all"
                                value={form.initialStock || ''} onChange={e => setForm({ ...form, initialStock: Number(e.target.value) })}
                            />
                            <p className="text-[10px] text-foreground-muted">Initial quantity available in {currentBranch?.name || 'this branch'}.</p>
                        </div>
                    </div>
                </div>

                {/* Identification & Supplier */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Identification</h2>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">SKU (Internal Code)</label>
                                <button type="button" onClick={generateSku} className="text-[10px] font-bold text-accent hover:underline uppercase tracking-widest">Generate</button>
                            </div>
                            <input placeholder="Auto-generated if left empty" className="w-full bg-background border border-border rounded-lg p-3 text-sm font-mono outline-none focus:border-accent transition-all"
                                value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Barcode (Optional Scan)</label>
                            <input placeholder="Scan or enter barcode" className="w-full bg-background border border-border rounded-lg p-3 text-sm font-mono outline-none focus:border-accent transition-all"
                                value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Supply Details</h2>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Preferred Supplier</label>
                            <select className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-accent transition-all"
                                value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}
                            >
                                <option value="">Select Supplier (Optional)</option>
                                {suppliers.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Product Variants</h2>
                            <button type="button" onClick={addVariant} className="text-[10px] font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-1">
                                <FiPlus /> Add Variant
                            </button>
                        </div>

                        <div className="space-y-3">
                            {form.variants.length === 0 ? (
                                <p className="text-[10px] text-foreground-muted italic text-center py-2">No variants added (e.g. Size, Color)</p>
                            ) : (
                                form.variants.map((variant: any, index: number) => (
                                    <div key={index} className="flex gap-2 items-end">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[8px] font-bold uppercase text-foreground-muted ml-1">Variant Name</label>
                                            <input placeholder="e.g. Large" className="w-full bg-background border border-border rounded-lg p-2 text-xs outline-none focus:border-accent transition-all"
                                                value={variant.name} onChange={e => updateVariant(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="w-24 space-y-1">
                                            <label className="text-[8px] font-bold uppercase text-foreground-muted ml-1">Price (₦)</label>
                                            <input type="number" className="w-full bg-background border border-border rounded-lg p-2 text-xs font-bold outline-none focus:border-accent transition-all"
                                                value={variant.price} onChange={e => updateVariant(index, 'price', e.target.value)}
                                            />
                                        </div>
                                        <button type="button" onClick={() => removeVariant(index)} className="p-2.5 text-foreground-muted hover:text-error transition-colors">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={isSaving}
                            className="w-full py-4 bg-accent text-white font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-accent/20"
                        >
                            {isSaving ? <FiLoader className="animate-spin text-xl" /> : <FiPlus className="text-xl" />}
                            Create Product
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
