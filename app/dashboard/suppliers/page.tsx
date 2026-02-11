"use client";

import { useState, useEffect } from "react";
import { FiMail, FiPhone, FiMapPin, FiMoreVertical, FiPlus, FiX, FiUser, FiInfo, FiBox, FiClock, FiDollarSign, FiEdit2, FiTrash2, FiActivity } from "react-icons/fi";
import { useApp } from "@/context/app-context";
import { toast } from "sonner";

export default function SuppliersPage() {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier, getSupplierProfile } = useApp();

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
    const [supplierProfile, setSupplierProfile] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        category: '',
        paymentTerms: '',
        notes: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
            category: '',
            paymentTerms: '',
            notes: ''
        });
        setEditId(null);
    };

    const handleOpenModal = (supplier?: any) => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                contactPerson: supplier.contactPerson || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || '',
                category: supplier.category || '',
                paymentTerms: supplier.paymentTerms || '',
                notes: supplier.notes || ''
            });
            setEditId(supplier._id || supplier.id);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleViewProfile = async (id: string) => {
        setSelectedSupplierId(id);
        setIsProcessing(true);
        try {
            const data = await getSupplierProfile(id);
            setSupplierProfile(data);
            setIsProfileOpen(true);
        } catch (err) {
            toast.error("Failed to load supplier profile");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            if (editId) {
                await updateSupplier(editId, formData);
                toast.success("Supplier updated successfully");
            } else {
                await addSupplier(formData);
                toast.success("Supplier added successfully");
            }
            setIsModalOpen(false);
            resetForm();
        } catch (err) {
            toast.error("Failed to save supplier");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteSupplier(id);
                toast.success("Supplier deleted");
            } catch (err) {
                toast.error("Failed to delete supplier");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Suppliers & Vendors</h1>
                    <p className="text-foreground-muted text-sm">Manage procurement and vendor performance tracking.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-accent/20">
                    <FiPlus /> Add New Supplier
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center text-xl">
                            <FiActivity />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Active Vendors</p>
                            <h3 className="text-2xl font-black">{suppliers.filter(s => s.status !== 'INACTIVE').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border p-6 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-success/10 text-success rounded-2xl flex items-center justify-center text-xl">
                            <FiBox />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Categories</p>
                            <h3 className="text-2xl font-black">{new Set(suppliers.map(s => s.category)).size}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border p-6 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center text-xl">
                            <FiClock />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Total Suppliers</p>
                            <h3 className="text-2xl font-black">{suppliers.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-card border-2 border-dashed border-border rounded-3xl">
                        <FiUser className="text-6xl mx-auto mb-4 opacity-10" />
                        <h3 className="text-lg font-bold">No suppliers yet</h3>
                        <p className="text-foreground-muted mb-6">Start by adding your first vendor to track inventory orders.</p>
                        <button onClick={() => handleOpenModal()} className="btn btn-primary px-6 py-2 rounded-xl">Add Supplier</button>
                    </div>
                ) : (
                    suppliers.map(supplier => (
                        <div key={supplier?._id || supplier.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-14 h-14 bg-background-secondary border border-border rounded-2xl flex items-center justify-center text-xl font-black text-accent shadow-sm">
                                    {supplier.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(supplier)} className="p-2 hover:bg-accent/10 rounded-xl text-foreground-muted hover:text-accent transition-colors"><FiEdit2 /></button>
                                    <button onClick={() => handleDelete(supplier._id || supplier.id || '', supplier.name)} className="p-2 hover:bg-error/10 rounded-xl text-foreground-muted hover:text-error transition-colors"><FiTrash2 /></button>
                                </div>
                            </div>

                            <div className="mb-6 relative z-10">
                                <h3 className="text-xl font-black leading-tight mb-1">{supplier.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-black uppercase tracking-widest">{supplier.category || 'Vendor'}</span>
                                    <span className={`w-2 h-2 rounded-full ${supplier.status === 'INACTIVE' ? 'bg-foreground-muted' : 'bg-success'}`} />
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 text-sm relative z-10">
                                <div className="flex items-center gap-4 text-foreground-muted group/info hover:text-foreground transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center shrink-0"><FiUser className="text-xs" /></div>
                                    <span className="font-medium truncate">{supplier.contactPerson || 'No contact person'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-foreground-muted group/info hover:text-foreground transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center shrink-0"><FiPhone className="text-xs" /></div>
                                    <span className="font-medium">{supplier.phone || 'No phone'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-foreground-muted group/info hover:text-foreground transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center shrink-0"><FiMail className="text-xs" /></div>
                                    <span className="font-medium truncate">{supplier.email || 'No email'}</span>
                                </div>
                            </div>

                            <button onClick={() => handleViewProfile(supplier._id || supplier.id || '')} className="w-full py-3 bg-background-secondary hover:bg-accent hover:text-white border border-border hover:border-accent rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                                View Full Profile
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: Add/Edit Supplier */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-background w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-border animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center p-8 border-b border-border bg-background-secondary/30">
                            <div>
                                <h3 className="font-black text-2xl tracking-tight">{editId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
                                <p className="text-sm text-foreground-muted">Maintain accurate vendor records for your supply chain.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center hover:rotate-90 transition-all shadow-sm">
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Basic Information
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-foreground-muted ml-1 tracking-widest">Business Name</label>
                                            <input required type="text" placeholder="e.g. Alaba Electronics Ltd" className="w-full border border-border rounded-2xl p-4 bg-background-secondary mt-1 outline-none focus:border-accent transition-all text-sm"
                                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-foreground-muted ml-1 tracking-widest">Contact Person</label>
                                            <input type="text" placeholder="e.g. Segun Arinze" className="w-full border border-border rounded-2xl p-4 bg-background-secondary mt-1 outline-none focus:border-accent transition-all text-sm"
                                                value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-foreground-muted ml-1 tracking-widest">Category</label>
                                            <select className="w-full border border-border rounded-2xl p-4 bg-background-secondary mt-1 outline-none focus:border-accent transition-all text-sm appearance-none"
                                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="">Select Category...</option>
                                                <option value="Electronics">Electronics</option>
                                                <option value="Groceries">Groceries</option>
                                                <option value="Fashtion">Fashion</option>
                                                <option value="Pharmacy">Pharmacy</option>
                                                <option value="Construction">Construction</option>
                                                <option value="General">General Merchant</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Contact Details
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-foreground-muted ml-1 tracking-widest">Email Address</label>
                                            <input type="email" placeholder="vendor@example.com" className="w-full border border-border rounded-2xl p-4 bg-background-secondary mt-1 outline-none focus:border-accent transition-all text-sm"
                                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-foreground-muted ml-1 tracking-widest">Phone Number</label>
                                            <input type="text" placeholder="+234 ..." className="w-full border border-border rounded-2xl p-4 bg-background-secondary mt-1 outline-none focus:border-accent transition-all text-sm"
                                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-foreground-muted ml-1 tracking-widest">Payment Terms</label>
                                            <input type="text" placeholder="e.g. Net 30, COD" className="w-full border border-border rounded-2xl p-4 bg-background-secondary mt-1 outline-none focus:border-accent transition-all text-sm"
                                                value={formData.paymentTerms} onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-foreground-muted ml-1 tracking-widest">Office Address</label>
                                <textarea rows={2} placeholder="Full physical location..." className="w-full border border-border rounded-2xl p-4 bg-background-secondary mt-1 outline-none focus:border-accent transition-all text-sm resize-none"
                                    value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <button disabled={isProcessing} className="w-full py-6 font-black uppercase tracking-[0.3em] text-lg rounded-[2rem] bg-accent text-white hover:bg-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-accent/20">
                                {isProcessing ? 'Saving Records...' : (editId ? 'Update Supplier Profile' : 'Confirm & Add Supplier')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Supplier Profile Detail View */}
            {isProfileOpen && supplierProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-background w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-border animate-in slide-in-from-bottom-8 duration-500">
                        {/* Profile Header */}
                        <div className="relative h-48 shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-dark overflow-hidden">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                            </div>
                            <button onClick={() => setIsProfileOpen(false)} className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all z-20">
                                <FiX className="text-2xl" />
                            </button>

                            <div className="absolute -bottom-16 left-12 flex items-end gap-8 z-10">
                                <div className="w-32 h-32 bg-card border-4 border-background rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-accent shadow-2xl">
                                    {supplierProfile.supplier.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="pb-4">
                                    <h2 className="text-3xl font-black text-white drop-shadow-lg">{supplierProfile.supplier.name}</h2>
                                    <div className="flex gap-2 mt-2">
                                        <span className="bg-success text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Verified Vendor</span>
                                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">{supplierProfile.supplier.category || 'General'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="mt-20 p-12 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Left Col: Contact & Meta */}
                                <div className="space-y-10">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground-muted mb-6">Contact Information</h4>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 bg-background-secondary rounded-xl flex items-center justify-center text-foreground-muted"><FiUser /></div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-foreground-muted tracking-tighter">Contact Person</p>
                                                    <p className="font-bold">{supplierProfile.supplier.contactPerson || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 bg-background-secondary rounded-xl flex items-center justify-center text-foreground-muted"><FiPhone /></div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-foreground-muted tracking-tighter">Direct Line</p>
                                                    <p className="font-bold">{supplierProfile.supplier.phone || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 bg-background-secondary rounded-xl flex items-center justify-center text-foreground-muted"><FiMail /></div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-foreground-muted tracking-tighter">Email Address</p>
                                                    <p className="font-bold truncate max-w-[200px]">{supplierProfile.supplier.email || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-5">
                                                <div className="w-10 h-10 bg-background-secondary rounded-xl flex items-center justify-center text-foreground-muted mt-1"><FiMapPin /></div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-foreground-muted tracking-tighter">Office Address</p>
                                                    <p className="font-bold text-sm leading-relaxed">{supplierProfile.supplier.address || 'Not provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-accent/5 rounded-3xl p-8 border border-accent/10">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Financial Overview</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-foreground-muted uppercase">Total Volume</p>
                                                <p className="text-xl font-black">₦{supplierProfile.stats.totalSpent.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-foreground-muted uppercase">Total Orders</p>
                                                <p className="text-xl font-black">{supplierProfile.stats.totalOrders}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: Products & History */}
                                <div className="lg:col-span-2 space-y-12">
                                    {/* Linked Products */}
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Product Catalog ({supplierProfile.products.length})</h4>
                                            <p className="text-xs font-bold text-accent">Items linked to this vendor</p>
                                        </div>
                                        {supplierProfile.products.length === 0 ? (
                                            <div className="bg-background-secondary rounded-2xl p-8 text-center text-sm text-foreground-muted italic">
                                                No products are currently linked to this supplier.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {supplierProfile.products.map((p: any) => (
                                                    <div key={p._id} className="flex items-center gap-4 bg-card border border-border p-4 rounded-2xl">
                                                        <div className="w-10 h-10 rounded-lg bg-background-secondary flex items-center justify-center text-xl">📦</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm truncate">{p.name}</p>
                                                            <p className="text-[10px] text-foreground-muted uppercase tracking-wider">{p.sku}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-sm text-accent">₦{p.sellingPrice.toLocaleString()}</p>
                                                            <p className="text-[10px] text-foreground-muted uppercase">Stock: {Object.values(p.stock || {}).reduce((a: number, b: any) => a + (b as number), 0)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Purchase History */}
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Purchase History (Latest 10)</h4>
                                            <p className="text-xs font-bold text-accent">Stock incoming from vendor</p>
                                        </div>
                                        {supplierProfile.purchases.length === 0 ? (
                                            <div className="bg-background-secondary rounded-2xl p-8 text-center text-sm text-foreground-muted italic">
                                                No purchase history recorded.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {supplierProfile.purchases.map((r: any) => (
                                                    <div key={r._id} className="flex items-center justify-between bg-card border border-border p-5 rounded-3xl hover:border-accent transition-colors">
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${r.status === 'VERIFIED' ? 'bg-success/10 text-success' :
                                                                r.status === 'REJECTED' ? 'bg-error/10 text-error' : 'bg-orange-500/10 text-orange-500'
                                                                }`}>
                                                                <FiClock />
                                                            </div>
                                                            <div>
                                                                <p className="font-black">#{r.receiptNumber}</p>
                                                                <p className="text-xs text-foreground-muted">{new Date(r.createdAt).toLocaleDateString()} • {r.items.length} items</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-lg text-foreground">₦{r.totalAmount.toLocaleString()}</p>
                                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${r.status === 'VERIFIED' ? 'bg-success/10 text-success' :
                                                                r.status === 'REJECTED' ? 'bg-error/10 text-error' : 'bg-orange-500/10 text-orange-500'
                                                                }`}>{r.status}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
