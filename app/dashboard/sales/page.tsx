"use client";

import { useState } from "react";
import { FiPlus, FiMinus, FiTrash2, FiTrash, FiShoppingCart, FiUser, FiSearch, FiCheck, FiX, FiBox, FiLoader } from 'react-icons/fi';
import { useApp, Product, SaleItem } from "@/context/app-context";
import { toast } from 'sonner';

export default function SalesPage() {
    // Context Data
    const { products, customers, currentBranch, currentUser, currentCompany, addSale } = useApp();

    // Local State
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'POS' | 'TRANSFER' | 'CREDIT'>('CASH');
    const [isProcessing, setIsProcessing] = useState(false);

    // Variant Selection Modal State
    const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

    if (!currentBranch) return <div>Loading...</div>;

    const branchKey = (currentBranch as any)?._id || currentBranch.id;

    // Filter products by branchId and search term
    const availableProducts = products.filter(p => {
        // Show if product is assigned to this branch OR if it's a global product (no branchId)
        const isForThisBranch = !p.branchId || (p as any).branchId === branchKey;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
        return isForThisBranch && matchesSearch;
    });

    const addToCart = (product: Product, variant?: { name: string, price: number }) => {
        const branchKey = (currentBranch as any)?._id || currentBranch.id;
        const stock = product.stock?.[branchKey] || 0;
        const productId = product._id || product.id;
        const variantName = variant?.name;

        // Check if item with this specific variant is already in cart
        const cartItemId = variantName ? `${productId}-${variantName}` : productId;

        if (stock <= 0) {
            toast.error('Insufficient stock in this branch!');
            return;
        }

        const existingIndex = cart.findIndex(x => {
            const id = x.variantName ? `${x.productId}-${x.variantName}` : x.productId;
            return id === cartItemId;
        });

        if (existingIndex > -1) {
            const newCart = [...cart];
            newCart[existingIndex].quantity += 1;
            setCart(newCart);
        } else {
            setCart([...cart, {
                productId: productId,
                productName: product.name,
                variantName: variantName,
                quantity: 1,
                price: variant ? variant.price : product.sellingPrice
            }]);
        }

        if (variantModalProduct) setVariantModalProduct(null);
    };

    const handleProductClick = (product: Product) => {
        if (product.variants && product.variants.length > 0) {
            setVariantModalProduct(product);
        } else {
            addToCart(product);
        }
    };

    const updateQty = (cartItem: SaleItem, delta: number) => {
        const cartItemId = cartItem.variantName ? `${cartItem.productId}-${cartItem.variantName}` : cartItem.productId;

        setCart(cart.map(item => {
            const itemId = item.variantName ? `${item.productId}-${item.variantName}` : item.productId;
            if (itemId === cartItemId) {
                const product = products.find(p => (p._id || p.id) === item.productId);
                const branchKey = (currentBranch as any)?._id || currentBranch.id;
                const maxStock = product?.stock?.[branchKey] || 0;
                const newQty = item.quantity + delta;

                if (newQty > maxStock) {
                    toast.error('Cannot exceed available stock');
                    return item;
                }
                return { ...item, quantity: Math.max(1, newQty) };
            }
            return item;
        }));
    };

    const removeFromCart = (cartItem: SaleItem) => {
        const cartItemId = cartItem.variantName ? `${cartItem.productId}-${cartItem.variantName}` : cartItem.productId;
        setCart(cart.filter(item => {
            const itemId = item.variantName ? `${item.productId}-${item.variantName}` : item.productId;
            return itemId !== cartItemId;
        }));
    };

    const handleCheckout = async () => {
        if (cart.length === 0 || isProcessing) return;

        // Check if customer is required
        if (currentCompany?.settings?.requireCustomerForSale && !selectedCustomerId) {
            toast.error('Identity Protocol: A customer must be assigned to this transaction.');
            return;
        }

        setIsProcessing(true);
        try {
            await addSale({
                branchId: (currentBranch as any)?._id || currentBranch.id,
                companyId: currentUser?.companyId || 'mock_company_id',
                customerId: selectedCustomerId || undefined,
                items: cart.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    variantName: item.variantName,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: total,
                paidAmount: paymentMethod === 'CREDIT' ? 0 : total,
                paymentMethod,
                status: 'COMPLETED'
            });

            toast.success('Sale Processed Successfully!');
            setCart([]);
            setPaymentMethod('CASH');
            setSelectedCustomerId('');
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to process sale. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxRate = currentCompany?.settings?.taxRate || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto pr-2">
                {/* Search & Header */}
                <div className="mb-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-xl">POS Terminal</h2>
                        <div className="text-sm font-medium bg-accent/10 text-accent px-3 py-1 rounded-full">{currentBranch.name}</div>
                    </div>

                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search products by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-3 outline-none focus:border-accent shadow-sm text-lg"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {availableProducts.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-background-secondary rounded-md border-2 border-dashed border-border text-foreground-muted">
                            <FiBox className="text-4xl mx-auto mb-3 opacity-20" />
                            <p className="font-bold">No products found matching your search.</p>
                            <p className="text-xs">Add products in the Inventory section first.</p>
                        </div>
                    ) : (
                        availableProducts.map(product => {
                            const branchKey = (currentBranch as any)?._id || currentBranch.id;
                            const qty = product.stock?.[branchKey] || 0;
                            const isOutOfStock = qty <= 0;
                            const hasVariants = product.variants && product.variants.length > 0;

                            return (
                                <button
                                    key={product._id || product.id}
                                    onClick={() => handleProductClick(product)}
                                    className={`bg-card border border-border p-4 rounded-xl hover:border-accent transition-all hover:shadow-md text-left flex flex-col gap-3 relative group group/card ${isOutOfStock ? 'opacity-60' : ''}`}
                                >
                                    <div className={`text-5xl bg-background-secondary w-full aspect-[4/3] rounded-lg flex items-center justify-center group-hover/card:bg-accent/5 transition-colors ${isOutOfStock ? 'grayscale' : ''}`}>
                                        📦
                                    </div>
                                    <div className="w-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-bold text-sm truncate">{product.name}</h4>
                                            {isOutOfStock && (
                                                <span className="text-[10px] font-black text-error bg-error/10 px-1.5 py-0.5 rounded uppercase">Out</span>
                                            )}
                                        </div>

                                        <p className="text-accent font-black text-xl mb-2">₦{product.sellingPrice.toLocaleString()}</p>

                                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${qty < 5 && !isOutOfStock ? 'bg-warning/10 text-warning' : 'bg-background-secondary text-foreground-muted'}`}>
                                                Qty: {qty}
                                            </span>

                                            {hasVariants && (
                                                <div className="text-[10px] font-bold text-foreground-muted flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                    {product.variants?.length} Variants
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Cart Sidebar */}
            <div className="w-full lg:w-96 bg-card border border-border rounded-md p-6 flex flex-col shadow-xl h-full">
                <div className="mb-6 space-y-4">
                    <h2 className="font-black text-xl flex items-center gap-2">
                        <FiShoppingCart /> Current Order
                    </h2>

                    {/* Customer Selector */}
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
                        <select
                            className="w-full bg-background-secondary border border-border rounded-md pl-10 pr-4 py-2 text-sm outline-none appearance-none cursor-pointer"
                            value={selectedCustomerId}
                            onChange={(e) => setSelectedCustomerId(e.target.value)}
                        >
                            <option value="">Guest Customer</option>
                            {customers.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-foreground-muted opacity-50">
                            <FiShoppingCart className="text-4xl mb-2" />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={`${item.productId}-${item.variantName || 'base'}`} className="flex items-center gap-3 bg-background-secondary p-3 rounded-md border border-border">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">{item.productName}</h4>
                                    {item.variantName && (
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-accent/10 text-accent px-1.5 py-0.5 rounded leading-none block w-fit mt-0.5 mb-1">
                                            {item.variantName}
                                        </span>
                                    )}
                                    <p className="text-xs text-foreground-muted">₦{item.price.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQty(item, -1)} className="p-1 rounded bg-background hover:bg-border"><FiMinus className="w-3 h-3" /></button>
                                    <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                                    <button onClick={() => updateQty(item, 1)} className="p-1 rounded bg-background hover:bg-border"><FiPlus className="w-3 h-3" /></button>
                                </div>
                                <button onClick={() => removeFromCart(item)} className="text-error hover:text-red-700 ml-1">
                                    <FiTrash />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                    <div className="space-y-1 text-sm border-b border-border pb-4">
                        <div className="flex justify-between text-foreground-muted">
                            <span>Subtotal</span>
                            <span>₦{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-foreground-muted">
                            <span>Tax ({taxRate}%)</span>
                            <span>₦{taxAmount.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex justify-between font-black text-2xl">
                        <span>Total</span>
                        <span>₦{total.toLocaleString()}</span>
                    </div>

                    {/* Payment Method */}
                    <div className="grid grid-cols-2 gap-2">
                        {['CASH', 'POS', 'TRANSFER', 'CREDIT'].map(method => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method as any)}
                                className={`py-2 text-xs font-bold rounded-lg border ${paymentMethod === method ? 'bg-accent text-white border-accent' : 'bg-background border-border hover:bg-background-secondary'}`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isProcessing}
                        className="btn btn-primary w-full py-4 text-lg font-bold rounded-md shadow-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <FiLoader className="animate-spin" /> Processing...
                            </>
                        ) : (
                            'Confirm Payment'
                        )}
                    </button>
                </div>
            </div>

            {/* Variant Selection Modal */}
            {variantModalProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-background w-full max-w-md rounded-md shadow-2xl overflow-hidden border border-border">
                        <div className="p-8 border-b border-border bg-background-secondary/30">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-black text-2xl tracking-tight">Select Variant</h3>
                                <button onClick={() => setVariantModalProduct(null)} className="w-10 h-10 rounded-md bg-background border border-border flex items-center justify-center hover:rotate-90 transition-all shadow-sm">
                                    <FiX className="text-xl" />
                                </button>
                            </div>
                            <p className="text-sm text-foreground-muted">Choose the specific variant of <span className="text-foreground font-bold">{variantModalProduct.name}</span></p>
                        </div>

                        <div className="p-8 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {variantModalProduct.variants?.map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() => addToCart(variantModalProduct, v)}
                                    className="w-full flex justify-between items-center p-5 bg-card hover:bg-accent/5 border border-border hover:border-accent rounded-md transition-all group"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-lg group-hover:text-accent transition-colors">{v.name}</div>
                                        <div className="text-[10px] font-mono text-foreground-muted">{v.sku || 'No SKU'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-xl">₦{v.price.toLocaleString()}</div>
                                        <div className="text-[10px] uppercase font-black text-accent opacity-0 group-hover:opacity-100 transition-opacity">Select Item</div>
                                    </div>
                                </button>
                            ))}

                            {/* Option to select base product if needed - although usually with variants you select a variant */}
                            <button
                                onClick={() => addToCart(variantModalProduct)}
                                className="w-full flex justify-between items-center p-5 bg-background-secondary/30 hover:bg-background-secondary/50 border border-dashed border-border rounded-md transition-all mt-4"
                            >
                                <div className="text-left">
                                    <div className="font-bold">Base Product</div>
                                    <div className="text-[10px] text-foreground-muted">Standard version</div>
                                </div>
                                <div className="font-black">₦{variantModalProduct.sellingPrice.toLocaleString()}</div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
