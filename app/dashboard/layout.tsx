"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiBox,
    FiShoppingCart,
    FiUsers,
    FiPieChart,
    FiSettings,
    FiBell,
    FiSearch,
    FiMenu,
    FiX,
    FiLogOut,
    FiChevronDown,
    FiList,
    FiShield,
    FiLayers,
    FiUserCheck,
    FiTruck,
    FiSun,
    FiMoon,
    FiLock
} from "react-icons/fi";
import { useApp, Role } from "@/context/app-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";


// Define Nav Items with Role Restrictions
interface NavItem {
    icon: any;
    label: string;
    href?: string;
    roles?: Role[]; // If undefined, available to all
    children?: { label: string; href: string; roles?: Role[] }[];
}

interface NavGroup {
    group: string;
    items: NavItem[];
}

const SIDEBAR_GROUPS: NavGroup[] = [
    {
        group: "Main",
        items: [
            { icon: FiHome, label: "Overview", href: "/dashboard" },
        ]
    },
    {
        group: "Operations",
        items: [
            { icon: FiBox, label: "Inventory", href: "/dashboard/inventory" },
            { icon: FiShoppingCart, label: "Sales & POS", href: "/dashboard/sales" },
            { icon: FiTruck, label: "Purchases", href: "/dashboard/purchases", roles: ['OWNER', 'MANAGER'] },
            {
                icon: FiList,
                label: "Sales History",
                href: "/dashboard/orders",
                children: [
                    { label: "All Sales", href: "/dashboard/orders" },
                    { label: "Transfer Sales", href: "/dashboard/orders/transfer" },
                    { label: "Cash Sales", href: "/dashboard/orders/cash" },
                    { label: "POS Sales", href: "/dashboard/orders/pos" },
                    { label: "Credit Sales", href: "/dashboard/orders/credit" },
                ]
            },
        ]
    },
    {
        group: "Relations",
        items: [
            { icon: FiUserCheck, label: "Customers", href: "/dashboard/customers" },
            { icon: FiTruck, label: "Suppliers", href: "/dashboard/suppliers", roles: ['OWNER', 'MANAGER'] },
        ]
    },
    {
        group: "Insights",
        items: [
            { icon: FiPieChart, label: "Reports", href: "/dashboard/reports", roles: ['OWNER', 'MANAGER'] },
            { icon: FiShield, label: "Audit Logs", href: "/dashboard/audit-logs", roles: ['OWNER', 'ADMIN'] },
        ]
    },
    {
        group: "Team",
        items: [
            { icon: FiUsers, label: "Staff", href: "/dashboard/users", roles: ['OWNER', 'MANAGER'] },
        ]
    },
    {
        group: "Workspace",
        items: [
            { icon: FiLayers, label: "Branches", href: "/dashboard/branches", roles: ['OWNER'] },
            { icon: FiSettings, label: "Global Settings", href: "/dashboard/settings", roles: ['OWNER'] },
        ]
    }
];


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const { currentUser, currentBranch, branches, switchBranch, logout, loading } = useApp();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auth Guard & Onboarding Check
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('stockit_token') : null;
        if (!currentUser && !token) {
            router.push('/login');
            return;
        }

        // If logged in but needs onboarding, take to onboarding
        if (currentUser && currentUser.needsOnboarding && branches.length === 0) {
            router.push('/onboarding');
        }
    }, [currentUser, branches, loading, router]);

    if (!currentUser) return null;

    const isRoleAllowed = (roles?: Role[]) => !roles || roles.includes(currentUser.role);

    return (
        <div className="min-h-screen bg-background-secondary flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-background border-r border-border transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"
                    } hidden md:flex flex-col shadow-2xl shadow-black/5`}
            >
                <div className="h-20 flex items-center px-6 border-b border-border">
                    <div className="w-9 h-9 bg-accent rounded-md flex items-center justify-center shrink-0 shadow-lg shadow-accent/10">
                        <span className="text-white font-black text-lg">S</span>
                    </div>
                    {isSidebarOpen && (
                        <div className="ml-3">
                            <span className="block font-black text-xl tracking-tighter leading-none">StockIt</span>
                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none mt-1 block">Management</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 py-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
                    {SIDEBAR_GROUPS.map((group) => {
                        const visibleItems = group.items.filter(item => isRoleAllowed(item.roles));
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={group.group} className="space-y-2">
                                {isSidebarOpen && (
                                    <h5 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted/50 mb-3">
                                        {group.group}
                                    </h5>
                                )}
                                <div className="space-y-1">
                                    {visibleItems.map((item) => (
                                        <SidebarItem
                                            key={item.label}
                                            item={item}
                                            pathname={pathname}
                                            isSidebarOpen={isSidebarOpen}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => { logout(); router.push('/login'); }}
                        className={`flex items-center w-full px-4 py-2.5 rounded-md text-error hover:bg-error/5 transition-all group ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <FiLogOut className="w-5 h-5 transition-transform" />
                        {isSidebarOpen && <span className="ml-3 font-bold text-sm">Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
                {/* Top Header */}
                <header className="h-20 bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden md:flex p-2.5 hover:bg-background-secondary rounded-md text-foreground-muted transition-colors border border-transparent hover:border-border"
                        >
                            <FiMenu className="w-5 h-5" />
                        </button>
                        {/* Mobile Menu Toggle */}
                        <button className="md:hidden p-2 text-foreground" onClick={() => setIsSidebarOpen(true)}>
                            <FiMenu className="w-5 h-5" />
                        </button>


                        {/* Branch Switcher & Search */}
                        <div className="hidden lg:flex items-center gap-6">
                            {/* Branch Selector */}
                            <div className="relative group">
                                {currentUser.branchId ? (
                                    <div className="flex items-center gap-3 px-5 py-2.5 bg-background-secondary rounded-md border border-border text-xs font-black uppercase tracking-wider min-w-[180px] shadow-inner opacity-80 cursor-not-allowed">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                            {currentBranch?.name || "Assigned Branch"}
                                        </div>
                                        <FiLock className="text-foreground-muted" />
                                    </div>
                                ) : (
                                    <>
                                        <button className="flex items-center gap-3 px-5 py-2.5 bg-background-secondary rounded-md border border-border text-xs font-black uppercase tracking-wider min-w-[180px] justify-between transition-all hover:border-accent/30 shadow-inner">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                                {currentBranch?.name || "Select Branch"}
                                            </div>
                                            <FiChevronDown className="group-hover:rotate-180 transition-transform" />
                                        </button>
                                        <div className="absolute top-full left-0 w-64 pt-3 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                            <div className="bg-card border border-border rounded-md shadow-2xl overflow-hidden">
                                                <div className="px-4 py-3 bg-background-secondary/50 border-b border-border">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Active Branches</p>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                    {branches.map(b => (
                                                        <button
                                                            key={b._id || b.id}
                                                            onClick={() => switchBranch(b._id || b.id)}
                                                            className={`w-full text-left px-5 py-4 text-sm hover:bg-background-secondary font-bold transition-colors flex items-center justify-between ${(currentBranch?._id || currentBranch?.id) === (b._id || b.id) ? 'text-accent bg-accent/5' : 'text-foreground-muted'}`}
                                                        >
                                                            {b.name}
                                                            {(currentBranch?._id || currentBranch?.id) === (b._id || b.id) && <FiCheckCircle className="w-4 h-4" />}
                                                        </button>
                                                    ))}
                                                </div>
                                                {currentUser.role === 'OWNER' && (
                                                    <Link href="/dashboard/branches" className="block w-full text-center px-4 py-4 text-xs font-black uppercase tracking-wider bg-accent text-white hover:bg-accent-dark transition-colors">
                                                        + Manage Branches
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center bg-background-secondary rounded-md px-5 py-2.5 border border-border focus-within:border-accent w-80 transition-all shadow-inner focus-within:shadow-lg focus-within:shadow-accent/5">
                                <FiSearch className="text-foreground-muted" />
                                <input
                                    type="text"
                                    placeholder="Jump to products, sales, customers..."
                                    className="bg-transparent border-none outline-none text-sm ml-3 w-full placeholder:text-foreground-muted/40 font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-10 h-10 flex items-center justify-center bg-background-secondary rounded-xl hover:bg-border transition-all group border border-transparent hover:border-border relative overflow-hidden"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            <AnimatePresence mode="wait">
                                {mounted && (
                                    <motion.div
                                        key={theme}
                                        initial={{ y: 20, opacity: 0, rotate: 45 }}
                                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                                        exit={{ y: -20, opacity: 0, rotate: -45 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        {theme === 'dark' ? (
                                            <FiSun className="w-5 h-5 text-accent" />
                                        ) : (
                                            <FiMoon className="w-5 h-5 text-foreground-muted group-hover:text-foreground" />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        <button className="w-10 h-10 flex items-center justify-center relative bg-background-secondary rounded-xl hover:bg-border transition-all group">
                            <FiBell className="w-5 h-5 text-foreground-muted group-hover:text-foreground" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-background animate-pulse"></span>
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l border-border h-10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black leading-none mb-1">{currentUser?.name || 'User'}</p>
                                <p className="text-[10px] font-black uppercase tracking-wider text-accent bg-accent/5 px-2 py-0.5 rounded-full inline-block">{currentUser?.role || 'Staff'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>

            {/* Mobile Drawer */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden bg-black/60" onClick={() => setIsSidebarOpen(false)}>
                    <motion.div
                        initial={{ x: -260 }}
                        animate={{ x: 0 }}
                        className="w-72 h-full bg-background flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-20 flex justify-between items-center px-6 border-b border-border">
                            <span className="font-black text-2xl tracking-tighter">StockIt</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-background-secondary rounded-md">
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">
                            {SIDEBAR_GROUPS.map((group) => {
                                const visibleItems = group.items.filter(item => isRoleAllowed(item.roles));
                                if (visibleItems.length === 0) return null;

                                return (
                                    <div key={group.group} className="space-y-3">
                                        <h5 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted/50">
                                            {group.group}
                                        </h5>
                                        <div className="space-y-1">
                                            {visibleItems.map((item) => (
                                                <SidebarItem
                                                    key={item.label}
                                                    item={item}
                                                    pathname={pathname}
                                                    isSidebarOpen={true}
                                                    onMobileClick={() => setIsSidebarOpen(false)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-border space-y-2">
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="flex items-center w-full px-4 py-3 rounded-xl bg-background-secondary text-foreground hover:bg-border transition-all"
                            >
                                {mounted && (
                                    <>
                                        {theme === 'dark' ? (
                                            <FiSun className="w-5 h-5 text-accent mr-3" />
                                        ) : (
                                            <FiMoon className="w-5 h-5 text-foreground-muted mr-3" />
                                        )}
                                        <span className="font-bold text-sm">
                                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                        </span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => { logout(); router.push('/login'); }}
                                className="flex items-center w-full px-4 py-3 rounded-xl text-error hover:bg-error/5 transition-all"
                            >
                                <FiLogOut className="w-5 h-5 mr-3" />
                                <span className="font-bold text-sm">Log Out</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function SidebarItem({ item, pathname, isSidebarOpen, onMobileClick }: { item: NavItem, pathname: string, isSidebarOpen: boolean, onMobileClick?: () => void }) {
    const hasChildren = item.children && item.children.length > 0;
    const isParentActive = pathname === item.href || item.children?.some(child => pathname === child.href);
    const [isOpen, setIsOpen] = useState(isParentActive);

    useEffect(() => {
        if (isParentActive) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [pathname, isParentActive]);

    const handleClick = () => {
        if (!hasChildren && onMobileClick) onMobileClick();
        if (hasChildren) setIsOpen(!isOpen);
    };

    return (
        <div className="space-y-1">
            {item.href ? (
                <Link
                    href={item.href}
                    onClick={handleClick}
                    className={`flex items-center px-4 py-2.5 rounded-md transition-all group relative ${isParentActive
                        ? "bg-accent/10 text-accent font-bold"
                        : "text-foreground-muted hover:bg-background-secondary hover:text-foreground"
                        }`}
                >
                    <item.icon className={`w-5 h-5 shrink-0 transition-all ${isParentActive ? "text-accent" : "group-hover:text-accent"}`} />
                    {isSidebarOpen && <span className="ml-3 text-sm">{item.label}</span>}
                    {isParentActive && (
                        <div className="absolute left-0 w-1 h-5 bg-accent rounded-r-full" />
                    )}
                </Link>
            ) : (
                <button
                    onClick={handleClick}
                    className={`w-full flex items-center px-4 py-2.5 rounded-md transition-all group relative ${isParentActive
                        ? "text-accent font-bold"
                        : "text-foreground-muted hover:bg-background-secondary hover:text-foreground"
                        }`}
                >
                    <item.icon className={`w-5 h-5 shrink-0 transition-all ${isParentActive ? "text-accent" : "group-hover:text-accent"}`} />
                    {isSidebarOpen && (
                        <>
                            <span className="ml-3 text-sm flex-1 text-left">{item.label}</span>
                            <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </>
                    )}
                </button>
            )}

            {hasChildren && isSidebarOpen && isOpen && (
                <div className="ml-9 space-y-1 border-l border-border pl-2 mt-1">
                    {item.children!.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                            <Link
                                key={child.href}
                                href={child.href}
                                onClick={onMobileClick}
                                className={`block px-4 py-2 text-xs rounded-md transition-all ${isChildActive
                                    ? "text-accent font-black bg-accent/5"
                                    : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
                                    }`}
                            >
                                {child.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Additional Icons
function FiCheckCircle(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
}
