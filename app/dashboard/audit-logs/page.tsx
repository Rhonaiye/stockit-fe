"use client";

import { useState, useEffect } from "react";
import {
    FiShield,
    FiSearch,
    FiFilter,
    FiClock,
    FiUser,
    FiActivity,
    FiAlertTriangle,
    FiRefreshCcw,
    FiDownload,
    FiEye,
    FiLayers
} from "react-icons/fi";
import { useApp, AuditLog } from "@/context/app-context";

export default function AuditLogsPage() {
    const { auditLogs, fetchAuditLogs, currentUser } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    if (currentUser?.role !== 'OWNER' && currentUser?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center">
                    <FiShield className="text-4xl" />
                </div>
                <h1 className="text-2xl font-black">Security Restricted</h1>
                <p className="text-foreground-muted">Only high-level administrators can access system audit logs.</p>
            </div>
        );
    }

    const filteredLogs = auditLogs.filter(log =>
        (log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.entity.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterType === "ALL" || (filterType === "SUSPICIOUS" ? log.isSuspicious : true))
    );

    const getActionColor = (action: string) => {
        if (action.includes('CREATED')) return 'text-success bg-success/10 border-success/20';
        if (action.includes('DELETED')) return 'text-error bg-error/10 border-error/20';
        if (action.includes('UPDATED')) return 'text-accent bg-accent/10 border-accent/20';
        if (action.includes('FAILED')) return 'text-error bg-error/10 border-error/20';
        return 'text-foreground-muted bg-background-secondary border-border';
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <FiShield className="text-accent" /> Audit & Security Trail
                    </h1>
                    <p className="text-foreground-muted">Complete history of all critical actions performed in the system.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchAuditLogs()}
                        className="btn btn-secondary px-4 py-2 flex items-center gap-2"
                    >
                        <FiRefreshCcw /> Refresh
                    </button>
                    <button className="btn btn-secondary px-4 py-2 flex items-center gap-2">
                        <FiDownload /> Export
                    </button>
                </div>
            </div>

            {/* Suspicious Activity Banner */}
            {auditLogs.some(l => l.isSuspicious) && (
                <div className="bg-error/5 border border-error/20 p-6 rounded-[2rem] flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-error/10 text-error rounded-2xl flex items-center justify-center shrink-0">
                        <FiAlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-error italic uppercase tracking-tighter">Potential Security Risks Detected</h4>
                        <p className="text-sm text-error/80 font-medium">Multiple suspicious activities have been flagged. Please review red-marked entries immediately.</p>
                    </div>
                </div>
            )}

            <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
                {/* Search & Filters */}
                <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-secondary/30">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                        <input
                            type="text"
                            placeholder="Filter by user, action or entity..."
                            className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 outline-none focus:border-accent transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            className="bg-background border border-border rounded-xl px-4 py-3 outline-none text-sm font-bold"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="ALL">All Activities</option>
                            <option value="SUSPICIOUS">Suspicious Only</option>
                        </select>
                        <div className="text-xs font-bold text-foreground-muted uppercase tracking-widest px-4">
                            Showing {filteredLogs.length} Entries
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-background-secondary/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-2">Action</div>
                    <div className="col-span-3">Entity</div>
                    <div className="col-span-3">Performed By</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-right">View</div>
                </div>

                <div className="divide-y divide-border">
                    {filteredLogs.map((log) => (
                        <div key={log._id} className={`group p-4 md:px-6 md:py-4 transition-all hover:bg-background-secondary/30 ${log.isSuspicious ? 'bg-error/[0.02]' : ''}`}>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                {/* Timestamp */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        <FiClock className="text-foreground-muted shrink-0" size={14} />
                                        <div>
                                            <div className="font-bold text-foreground">{new Date(log.createdAt).toLocaleDateString()}</div>
                                            <div className="text-[10px] text-foreground-muted font-bold tracking-tight">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="col-span-1 md:col-span-2">
                                    <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">Action</span>
                                    <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${getActionColor(log.action)}`}>
                                        {log.action.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                {/* Entity */}
                                <div className="col-span-1 md:col-span-3">
                                    <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">Entity</span>
                                    <div className="flex items-center gap-2">
                                        <FiLayers className="text-foreground-muted shrink-0" size={14} />
                                        <div className="text-sm font-bold text-foreground truncate">{log.entity}</div>
                                    </div>
                                </div>

                                {/* Performed By */}
                                <div className="col-span-1 md:col-span-3">
                                    <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">Performed By</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-black text-accent uppercase shrink-0">
                                            {log.userName.substring(0, 1)}
                                        </div>
                                        <span className="text-sm font-medium text-foreground-muted group-hover:text-foreground transition-colors truncate">{log.userName}</span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 md:col-span-1 text-left md:text-center">
                                    <span className="md:hidden text-[10px] font-black uppercase text-foreground-muted block mb-1">Status</span>
                                    {log.isSuspicious ? (
                                        <span className="inline-flex items-center gap-1 text-error text-[10px] font-black uppercase italic animate-pulse">
                                            <FiAlertTriangle /> Suspicious
                                        </span>
                                    ) : (
                                        <span className="text-success text-[10px] font-black uppercase opacity-60">Verified</span>
                                    )}
                                </div>

                                {/* Detail Action */}
                                <div className="col-span-1 md:col-span-1 flex justify-end">
                                    <button
                                        onClick={() => setSelectedLog(log)}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-background-secondary/50 text-foreground-muted hover:bg-accent/10 hover:text-accent border border-transparent hover:border-accent/20 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                        title="View Details"
                                    >
                                        <FiEye size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Log Details Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-border flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">Activity Details</h3>
                                <p className="text-foreground-muted text-sm uppercase font-bold tracking-widest">{selectedLog.action}</p>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-background-secondary rounded-full transition-colors">
                                <FiX className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Performed By</p>
                                        <p className="font-bold flex items-center gap-2 text-lg"><FiUser className="text-accent" /> {selectedLog.userName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Entity Modified</p>
                                        <p className="font-bold flex items-center gap-2 text-lg"><FiLayers className="text-accent" /> {selectedLog.entity} ({selectedLog.entityId})</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Timestamp</p>
                                        <p className="font-bold flex items-center gap-2 text-lg"><FiClock className="text-accent" /> {new Date(selectedLog.createdAt).toLocaleString()}</p>
                                    </div>
                                    {selectedLog.isSuspicious && (
                                        <div className="bg-error/10 border border-error/20 p-4 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase text-error tracking-widest">Suspicion Reason</p>
                                            <p className="text-error font-medium">{selectedLog.suspiciousReason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase text-foreground-muted tracking-widest">Action Details (JSON)</p>
                                <div className="bg-background border border-border rounded-2xl p-6 overflow-auto max-h-[300px]">
                                    <pre className="text-xs font-mono text-accent">
                                        {JSON.stringify(selectedLog.details, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-background-secondary/50 border-t border-border flex justify-end">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="btn btn-secondary px-8 py-3 rounded-2xl font-bold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FiX(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
