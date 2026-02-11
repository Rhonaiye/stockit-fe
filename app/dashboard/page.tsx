"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    FiTrendingUp,
    FiTrendingDown,
    FiBox,
    FiDollarSign,
    FiAlertCircle,
    FiShoppingBag,
    FiArrowRight,
    FiUsers,
    FiPlusCircle,
    FiActivity,
    FiZap,
    FiCalendar,
    FiCreditCard,
    FiPackage,
    FiFilter
} from "react-icons/fi";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import { useApp, Branch } from "@/context/app-context";
import { format, isToday, isThisWeek, isThisMonth, startOfDay, subDays } from "date-fns";
import Link from "next/link";
import { useState, useMemo } from "react";

type ViewMode = 'current_branch' | 'all_branches';

const StatCard = ({ title, value, subValue, icon: Icon, iconColor = 'text-accent' }: {
    title: string;
    value: string | number;
    subValue?: string;
    icon: any;
    iconColor?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden group hover:border-accent/30 transition-all"
    >
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-accent/10 shrink-0`}>
                <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground-muted font-medium mb-0.5 truncate">{title}</p>
                <p className="text-2xl font-black tracking-tight truncate">{value}</p>
                {subValue && <p className="text-[11px] text-foreground-muted truncate">{subValue}</p>}
            </div>
        </div>
    </motion.div>
);

export default function DashboardPage() {
    const { sales, products, currentBranch, branches, loading, customers, currentUser } = useApp();
    const [viewMode, setViewMode] = useState<ViewMode>('current_branch');



    const branchKey = (currentBranch?._id || currentBranch?.id) || "";

    // Filter sales based on view mode
    const filteredSales = useMemo(() => {
        if (viewMode === 'all_branches') {
            return sales;
        }
        return sales.filter(s => s.branchId === branchKey);
    }, [sales, viewMode, branchKey]);

    // Filter products based on view mode
    const filteredProducts = useMemo(() => {
        if (viewMode === 'all_branches') {
            return products;
        }
        return products.filter(p => !p.branchId || p.branchId === branchKey);
    }, [products, viewMode, branchKey]);

    // === KEY METRICS ===
    const totalRevenue = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalSalesCount = filteredSales.length;
    const totalItemsSold = filteredSales.reduce((acc, s) => acc + s.items.reduce((a, i) => a + i.quantity, 0), 0);

    // Today's metrics
    const todaySales = filteredSales.filter(s => isToday(new Date(s.createdAt || "")));
    const todayRevenue = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
    const todaySalesCount = todaySales.length;

    // This week's metrics
    const weekSales = filteredSales.filter(s => isThisWeek(new Date(s.createdAt || "")));
    const weekRevenue = weekSales.reduce((acc, s) => acc + s.totalAmount, 0);

    // Payment method breakdown (today)
    const cashSalesToday = todaySales.filter(s => s.paymentMethod === 'CASH').reduce((acc, s) => acc + s.totalAmount, 0);
    const posSalesToday = todaySales.filter(s => s.paymentMethod === 'POS').reduce((acc, s) => acc + s.totalAmount, 0);
    const transferSalesToday = todaySales.filter(s => s.paymentMethod === 'TRANSFER').reduce((acc, s) => acc + s.totalAmount, 0);
    const creditSalesToday = todaySales.filter(s => s.paymentMethod === 'CREDIT').reduce((acc, s) => acc + s.totalAmount, 0);

    // Stock metrics
    const totalProductsInStock = viewMode === 'all_branches'
        ? filteredProducts.reduce((acc, p) => {
            const totalStock = Object.values(p.stock || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
            return acc + totalStock;
        }, 0)
        : filteredProducts.reduce((acc, p) => acc + (p.stock?.[branchKey] || 0), 0);

    const lowStockProducts = viewMode === 'all_branches'
        ? filteredProducts.filter(p => {
            const totalStock = Object.values(p.stock || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
            return totalStock <= (p.minStockLevel || 5);
        })
        : filteredProducts.filter(p => (p.stock?.[branchKey] || 0) <= (p.minStockLevel || 5));

    const outOfStockProducts = viewMode === 'all_branches'
        ? filteredProducts.filter(p => {
            const totalStock = Object.values(p.stock || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
            return totalStock === 0;
        })
        : filteredProducts.filter(p => (p.stock?.[branchKey] || 0) === 0);

    // Top selling products (all time)
    const productSalesMap: Record<string, { name: string, quantity: number, revenue: number }> = {};
    filteredSales.forEach(sale => {
        sale.items.forEach(item => {
            const key = item.productId || item.productName;
            if (!productSalesMap[key]) {
                productSalesMap[key] = { name: item.productName, quantity: 0, revenue: 0 };
            }
            productSalesMap[key].quantity += item.quantity;
            productSalesMap[key].revenue += item.price * item.quantity;
        });
    });
    const topSellingProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Revenue by day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayStart = startOfDay(date);
        const daySales = filteredSales.filter(s => {
            const saleDate = startOfDay(new Date(s.createdAt || ""));
            return saleDate.getTime() === dayStart.getTime();
        });
        return {
            name: format(date, 'EEE'),
            date: format(date, 'dd MMM'),
            revenue: daySales.reduce((acc, s) => acc + s.totalAmount, 0),
            count: daySales.length
        };
    });

    // Recent transactions
    const recentTransactions = filteredSales.slice(-10).reverse();

    // Branch breakdown (only for all_branches view)
    const branchBreakdown = useMemo(() => {
        if (viewMode !== 'all_branches') return [];
        return branches.map(branch => {
            const bKey = branch._id || branch.id;
            const bSales = sales.filter(s => s.branchId === bKey);
            const bRevenue = bSales.reduce((acc, s) => acc + s.totalAmount, 0);
            const bTodaySales = bSales.filter(s => isToday(new Date(s.createdAt || "")));
            const bTodayRevenue = bTodaySales.reduce((acc, s) => acc + s.totalAmount, 0);
            return {
                name: branch.name,
                totalRevenue: bRevenue,
                todayRevenue: bTodayRevenue,
                salesCount: bSales.length,
                todaySalesCount: bTodaySales.length
            };
        }).sort((a, b) => b.totalRevenue - a.totalRevenue);
    }, [branches, sales, viewMode]);

    if (loading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-accent/10 border-t-accent rounded-full animate-spin" />
                <FiZap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent animate-pulse" />
            </div>
            <div className="space-y-2 text-center">
                <p className="text-foreground font-bold text-sm">Loading Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Business Overview</h1>
                    <p className="text-foreground-muted text-sm mt-1">
                        {viewMode === 'current_branch'
                            ? <>Viewing data for <span className="font-bold text-accent">{currentBranch?.name}</span></>
                            : <>Viewing data for <span className="font-bold text-accent">All Branches</span></>
                        }
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-background-secondary rounded-xl p-1 border border-border">
                        <button
                            onClick={() => setViewMode('current_branch')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'current_branch' ? 'bg-accent text-white shadow-md' : 'text-foreground-muted hover:text-foreground'}`}
                        >
                            {currentBranch?.name || 'Current Branch'}
                        </button>
                        {!currentUser?.branchId && (
                            <button
                                onClick={() => setViewMode('all_branches')}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'all_branches' ? 'bg-accent text-white shadow-md' : 'text-foreground-muted hover:text-foreground'}`}
                            >
                                All Branches
                            </button>
                        )}
                    </div>

                    <Link href="/dashboard/sales" className="h-11 px-6 bg-accent text-white rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-accent/30 hover:-translate-y-0.5 transition-all">
                        <FiPlusCircle strokeWidth={2.5} /> New Sale
                    </Link>
                </div>
            </header>

            {/* Key Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                    title="Today's Revenue"
                    value={`₦${todayRevenue.toLocaleString()}`}
                    subValue={`${todaySalesCount} sales`}
                    icon={FiDollarSign}
                    iconColor="text-accent"
                />
                <StatCard
                    title="This Week"
                    value={`₦${weekRevenue.toLocaleString()}`}
                    subValue={`${weekSales.length} sales`}
                    icon={FiCalendar}
                    iconColor="text-accent"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₦${totalRevenue.toLocaleString()}`}
                    subValue={`${totalSalesCount} all-time`}
                    icon={FiTrendingUp}
                    iconColor="text-success"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <StatCard
                    title="Avg. Order Value"
                    value={`₦${totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount).toLocaleString() : 0}`}
                    subValue="per transaction"
                    icon={FiShoppingBag}
                    iconColor="text-accent"
                />
                <StatCard
                    title="Items in Stock"
                    value={totalProductsInStock.toLocaleString()}
                    subValue={`${filteredProducts.length} products`}
                    icon={FiPackage}
                    iconColor="text-success"
                />
            </div>

            {/* Today's Payment Breakdown */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold">Today's Payment Breakdown</h3>
                        <p className="text-xs text-foreground-muted">Revenue categorized by payment method</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black">₦{todayRevenue.toLocaleString()}</p>
                        <p className="text-xs text-foreground-muted">Total Today</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                        <p className="text-xs font-bold text-accent mb-1">Cash</p>
                        <p className="text-xl font-black">₦{cashSalesToday.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                        <p className="text-xs font-bold text-accent mb-1">POS</p>
                        <p className="text-xl font-black">₦{posSalesToday.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                        <p className="text-xs font-bold text-accent mb-1">Transfer</p>
                        <p className="text-xl font-black">₦{transferSalesToday.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-foreground-muted/5 rounded-xl border border-foreground-muted/10">
                        <p className="text-xs font-bold text-foreground-muted mb-1">Credit (Unpaid)</p>
                        <p className="text-xl font-black">₦{creditSalesToday.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Revenue (Last 7 Days)</h3>
                            <p className="text-xs text-foreground-muted">Daily revenue trend</p>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={last7Days}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11, fontWeight: '600' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11, fontWeight: '600' }} tickFormatter={(v) => `₦${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                                <Tooltip
                                    contentStyle={{ background: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                                    formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Revenue']}
                                    labelFormatter={(label, payload) => payload[0]?.payload?.date || label}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fill="url(#revenueGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stock Alerts */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Stock Alerts</h3>
                            <p className="text-xs text-foreground-muted">Items needing attention</p>
                        </div>
                        <Link href="/dashboard/inventory" className="text-xs font-bold text-accent hover:underline">View All</Link>
                    </div>

                    {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-3">
                                <FiActivity className="text-success text-xl" />
                            </div>
                            <p className="font-bold text-success">All Stock Levels OK</p>
                            <p className="text-xs text-foreground-muted mt-1">No products below minimum levels</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[280px] overflow-y-auto">
                            {outOfStockProducts.length > 0 && (
                                <div className="p-3 bg-error/5 border border-error/10 rounded-xl">
                                    <p className="text-xs font-bold text-error mb-2 flex items-center gap-2">
                                        <FiAlertCircle /> Out of Stock ({outOfStockProducts.length})
                                    </p>
                                    <div className="space-y-1">
                                        {outOfStockProducts.slice(0, 3).map(p => (
                                            <p key={p._id || p.id} className="text-xs font-medium truncate">{p.name}</p>
                                        ))}
                                        {outOfStockProducts.length > 3 && (
                                            <p className="text-xs text-foreground-muted">+{outOfStockProducts.length - 3} more</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {lowStockProducts.filter(p => {
                                const stock = viewMode === 'all_branches'
                                    ? Object.values(p.stock || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0)
                                    : (p.stock?.[branchKey] || 0);
                                return stock > 0;
                            }).length > 0 && (
                                    <div className="p-3 bg-foreground-muted/5 border border-foreground-muted/10 rounded-xl">
                                        <p className="text-xs font-bold text-foreground-muted mb-2 flex items-center gap-2">
                                            <FiAlertCircle /> Low Stock
                                        </p>
                                        <div className="space-y-1">
                                            {lowStockProducts.filter(p => {
                                                const stock = viewMode === 'all_branches'
                                                    ? Object.values(p.stock || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0)
                                                    : (p.stock?.[branchKey] || 0);
                                                return stock > 0;
                                            }).slice(0, 3).map(p => (
                                                <div key={p._id || p.id} className="flex justify-between text-xs">
                                                    <span className="font-medium truncate max-w-[140px]">{p.name}</span>
                                                    <span className="font-bold text-foreground-muted">
                                                        {viewMode === 'all_branches'
                                                            ? Object.values(p.stock || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0)
                                                            : (p.stock?.[branchKey] || 0)} left
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>

            {/* Branch Breakdown (only for all branches view) */}
            {viewMode === 'all_branches' && branchBreakdown.length > 1 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Branch Performance</h3>
                            <p className="text-xs text-foreground-muted">Revenue comparison across branches</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-bold text-foreground-muted text-xs uppercase tracking-wide">Branch</th>
                                    <th className="text-right py-3 px-4 font-bold text-foreground-muted text-xs uppercase tracking-wide">Today</th>
                                    <th className="text-right py-3 px-4 font-bold text-foreground-muted text-xs uppercase tracking-wide">Total Revenue</th>
                                    <th className="text-right py-3 px-4 font-bold text-foreground-muted text-xs uppercase tracking-wide">Sales</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {branchBreakdown.map((branch, i) => (
                                    <tr key={i} className="hover:bg-background-secondary/50">
                                        <td className="py-3 px-4 font-bold">{branch.name}</td>
                                        <td className="py-3 px-4 text-right font-bold text-success">₦{branch.todayRevenue.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-right font-black">₦{branch.totalRevenue.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-right text-foreground-muted">{branch.salesCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bottom Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Top Selling Products</h3>
                            <p className="text-xs text-foreground-muted">Best performers by revenue</p>
                        </div>
                        <Link href="/dashboard/inventory" className="text-xs font-bold text-accent hover:underline">View All</Link>
                    </div>
                    {topSellingProducts.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-center">
                            <FiShoppingBag className="text-3xl text-foreground-muted/30 mb-3" />
                            <p className="font-bold text-foreground-muted">No sales recorded yet</p>
                            <p className="text-xs text-foreground-muted mt-1">Start selling to see top products</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {topSellingProducts.map((product, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-xs font-black text-accent">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm truncate max-w-[180px]">{product.name}</p>
                                            <p className="text-xs text-foreground-muted">{product.quantity} units sold</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-accent">₦{product.revenue.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Recent Transactions</h3>
                            <p className="text-xs text-foreground-muted">Latest sales activity</p>
                        </div>
                        <Link href="/dashboard/orders" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                            View All <FiArrowRight size={12} />
                        </Link>
                    </div>
                    {recentTransactions.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-center">
                            <FiCreditCard className="text-3xl text-foreground-muted/30 mb-3" />
                            <p className="font-bold text-foreground-muted">No transactions yet</p>
                            <p className="text-xs text-foreground-muted mt-1">Sales will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {recentTransactions.map((sale) => (
                                <div key={sale._id || sale.id} className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-xl">
                                    <div>
                                        <p className="font-mono text-xs font-bold text-foreground-muted">
                                            #{(sale._id || sale.id || '').slice(-6).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-foreground-muted">
                                            {format(new Date(sale.createdAt || new Date()), 'dd MMM, HH:mm')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black">₦{sale.totalAmount.toLocaleString()}</p>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-background rounded border border-border">
                                            {sale.paymentMethod}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
