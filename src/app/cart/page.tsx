"use client";

import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface CartItem {
    _id: string;
    product: any;
    quantity: number;
}

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
    const [activeCouponCodes, setActiveCouponCodes] = useState<string[]>([]);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const [cartRes, couponRes] = await Promise.all([
                    api.get('/cart'),
                    api.get('/coupons/active')
                ]);
                setCartItems(cartRes.data?.items || []);
                setActiveCouponCodes(couponRes.data.map((c: any) => c.code));
            } catch { setCartItems([]); }
            finally { setLoading(false); }
        };
        loadCart();
    }, []);

    const updateQuantity = async (productId: string, qty: number) => {
        if (qty < 1) return removeFromCart(productId);
        try {
            const res = await api.put('/cart', { productId, quantity: qty });
            setCartItems(res.data?.items || []);
        } catch { alert("Failed to update cart"); }
    };

    const removeFromCart = async (productId: string) => {
        try {
            const res = await api.delete(`/cart/${productId}`);
            setCartItems(res.data?.items || []);
        } catch { alert("Failed to remove item"); }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        try {
            const res = await api.post('/coupons/apply', { code: couponCode, cartItems });
            setAppliedCoupon(res.data);
            setCouponMessage({ type: 'success', text: 'Coupon applied!' });
            setCouponCode("");
        } catch (e: any) {
            setCouponMessage({ type: 'error', text: e.response?.data?.msg || 'Invalid coupon' });
        }
    };

    const validCartItems = cartItems.filter(item => item.product);
    const subtotal = validCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discount = appliedCoupon?.discountAmount || 0;
    const isFreeDelivery = subtotal >= 500;
    const totalPrice = subtotal - discount;
    const progressToFreeDelivery = Math.min(100, (subtotal / 500) * 100);

    if (loading) return (
        <div className="min-h-screen pt-24 flex justify-center items-center bg-slate-50 dark:bg-slate-950">
            <Loader2 className="animate-spin size-10 text-teal-600" />
        </div>
    );

    if (validCartItems.length === 0) return (
        <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-950">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="size-10 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Your cart is empty</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">Browse our products to find what you need.</p>
            <Link href="/shop" className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
                Start Shopping
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart</h1>

                {/* Free Delivery Progress */}
                <div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900 dark:text-white">
                            {isFreeDelivery ? "🎉 You've unlocked Free Delivery!" : `Add ₹${(500 - subtotal).toFixed(2)} more for Free Delivery`}
                        </span>
                        <span className="text-sm font-bold text-teal-600">{Math.round(progressToFreeDelivery)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500" style={{ width: `${progressToFreeDelivery}%` }} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {validCartItems.map((item) => (
                            <div key={item._id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4 shadow-sm relative">
                                {item.product.couponCode && activeCouponCodes.includes(item.product.couponCode) && (
                                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full border border-purple-200">
                                        Coupon: {item.product.couponCode}
                                    </div>
                                )}
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                                    {item.product.image
                                        ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="size-8 text-slate-300" /></div>}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{item.product.name}</h3>
                                        <p className="text-teal-600 font-bold">₹{item.product.price}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"><Minus className="size-4" /></button>
                                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"><Plus className="size-4" /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.product._id)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                                            <Trash2 className="size-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
                            {/* Coupon Input */}
                            <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Have a coupon?</label>
                                <div className="flex gap-2">
                                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter code" disabled={!!appliedCoupon} className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50" />
                                    <button onClick={handleApplyCoupon} disabled={!!appliedCoupon || !couponCode.trim()} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:opacity-90 disabled:opacity-50">Apply</button>
                                </div>
                                {couponMessage.text && <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{couponMessage.text}</p>}
                                {appliedCoupon && (
                                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg flex justify-between items-center">
                                        <span className="text-sm font-bold text-green-700 dark:text-green-400">{appliedCoupon.code} — -₹{appliedCoupon.discountAmount?.toFixed(2)}</span>
                                        <button onClick={() => { setAppliedCoupon(null); setCouponMessage({ type: '', text: '' }); }} className="text-slate-400 hover:text-red-500"><Trash2 className="size-4" /></button>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                                {appliedCoupon && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
                                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Delivery</span>{isFreeDelivery ? <span className="text-green-600 font-bold">Free</span> : <span>₹50.00</span>}</div>
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                                    <span>Order Total</span><span>₹{(totalPrice + (isFreeDelivery ? 0 : 50)).toFixed(2)}</span>
                                </div>
                            </div>
                            <Link href="/checkout" className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-500/25 flex items-center justify-center gap-2">
                                Checkout <ArrowRight className="size-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
