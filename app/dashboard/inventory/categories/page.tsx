"use client";

import { useState } from "react";
import Link from "next/link";
import { FiPlus, FiTrash2, FiLoader, FiArrowLeft } from "react-icons/fi";
import { useApp } from "@/context/app-context";
import { toast } from "sonner";

export default function CategoriesPage() {
    const { categories, addCategory, deleteCategory } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "" });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.name) return;
        setIsAdding(true);
        try {
            await addCategory(newCategory.name);
            setNewCategory({ name: "" });
            toast.success("Category added");
        } catch (error) {
            toast.error("Failed to add category");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Remove this category? Products using it won't be deleted but will stay 'Uncategorized'.")) {
            try {
                await deleteCategory(id);
                toast.success("Category removed");
            } catch (error) {
                toast.error("Failed to remove category");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/inventory" className="p-2 hover:bg-background-secondary rounded-lg transition-colors">
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-foreground">Categories</h1>
                    <p className="text-sm text-foreground-muted">Organize your products by type</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Add Form */}
                <div className="md:col-span-1">
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm sticky top-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground-muted mb-4">New Category</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest ml-1">Name</label>
                                <input
                                    required
                                    placeholder="e.g. Beverages"
                                    className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-accent transition-all mt-1"
                                    value={newCategory.name}
                                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                            </div>
                            <button
                                disabled={isAdding || !newCategory.name}
                                className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-accent/20"
                            >
                                {isAdding ? <FiLoader className="animate-spin" /> : <FiPlus />}
                                Add Category
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: List */}
                <div className="md:col-span-2">
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-background-secondary/50 border-b border-border text-[10px] font-bold uppercase text-foreground-muted tracking-widest leading-none">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-10 text-center text-foreground-muted text-sm italic">
                                            No categories created yet.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((cat) => (
                                        <tr key={cat._id || cat.id} className="hover:bg-background-secondary/10 transition-colors group">
                                            <td className="px-6 py-4 font-semibold text-foreground">
                                                {cat.name}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(cat._id || cat.id || '')}
                                                    className="p-2 text-foreground-muted hover:text-error hover:bg-error/5 rounded-lg transition-all"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
