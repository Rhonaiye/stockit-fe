"use client";

import { useState, useEffect } from "react";
import {
    FiUser,
    FiShield,
    FiSave,
    FiMail,
    FiPhone,
    FiMapPin,
    FiDollarSign,
    FiPercent,
    FiBriefcase,
    FiCreditCard,
    FiSettings,
    FiBell,
    FiGlobe,
    FiUsers,
    FiPackage,
    FiCheckCircle,
    FiAlertCircle,
    FiArrowRight,
    FiTrash2,
    FiFileText
} from "react-icons/fi";
import { useApp } from "@/context/app-context";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
    const { currentCompany, currentUser, updateCompany, updateCompanySettings, deleteAccount, purgeWorkspace, loading: contextLoading } = useApp();
    const [activeTab, setActiveTab] = useState('company');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [purgeConfirmName, setPurgeConfirmName] = useState("");

    const [companyProfile, setCompanyProfile] = useState({
        name: currentCompany?.name || "",
        email: currentCompany?.email || "",
        phone: currentCompany?.phone || "",
        address: currentCompany?.address || "",
        currency: currentCompany?.currency || "NGN"
    });

    const [businessSettings, setBusinessSettings] = useState({
        lowStockThreshold: currentCompany?.settings?.lowStockThreshold || 10,
        receiptFooter: currentCompany?.settings?.receiptFooter || "Thank you for your business!",
        taxRate: currentCompany?.settings?.taxRate || 0,
        requireCustomerForSale: currentCompany?.settings?.requireCustomerForSale || false
    });

    const [receiptSettings, setReceiptSettings] = useState({
        receiptHeader: currentCompany?.settings?.receiptHeader || "",
        showLogoOnReceipt: currentCompany?.settings?.showLogoOnReceipt ?? true,
        receiptWidth: currentCompany?.settings?.receiptWidth || "80mm",
        showStoreAddress: currentCompany?.settings?.showStoreAddress ?? true,
        showStorePhone: currentCompany?.settings?.showStorePhone ?? true,
        showCustomerInfo: currentCompany?.settings?.showCustomerInfo ?? true,
        showSoldBy: currentCompany?.settings?.showSoldBy ?? true,
        receiptNote: currentCompany?.settings?.receiptNote || "",
        receiptFooter: currentCompany?.settings?.receiptFooter || "Thank you for your business!"
    });

    useEffect(() => {
        if (currentCompany) {
            setCompanyProfile({
                name: currentCompany.name || "",
                email: currentCompany.email || "",
                phone: currentCompany.phone || "",
                address: currentCompany.address || "",
                currency: currentCompany.currency || "NGN"
            });
            setBusinessSettings({
                lowStockThreshold: currentCompany.settings?.lowStockThreshold || 10,
                receiptFooter: currentCompany.settings?.receiptFooter || "Thank you for your business!",
                taxRate: currentCompany.settings?.taxRate || 0,
                requireCustomerForSale: currentCompany.settings?.requireCustomerForSale || false
            });
            setReceiptSettings({
                receiptHeader: currentCompany.settings?.receiptHeader || "",
                showLogoOnReceipt: currentCompany.settings?.showLogoOnReceipt ?? true,
                receiptWidth: currentCompany.settings?.receiptWidth || "80mm",
                showStoreAddress: currentCompany.settings?.showStoreAddress ?? true,
                showStorePhone: currentCompany.settings?.showStorePhone ?? true,
                showCustomerInfo: currentCompany.settings?.showCustomerInfo ?? true,
                showSoldBy: currentCompany.settings?.showSoldBy ?? true,
                receiptNote: currentCompany.settings?.receiptNote || "",
                receiptFooter: currentCompany.settings?.receiptFooter || "Thank you for your business!"
            });
        }
    }, [currentCompany]);

    const isOwner = currentUser?.role === 'OWNER';

    const handleUpdateCompany = async () => {
        if (!isOwner) return;
        setIsUpdating(true);
        try {
            await updateCompany(companyProfile);
            toast.success('Company profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update company profile.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateSettings = async () => {
        if (!isOwner) return;
        setIsUpdating(true);
        try {
            await updateCompanySettings(businessSettings);
            toast.success('Business settings updated successfully!');
        } catch (error) {
            toast.error('Failed to update business settings.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateReceiptSettings = async () => {
        if (!isOwner) return;
        setIsUpdating(true);
        try {
            await updateCompanySettings(receiptSettings);
            toast.success('Receipt settings updated successfully!');
        } catch (error) {
            toast.error('Failed to update receipt settings.');
        } finally {
            setIsUpdating(false);
        }
    };

    const tabs = [
        { id: 'company', label: 'Company Profile', icon: FiBriefcase, description: 'Workspace & branding' },
        { id: 'business', label: 'Workflow Controls', icon: FiSettings, description: 'Inventory & sales logic' },
        { id: 'receipt', label: 'Receipt Design', icon: FiFileText, description: 'Customize receipts' },
        { id: 'profile', label: 'Personal Identity', icon: FiUser, description: 'Security & preferences' },
        { id: 'billing', label: 'Global Subscription', icon: FiCreditCard, description: 'Plan & billing cycles' },
        { id: 'danger', label: 'Danger Zone', icon: FiShield, description: 'Account & data deletion' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">Global Interface</h1>
                    <p className="text-foreground-muted font-medium mt-1">Configure your industrial ecosystem and personal workspace.</p>
                </div>
                {isUpdating && (
                    <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 px-4 py-2 rounded-md">
                        <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">Pushing Updates...</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Navigation Sidebar */}
                <aside className="w-full lg:w-72 space-y-1 shrink-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted mb-4 ml-4">Workspace Categories</p>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full group text-left px-5 py-4 rounded-md transition-all flex items-center gap-4 relative ${activeTab === tab.id
                                ? "bg-accent/10 text-accent"
                                : "hover:bg-background-secondary text-foreground-muted hover:text-foreground"
                                }`}
                        >
                            <tab.icon className={`text-lg transition-transform ${activeTab === tab.id ? "scale-110" : "group-hover:scale-110"}`} />
                            <div>
                                <span className={`block text-sm font-black uppercase tracking-wider ${activeTab === tab.id ? "" : ""}`}>{tab.label}</span>
                                <span className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">{tab.description}</span>
                            </div>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 w-1 h-8 bg-accent rounded-r-full"
                                />
                            )}
                        </button>
                    ))}
                </aside>

                {/* Content Matrix */}
                <main className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Company Profile Section */}
                            {activeTab === 'company' && (
                                <div className="space-y-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-8">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight uppercase">Company Identity</h2>
                                            <p className="text-sm text-foreground-muted mt-1 font-medium">This identity is visible across all internal and external nodes.</p>
                                        </div>
                                        {isOwner && (
                                            <button
                                                onClick={handleUpdateCompany}
                                                disabled={isUpdating}
                                                className="btn btn-primary shadow-xl shadow-accent/20 px-8 py-3"
                                            >
                                                <FiSave className="text-lg" />
                                                <span>{isUpdating ? "Synchronizing..." : "Apply Config"}</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Registered Entity Name</label>
                                                <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                    <input
                                                        type="text"
                                                        value={companyProfile.name}
                                                        onChange={(e) => setCompanyProfile({ ...companyProfile, name: e.target.value })}
                                                        placeholder="e.g. Acme Corporation"
                                                        className="w-full bg-transparent px-5 py-4 text-sm font-bold outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Support Endpoint (Email)</label>
                                                <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                    <input
                                                        type="email"
                                                        value={companyProfile.email}
                                                        onChange={(e) => setCompanyProfile({ ...companyProfile, email: e.target.value })}
                                                        placeholder="legal@company.com"
                                                        className="w-full bg-transparent px-5 py-4 text-sm font-bold outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Direct Communication Channel</label>
                                                <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                    <input
                                                        type="tel"
                                                        value={companyProfile.phone}
                                                        onChange={(e) => setCompanyProfile({ ...companyProfile, phone: e.target.value })}
                                                        placeholder="+234 000 000 0000"
                                                        className="w-full bg-transparent px-5 py-4 text-sm font-bold outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Ecosystem Currency</label>
                                                <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors relative">
                                                    <select
                                                        value={companyProfile.currency}
                                                        onChange={(e) => setCompanyProfile({ ...companyProfile, currency: e.target.value })}
                                                        className="w-full bg-transparent px-5 py-4 text-sm font-black outline-none appearance-none uppercase"
                                                    >
                                                        <option value="NGN">NGN (₦) - Nigerian Naira</option>
                                                        <option value="USD">USD ($) - US Dollar</option>
                                                        <option value="GBP">GBP (£) - British Pound</option>
                                                    </select>
                                                    <FiArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Central HUB Address</label>
                                            <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                <input
                                                    type="text"
                                                    value={companyProfile.address}
                                                    onChange={(e) => setCompanyProfile({ ...companyProfile, address: e.target.value })}
                                                    placeholder="Enter HQ Address"
                                                    className="w-full bg-transparent px-5 py-4 text-sm font-bold outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Warning */}
                                    {!isOwner && (
                                        <div className="p-6 bg-error/5 border border-error/20 rounded-md flex gap-4">
                                            <FiShield className="text-error text-xl shrink-0 mt-1" />
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-wider text-error">Limited Authorization</h4>
                                                <p className="text-xs text-foreground-muted mt-1">You are currently in READ-ONLY mode. Only users with OWNER clearance can modify global workspace parameters.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Business Logic Section */}
                            {activeTab === 'business' && (
                                <div className="space-y-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-8">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight uppercase">Workflow Parameters</h2>
                                            <p className="text-sm text-foreground-muted mt-1 font-medium">Define the core execution rules for inventory and sales.</p>
                                        </div>
                                        {isOwner && (
                                            <button
                                                onClick={handleUpdateSettings}
                                                disabled={isUpdating}
                                                className="btn btn-primary shadow-xl shadow-accent/20 px-8 py-3"
                                            >
                                                <FiSave className="text-lg" />
                                                <span>{isUpdating ? "Synchronizing..." : "Apply Controls"}</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Critical Stock Level Alert</label>
                                            <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                <input
                                                    type="number"
                                                    value={businessSettings.lowStockThreshold}
                                                    onChange={(e) => setBusinessSettings({ ...businessSettings, lowStockThreshold: Number(e.target.value) })}
                                                    className="w-full bg-transparent px-5 py-4 text-sm font-black outline-none"
                                                />
                                            </div>
                                            <p className="text-[10px] text-foreground-muted font-bold pl-1">Visual alerts trigger when stock drops below this value.</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Industrial Tax Rate (%)</label>
                                            <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                <input
                                                    type="number"
                                                    value={businessSettings.taxRate}
                                                    onChange={(e) => setBusinessSettings({ ...businessSettings, taxRate: Number(e.target.value) })}
                                                    className="w-full bg-transparent px-5 py-4 text-sm font-black outline-none"
                                                />
                                            </div>
                                            <p className="text-[10px] text-foreground-muted font-bold pl-1">Automatically applied to all newly initiated sales transactions.</p>
                                        </div>

                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Receipt Terminal Footer</label>
                                            <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                <textarea
                                                    value={businessSettings.receiptFooter}
                                                    onChange={(e) => setBusinessSettings({ ...businessSettings, receiptFooter: e.target.value })}
                                                    className="w-full bg-transparent px-5 py-4 text-sm font-bold outline-none min-h-[120px] resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Toggles */}
                                    <div className="space-y-4 pt-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Operational Protocol</p>
                                        <div className="flex items-center justify-between p-7 bg-background-secondary border border-border rounded-md group hover:border-accent/40 transition-colors">
                                            <div className="flex items-center gap-5">
                                                <div className={`p-4 rounded-md transition-colors ${businessSettings.requireCustomerForSale ? "bg-accent text-white" : "bg-background border border-border text-foreground-muted"}`}>
                                                    <FiUsers className="text-xl" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-sm uppercase tracking-wider">Mandatory Customer Assignment</h4>
                                                    <p className="text-xs text-foreground-muted font-medium mt-0.5">Sale terminals will block checkout unless a customer is identified.</p>
                                                </div>
                                            </div>
                                            <button
                                                disabled={!isOwner}
                                                onClick={() => setBusinessSettings({ ...businessSettings, requireCustomerForSale: !businessSettings.requireCustomerForSale })}
                                                className={`w-14 h-7 rounded-full transition-all relative ${businessSettings.requireCustomerForSale ? 'bg-accent' : 'bg-background border border-border'} ${!isOwner ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            >
                                                <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all shadow-sm ${businessSettings.requireCustomerForSale ? 'bg-white left-8' : 'bg-foreground-muted/30 left-2'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Personal Profile Section */}
                            {activeTab === 'receipt' && (
                                <div className="space-y-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-8">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight uppercase">Receipt Design</h2>
                                            <p className="text-sm text-foreground-muted mt-1 font-medium">Customize how your receipts look when printed.</p>
                                        </div>
                                        {isOwner && (
                                            <button
                                                onClick={handleUpdateReceiptSettings}
                                                disabled={isUpdating}
                                                className="btn btn-primary shadow-xl shadow-accent/20 px-8 py-3"
                                            >
                                                <FiSave className="text-lg" />
                                                <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Receipt Header Text</label>
                                            <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                <input
                                                    type="text"
                                                    value={receiptSettings.receiptHeader}
                                                    onChange={(e) => setReceiptSettings({ ...receiptSettings, receiptHeader: e.target.value })}
                                                    placeholder="e.g. Official Sales Receipt"
                                                    className="w-full bg-transparent px-5 py-4 text-sm font-bold outline-none"
                                                />
                                            </div>
                                            <p className="text-[10px] text-foreground-muted font-bold pl-1">Appears below company name on receipt.</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Receipt Width</label>
                                            <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors relative">
                                                <select
                                                    value={receiptSettings.receiptWidth}
                                                    onChange={(e) => setReceiptSettings({ ...receiptSettings, receiptWidth: e.target.value })}
                                                    className="w-full bg-transparent px-5 py-4 text-sm font-black outline-none appearance-none"
                                                >
                                                    <option value="58mm">58mm (Small POS)</option>
                                                    <option value="80mm">80mm (Standard)</option>
                                                    <option value="A4">A4 (Full Page)</option>
                                                </select>
                                                <FiArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 rotate-90" />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Receipt Footer Message</label>
                                            <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                <textarea
                                                    value={receiptSettings.receiptFooter}
                                                    onChange={(e) => setReceiptSettings({ ...receiptSettings, receiptFooter: e.target.value })}
                                                    placeholder="Thank you for your business!"
                                                    className="w-full bg-transparent px-5 py-4 text-sm font-bold outline-none min-h-[80px] resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Additional Note</label>
                                            <div className="group border border-border rounded-md bg-background focus-within:border-accent transition-colors">
                                                <textarea
                                                    value={receiptSettings.receiptNote}
                                                    onChange={(e) => setReceiptSettings({ ...receiptSettings, receiptNote: e.target.value })}
                                                    placeholder="e.g. No returns after 7 days. Terms apply."
                                                    className="w-full bg-transparent px-5 py-4 text-sm font-bold outline-none min-h-[80px] resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Toggle Options */}
                                    <div className="space-y-4 pt-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Display Options</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { key: 'showLogoOnReceipt', label: 'Show Company Logo', desc: 'Display your logo at the top of receipts' },
                                                { key: 'showStoreAddress', label: 'Show Store Address', desc: 'Include your business address' },
                                                { key: 'showStorePhone', label: 'Show Store Phone', desc: 'Display contact phone number' },
                                                { key: 'showCustomerInfo', label: 'Show Customer Info', desc: 'Include customer name if available' },
                                                { key: 'showSoldBy', label: 'Show Cashier Name', desc: 'Display who processed the sale' },
                                            ].map((toggle) => (
                                                <div key={toggle.key} className="flex items-center justify-between p-5 bg-background-secondary border border-border rounded-md group hover:border-accent/40 transition-colors">
                                                    <div>
                                                        <h4 className="font-black text-xs uppercase tracking-wider">{toggle.label}</h4>
                                                        <p className="text-[10px] text-foreground-muted font-medium mt-0.5">{toggle.desc}</p>
                                                    </div>
                                                    <button
                                                        disabled={!isOwner}
                                                        onClick={() => setReceiptSettings({ ...receiptSettings, [toggle.key]: !receiptSettings[toggle.key as keyof typeof receiptSettings] })}
                                                        className={`w-12 h-6 rounded-full transition-all relative ${receiptSettings[toggle.key as keyof typeof receiptSettings] ? 'bg-accent' : 'bg-background border border-border'} ${!isOwner ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all shadow-sm ${receiptSettings[toggle.key as keyof typeof receiptSettings] ? 'bg-white left-7' : 'bg-foreground-muted/30 left-1'}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Security Warning */}
                                    {!isOwner && (
                                        <div className="p-6 bg-error/5 border border-error/20 rounded-md flex gap-4">
                                            <FiShield className="text-error text-xl shrink-0 mt-1" />
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-wider text-error">Limited Authorization</h4>
                                                <p className="text-xs text-foreground-muted mt-1">Only users with OWNER clearance can modify receipt settings.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Personal Profile Section */}
                            {activeTab === 'profile' && (
                                <div className="space-y-10">
                                    <div className="border-b border-border pb-8">
                                        <h2 className="text-2xl font-black tracking-tight uppercase">Identity Node</h2>
                                        <p className="text-sm text-foreground-muted mt-1 font-medium">Your personal digital signature and security markers.</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 p-10 bg-background-secondary border border-border rounded-md">
                                        <div className="relative group">
                                            <div className="w-24 h-24 bg-accent rounded-md flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-accent/30 group-hover:rotate-6 transition-transform">
                                                {currentUser?.name?.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success border-4 border-background-secondary rounded-full" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h4 className="text-2xl font-black uppercase tracking-tighter">{currentUser?.name}</h4>
                                                <p className="text-xs font-black text-accent uppercase tracking-[0.2em] mt-1">{currentUser?.role}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-3 pt-2">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                                                    <FiMail /> {currentUser?.email}
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                                                    <FiPhone /> {currentUser?.phone || "No Phone Connected"}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-secondary px-6 shrink-0 font-black tracking-widest uppercase text-[10px]">Update Bio</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">Legal Name (Read Only)</label>
                                            <div className="border border-border rounded-md bg-background-secondary p-4 text-sm font-bold opacity-60">
                                                {currentUser?.name}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">System Privilege Line</label>
                                            <div className="border border-border rounded-md bg-background-secondary p-4 text-sm font-black text-accent uppercase">
                                                {currentUser?.role} LEVEL CLEARANCE
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Billing & Plans Section */}
                            {activeTab === 'billing' && (
                                <div className="space-y-10">
                                    <div className="border-b border-border pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight uppercase">Global Subscription</h2>
                                            <p className="text-sm text-foreground-muted mt-1 font-medium">Plan management and ecosystem utilization metrics.</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success border border-success/20 rounded-full">
                                            <FiCheckCircle className="text-sm" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Account Healthy</span>
                                        </div>
                                    </div>

                                    {/* Active Plan High-Impact Card */}
                                    <div className="bg-accent rounded-md p-1 bg-[linear-gradient(135deg,var(--accent),#1d4ed8)] shadow-2xl shadow-accent/20">
                                        <div className="bg-background rounded-[calc(var(--radius-md)-2px)] p-10 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[80px] -mr-40 -mt-40 rounded-full" />

                                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                                                <div className="space-y-6">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-md">
                                                        Active Plan
                                                    </div>
                                                    <div>
                                                        <h3 className="text-5xl font-black tracking-tighter uppercase text-accent">{currentCompany?.subscriptionPlan || "LIFETIME"} PRO</h3>
                                                        <p className="text-foreground-muted font-bold mt-2 uppercase tracking-widest text-xs">Full Industrial License Granted</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Unlimited Transactions', 'Multi-Node Access', '24/7 Core Support', 'Advanced Analytics'].map(feature => (
                                                            <div key={feature} className="flex items-center gap-2 px-3 py-1.5 bg-background-secondary border border-border rounded-md text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                                                                <FiCheckCircle className="text-accent" /> {feature}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="w-full lg:w-fit space-y-4 pt-6 lg:pt-0">
                                                    <div className="border border-border rounded-md p-6 bg-background-secondary">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted mb-4 text-center">Renewal Projection</p>
                                                        <div className="text-center font-black text-2xl tracking-tighter">₦0.00 / MONTH</div>
                                                        <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-1 text-center italic">LIFETIME ACCESS GRANTED</p>
                                                    </div>
                                                    <button className="w-full btn btn-primary py-4 font-black shadow-lg shadow-accent/20">Expand License</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Usage Metrics */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                                        {[
                                            { label: 'Staff Nodes', icon: FiUsers, current: '2', limit: '5', color: 'bg-accent' },
                                            { label: 'Branch Access', icon: FiMapPin, current: '1', limit: '1', color: 'bg-error' },
                                            { label: 'Inventory SKU', icon: FiPackage, current: '48', limit: '500', color: 'bg-success' },
                                        ].map((metric) => {
                                            const percentage = (Number(metric.current) / Number(metric.limit)) * 100;
                                            return (
                                                <div key={metric.label} className="p-6 bg-background-secondary border border-border rounded-md group hover:border-accent/40 transition-colors">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="p-3 bg-background border border-border rounded-md text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                                            <metric.icon className="text-xl" />
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-black uppercase tracking-widest opacity-40">{metric.label}</span>
                                                            <h4 className="text-xl font-black block leading-none mt-1">{metric.current} <span className="text-xs opacity-20">/ {metric.limit}</span></h4>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-background border border-border rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${metric.color}`}
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                        {activeTab === 'danger' && (
                            <motion.div
                                key="danger"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                <div className="p-10 border border-error/30 bg-error/5 rounded-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-error/5 blur-[60px] -mr-32 -mt-32 rounded-full" />

                                    <div className="flex items-center gap-6 mb-10 relative z-10">
                                        <div className="w-16 h-16 rounded-md bg-error flex items-center justify-center text-white shadow-xl shadow-error/20">
                                            <FiShield size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black tracking-tight text-error uppercase">Terminal Command Center</h3>
                                            <p className="text-sm text-foreground-muted font-bold tracking-widest uppercase mt-1 opacity-60">Critical Data Ecosystem Controls</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 relative z-10">
                                        {/* Account Deletion - Only for non-owners */}
                                        {!isOwner && (
                                            <div className="p-8 bg-background border border-border rounded-md hover:border-error/50 transition-all group">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                                    <div className="space-y-2">
                                                        <h4 className="text-xl font-black uppercase tracking-tight">Deactivate Personal Identity</h4>
                                                        <p className="text-sm text-foreground-muted max-w-lg">Permanently delete your profile and access credentials. This will not affect other members of your team or global workspace data.</p>
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm("IDENTITY DELETION: Are you absolutely certain you want to destroy your account? This action is irreversible.")) {
                                                                try {
                                                                    await deleteAccount();
                                                                    toast.success("Profile Destroyed. Logged out.");
                                                                } catch (err: any) {
                                                                    toast.error(err.message);
                                                                }
                                                            }
                                                        }}
                                                        className="w-full md:w-fit px-8 py-3 bg-background border-2 border-error text-error font-black text-xs uppercase tracking-[0.2em] rounded-md hover:bg-error hover:text-white transition-all shadow-lg"
                                                    >
                                                        Delete Account
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {isOwner && (
                                            <div className="p-8 bg-error/10 border-2 border-error/20 rounded-md">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                                    <div className="space-y-2">
                                                        <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-error text-white text-[10px] font-black uppercase tracking-widest rounded mb-2">
                                                            Nuclear Option
                                                        </div>
                                                        <h4 className="text-xl font-black uppercase tracking-tight text-error">Purge Workspace Ecosystem</h4>
                                                        <p className="text-sm text-foreground-muted max-w-lg">Permanently delete {currentCompany?.name} and all associated data. This includes all inventory, sales records, staff profiles, and branch configurations.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setIsPurgeModalOpen(true)}
                                                        className="w-full md:w-fit px-8 py-4 bg-error text-white font-black text-xs uppercase tracking-[0.3em] rounded-md hover:bg-black transition-all shadow-2xl shadow-error/40 hover:scale-105 active:scale-95"
                                                    >
                                                        Purge Workspace
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-10 text-center border border-dashed border-border rounded-md">
                                    <FiTrash2 className="mx-auto text-3xl text-foreground-muted mb-4 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground-muted">Data Integrity Protection: Authorized Access Required</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Global Purge Modal */}
            <AnimatePresence>
                {isPurgeModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-lg bg-background border-2 border-error rounded-md overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                        >
                            <div className="bg-error p-6 text-white flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center">
                                    <FiAlertCircle size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Security Authorization</h2>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Workspace Destruction Protocol</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <p className="text-sm font-medium text-foreground-muted leading-relaxed">
                                    You are about to initiate a <span className="text-error font-black uppercase">Permanent Global Purge</span> of <span className="text-foreground font-black italic">"{currentCompany?.name}"</span>.
                                    This will destroy all inventory, sales history, and staff access credentials across all nodes.
                                </p>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-error">Type the workspace name to authorize:</label>
                                    <div className="group border-2 border-error/20 rounded-md bg-background focus-within:border-error transition-colors">
                                        <input
                                            type="text"
                                            value={purgeConfirmName}
                                            onChange={(e) => setPurgeConfirmName(e.target.value)}
                                            placeholder={currentCompany?.name}
                                            className="w-full bg-transparent px-5 py-4 text-sm font-black outline-none text-error"
                                        />
                                    </div>
                                    <p className="text-[9px] font-bold text-foreground-muted uppercase tracking-tighter">Case-sensitive identifier: {currentCompany?.name}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                                    <button
                                        onClick={() => {
                                            setIsPurgeModalOpen(false);
                                            setPurgeConfirmName("");
                                        }}
                                        className="flex-1 px-6 py-3 border border-border rounded-md text-xs font-black uppercase tracking-widest hover:bg-background-secondary transition-colors"
                                    >
                                        Abort Mission
                                    </button>
                                    <button
                                        disabled={purgeConfirmName !== currentCompany?.name}
                                        onClick={async () => {
                                            try {
                                                await purgeWorkspace();
                                                toast.success("Ecosystem Purged. Redirecting...");
                                            } catch (err: any) {
                                                toast.error(err.message);
                                                setIsPurgeModalOpen(false);
                                            }
                                        }}
                                        className="flex-1 px-6 py-3 bg-error text-white rounded-md text-xs font-black uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:bg-black transition-all shadow-xl shadow-error/20"
                                    >
                                        Confirm Destruction
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
