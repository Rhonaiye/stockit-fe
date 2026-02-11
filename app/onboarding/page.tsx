"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FiCheck,
    FiArrowRight,
    FiBriefcase,
    FiMapPin,
    FiUsers,
    FiBox,
    FiPhone,
    FiHash,
    FiZap,
    FiLayers,
    FiTarget,
    FiShield
} from "react-icons/fi";
import { useApp, Role } from "@/context/app-context";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
    const { currentUser, currentCompany, branches, addBranch, addUser, addProduct, refreshData, categories, seedCategories, updateCompany } = useApp();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form states
    const [companyInfo, setCompanyInfo] = useState({
        name: currentCompany?.name || '',
        businessNiche: 'General',
        phone: '',
        taxId: '',
        address: ''
    });

    const [branchData, setBranchData] = useState({ name: '', address: '' });
    const [staffData, setStaffData] = useState({ name: '', email: '', role: 'MANAGER' as Role });
    const [productData, setProductData] = useState({ name: '', category: '', costPrice: 0, sellingPrice: 0 });

    useEffect(() => {
        // Only redirect to dashboard if user has completed onboarding
        // (needsOnboarding is false AND they have at least one branch)
        if (currentUser && currentUser.needsOnboarding === false && branches.length > 0) {
            router.push('/dashboard');
        }
    }, [currentUser, branches, router]);

    const handleUpdateCompanyInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateCompany(companyInfo);
            await seedCategories(companyInfo.businessNiche);
            setStep(3);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await addBranch(branchData);
        await refreshData();
        setLoading(false);
        setStep(4);
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await addUser({ ...staffData, status: 'ACTIVE', branchId: branches[0]?._id || branches[0]?.id, password: 'password123' });
        setLoading(false);
        setStep(5);
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await addProduct({
            ...productData,
            category: productData.category || (categories[0]?.name || 'General'),
            sku: `SKU-${Math.floor(Math.random() * 100000)}`,
            branchId: branches[0]?._id || branches[0]?.id,
            initialStock: 10
        });
        setLoading(false);
        router.push('/dashboard');
    };

    const skipToFinish = () => {
        router.push('/dashboard');
    };

    if (!currentUser) return null;

    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-background flex relative overflow-hidden">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-[45%] bg-accent relative overflow-hidden flex-col justify-between p-12">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[80px] rounded-full -ml-32 -mb-32" />

                {/* Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center">
                            <FiZap className="text-accent text-2xl" />
                        </div>
                        <span className="text-white font-black text-2xl tracking-tight">Stockit</span>
                    </div>
                </div>

                {/* Central Content */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
                            Building Your<br />
                            <span className="text-white/60">Industrial Empire</span>
                        </h1>
                        <p className="text-white/60 text-lg mt-4 max-w-md font-medium">
                            Every great business starts with the right foundation. Let's configure your command center.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-4">
                        {[
                            { num: 1, label: 'Welcome', icon: FiZap },
                            { num: 2, label: 'Business Profile', icon: FiBriefcase },
                            { num: 3, label: 'Headquarters', icon: FiMapPin },
                            { num: 4, label: 'Team Setup', icon: FiUsers },
                            { num: 5, label: 'First Product', icon: FiBox }
                        ].map((s) => (
                            <div key={s.num} className={`flex items-center gap-4 transition-all ${step >= s.num ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${step > s.num ? 'bg-white text-accent' : step === s.num ? 'bg-white/20 text-white border-2 border-white' : 'bg-white/10 text-white/50'}`}>
                                    {step > s.num ? <FiCheck className="text-lg" /> : <s.icon className="text-lg" />}
                                </div>
                                <span className={`font-bold text-sm uppercase tracking-widest ${step === s.num ? 'text-white' : 'text-white/50'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                        <FiShield />
                        <span>256-bit Secure Onboarding</span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Forms */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-lg">
                    {/* Mobile Progress */}
                    <div className="lg:hidden mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center text-white">
                                <FiZap />
                            </div>
                            <span className="font-black text-xl">Stockit</span>
                        </div>
                        <div className="h-1 bg-border rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-accent"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-foreground-muted mt-2 font-bold uppercase tracking-widest">Step {step} of {totalSteps}</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-md">
                                        <FiTarget className="text-xs" /> Mission Control
                                    </div>
                                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                        Welcome aboard,<br />
                                        <span className="text-accent">{currentUser.name.split(' ')[0]}</span>
                                    </h1>
                                    <p className="text-foreground-muted text-lg font-medium max-w-md">
                                        You're 4 steps away from transforming how you manage inventory, sales, and growth.
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { icon: FiLayers, label: 'Multi-Branch', desc: 'Scale easily' },
                                        { icon: FiZap, label: 'Real-Time', desc: 'Instant sync' },
                                        { icon: FiShield, label: 'Secure', desc: 'Bank-grade' }
                                    ].map((f, i) => (
                                        <div key={i} className="p-4 bg-background-secondary border border-border rounded-md text-center space-y-2 hover:border-accent/40 transition-colors">
                                            <f.icon className="mx-auto text-accent text-xl" />
                                            <div className="text-xs font-black uppercase tracking-widest">{f.label}</div>
                                            <div className="text-[10px] text-foreground-muted font-bold">{f.desc}</div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="btn btn-primary w-full py-5 font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                                >
                                    Begin Setup <FiArrowRight />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black tracking-tight">Business Identity</h2>
                                    <p className="text-foreground-muted font-medium">Your official details for receipts and reports.</p>
                                </div>

                                <form onSubmit={handleUpdateCompanyInfo} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Legal Business Name</label>
                                        <div className="relative">
                                            <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                            <input required type="text" placeholder="e.g. Acme Stores Ltd."
                                                className="w-full border border-border rounded-md p-4 bg-background pl-12 outline-none focus:border-accent font-bold"
                                                value={companyInfo.name} onChange={e => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Industry</label>
                                            <select required
                                                className="w-full border border-border rounded-md p-4 bg-background outline-none focus:border-accent font-bold appearance-none"
                                                value={companyInfo.businessNiche}
                                                onChange={e => setCompanyInfo({ ...companyInfo, businessNiche: e.target.value })}
                                            >
                                                <option value="Pharmacy">Pharmacy</option>
                                                <option value="Supermarket">Supermarket</option>
                                                <option value="Boutique">Boutique</option>
                                                <option value="Electronics">Electronics</option>
                                                <option value="Restaurant">Restaurant</option>
                                                <option value="General">General</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Phone</label>
                                            <div className="relative">
                                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                                <input required type="tel" placeholder="+234..."
                                                    className="w-full border border-border rounded-md p-4 bg-background pl-12 outline-none focus:border-accent font-bold"
                                                    value={companyInfo.phone} onChange={e => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Tax ID / RC Number <span className="opacity-50">(Optional)</span></label>
                                        <div className="relative">
                                            <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                            <input type="text" placeholder="RC-1234567"
                                                className="w-full border border-border rounded-md p-4 bg-background pl-12 outline-none focus:border-accent font-bold"
                                                value={companyInfo.taxId} onChange={e => setCompanyInfo({ ...companyInfo, taxId: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button disabled={loading} className="btn btn-primary w-full py-4 font-black shadow-lg shadow-accent/20">
                                        {loading ? 'Processing...' : 'Continue'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black tracking-tight">Your Headquarters</h2>
                                    <p className="text-foreground-muted font-medium">Set up your primary business location.</p>
                                </div>

                                <form onSubmit={handleCreateBranch} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Branch Name</label>
                                        <input required type="text" placeholder="e.g. Head Office"
                                            className="w-full border border-border rounded-md p-4 bg-background outline-none focus:border-accent font-bold"
                                            value={branchData.name} onChange={e => setBranchData({ ...branchData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Physical Address</label>
                                        <input required type="text" placeholder="123 Victoria Island, Lagos"
                                            className="w-full border border-border rounded-md p-4 bg-background outline-none focus:border-accent font-medium"
                                            value={branchData.address} onChange={e => setBranchData({ ...branchData, address: e.target.value })}
                                        />
                                    </div>
                                    <button disabled={loading} className="btn btn-primary w-full py-4 font-black shadow-lg shadow-accent/20">
                                        {loading ? 'Creating Branch...' : 'Create & Continue'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black tracking-tight">Team Member</h2>
                                    <p className="text-foreground-muted font-medium">Invite a manager or staff to help run operations.</p>
                                </div>

                                <form onSubmit={handleAddStaff} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Full Name</label>
                                        <input required type="text" placeholder="John Manager"
                                            className="w-full border border-border rounded-md p-4 bg-background outline-none focus:border-accent font-bold"
                                            value={staffData.name} onChange={e => setStaffData({ ...staffData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Email Address</label>
                                        <input required type="email" placeholder="staff@company.com"
                                            className="w-full border border-border rounded-md p-4 bg-background outline-none focus:border-accent font-medium"
                                            value={staffData.email} onChange={e => setStaffData({ ...staffData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setStep(5)} className="flex-1 py-4 border border-border rounded-md text-foreground-muted font-bold hover:bg-background-secondary transition-colors">
                                            Skip
                                        </button>
                                        <button disabled={loading} className="btn btn-primary flex-[2] py-4 font-black shadow-lg shadow-accent/20">
                                            {loading ? 'Adding...' : 'Add & Continue'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black tracking-tight">First Product</h2>
                                    <p className="text-foreground-muted font-medium">Add your first inventory item to get started.</p>
                                </div>

                                <form onSubmit={handleAddProduct} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Product Name</label>
                                        <input required type="text" placeholder="e.g. Premium Widget"
                                            className="w-full border border-border rounded-md p-4 bg-background outline-none focus:border-accent font-black"
                                            value={productData.name} onChange={e => setProductData({ ...productData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Category</label>
                                        <select
                                            className="w-full border border-border rounded-md p-4 bg-background outline-none focus:border-accent font-bold appearance-none"
                                            value={productData.category}
                                            onChange={e => setProductData({ ...productData, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c._id || c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Cost Price (₦)</label>
                                            <input required type="number" min="0"
                                                className="w-full border border-border rounded-md p-4 bg-background outline-none focus:border-accent font-bold"
                                                value={productData.costPrice} onChange={e => setProductData({ ...productData, costPrice: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Selling Price (₦)</label>
                                            <input required type="number" min="0"
                                                className="w-full border border-border rounded-md p-4 bg-background outline-none focus:border-accent font-bold"
                                                value={productData.sellingPrice} onChange={e => setProductData({ ...productData, sellingPrice: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="button" onClick={skipToFinish} className="flex-1 py-4 border border-border rounded-md text-foreground-muted font-bold hover:bg-background-secondary transition-colors">
                                            Skip & Finish
                                        </button>
                                        <button disabled={loading} className="btn btn-primary flex-[2] py-4 font-black shadow-lg shadow-accent/20">
                                            {loading ? 'Launching...' : 'Launch Dashboard'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
