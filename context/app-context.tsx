"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Interfaces ---

export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    PENDING_INVITE = 'PENDING_INVITE',
}

export interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    role: Role;
    branchId?: string;
    companyId?: string;
    status: UserStatus;
    needsOnboarding?: boolean;
    lastLoginAt?: string;
    lastActivityAt?: string;
    phone?: string;
}

export interface Customer {
    id: string;
    _id?: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    totalSpent: number;
    totalPurchases: number;
    creditBalance: number;
    creditLimit?: number;
    loyaltyPoints?: number;
    tier?: 'REGULAR' | 'VIP' | 'PREMIUM';
    lastPurchaseDate?: string;
}

export interface AuditLog {
    _id: string;
    action: string;
    entity: string;
    entityId: string;
    userName: string;
    createdAt: string;
    details: any;
    isSuspicious: boolean;
    suspiciousReason?: string;
}

export interface Branch {
    id: string;
    _id?: string;
    name: string;
    address: string;
}

export interface Product {
    id: string;
    _id?: string;
    name: string;
    category: string;
    sku: string;
    barcode?: string;
    costPrice: number;
    sellingPrice: number;
    stock: Record<string, number>;
    minStockLevel?: number;
    initialStock?: number;
    branchId?: string;
    supplierId?: string;
    description?: string;
    imageUrl?: string;
    variants?: any[];
}

export interface Category {
    id: string;
    _id?: string;
    name: string;
    description?: string;
}

export interface Supplier {
    id: string;
    _id?: string;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    category?: string;
    status?: string;
    paymentTerms?: string;
    notes?: string;
}

export interface SaleItem {
    productId: string;
    productName: string;
    variantName?: string;
    quantity: number;
    price: number;
}

export interface Sale {
    id: string;
    _id?: string;
    items: SaleItem[];
    totalAmount: number;
    paidAmount: number;
    paymentMethod: string;
    status: string;
    customerId?: string;
    branchId: string;
    companyId: string;
    soldBy?: {
        _id?: string;
        id?: string;
        name: string;
        email: string;
    } | string;
    createdAt?: string;
    date?: string;
}

export interface StockReceiptItem {
    productId: string;
    productName?: string;
    quantity: number;
    costPerUnit?: number;
}

export interface StockReceipt {
    _id: string;
    id?: string;
    receiptNumber: string;
    supplierInvoiceNumber?: string;
    branchId: string;
    supplierId: string;
    items: StockReceiptItem[];
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    totalAmount: number;
    receivedDate?: string;
    createdAt: string;
}

export interface StockTransaction {
    _id: string;
    productId: string;
    branchId: string;
    type: 'IN' | 'OUT' | 'ADJUST';
    quantity: number;
    reason: string;
    userId: string;
    createdAt: string;
}

export interface Company {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    logo?: string;
    taxId?: string;
    businessNiche?: string;
    website?: string;
    currency: string;
    settings: {
        lowStockThreshold: number;
        receiptFooter: string;
        taxRate: number;
        requireCustomerForSale: boolean;
        // Receipt Customization
        receiptHeader?: string;
        showLogoOnReceipt?: boolean;
        receiptWidth?: string;
        showStoreAddress?: boolean;
        showStorePhone?: boolean;
        showCustomerInfo?: boolean;
        showSoldBy?: boolean;
        receiptNote?: string;
    };
    subscriptionPlan: string;
}

interface AppContextType {
    currentUser: User | null;
    currentBranch: Branch | null;
    currentCompany: Company | null;
    users: User[];
    branches: Branch[];
    products: Product[];
    categories: Category[];
    suppliers: Supplier[];
    customers: Customer[];
    sales: Sale[];
    auditLogs: AuditLog[];
    loading: boolean;

    login: (email: string, password?: string) => Promise<boolean>;
    logout: () => void;
    switchBranch: (branchId: string) => void;

    refreshData: () => Promise<void>;
    addProduct: (product: any) => Promise<void>;
    updateProduct: (id: string, product: any) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addSale: (sale: any) => Promise<void>;

    // Suppliers
    addSupplier: (supplier: any) => Promise<void>;
    updateSupplier: (id: string, data: any) => Promise<void>;
    deleteSupplier: (id: string) => Promise<void>;
    getSupplierProfile: (id: string) => Promise<any>;

    // Customers
    addCustomer: (customer: any) => Promise<void>;
    updateCustomer: (id: string, data: any) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    updateCustomerCredit: (id: string, amount: number, operation: 'ADD' | 'DEDUCT') => Promise<void>;

    // Users
    addUser: (user: any) => Promise<void>;
    inviteUser: (data: { email: string; name: string; role: Role; branchId?: string }) => Promise<void>;
    suspendUser: (id: string, reason: string) => Promise<void>;
    activateUser: (id: string) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;

    // Company
    updateCompany: (data: any) => Promise<void>;
    updateCompanySettings: (settings: any) => Promise<void>;

    addBranch: (branch: any) => Promise<void>;
    register: (data: any) => Promise<boolean>;
    addCategory: (category: any) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    seedCategories: (niche: string) => Promise<void>;

