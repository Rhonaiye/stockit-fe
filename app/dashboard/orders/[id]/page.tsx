"use client";

import { useApp, Sale } from "@/context/app-context";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { FiArrowLeft, FiCalendar, FiClock, FiUser, FiCreditCard, FiPrinter, FiDownload, FiPackage, FiX } from "react-icons/fi";
import Link from "next/link";
import { useState, useRef } from "react";
import PrintableReceipt from "@/components/PrintableReceipt";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SaleDetailPage() {
    const { sales, customers, products, currentBranch, currentCompany, currentUser, loading } = useApp();
    const params = useParams();
    const router = useRouter();
    const saleId = params.id as string;
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: `Receipt-${saleId.slice(-8).toUpperCase()}`,
        onAfterPrint: () => setShowReceiptModal(false)
    });

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    const sale = sales.find(s => (s._id || s.id) === saleId);

    if (!sale) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <FiPackage className="text-5xl text-foreground-muted/30 mb-4" />
                <h2 className="text-xl font-bold mb-2">Sale Not Found</h2>
                <p className="text-foreground-muted text-sm mb-6">This transaction may have been deleted or the ID is invalid.</p>
                <Link href="/dashboard/orders" className="btn btn-primary px-6 py-3 rounded-xl font-bold">
                    Back to Sales History
                </Link>
            </div>
        );
    }

    const customer = customers.find(c => (c._id || c.id) === (sale as any).customerId);
    const saleDate = new Date(sale.createdAt || (sale as any).date || new Date());

    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return;
        setIsDownloading(true);
        try {
            const element = receiptRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                unit: "mm",
                format: [80, canvas.height * 80 / canvas.width]
            });
            pdf.addImage(imgData, "PNG", 0, 0, 80, canvas.height * 80 / canvas.width);
            pdf.save(`Receipt-${(sale._id || sale.id || "").slice(-8).toUpperCase()}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePrintReceipt = () => {
        setShowReceiptModal(true);
        // handlePrint is called via the modal button or automatically if we want
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center hover:bg-accent/10 hover:border-accent/20 transition-all print:hidden"
                    >
                        <FiArrowLeft />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="bg-accent text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Receipt</span>
                            <h1 className="font-mono text-2xl font-black text-accent">
                                #{(sale._id || sale.id || "").slice(-8).toUpperCase()}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-foreground-muted">
                            <span className="flex items-center gap-1.5 font-medium">
                                <FiCalendar className="text-accent" /> {format(saleDate, "MMMM dd, yyyy")}
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                                <FiClock className="text-accent" /> {format(saleDate, "hh:mm a")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 print:hidden">
                    <button
                        onClick={handlePrintReceipt}
                        className="h-10 px-4 bg-background-secondary border border-border rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-accent/10 hover:border-accent/20 transition-all"
                    >
                        <FiPrinter /> Print Receipt
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="h-10 px-4 bg-accent text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-accent/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {isDownloading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiDownload />} Download PDF
                    </button>
                </div>
            </div>

            {/* Status & Summary Card */}
            <div className="bg-card border border-border rounded-2xl p-6 print:hidden">
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-1">Status</p>
                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${sale.status === 'COMPLETED' ? 'bg-success/10 text-success' :
                                sale.status === 'PENDING' ? 'bg-accent/10 text-accent' :
                                    'bg-error/10 text-error'
                                }`}>
                                {sale.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-1">Payment Method</p>
                            <div className="flex items-center gap-2 bg-background-secondary border border-border px-4 py-2 rounded-lg w-fit">
                                <FiCreditCard className="text-accent" />
                                <span className="font-black text-sm uppercase">{sale.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-1">Total Amount</p>
                        <p className="text-4xl font-black text-foreground">₦{sale.totalAmount.toLocaleString()}</p>
                        {(sale as any).paidAmount !== undefined && (sale as any).paidAmount !== sale.totalAmount && (
                            <p className="text-sm text-foreground-muted mt-1">
                                Paid: ₦{(sale as any).paidAmount.toLocaleString()} | Balance: ₦{(sale.totalAmount - (sale as any).paidAmount).toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Customer & Employee Info */}
            <div className="grid md:grid-cols-2 gap-6 print:hidden">
                <div className="bg-card border border-border rounded-2xl p-6">
                    <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-4">Customer Information</p>
                    {customer ? (
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black text-lg">
                                {customer.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-black text-lg">{customer.name}</p>
                                <p className="text-sm text-foreground-muted">{customer.phone || 'No phone recorded'}</p>
                                {customer.email && <p className="text-sm text-foreground-muted">{customer.email}</p>}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-background-secondary border border-border flex items-center justify-center text-foreground-muted">
                                <FiUser size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-foreground-muted">Walk-in Customer</p>
                                <p className="text-sm text-foreground-muted">No customer assigned</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                    <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-4">Transaction Details</p>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-foreground-muted">Branch</span>
                            <span className="font-bold">{currentBranch?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-foreground-muted">Processed By</span>
                            <span className="font-bold">{(sale.soldBy as any)?.name || 'System'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-foreground-muted">Transaction ID</span>
                            <span className="font-mono font-bold text-accent">{(sale._id || sale.id || "").slice(-12).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden print:hidden">
                <div className="p-6 border-b border-border">
                    <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide">Order Items ({sale.items.length})</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-background-secondary border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold text-foreground-muted text-xs uppercase tracking-wide">Product</th>
                                <th className="px-6 py-4 text-center font-bold text-foreground-muted text-xs uppercase tracking-wide">Qty</th>
                                <th className="px-6 py-4 text-right font-bold text-foreground-muted text-xs uppercase tracking-wide">Unit Price</th>
                                <th className="px-6 py-4 text-right font-bold text-foreground-muted text-xs uppercase tracking-wide">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sale.items.map((item, idx) => {
                                const product = products.find(p => (p._id || p.id) === item.productId);
                                const displayName = item.productName || product?.name || 'Item Removed';

                                return (
                                    <tr key={idx} className="hover:bg-background-secondary/50">
                                        <td className="px-6 py-4">
                                            <p className="font-bold">{displayName}</p>
                                            {item.variantName && (
                                                <span className="text-[10px] font-black uppercase text-accent bg-accent/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                                                    {item.variantName}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold">×{item.quantity}</td>
                                        <td className="px-6 py-4 text-right font-medium">₦{item.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-black">₦{(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-background-secondary/50 border-t border-border">
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-right font-bold text-foreground-muted">Total</td>
                                <td className="px-6 py-4 text-right font-black text-xl">₦{sale.totalAmount.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Mobile Actions */}
            <div className="sm:hidden grid grid-cols-2 gap-4 print:hidden">
                <button
                    onClick={handlePrintReceipt}
                    className="btn bg-background-secondary border border-border p-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                    <FiPrinter /> Print
                </button>
                <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="btn btn-primary p-4 rounded-xl font-black flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <FiDownload /> {isDownloading ? "..." : "Download"}
                </button>
            </div>

            {/* Receipt Print Modal */}
            {showReceiptModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 print:bg-white print:relative print:inset-auto">
                    <div className="bg-white max-w-md w-full max-h-[90vh] overflow-auto rounded-2xl print:max-w-none print:w-full print:rounded-none print:max-h-none">
                        <div className="p-4 border-b flex justify-between items-center print:hidden">
                            <h3 className="font-bold text-gray-900">Print Preview</h3>
                            <button
                                onClick={() => setShowReceiptModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <FiX className="text-gray-600" />
                            </button>
                        </div>
                        <PrintableReceipt
                            ref={receiptRef}
                            sale={sale}
                            company={{
                                name: currentCompany?.name || 'Store',
                                logo: currentCompany?.logo,
                                address: currentCompany?.address,
                                phone: currentCompany?.phone,
                                email: currentCompany?.email,
                                settings: currentCompany?.settings
                            }}
                            branch={currentBranch ? { name: currentBranch.name } : undefined}
                            customer={customer}
                            soldBy={(sale.soldBy as any)?.name || currentUser?.name}
                        />
                        <div className="p-4 border-t flex gap-3 print:hidden">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <FiDownload /> {isDownloading ? "..." : "PDF"}
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex-1 py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                            >
                                <FiPrinter /> Print
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-receipt, .print-receipt * {
                        visibility: visible !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}

