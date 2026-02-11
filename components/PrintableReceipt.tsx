"use client";

import { Sale, Customer } from "@/context/app-context";
import { format } from "date-fns";
import { forwardRef } from "react";

interface ReceiptSettings {
    receiptHeader?: string;
    receiptFooter?: string;
    showLogoOnReceipt?: boolean;
    showStoreAddress?: boolean;
    showStorePhone?: boolean;
    showCustomerInfo?: boolean;
    showSoldBy?: boolean;
    receiptNote?: string;
}

interface PrintableReceiptProps {
    sale: Sale;
    company: {
        name: string;
        logo?: string;
        address?: string;
        phone?: string;
        email?: string;
        settings?: ReceiptSettings;
    };
    branch?: { name: string };
    customer?: Customer | null;
    soldBy?: string;
}

export const PrintableReceipt = forwardRef<HTMLDivElement, PrintableReceiptProps>(
    ({ sale, company, branch, customer, soldBy }, ref) => {
        const settings = company.settings || {};
        const saleDate = new Date(sale.createdAt || new Date());

        return (
            <div ref={ref} className="print-receipt bg-white text-black p-6 max-w-[80mm] mx-auto font-mono text-xs">
                <style jsx>{`
                    @media print {
                        .print-receipt {
                            width: 80mm !important;
                            margin: 0 auto;
                            padding: 10mm;
                            font-size: 10px;
                        }
                        @page {
                            size: 80mm auto;
                            margin: 0;
                        }
                    }
                `}</style>

                {/* Header */}
                <div className="text-center border-b border-dashed border-gray-400 pb-4 mb-4">
                    {settings.showLogoOnReceipt && company.logo && (
                        <img src={company.logo} alt={company.name} className="h-12 mx-auto mb-2 object-contain" />
                    )}
                    <h1 className="text-lg font-black uppercase">{company.name}</h1>
                    {settings.receiptHeader && (
                        <p className="text-[10px] mt-1">{settings.receiptHeader}</p>
                    )}
                    {settings.showStoreAddress && company.address && (
                        <p className="text-[10px] mt-1">{company.address}</p>
                    )}
                    {settings.showStorePhone && company.phone && (
                        <p className="text-[10px]">Tel: {company.phone}</p>
                    )}
                    {branch && <p className="text-[10px] font-bold mt-1">Branch: {branch.name}</p>}
                </div>

                {/* Receipt Info */}
                <div className="border-b border-dashed border-gray-400 pb-4 mb-4 space-y-1">
                    <div className="flex justify-between">
                        <span>Receipt #:</span>
                        <span className="font-bold">{(sale._id || sale.id || "").slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{format(saleDate, "dd/MM/yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{format(saleDate, "HH:mm")}</span>
                    </div>
                    {settings.showCustomerInfo && customer && (
                        <div className="flex justify-between">
                            <span>Customer:</span>
                            <span>{customer.name}</span>
                        </div>
                    )}
                    {settings.showSoldBy && soldBy && (
                        <div className="flex justify-between">
                            <span>Cashier:</span>
                            <span>{soldBy}</span>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="border-b border-dashed border-gray-400 pb-4 mb-4">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="text-left py-1">Item</th>
                                <th className="text-center py-1">Qty</th>
                                <th className="text-right py-1">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="py-1 pr-2">
                                        <div className="truncate max-w-[120px]">{item.productName}</div>
                                        {item.variantName && (
                                            <div className="text-[8px] text-gray-500">({item.variantName})</div>
                                        )}
                                        <div className="text-[8px] text-gray-500">@ ₦{item.price.toLocaleString()}</div>
                                    </td>
                                    <td className="text-center py-1">{item.quantity}</td>
                                    <td className="text-right py-1">₦{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="space-y-1 mb-4">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₦{sale.items.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}</span>
                    </div>
                    {(sale as any).discount && (sale as any).discount > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span>Discount:</span>
                            <span>-₦{(sale as any).discount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-black text-base border-t border-gray-400 pt-2 mt-2">
                        <span>TOTAL:</span>
                        <span>₦{sale.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                        <span>Payment:</span>
                        <span className="font-bold uppercase">{sale.paymentMethod}</span>
                    </div>
                    {(sale as any).paidAmount !== undefined && (sale as any).paidAmount !== sale.totalAmount && (
                        <>
                            <div className="flex justify-between text-[10px]">
                                <span>Paid:</span>
                                <span>₦{(sale as any).paidAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span>Balance:</span>
                                <span>₦{(sale.totalAmount - (sale as any).paidAmount).toLocaleString()}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center border-t border-dashed border-gray-400 pt-4 space-y-2">
                    {settings.receiptNote && (
                        <p className="text-[10px] italic">{settings.receiptNote}</p>
                    )}
                    <p className="text-[10px]">{settings.receiptFooter || "Thank you for your business!"}</p>
                    <p className="text-[8px] text-gray-500 mt-2">
                        Powered by StockIt
                    </p>
                </div>
            </div>
        );
    }
);

PrintableReceipt.displayName = "PrintableReceipt";

export default PrintableReceipt;