    // Stock Management
    createStockReceipt: (receipt: any) => Promise<any>;
    getStockReceipts: (branchId?: string, status?: string) => Promise<StockReceipt[]>;
    verifyStockReceipt: (id: string) => Promise<any>;
    rejectStockReceipt: (id: string, reason: string) => Promise<any>;
    getProductTransactions: (productId: string) => Promise<StockTransaction[]>;
    adjustStock: (productId: string, branchId: string, quantity: number, type: string, reason: string) => Promise<any>;

    // Audit Logs
    fetchAuditLogs: (filters?: any) => Promise<void>;

    // Data Management
    deleteAccount: () => Promise<void>;
    purgeWorkspace: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
    const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(false);

    // Persistence
    useEffect(() => {
        const savedUser = localStorage.getItem('stockit_user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            refreshData();
        }
    }, [currentUser]);

    const getHeaders = () => {
        const token = localStorage.getItem('stockit_token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    };

    const refreshData = async () => {
        setLoading(true);
        try {
            const headers = getHeaders();
            const fetcher = (url: string) => fetch(url, { headers }).then(r => r.json());

            const [bRes, pRes, sRes, uRes, cRes, slRes, catRes, coRes] = await Promise.all([
                fetcher('/api/branches'),
                fetcher('/api/products'),
                fetcher('/api/suppliers'),
                fetcher('/api/users'),
                fetcher('/api/customers'),
                fetcher('/api/sales'),
                fetcher('/api/categories'),
                fetcher('/api/companies/profile')
            ]);

            setBranches(bRes);
            setProducts(pRes);
            setSuppliers(sRes);
            setUsers(uRes);
            setCustomers(cRes);
            setSales(slRes);
            setCategories(Array.isArray(catRes) ? catRes : []);
            setCurrentCompany(coRes);

            if (bRes.length > 0) {
                if (currentUser?.branchId) {
                    const assignedBranch = bRes.find((b: any) => (b._id || b.id) === currentUser.branchId);
                    if (assignedBranch) setCurrentBranch(assignedBranch);
                } else if (!currentBranch) {
                    setCurrentBranch(bRes[0]);
                }
            }

            if (currentUser && bRes.length > 0 && currentUser.needsOnboarding) {
                const updatedUser = { ...currentUser, needsOnboarding: false };
                setCurrentUser(updatedUser);
                localStorage.setItem('stockit_user', JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password = 'password123') => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.access_token) {
                localStorage.setItem('stockit_token', data.access_token);
                localStorage.setItem('stockit_user', JSON.stringify(data.user));
                setCurrentUser(data.user);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Login failed:", err);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('stockit_token');
        localStorage.removeItem('stockit_user');
        setCurrentUser(null);
    };

    const switchBranch = (branchId: string) => {
        // If user is restricted to a specific branch, prevent switching
        if (currentUser?.branchId && currentUser.branchId !== branchId) {
            console.warn("User is restricted to a specific branch");
            return;
        }

        const branch = branches.find(b => (b._id || b.id) === branchId);
        if (branch) setCurrentBranch(branch);
    };

    const addProduct = async (product: any) => {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(product)
        });
        if (!res.ok) {
            console.log(await res.json())
            throw new Error('Failed to add product');
        }
        await refreshData();
    };

    const updateProduct = async (id: string, product: any) => {
        const { _id, ...updateData } = product;
        const res = await fetch(`/api/products/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(updateData)
        });
        if (!res.ok) throw new Error('Failed to update product');
        await refreshData();
    };

    const deleteProduct = async (id: string) => {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete product');
        await refreshData();
    };

    const addCategory = async (category: any) => {
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(category)
        });
        if (!res.ok) throw new Error('Failed to add category');
        await refreshData();
    };

    const deleteCategory = async (id: string) => {
        const res = await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete category');
        await refreshData();
    };

    const seedCategories = async (niche: string) => {
        await fetch('/api/categories/seed', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ niche })
        });
        await refreshData();
    };

    const addSale = async (sale: any) => {
        await fetch('/api/sales', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(sale)
        });
        await refreshData();
    };

    // ====== SUPPLIER FUNCTIONS ======

    const addSupplier = async (supplier: any) => {
        await fetch('/api/suppliers', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(supplier)
        });
        await refreshData();
    };

    const updateSupplier = async (id: string, data: any) => {
        await fetch(`/api/suppliers/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        await refreshData();
    };

    const deleteSupplier = async (id: string) => {
        await fetch(`/api/suppliers/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        await refreshData();
    };

    const getSupplierProfile = async (id: string) => {
        const res = await fetch(`/api/suppliers/${id}/profile`, {
            headers: getHeaders()
        });
        return res.json();
    };

    // ====== CUSTOMER FUNCTIONS ======

    const addCustomer = async (customer: any) => {
        await fetch('/api/customers', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(customer)
        });
        await refreshData();
    };

    const updateCustomer = async (id: string, data: any) => {
        await fetch(`/api/customers/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        await refreshData();
    };

    const deleteCustomer = async (id: string) => {
        await fetch(`/api/customers/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        await refreshData();
    };

    const updateCustomerCredit = async (id: string, amount: number, operation: 'ADD' | 'DEDUCT') => {
        await fetch(`/api/customers/${id}/credit`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ amount, operation })
        });
        await refreshData();
    };

    // ====== USER FUNCTIONS ======

    const addUser = async (user: any) => {
        await fetch('/api/users', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(user)
        });
        await refreshData();
    };

    const inviteUser = async (data: any) => {
        await fetch('/api/users/invite', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        await refreshData();
    };

    const suspendUser = async (id: string, reason: string) => {
        await fetch(`/api/users/${id}/suspend`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ reason })
        });
        await refreshData();
    };

    const activateUser = async (id: string) => {
        await fetch(`/api/users/${id}/activate`, {
            method: 'PATCH',
            headers: getHeaders()
        });
        await refreshData();
    };

    const deleteUser = async (id: string) => {
        await fetch(`/api/users/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        await refreshData();
    };

    // ====== COMPANY FUNCTIONS ======

    const updateCompany = async (data: any) => {
        await fetch('/api/companies/profile', {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        await refreshData();
    };

    const updateCompanySettings = async (settings: any) => {
        await fetch('/api/companies/settings', {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(settings)
        });
        await refreshData();
    };

    const register = async (data: any) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.ok;
        } catch (err) {
            console.error("Registration failed:", err);
            return false;
        }
    };

    const addBranch = async (branch: any) => {
        await fetch('/api/branches', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(branch)
        });
        await refreshData();
    };

    // ====== STOCK MANAGEMENT FUNCTIONS ======

    const createStockReceipt = async (receipt: any) => {
        const res = await fetch('/api/inventory/receipts', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(receipt)
        });
        if (!res.ok) throw new Error('Failed to create stock receipt');
        const data = await res.json();
        await refreshData();
        return data;
    };

    const getStockReceipts = async (branchId?: string, status?: string): Promise<StockReceipt[]> => {
        let url = '/api/inventory/receipts';
        const params = new URLSearchParams();
        if (branchId) params.append('branchId', branchId);
        if (status) params.append('status', status);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url, { headers: getHeaders() });
        return res.json();
    };

    const verifyStockReceipt = async (id: string) => {
        const res = await fetch(`/api/inventory/receipts/${id}/verify`, {
            method: 'PATCH',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to verify receipt');
        const data = await res.json();
        await refreshData();
        return data;
    };

    const rejectStockReceipt = async (id: string, reason: string) => {
        const res = await fetch(`/api/inventory/receipts/${id}/reject`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ reason })
        });
        if (!res.ok) throw new Error('Failed to reject receipt');
        return res.json();
    };

    const getProductTransactions = async (productId: string): Promise<StockTransaction[]> => {
        const res = await fetch(`/api/inventory/transactions/product/${productId}`, {
            headers: getHeaders()
        });
        return res.json();
    };

    const adjustStock = async (productId: string, branchId: string, quantity: number, type: string, reason: string) => {
        const res = await fetch('/api/inventory/adjust', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ productId, branchId, quantity, type, reason })
        });
        if (!res.ok) throw new Error('Failed to adjust stock');
        const data = await res.json();
        await refreshData();
        return data;
    };

    // ====== AUDIT LOGS ======

    const fetchAuditLogs = async (filters?: any) => {
        let url = '/api/audit-logs';
        if (filters) {
            const params = new URLSearchParams(filters);
            url += `?${params.toString()}`;
        }
        const res = await fetch(url, { headers: getHeaders() });
        const data = await res.json();
        setAuditLogs(data.logs || []);
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            currentBranch,
            currentCompany,
            users,
            branches,
            products,
            categories,
            suppliers,
            customers,
            sales,
            auditLogs,
            loading,
            login,
            logout,
            switchBranch,
            refreshData,
            addProduct,
            updateProduct,
            deleteProduct,
            addSale,
            addCustomer,
            updateCustomer,
            deleteCustomer,
            updateCustomerCredit,
            addUser,
            inviteUser,
            suspendUser,
            activateUser,
            deleteUser,
            updateCompany,
            updateCompanySettings,
            addBranch,
            register,
            addCategory,
            deleteCategory,
            seedCategories,
            createStockReceipt,
            getStockReceipts,
            verifyStockReceipt,
            rejectStockReceipt,
            getProductTransactions,
            adjustStock,
            fetchAuditLogs,
            addSupplier,
            updateSupplier,
            deleteSupplier,
            getSupplierProfile,
            deleteAccount: async () => {
                const res = await fetch('/api/users/me/delete', {
                    method: 'PATCH',
                    headers: getHeaders()
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to delete account');
                }
                logout();
            },
            purgeWorkspace: async () => {
                const res = await fetch('/api/companies/danger/purge', {
                    method: 'PATCH',
                    headers: getHeaders()
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to purge workspace');
                }
                logout();
            }
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

