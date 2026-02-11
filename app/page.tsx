"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    FiArrowRight,
    FiMenu,
    FiX,
    FiCheck,
    FiChevronDown,
    FiPlay,
    FiMinus,
    FiMail,
    FiTwitter,
    FiInstagram,
    FiLinkedin
} from "react-icons/fi";
import {
    RiLayoutGridLine,
    RiHistoryLine,
    RiUserLine,
    RiNotification3Line,
    RiPieChartLine,
    RiGroupLine,
    RiArrowRightLine,
    RiDatabase2Line,
    RiShieldCheckLine,
    RiGlobalLine
} from "react-icons/ri";
import {
    HiOutlineShieldCheck,
    HiOutlineLightningBolt,
    HiOutlineCurrencyDollar,
    HiOutlineChartBar,
    HiOutlineEye,
    HiOutlineBell,
    HiOutlineDocumentReport,
    HiOutlineTruck
} from "react-icons/hi";
import Link from "next/link";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const stagger: Variants = {
    visible: { transition: { staggerChildren: 0.1 } }
};

const Navbar = () => {
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <div className="nav-pill-wrapper">
            <nav className="nav-pill px-6">
                <Link href="/" className="flex items-center gap-2 mr-4">
                    <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
                        <span className="text-background font-black text-sm">S</span>
                    </div>
                    <span className="font-bold tracking-tight text-foreground hidden sm:block">StockIt</span>
                </Link>

                <div className="hidden md:flex items-center gap-2">
                    <Link href="#solutions" className="btn btn-ghost px-4">Solutions</Link>
                    <Link href="#how-it-works" className="btn btn-ghost px-4">Process</Link>
                    <Link href="#pricing" className="btn btn-ghost px-4">Pricing</Link>
                </div>

                <div className="flex items-center gap-2 ml-4">
                    <Link href="/login" className="btn btn-ghost hidden sm:flex font-bold">Log in</Link>
                    <Link href="/signup" className="btn btn-primary px-6 py-2.5">Join Free</Link>
                    <button onClick={() => setMobileMenu(true)} className="md:hidden btn btn-secondary p-2.5 rounded-full">
                        <FiMenu className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-4 z-[101] bg-background border border-border rounded-[2rem] p-8 md:hidden flex flex-col shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-black text-2xl tracking-tighter">StockIt.</span>
                            <button onClick={() => setMobileMenu(false)} className="p-3 bg-background-secondary rounded-full border border-border">
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 text-3xl font-black tracking-tighter uppercase mb-12">
                            <Link href="#solutions" onClick={() => setMobileMenu(false)}>Solutions</Link>
                            <Link href="#how-it-works" onClick={() => setMobileMenu(false)}>Process</Link>
                            <Link href="#pricing" onClick={() => setMobileMenu(false)}>Pricing</Link>
                        </div>
                        <div className="mt-auto flex flex-col gap-4">
                            <Link href="/login" className="btn btn-secondary text-lg py-5">Login</Link>
                            <Link href="/signup" className="btn btn-primary text-lg py-5">Try Free</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="group border-b border-border py-4 transition-all hover:bg-background-secondary/50 rounded-lg px-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none"
            >
                <h4 className="font-bold text-lg md:text-xl pr-4 text-foreground tracking-tight">{question}</h4>
                <div className={`flex-shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 bg-accent text-white scale-110' : 'bg-background-secondary text-foreground-muted'} w-8 h-8 rounded-full flex items-center justify-center`}>
                    <FiChevronDown className="w-5 h-5" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                    >
                        <p className="mt-4 text-foreground-muted leading-relaxed text-lg pb-2">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function LandingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    return (
        <main className="bg-background selection:bg-accent selection:text-white">
            <Navbar />

            {/* Hero Section - Revamped */}
            <section className="relative pt-48 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] -z-10" />
                <div className="container">
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-5xl mx-auto text-center relative z-10">
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-black mb-10 uppercase tracking-[0.25em] shadow-xl shadow-accent/20">
                            Live 2026: Multi-Tenant Architecture Ready
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="h1 mb-8 leading-[0.95] tracking-[-0.06em]">
                            The Operating System <br /><span className="text-foreground-muted italic font-light">for your business.</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="p-lg mb-12 max-w-3xl mx-auto text-xl md:text-2xl font-medium tracking-tight">
                            Take full control of your inventory, sales, and multi-outlet operations with real-time analytics and automated reconciliation.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/signup" className="btn btn-primary px-12 py-6 text-lg tracking-tight shadow-2xl shadow-accent/30 font-bold group">
                                Scale your business <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="btn btn-secondary px-12 py-6 text-lg font-bold border-2">
                                <FiPlay className="mr-3" /> Watch Demo
                            </button>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mt-16 flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                            <span className="flex items-center gap-2"><RiDatabase2Line className="text-sm" /> MongoDB Scalability</span>
                            <span className="flex items-center gap-2"><RiShieldCheckLine className="text-sm" /> ISO Certification</span>
                            <span className="flex items-center gap-2"><RiGlobalLine className="text-sm" /> 99.9% Uptime</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="section bg-foreground text-background py-32 overflow-hidden border-y border-white/5">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <h2 className="h2 mb-12 leading-[1.05] text-primary-foreground tracking-tighter">Spreadsheets are <br /><span className="opacity-40 italic underline decoration-accent decoration-8 underline-offset-[14px]">leaking your profit.</span></h2>

                            <div className="space-y-12 mb-12"> {/* Added mb-12 */}
                                <div className="flex gap-8 group">
                                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-error group-hover:bg-error/20 transition-all"><FiX className="text-4xl" /></div>
                                    <div>
                                        <h4 className="font-black text-2xl uppercase tracking-tighter mb-3">Stockouts are lost revenue</h4>
                                        <p className="opacity-60 text-xl font-light leading-relaxed">Every time a customer asks for a product you don&apos;t have, that&apos;s a direct hit to your bottom line. Stop guessing and start tracking.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 group">
                                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center text-error group-hover:bg-error/20 transition-all"><FiX className="text-4xl" /></div>
                                    <div>
                                        <h4 className="font-black text-2xl uppercase tracking-tighter mb-3">Invisible Theft</h4>
                                        <p className="opacity-60 text-xl font-light leading-relaxed">No audit trail means zero accountability. 15% of retail profit is lost to internal shrinkage. We track every unit movement.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-12 -left-12 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
                            <div className="card bg-white/5 border-white/10 p-12 backdrop-blur-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-error/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="flex justify-between items-start mb-8">
                                    <HiOutlineChartBar className="text-5xl text-error" />
                                    <span className="badge bg-error/20 text-error border-none px-4 py-2 font-black">Profit Drain</span>
                                </div>
                                <p className="text-7xl font-black italic tracking-tighter mb-4 group-hover:scale-105 transition-transform duration-500">₦12.5M</p>
                                <p className="text-xl opacity-60 font-bold leading-tight">Average annual loss for unmanaged Nigerian retailers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solutions Section - Centered Header */}
            <section id="solutions" className="section bg-background-secondary py-32">
                <div className="container">
                    <div className="text-center max-w-4xl mx-auto mb-24 px-4">
                        <h2 className="h2 mb-8 leading-[1.05]">Designed for speed, <br />built for scale.</h2> {/* Added mb-8 */}
                        <p className="p-lg text-xl font-medium">Everything you need to manage one shop or a thousand, from anywhere in the world.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: <RiLayoutGridLine />, title: "Multi-Outlet Sync", desc: "View live levels across all branches. Seamlessly transfer products across your entire retail network." },
                            { icon: <RiHistoryLine />, title: "Full Audit Trail", desc: "Track every movement of every item. Know exactly who sold it, who moved it, and when. Absolute accountability." },
                            { icon: <RiNotification3Line />, title: "Low-Stock Alerts", desc: "Get predictive notifications via WhatsApp and Email before your best-sellers run out. Stay ahead of demand." },
                            { icon: <RiPieChartLine />, title: "Sales Insights", desc: "Discover your most profitable products and weakest outlets. One-click reports that simplify your accounting." },
                            { icon: <RiUserLine />, title: "Role-Based Access", desc: "Secure your sensitive data. Grant staff only the access they need to perform their daily duties." },
                            { icon: <RiGroupLine />, title: "Supplier Engine", desc: "Manage purchase orders, track supplier performance, and maintain a history of all deliveries centrally." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8 }}
                                className="card card-hover flex flex-col gap-8 group bg-background"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center text-4xl shadow-lg shadow-accent/20 group-hover:rotate-6 transition-transform">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="h3 mb-4 tracking-tight group-hover:text-accent transition-colors">{feature.title}</h3>
                                    <p className="text-foreground-muted text-lg leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section - Centered Header */}
            <section id="how-it-works" className="section py-32">
                <div className="container text-center"> {/* Added text-center */}
                    <div className="max-w-4xl mx-auto mb-32">
                        <h2 className="h2 mb-8 leading-[1.05]">How StockIt saves <br />your business in 4 steps.</h2> {/* Added mb-8 */}
                        <p className="p-lg text-xl font-medium">The faster you switch, the sooner you start earning more.</p>
                    </div>

                    <div className="grid gap-24 relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -z-10 hidden lg:block" />
                        {[
                            {
                                step: "01",
                                title: "Centralized Visibility",
                                desc: "Dashboard shows stock levels across ALL branches instantly. No more calling staff to ask &ldquo;what do we have?&rdquo; - it&apos;s all live.",
                                icon: <HiOutlineEye className="w-12 h-12" />,
                                bullets: ["Live stock tracking", "Multi-branch view"]
                            },
                            {
                                step: "02",
                                title: "Predictive Restocking",
                                desc: "StockIt analyzes your sales velocity. It suggests exactly what to buy and when, preventing capital tie-down.",
                                icon: <HiOutlineBell className="w-12 h-12" />,
                                bullets: ["Smart predictions", "Supplier sync"]
                            },
                            {
                                step: "03",
                                title: "Total Accountability",
                                desc: "Every sale tied to a user. Every movement requires clearance. Every naira is accounted for in daily logs.",
                                icon: <HiOutlineShieldCheck className="w-12 h-12" />,
                                bullets: ["Audit logs", "Theft prevention"]
                            },
                            {
                                step: "04",
                                title: "Precision Reporting",
                                desc: "One-click exports for owners. See gross margins, top customers, and stock turnover in seconds.",
                                icon: <HiOutlineDocumentReport className="w-12 h-12" />,
                                bullets: ["Financial clarity", "Growth insights"]
                            }
                        ].map((item, i) => (
                            <div key={i} className={`flex flex-col lg:flex-row gap-12 items-center text-left ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                <div className="flex-1 space-y-8">
                                    <div className="flex items-center gap-6">
                                        <span className="text-8xl font-black text-foreground/5 leading-none select-none tracking-[-0.1em]">{item.step}</span>
                                        <h3 className="h2 tracking-tighter text-4xl">{item.title}</h3>
                                    </div>
                                    <p className="text-xl text-foreground-muted leading-relaxed max-w-lg">{item.desc}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {item.bullets.map((b, bi) => (
                                            <span key={bi} className="bg-accent/5 text-accent border border-accent/10 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em]">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 w-full flex justify-center">
                                    <div className="w-64 h-64 rounded-[3rem] bg-foreground text-background flex items-center justify-center p-12 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                        {item.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials - Adjusted Headers and Cards */}
            <section className="section bg-foreground text-background py-32 overflow-hidden border-y border-white/10">
                <div className="container">
                    <div className="max-w-4xl mb-24"> {/* Header */}
                        <h2 className="h2 mb-12 text-background leading-[1.05] tracking-tight">Trusted by the best <br /><span className="opacity-40 italic underline decoration-accent underline-offset-[12px]">in the business.</span></h2> {/* Added mb-12 */}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "Before StockIt, I was losing ₦200,000 monthly to stockouts. Now I get alerts before items run low. My customers are happier.",
                                author: "Adebayo Johnson",
                                title: "Johnson Supermarket, Lagos"
                            },
                            {
                                quote: "Managing 4 branches was a nightmare. I never knew what was selling. StockIt showed me Ikeja was overstocked fixed that in a week.",
                                author: "Chioma Okafor",
                                title: "CEO, Chichi Fashion, Abuja"
                            },
                            {
                                quote: "The supplier tracking is worth it. I see exactly when orders arrive and track every naira paid. My business margins improved by 15%.",
                                author: "Ibrahim Musa",
                                title: "Musa Wholesale, Kano"
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/10 p-12 rounded-sm flex flex-col justify-between h-full hover:bg-white/[0.08] transition-all group"> {/* Adjusted padding and rounded-sm */}
                                <div className="flex gap-1 mb-8">
                                    {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-4 h-4 rounded-full bg-accent" />)}
                                </div>
                                <p className="text-2xl font-light italic leading-relaxed mb-10 group-hover:scale-[1.02] transition-transform">&ldquo;{t.quote}&rdquo;</p>
                                <div>
                                    <p className="font-black text-xl mb-1">{t.author}</p>
                                    <p className="text-xs opacity-50 uppercase tracking-[0.3em] font-black">{t.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing - Revamped Modern */}
            <section id="pricing" className="section py-32 bg-background relative overflow-hidden">
                <div className="container relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20 px-4">
                        <h2 className="h2 mb-8 tracking-tighter">Growth-focused pricing.</h2>
                        <div className="flex items-center justify-center gap-2 bg-background-secondary p-1 rounded-full w-max mx-auto border border-border">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${billingCycle === "monthly" ? "bg-accent text-white shadow-xl shadow-accent/20" : "text-foreground-muted"}`}
                            >Monthly</button>
                            <button
                                onClick={() => setBillingCycle("yearly")}
                                className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${billingCycle === "yearly" ? "bg-accent text-white shadow-xl shadow-accent/20" : "text-foreground-muted"}`}
                            >Yearly <span className="opacity-60 ml-1">-20%</span></button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                        {/* Starter */}
                        <div className="card border-border flex flex-col p-10 bg-background-secondary/30">
                            <div className="mb-10">
                                <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-foreground-muted mb-6">Solo Starter</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black tracking-tighter">₦0</span>
                                    <span className="text-foreground-muted font-black text-[10px] tracking-widest uppercase">/Forever</span>
                                </div>
                            </div>
                            <div className="space-y-4 mb-12 flex-1 pt-8 border-t border-border/50">
                                <div className="flex items-center gap-3 font-bold text-sm"><FiCheck className="text-success text-xl" /> 1 Branch</div>
                                <div className="flex items-center gap-3 font-bold text-sm"><FiCheck className="text-success text-xl" /> 100 SKUs</div>
                                <div className="flex items-center gap-3 font-bold text-sm text-foreground-muted/40"><FiMinus className="text-xl" /> No Analytics</div>
                            </div>
                            <button className="btn btn-secondary w-full py-5 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-foreground hover:text-background transition-colors">Start Free</button>
                        </div>

                        {/* Business Pro - The Star */}
                        <div className="card bg-foreground text-background border-none shadow-[0_45px_100px_-20px_rgba(0,0,0,0.3)] p-12 relative flex flex-col scale-105 z-10 transition-transform duration-500 hover:scale-[1.07]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.5em]">Scaling Now</div>
                            <div className="mb-10 text-center">
                                <h4 className="font-black uppercase tracking-[0.3em] text-[10px] opacity-40 mb-6">Business Elite</h4>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-7xl font-black tracking-tighter">₦15k</span>
                                    <span className="opacity-40 font-black text-[10px] tracking-widest uppercase">/Month</span>
                                </div>
                            </div>
                            <div className="space-y-5 mb-12 flex-1 pt-10 border-t border-white/10">
                                <div className="flex items-center gap-4 font-black text-sm uppercase tracking-widest"><FiCheck className="text-accent text-2xl" /> 10 Branches</div>
                                <div className="flex items-center gap-4 font-black text-sm uppercase tracking-widest"><FiCheck className="text-accent text-2xl" /> Unlimited SKUs</div>
                                <div className="flex items-center gap-4 font-black text-sm uppercase tracking-widest"><FiCheck className="text-accent text-2xl" /> WhatsApp Alerts</div>
                                <div className="flex items-center gap-4 font-black text-sm uppercase tracking-widest"><FiCheck className="text-accent text-2xl" /> Advanced Reports</div>
                            </div>
                            <button className="btn btn-primary bg-accent w-full py-6 text-[10px] uppercase tracking-[0.4em] font-black text-white hover:brightness-110 shadow-xl shadow-accent/40 border-none transition-all">Go Elite Now</button>
                        </div>

                        {/* Enterprise */}
                        <div className="card border-border flex flex-col p-10 bg-background-secondary/30">
                            <div className="mb-10">
                                <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-foreground-muted mb-6">Enterprise</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black tracking-tighter">₦35k</span>
                                    <span className="text-foreground-muted font-black text-[10px] tracking-widest uppercase">/Month</span>
                                </div>
                            </div>
                            <div className="space-y-4 mb-12 flex-1 pt-8 border-t border-border/50">
                                <div className="flex items-center gap-3 font-bold text-sm"><FiCheck className="text-success text-xl" /> Unlimited Branch</div>
                                <div className="flex items-center gap-3 font-bold text-sm"><FiCheck className="text-success text-xl" /> Bulk Import Experts</div>
                                <div className="flex items-center gap-3 font-bold text-sm"><FiCheck className="text-success text-xl" /> Custom API</div>
                            </div>
                            <button className="btn btn-secondary w-full py-5 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-foreground hover:text-background transition-colors">Contact Expert</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ - Center and Clean Revamp */}
            <section id="faq" className="section bg-background-secondary/50 py-32">
                <div className="container text-center">
                    <div className="max-w-3xl mx-auto mb-20 px-4">
                        <h2 className="h2 mb-4 tracking-[-0.05em]">FAQ</h2>
                        <p className="p-lg text-lg font-bold uppercase tracking-widest text-accent">Transparency First</p>
                    </div>
                    <div className="max-w-3xl mx-auto bg-background p-10 rounded-[3rem] shadow-sm border border-border text-left">
                        <FaqItem
                            question="Is my data isolated from other companies?"
                            answer="Absolutely. We use a multi-tenant database architecture. Your business data resides in its own logical container, ensuring 100% isolation and security from other users."
                        />
                        <FaqItem
                            question="Can I scale from 1 to 50 locations easily?"
                            answer="Yes! StockIt was built to scale. Adding a new branch takes seconds. Our reporting engine will automatically aggregate data across all your locations for national-level insights."
                        />
                        <FaqItem
                            question="What happens if the internet goes down?"
                            answer="StockIt features critical offline synchronization. You can keep recording basic sales data, and the system will auto-sync once your connection is restored."
                        />
                        <FaqItem
                            question="Is there a limit on users per branch?"
                            answer="On our Pro and Enterprise plans, you get unlimited user accounts. You can create unique logins for every sales rep, manager, and accountant at no extra cost."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section - Contained Modern Card */}
            <section className="section py-32 border-t border-border">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative rounded-[2.5rem] overflow-hidden bg-primary text-primary-foreground px-6 py-20 md:px-20 md:py-24 text-center shadow-2xl"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                            <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[150%] bg-accent/20 blur-[100px] rounded-full mix-blend-screen" />
                            <div className="absolute -bottom-[50%] -right-[20%] w-[80%] h-[150%] bg-accent/10 blur-[120px] rounded-full mix-blend-screen" />
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                            <h2 className="h1 text-white leading-[0.95] tracking-tighter">
                                Ready to stop losing money?
                            </h2>
                            <p className="text-white/80 text-xl md:text-2xl font-medium leading-relaxed">
                                Join 2,000+ smart retailers who use StockIt to prevent theft, track inventory, and grow their profit margins.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                                <Link href="/signup" className="btn bg-white text-primary hover:bg-white/90 px-10 py-6 text-xl font-bold rounded-xl shadow-xl transition-transform hover:-translate-y-1">
                                    Start Free Trial <FiArrowRight className="ml-2" />
                                </Link>
                                <Link href="#pricing" className="btn bg-white/10 text-white hover:bg-white/20 border border-white/10 px-10 py-6 text-xl font-bold rounded-xl backdrop-blur-md">
                                    View Pricing
                                </Link>
                            </div>

                            <div className="pt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-black uppercase tracking-[0.2em] opacity-60">
                                <span className="flex items-center gap-2"><FiCheck className="text-accent" /> No Credit Card</span>
                                <span className="flex items-center gap-2"><FiCheck className="text-accent" /> 14-Day Free Trial</span>
                                <span className="flex items-center gap-2"><FiCheck className="text-accent" /> Cancel Anytime</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FooterSection - Premium Modern Revamp */}
            <footer className="bg-foreground text-background pt-32 pb-16 overflow-hidden relative">
                <div className="container">
                    <div className="grid lg:grid-cols-12 gap-20 mb-32 items-start">
                        <div className="lg:col-span-5">
                            <span className="text-6xl font-black tracking-tighter mb-10 block underline decoration-accent decoration-8 underline-offset-[12px]">StockIt.</span>
                            <p className="opacity-50 text-2xl font-light leading-relaxed max-w-md mb-12">The industrial-grade infrastructure powering the future of Nigerian enterprise retail and logistics.</p>
                            <div className="flex gap-4">
                                {[FiTwitter, FiInstagram, FiLinkedin, FiMail].map((Icon, i) => (
                                    <button key={i} className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-all hover:-translate-y-1">
                                        <Icon className="text-xl" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-7 grid md:grid-cols-3 gap-12">
                            <div className="space-y-10">
                                <h5 className="font-black uppercase tracking-[0.4em] text-[10px] opacity-30">Products</h5>
                                <ul className="space-y-5 font-black uppercase tracking-widest text-[11px]">
                                    <li><Link href="#" className="hover:text-accent transition-colors">Inventory V2</Link></li>
                                    <li><Link href="#" className="hover:text-accent transition-colors">Cloud POS</Link></li>
                                    <li><Link href="#" className="hover:text-accent transition-colors">Supply Chain</Link></li>
                                    <li><Link href="#" className="hover:text-accent transition-colors">Analytics</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-10">
                                <h5 className="font-black uppercase tracking-[0.4em] text-[10px] opacity-30">Resources</h5>
                                <ul className="space-y-5 font-black uppercase tracking-widest text-[11px]">
                                    <li><Link href="#" className="hover:text-accent transition-colors">Merchant Blog</Link></li>
                                    <li><Link href="#" className="hover:text-accent transition-colors">API Console</Link></li>
                                    <li><Link href="#" className="hover:text-accent transition-colors">Status Board</Link></li>
                                    <li><Link href="#" className="hover:text-accent transition-colors">Help Center</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-10">
                                <h5 className="font-black uppercase tracking-[0.4em] text-[10px] opacity-30">Company</h5>
                                <ul className="space-y-5 font-black uppercase tracking-widest text-[11px]">
                                    <li><Link href="#" className="hover:text-accent transition-colors">About Us</Link></li>
                                    <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                                    <li><Link href="#" className="hover:text-accent transition-colors">Security Port</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-16 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.6em] opacity-30 text-center md:text-left">
                        <p>© 2026 StockIt Multi-Tenant SaaS. Built with pride in Nigeria.</p>
                        <div className="flex gap-10">
                            <span>LAGOS HQ</span>
                            <span>UYO RESEARCH</span>
                            <span>ABUJA HUB</span>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
