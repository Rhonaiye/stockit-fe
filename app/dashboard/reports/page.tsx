"use client";

import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import {
    FiDownload,
    FiTrendingUp,
    FiArrowUpRight,
    FiArrowDownRight,
    FiDollarSign,
    FiShoppingBag,
    FiUsers,
    FiPieChart,
    FiActivity
} from "react-icons/fi";
import { useApp } from "@/context/app-context";
import { motion } from "framer-motion";
import { format } from "date-fns";

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function ReportsPage() {
    const { sales, products, customers } = useApp();

    // --- RECURRING CALCULATIONS ---
    const stats = useMemo(() => {
        const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

        // Calculate Profit (Revenue - Cost of Goods Sold)
        let totalCost = 0;
        sales.forEach(sale => {
            sale.items.forEach(item => {
                const product = products.find(p => (p._id || p.id) === item.productId);
                if (product) {
                    totalCost += product.costPrice * item.quantity;
                }
            });
        });

        const totalProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
        const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
        const customerLTV = customers.length > 0 ? totalRevenue / customers.length : 0;

        return {
            totalRevenue,
            totalProfit,
            profitMargin,
            avgOrderValue,
            customerLTV,
            salesCount: sales.length,
            customerCount: customers.length
        };
    }, [sales, products, customers]);

    // --- CHART DATA: SALES BY DAY (LAST 7 DAYS) ---
    const dailyData = useMemo(() => {
        const days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return format(date, 'MMM dd');
        }).reverse();

        return days.map(day => {
            const daySales = sales.filter(s => s.createdAt && format(new Date(s.createdAt), 'MMM dd') === day);
            const revenue = daySales.reduce((sum, s) => sum + s.totalAmount, 0);

            let cost = 0;
            daySales.forEach(s => s.items.forEach(item => {
                const p = products.find(prod => (prod._id || prod.id) === item.productId);
                if (p) cost += p.costPrice * item.quantity;
            }));

            return { name: day, revenue, profit: revenue - cost };
        });
    }, [sales, products]);

    // --- CHART DATA: SALES BY CATEGORY ---
    const categoryData = useMemo(() => {
        const categories: Record<string, number> = {};
        sales.forEach(s => {
            s.items.forEach(item => {
                const p = products.find(prod => (prod._id || prod.id) === item.productId);
                const cat = p?.category || 'Uncategorized';
                categories[cat] = (categories[cat] || 0) + (item.price * item.quantity);
            });
        });

        return Object.entries(categories)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [sales, products]);

    // --- TOP PRODUCTS ---
    const topProducts = useMemo(() => {
        const productSales: Record<string, { name: string, quantity: number, revenue: number, profit: number }> = {};

        sales.forEach(s => {
            s.items.forEach(item => {
                if (!productSales[item.productId]) {
                    const productRef = products.find(p => (p._id || p.id) === item.productId);
                    productSales[item.productId] = {
                        name: item.productName || productRef?.name || 'Item Removed',
                        quantity: 0,
                        revenue: 0,
                        profit: 0
                    };
                }
                const p = products.find(prod => (prod._id || prod.id) === item.productId);
                const itemCost = p ? p.costPrice * item.quantity : 0;

                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].revenue += (item.price * item.quantity);
                productSales[item.productId].profit += ((item.price * item.quantity) - itemCost);
            });
        });

        return Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }, [sales, products]);

    // --- CUSTOMER SEGMENTATION ---
    const topCustomers = useMemo(() => {
        return [...customers]
            .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
            .slice(0, 5);
    }, [customers]);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Financial Intelligence <span className="bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Pro Edition</span>
                    </h1>
                    <p className="text-foreground-muted">Industry-standard analytics for {customers.length > 50 ? 'Enterprise' : 'Scale'} Operations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="bg-card border border-border rounded-md px-4 py-2 text-sm font-bold outline-none focus:border-accent">
                        <option>Real-time View</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Month</option>
                        <option>Current Year</option>
                    </select>
                    <button className="btn btn-primary px-6 py-2 flex items-center gap-2">
                        <FiDownload /> Generate CEO Report
                    </button>
                </div>
            </div>

            {/* High-Level Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, color: 'text-accent', icon: FiDollarSign, trend: '+12.5%' },
                    { label: 'Gross Profit', value: `₦${stats.totalProfit.toLocaleString()}`, color: 'text-success', icon: FiTrendingUp, trend: '+8.2%' },
                    { label: 'Customer LTV', value: `₦${stats.customerLTV.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'text-warning', icon: FiUsers, trend: '+5.7%' },
                    { label: 'Avg Order Value', value: `₦${stats.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'text-purple-500', icon: FiShoppingBag, trend: '+2.1%' }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="bg-card border border-border p-6 rounded-md shadow-sm group hover:border-accent/50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-md bg-background-secondary ${stat.color} group-hover:bg-accent group-hover:text-white transition-colors`}>
                                <stat.icon className="text-xl" />
                            </div>
                            <span className={`text-xs font-black px-2 py-1 rounded-full flex items-center gap-0.5 ${stat.trend.startsWith('+') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                {stat.trend.startsWith('+') ? <FiArrowUpRight /> : <FiArrowDownRight />} {stat.trend}
                            </span>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted mb-1">{stat.label}</p>
                        <h4 className="text-2xl font-black">{stat.value}</h4>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue & Profit Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-card border border-border p-8 rounded-md shadow-sm"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-xl flex items-center gap-2">
                                <FiActivity className="text-accent" /> Revenue Velocity
                            </h3>
                            <p className="text-xs text-foreground-muted uppercase font-bold tracking-widest mt-1">Real-time Growth Trajectory</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Gross Sales</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-success" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Net Profit</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 10, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground-muted)', fontSize: 10, fontWeight: 700 }}
                                    tickFormatter={(val) => `₦${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--card)',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Sales by Category */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-border p-8 rounded-md shadow-sm"
                >
                    <h3 className="font-black text-xl flex items-center gap-2 mb-8">
                        <FiPieChart className="text-accent" /> Profit Concentration
                    </h3>
                    <div className="h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">Avg Margin</span>
                            <span className="text-xl font-black text-accent">{stats.profitMargin.toFixed(1)}%</span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        {categoryData.map((cat, i) => (
                            <div key={cat.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">{cat.name}</span>
                                </div>
                                <span className="text-xs font-black">₦{cat.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Top Selling Products */}
                <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-border bg-background-secondary/30">
                        <h3 className="font-black text-lg">SKU Performance Leaderboard</h3>
                        <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">Top products by contribution margin</p>
                    </div>
                    <div className="p-6 flex-1">
                        <div className="space-y-6">
                            {topProducts.map((p, i) => (
                                <div key={p.name} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-md bg-background-secondary flex items-center justify-center font-black text-accent border border-border shadow-sm">
                                        #{i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <div>
                                                <span className="font-bold text-sm block">{p.name}</span>
                                                <span className="text-[10px] font-black uppercase text-success">Profit: ₦{p.profit.toLocaleString()}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-black block">₦{p.revenue.toLocaleString()}</span>
                                                <span className="text-[10px] text-foreground-muted font-bold">{p.quantity} units sold</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-1.5 bg-background-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${(p.revenue / topProducts[0].revenue) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border bg-background-secondary/30">
                        <h3 className="font-black text-lg">Top Customer Portfolios</h3>
                        <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">High Net Worth Business Partners</p>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-background-secondary/50 text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Orders</th>
                                    <th className="px-6 py-4 text-right">Lifetime Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {topCustomers.map((c) => (
                                    <tr key={c._id || c.id} className="hover:bg-background-secondary/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold">{c.name}</div>
                                            <div className="text-[10px] text-foreground-muted break-all">{c.email || 'No email registered'}</div>
                                        </td>
                                        <td className="px-6 py-4 font-black">{c.totalPurchases || 0}</td>
                                        <td className="px-6 py-4 text-right font-black text-accent">₦{(c.totalSpent || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Performance Table */}
            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border bg-background-secondary/30">
                    <h3 className="font-black text-lg">Inventory Valuation</h3>
                    <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest">Live stock value and projections</p>
                </div>
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-background-secondary/50 text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                            <tr>
                                <th className="px-6 py-4">Metric</th>
                                <th className="px-6 py-4 text-right">Value</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr>
                                <td className="px-6 py-4 font-bold">Total Sales Completed</td>
                                <td className="px-6 py-4 text-right font-black">{stats.salesCount}</td>
                                <td className="px-6 py-4 text-right"><span className="text-[10px] font-black uppercase px-2 py-0.5 bg-success/10 text-success rounded-full border border-success/20">Optimal</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-bold">Total Inventory Value (Cost)</td>
                                <td className="px-6 py-4 text-right font-black">₦{products.reduce((sum, p) => sum + (p.costPrice * Object.values(p.stock).reduce((a, b) => a + b, 0)), 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right"><span className="text-[10px] font-black uppercase px-2 py-0.5 bg-warning/10 text-warning rounded-full border border-warning/20">High Liquid</span></td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-bold">Projected Sales Value</td>
                                <td className="px-6 py-4 text-right font-black">₦{products.reduce((sum, p) => sum + (p.sellingPrice * Object.values(p.stock).reduce((a, b) => a + b, 0)), 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right"><span className="text-[10px] font-black uppercase px-2 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/20">Growth</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
