"use client";

import { useState } from "react";
import { useApp, Role } from "@/context/app-context";
import { toast } from "sonner";
import { FiMail, FiLink, FiUser, FiCopy, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InviteUserPage() {
    const { inviteUser, branches, currentCompany } = useApp();
    const router = useRouter();
    const [inviteMethod, setInviteMethod] = useState<'email' | 'link'>('email');
    const [inviteLink, setInviteLink] = useState<string>('');
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [inviteData, setInviteData] = useState({
        name: '', email: '', role: 'STAFF' as Role, branchId: ''
    });

    const handleGenerateLink = async () => {
        setIsGeneratingLink(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('stockit_token') : null;
            const response = await fetch(`/api/invites/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    role: inviteData.role,
                    branchId: inviteData.branchId || 'all'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate link');
            }

            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const link = `${baseUrl}/join?token=${data.token}&role=${inviteData.role}&branch=${inviteData.branchId || 'all'}&company=${currentCompany?._id || ''}`;
            setInviteLink(link);
            toast.success('Secure invite link generated!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate invite link');
        } finally {
            setIsGeneratingLink(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await inviteUser(inviteData);
            setInviteData({ name: '', email: '', role: 'STAFF', branchId: '' });
            router.push('/dashboard/users');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/users"
                    className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center hover:bg-accent/10 hover:border-accent/20 transition-all"
                >
                    <FiArrowLeft />
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Invite Team Member</h1>
                    <p className="text-foreground-muted">Add new members to your organization.</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                {/* Invite Method Tabs */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setInviteMethod('email')}
                        className={`flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest transition-colors ${inviteMethod === 'email' ? 'bg-accent/10 text-accent border-b-2 border-accent' : 'text-foreground-muted hover:bg-background-secondary'}`}
                    >
                        <FiMail className="inline mr-2" /> Email Invite
                    </button>
                    <button
                        onClick={() => setInviteMethod('link')}
                        className={`flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest transition-colors ${inviteMethod === 'link' ? 'bg-accent/10 text-accent border-b-2 border-accent' : 'text-foreground-muted hover:bg-background-secondary'}`}
                    >
                        <FiLink className="inline mr-2" /> Shareable Link
                    </button>
                </div>

                {inviteMethod === 'email' ? (
                    <form onSubmit={handleInvite} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Jane Smith"
                                        className="w-full bg-background-secondary border border-border rounded-md pl-12 pr-4 py-4 outline-none focus:border-accent transition-colors"
                                        value={inviteData.name}
                                        onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="jane@company.com"
                                        className="w-full bg-background-secondary border border-border rounded-md pl-12 pr-4 py-4 outline-none focus:border-accent transition-colors"
                                        value={inviteData.email}
                                        onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Role</label>
                                    <select
                                        className="w-full bg-background-secondary border border-border rounded-md px-4 py-4 outline-none focus:border-accent transition-colors"
                                        value={inviteData.role}
                                        onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as Role })}
                                    >
                                        <option value="STAFF">Staff (Inventory & Sales)</option>
                                        <option value="MANAGER">Manager (Reports & Editing)</option>
                                        <option value="ADMIN">Admin (Full Control)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Assigned Branch</label>
                                    <select
                                        className="w-full bg-background-secondary border border-border rounded-md px-4 py-4 outline-none focus:border-accent transition-colors"
                                        value={inviteData.branchId}
                                        onChange={(e) => setInviteData({ ...inviteData, branchId: e.target.value })}
                                    >
                                        <option value="">Full Company Access</option>
                                        {branches.map(b => (
                                            <option key={b._id || b.id} value={b._id || b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-4 rounded-md font-black text-lg shadow-xl shadow-accent/20 disabled:opacity-50"
                        >
                            {isLoading ? 'Sending...' : 'Send Email Invitation'}
                        </button>
                        <p className="text-[10px] text-center text-foreground-muted uppercase font-bold tracking-widest">
                            The user will receive an email to set their password.
                        </p>
                    </form>
                ) : (
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Role for Invitees</label>
                                    <select
                                        className="w-full bg-background-secondary border border-border rounded-md px-4 py-4 outline-none focus:border-accent transition-colors"
                                        value={inviteData.role}
                                        onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as Role })}
                                    >
                                        <option value="STAFF">Staff (Inventory & Sales)</option>
                                        <option value="MANAGER">Manager (Reports & Editing)</option>
                                        <option value="ADMIN">Admin (Full Control)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Assigned Branch</label>
                                    <select
                                        className="w-full bg-background-secondary border border-border rounded-md px-4 py-4 outline-none focus:border-accent transition-colors"
                                        value={inviteData.branchId}
                                        onChange={(e) => setInviteData({ ...inviteData, branchId: e.target.value })}
                                    >
                                        <option value="">Full Company Access</option>
                                        {branches.map(b => (
                                            <option key={b._id || b.id} value={b._id || b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground-muted">Shareable Invite Link</label>
                                <div className="flex gap-2">
                                    <input
                                        readOnly
                                        type="text"
                                        value={inviteLink || 'Click button to generate link'}
                                        className="flex-1 bg-background-secondary border border-border rounded-md px-4 py-4 outline-none text-sm font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGenerateLink}
                                        disabled={isGeneratingLink}
                                        className="btn btn-primary px-6 py-4 rounded-md font-black shrink-0"
                                    >
                                        {isGeneratingLink ? '...' : inviteLink ? <FiCopy /> : 'Generate'}
                                    </button>
                                </div>
                            </div>

                            {inviteLink && (
                                <div className="p-4 bg-success/10 border border-success/20 rounded-md">
                                    <p className="text-xs text-success font-bold flex items-center gap-2">
                                        <FiCheckCircle /> Link generated! Share this link with your team member.
                                    </p>
                                    <p className="text-[10px] text-foreground-muted mt-2">
                                        This link expires in 7 days and can only be used once.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                if (inviteLink) {
                                    navigator.clipboard.writeText(inviteLink);
                                    toast.success('Invite link copied to clipboard!');
                                }
                            }}
                            disabled={!inviteLink}
                            className="btn btn-primary w-full py-4 rounded-md font-black text-lg shadow-xl shadow-accent/20 disabled:opacity-50"
                        >
                            <FiCopy className="mr-2" /> Copy Link to Clipboard
                        </button>
                        <p className="text-[10px] text-center text-foreground-muted uppercase font-bold tracking-widest">
                            Anyone with this link can join with the selected role.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
