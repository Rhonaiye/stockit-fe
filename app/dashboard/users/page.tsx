"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FiPlus,
    FiMoreVertical,
    FiUser,
    FiShield,
    FiMapPin,
    FiX,
    FiMail,
    FiLock,
    FiActivity,
    FiAlertCircle,
    FiCheckCircle,
    FiSend,
    FiLink,
    FiCopy,
    FiTrash2
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { useApp, User, Role, UserStatus } from "@/context/app-context";
import { toast } from "sonner";

export default function UsersPage() {
    const { users, branches, suspendUser, activateUser, deleteUser, currentUser } = useApp();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [actionModal, setActionModal] = useState<'SUSPEND' | 'DELETE' | null>(null);
    const [reason, setReason] = useState("");

    const handleAction = async () => {
        if (!selectedUser || !actionModal) return;

        try {
            if (actionModal === 'SUSPEND') {
                await suspendUser(selectedUser._id || selectedUser.id || "", reason);
                toast.success("User access suspended");
            } else if (actionModal === 'DELETE') {
                await deleteUser(selectedUser._id || selectedUser.id || "");
                toast.success("User permanently deleted");
            }
            closeModal();
        } catch (error) {
            toast.error("Action failed");
            console.error(error);
        }
    };

    const handleActivate = async (user: User) => {
        try {
            await activateUser(user._id || user.id || "");
            toast.success("User account activated");
        } catch (error) {
            toast.error("Activation failed");
        }
    };

    const closeModal = () => {
        setActionModal(null);
        setReason("");
        setSelectedUser(null);
    };

    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(currentUser?.role || '')) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center">
                    <FiLock className="text-3xl" />
                </div>
                <h1 className="text-xl font-black">Access Denied</h1>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Team Members</h1>
                    <p className="text-sm text-foreground-muted max-w-md">Manage staff access and permissions.</p>
                </div>
                <Link
                    href="/dashboard/users/invite"
                    className="btn btn-primary px-5 py-2.5 flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all"
                >
                    <FiSend /> Invite User
                </Link>
            </div>

            {/* Compact List Header */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-background-secondary/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                    <div className="col-span-4">User Identity</div>
                    <div className="col-span-3">Role & Branch</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3 text-right">Actions</div>
                </div>

                <div className="divide-y divide-border">
                    {users.map((user) => {
                        const isMe = user._id === currentUser?._id;
                        return (
                            <div key={user._id || user.id} className="group p-4 md:px-6 md:py-3 hover:bg-background-secondary/30 transition-colors">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    {/* User Identity */}
                                    <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                                        <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center font-black text-sm shadow-inner ${user.status === UserStatus.ACTIVE ? 'bg-accent/10 text-accent' :
                                            user.status === UserStatus.SUSPENDED ? 'bg-error/10 text-error' : 'bg-background-secondary text-foreground-muted'
                                            }`}>
                                            {user.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-sm truncate">{user.name}</h3>
                                                {isMe && <span className="text-[9px] bg-accent text-white px-1.5 rounded uppercase font-black">You</span>}
                                            </div>
                                            <div className="text-xs text-foreground-muted truncate font-medium">{user.email}</div>
                                        </div>
                                    </div>

                                    {/* Role & Branch */}
                                    <div className="col-span-1 md:col-span-3 flex md:flex-col gap-2 md:gap-0.5 mt-2 md:mt-0">
                                        <div className="flex items-center gap-1.5">
                                            <FiShield className="text-accent text-xs" />
                                            <span className="text-xs font-bold uppercase">{user.role}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-foreground-muted">
                                            <FiMapPin className="text-xs" />
                                            <span className="text-xs">{branches.find(b => (b._id || b.id) === user.branchId)?.name || 'Central Office'}</span>
                                        </div>
                                    </div>

                                    {/* Status & Activity */}
                                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-start gap-4 mt-2 md:mt-0">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${user.status === UserStatus.ACTIVE ? "bg-success/10 text-success" :
                                            user.status === UserStatus.SUSPENDED ? "bg-error/10 text-error" :
                                                "bg-warning/10 text-warning"
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === UserStatus.ACTIVE ? 'bg-success animate-pulse' : 'bg-current'}`} />
                                            {user.status}
                                        </span>
                                        <span className="md:hidden text-[10px] text-foreground-muted uppercase font-bold">
                                            {user.lastActivityAt ? formatDistanceToNow(new Date(user.lastActivityAt)) + ' ago' : 'Never'}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-2 mt-2 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        {!isMe && (
                                            <>
                                                {user.status === UserStatus.SUSPENDED ? (
                                                    <button
                                                        onClick={() => handleActivate(user)}
                                                        className="h-8 px-3 rounded-md bg-success/10 text-success hover:bg-success hover:text-white border border-success/20 text-xs font-bold transition-all flex items-center gap-1.5"
                                                    >
                                                        <FiCheckCircle /> Activate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => { setSelectedUser(user); setActionModal('SUSPEND'); }}
                                                        className="h-8 w-8 rounded-md bg-background-secondary text-foreground-muted hover:bg-warning/10 hover:text-warning hover:border-warning/20 border border-transparent transition-all flex items-center justify-center"
                                                        title="Suspend Access"
                                                    >
                                                        <FiLock />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => { setSelectedUser(user); setActionModal('DELETE'); }}
                                                    className="h-8 w-8 rounded-md bg-background-secondary text-foreground-muted hover:bg-error/10 hover:text-error hover:border-error/20 border border-transparent transition-all flex items-center justify-center"
                                                    title="Remove User"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </>
                                        )}
                                        <div className="text-[10px] text-foreground-muted font-bold text-right hidden md:block ml-2 w-24">
                                            {user.lastActivityAt ? formatDistanceToNow(new Date(user.lastActivityAt)) + ' ago' : 'Never'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Modal */}
            {actionModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className={`px-6 py-4 border-b border-border flex items-center gap-3 ${actionModal === 'DELETE' ? 'bg-error/5' : 'bg-warning/5'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${actionModal === 'DELETE' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}>
                                {actionModal === 'DELETE' ? <FiTrash2 /> : <FiLock />}
                            </div>
                            <h3 className="text-lg font-black tracking-tight">
                                {actionModal === 'DELETE' ? 'Remove User' : 'Suspend Access'}
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-sm text-foreground-muted font-medium">
                                {actionModal === 'DELETE'
                                    ? `Are you sure you want to permanently delete ${selectedUser.name}? This action cannot be undone.`
                                    : `Suspend ${selectedUser.name}'s access? They will be unable to log in.`
                                }
                            </p>

                            {/* Reason Input only for Suspend */}
                            {actionModal === 'SUSPEND' && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Reason (Optional)</label>
                                    <textarea
                                        className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-accent outline-none min-h-[80px]"
                                        placeholder="Why is this user being suspended?"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 btn bg-background-secondary text-foreground hover:bg-background-secondary/80 py-2.5 rounded-lg text-sm font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAction}
                                    className={`flex-1 btn py-2.5 rounded-lg text-sm font-bold shadow-lg text-white ${actionModal === 'DELETE'
                                        ? 'bg-error hover:bg-error-dark shadow-error/20'
                                        : 'bg-warning hover:bg-warning-dark shadow-warning/20'
                                        }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
