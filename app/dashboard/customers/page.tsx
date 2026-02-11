"use client";

import { useState, useEffect } from "react";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiCreditCard,
    FiTrendingUp,
    FiShoppingBag,
    FiMoreVertical,
    FiX,
    FiUser,
    FiPhone,
    FiMail,
    FiMapPin,
    FiCalendar,
    FiStar
} from "react-icons/fi";
import { useApp, Customer } from "@/context/app-context";

export default function CustomersPage() {
    const { customers, addCustomer, updateCustomer, deleteCustomer, updateCustomerCredit } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
    const [creditAmount, setCreditAmount] = useState(0);

    const [newCustomer, setNewCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        tier: "REGULAR"
    });

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        await addCustomer(newCustomer);
        setIsAddModalOpen(false);
        setNewCustomer({ name: "", email: "", phone: "", address: "", tier: "REGULAR" });
    };

    const handleCreditUpdate = async (operation: 'ADD' | 'DEDUCT') => {
        if (!selectedCustomer) return;
        await updateCustomerCredit(selectedCustomer._id || selectedCustomer.id || "", creditAmount, operation);
        setIsCreditModalOpen(false);
        setCreditAmount(0);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Customer Management</h1>
                    <p className="text-foreground-muted">Track purchase history, credit, and loyalty insights.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn btn-primary px-6 py-3 flex items-center justify-center gap-2"
                >
                    <FiPlus /> Add New Customer
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-md border border-border shadow-sm">
                    <div className="w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center text-accent mb-4">
                        <FiUser className="w-6 h-6" />
                    </div>
                    <p className="text-foreground-muted text-sm font-bold uppercase tracking-wider">Total Customers</p>
                    <h3 className="text-4xl font-black mt-1">{customers.length}</h3>
                </div>
                <div className="bg-card p-6 rounded-md border border-border shadow-sm">
                    <div className="w-12 h-12 bg-success/10 rounded-md flex items-center justify-center text-success mb-4">
                        <FiTrendingUp className="w-6 h-6" />
                    </div>
                    <p className="text-foreground-muted text-sm font-bold uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-4xl font-black mt-1">₦{customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}</h3>
                </div>
                <div className="bg-card p-6 rounded-md border border-border shadow-sm">
                    <div className="w-12 h-12 bg-error/10 rounded-md flex items-center justify-center text-error mb-4">
                        <FiCreditCard className="w-6 h-6" />
                    </div>
                    <p className="text-foreground-muted text-sm font-bold uppercase tracking-wider">Outstanding Credit</p>
                    <h3 className="text-4xl font-black mt-1">₦{customers.reduce((sum, c) => sum + (c.creditBalance || 0), 0).toLocaleString()}</h3>
                </div>
                <div className="bg-card p-6 rounded-md border border-border shadow-sm">
                    <div className="w-12 h-12 bg-warning/10 rounded-md flex items-center justify-center text-warning mb-4">
                        <FiStar className="w-6 h-6" />
                    </div>
                    <p className="text-foreground-muted text-sm font-bold uppercase tracking-wider">VIP Customers</p>
                    <h3 className="text-4xl font-black mt-1">{customers.filter(c => c.tier === 'VIP' || c.tier === 'PREMIUM').length}</h3>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-card border border-border rounded-md shadow-xl overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-secondary/50">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            className="w-full bg-background border border-border rounded-md pl-12 pr-4 py-3 outline-none focus:border-accent transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn btn-secondary px-4 py-3 flex items-center gap-2">
                            <FiFilter /> Filter
                        </button>
                    </div>
                </div>

                {/* Customer List Rows */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-background-secondary/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                    <div className="col-span-4">Customer Details</div>
                    <div className="col-span-3">Contact Information</div>
                    <div className="col-span-2">History & Loyalty</div>
                    <div className="col-span-2 text-right">Credit Balance</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                <div className="divide-y divide-border">
                    {filteredCustomers.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-foreground-muted font-bold italic">No customers found matching your search.</p>
                        </div>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <div key={customer._id || customer.id} className="group p-4 md:px-6 md:py-4 hover:bg-background-secondary/30 transition-colors">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-4 items-center">
                                    {/* Customer Identity */}
                                    <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent font-black text-sm shadow-inner uppercase">
                                            {customer.name.substring(0, 2)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm text-foreground leading-tight truncate">{customer.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${customer.tier === 'VIP' ? 'bg-warning/10 text-warning' :
                                                        customer.tier === 'PREMIUM' ? 'bg-accent/10 text-accent' : 'bg-background-secondary text-foreground-muted border border-border'
                                                    }`}>
                                                    {customer.tier || 'Regular'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="col-span-1 md:col-span-3">
                                        <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-2">Contact</span>
                                        <div className="space-y-1.5">
                                            {customer.phone && (
                                                <div className="flex items-center gap-2 text-xs font-medium text-foreground-muted">
                                                    <FiPhone className="shrink-0 text-accent/60" size={12} /> {customer.phone}
                                                </div>
                                            )}
                                            {customer.email && (
                                                <div className="flex items-center gap-2 text-xs font-medium text-foreground-muted">
                                                    <FiMail className="shrink-0 text-accent/60" size={12} /> {customer.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* History & Loyalty */}
                                    <div className="col-span-1 md:col-span-2">
                                        <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-2">History</span>
                                        <div className="flex flex-col md:items-start">
                                            <span className="text-sm font-black text-foreground">₦{(customer.totalSpent || 0).toLocaleString()}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-foreground-muted font-bold flex items-center gap-1">
                                                    <FiShoppingBag size={10} /> {(customer.totalPurchases || 0)}
                                                </span>
                                                <span className="text-[10px] text-warning font-black flex items-center gap-1">
                                                    <FiStar size={10} className="fill-current" /> {customer.loyaltyPoints || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Credit Balance */}
                                    <div className="col-span-1 md:col-span-2 text-left md:text-right">
                                        <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-2">Credit Balance</span>
                                        <div className="flex flex-col md:items-end">
                                            <span className={`text-sm font-black ${(customer.creditBalance || 0) > 0 ? 'text-error' : 'text-success/60'}`}>
                                                ₦{(customer.creditBalance || 0).toLocaleString()}
                                            </span>
                                            {customer.creditLimit && (
                                                <span className="text-[9px] font-bold text-foreground-muted uppercase tracking-tighter mt-0.5">
                                                    Limit: ₦{customer.creditLimit.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 md:col-span-1 flex items-center justify-end gap-2 mt-2 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setSelectedCustomer(customer); setIsCreditModalOpen(true); }}
                                            className="h-9 w-9 rounded-lg bg-background-secondary text-foreground-muted hover:bg-error/10 hover:text-error border border-transparent hover:border-error/20 transition-all flex items-center justify-center"
                                            title="Manage Credit"
                                        >
                                            <FiCreditCard size={14} />
                                        </button>
                                        <button
                                            className="h-9 w-9 rounded-lg bg-background-secondary text-foreground-muted hover:bg-accent/10 hover:text-accent border border-transparent hover:border-accent/20 transition-all flex items-center justify-center"
                                            title="View History"
                                        >
                                            <FiMoreVertical size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Customer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-card w-full max-w-lg rounded-md border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-8 border-b border-border">
                            <h3 className="text-2xl font-black tracking-tight">Add New Customer</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-background-secondary rounded-full transition-colors">
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                        <form onSubmit={handleAddCustomer} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-background-secondary border border-border rounded-md pl-12 pr-4 py-4 outline-none focus:border-accent transition-colors"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Email Address (Optional)</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-background-secondary border border-border rounded-md pl-12 pr-4 py-4 outline-none focus:border-accent transition-colors"
                                            value={newCustomer.email}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Phone Number</label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+234..."
                                            className="w-full bg-background-secondary border border-border rounded-md pl-12 pr-4 py-4 outline-none focus:border-accent transition-colors"
                                            value={newCustomer.phone}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Home/Business Address</label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                    <input
                                        type="text"
                                        placeholder="123 Main St, Lagos"
                                        className="w-full bg-background-secondary border border-border rounded-md pl-12 pr-4 py-4 outline-none focus:border-accent transition-colors"
                                        value={newCustomer.address}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button className="btn btn-primary w-full py-4 rounded-md font-black text-lg shadow-xl shadow-accent/20">
                                Create Customer
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Credit Management Modal */}
            {isCreditModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-card w-full max-w-md rounded-md border border-border shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-border bg-error/5">
                            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                <FiCreditCard className="text-error" /> Manage Credit
                            </h3>
                            <p className="text-foreground-muted text-sm font-medium mt-1">For {selectedCustomer.name}</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="bg-background-secondary p-6 rounded-md flex justify-between items-center outline outline-1 outline-border">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-foreground-muted">Current Balance</p>
                                    <p className="text-2xl font-black">₦{(selectedCustomer.creditBalance || 0).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-foreground-muted">Tier Status</p>
                                    <p className="text-lg font-black text-warning uppercase font-bold tracking-widest">{selectedCustomer.tier || 'REGULAR'}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted text-center block">Enter Amount</label>
                                <input
                                    type="number"
                                    className="w-full bg-background border border-border rounded-md p-6 text-center text-3xl font-black outline-none focus:border-error transition-all"
                                    placeholder="0.00"
                                    value={creditAmount}
                                    onChange={(e) => setCreditAmount(Number(e.target.value))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button
                                    onClick={() => handleCreditUpdate('DEDUCT')}
                                    className="btn btn-secondary py-4 rounded-md font-bold border-error/20 text-error hover:bg-error/10 hover:border-error"
                                >
                                    Payments / Deduct
                                </button>
                                <button
                                    onClick={() => handleCreditUpdate('ADD')}
                                    className="btn bg-error text-white py-4 rounded-md font-bold shadow-lg shadow-error/20 hover:brightness-110"
                                >
                                    Record Debt / Add
                                </button>
                            </div>
                            <button
                                onClick={() => setIsCreditModalOpen(false)}
                                className="w-full text-foreground-muted text-sm font-bold hover:text-foreground transition-colors py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
