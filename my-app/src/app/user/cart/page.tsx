"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
    ArrowRight,
    CreditCard,
    Loader2,
    ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState<string | null>(null);

    // Fetch Cart
    const fetchCart = async () => {
        try {
            const res = await axios.get("/api/user/cart/get-all-products");
            if (res.status === 200) {
                setCartItems(res.data.cart);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Update Quantity
    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setUpdatingItem(productId);
        try {
            const res = await axios.post("/api/user/cart/update-product", {
                productId,
                quantity: newQuantity
            });
            if (res.status === 200) {
                // Optimistically update local state for speed
                setCartItems(prev => prev.map(item =>
                    item.product._id === productId ? { ...item, quantity: newQuantity } : item
                ));
            }
        } catch (error) {
            toast.error("Failed to update quantity");
        } finally {
            setUpdatingItem(null);
        }
    };

    // Remove Item
    const removeItem = async (productId: string) => {
        setUpdatingItem(productId);
        try {
            const res = await axios.post("/api/user/cart/remove-product", { productId });
            if (res.status === 200) {
                setCartItems(res.data.cart);
                toast.success("Item removed");
            }
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setUpdatingItem(null);
        }
    };

    // Calculate Totals
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 50; // Example logic
    const total = subtotal + shipping;

    if (loading) return <div className="min-h-screen bg-[#0B0518] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500 w-10 h-10" /></div>;

    return (
        <div className="min-h-screen bg-[#0B0518] text-white pt-5 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* --- BACK BUTTON --- */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group cursor-pointer"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back</span>
                </button>

                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <ShoppingCart className="text-purple-500" /> Your Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#120c1f]/30 border border-white/5 rounded-3xl">
                        <ShoppingCart size={64} className="text-slate-600 mb-4" />
                        <p className="text-xl text-slate-400 font-medium mb-6">Your cart is empty.</p>
                        <Link href="/">
                            <button className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer font-bold transition-all">
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* --- CART ITEMS LIST --- */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-[#120c1f]/60 border border-white/5 items-center"
                                    >
                                        {/* Image */}
                                        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-black/20 border border-white/10">
                                            {item.product?.image1 ? (
                                                <Image src={item.product.image1} alt={item.product.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">No Image</div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 w-full md:w-auto text-center md:text-left">
                                            <h3 className="font-bold text-white text-lg truncate">{item.product?.title}</h3>
                                            <p className="text-sm text-slate-400">{item.product?.category}</p>
                                            <p className="text-purple-400 font-bold mt-1">₹{item.product?.price}</p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1 border border-white/5">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || updatingItem === item.product._id}
                                                className="p-1.5 hover:bg-white/10 rounded-md transition-colors cursor-pointer disabled:opacity-30"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                disabled={updatingItem === item.product._id}
                                                className="p-1.5 hover:bg-white/10 rounded-md transition-colors cursor-pointer disabled:opacity-30"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeItem(item.product._id)}
                                            disabled={updatingItem === item.product._id}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                                        >
                                            {updatingItem === item.product._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* --- ORDER SUMMARY --- */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 p-6 rounded-3xl bg-[#120c1f] border border-white/10 shadow-xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <CreditCard size={20} className="text-purple-400" /> Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-slate-400 text-sm">
                                        <span>Subtotal</span>
                                        <span className="text-white">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 text-sm">
                                        <span>Shipping</span>
                                        <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                                            {shipping === 0 ? "Free" : `₹${shipping}`}
                                        </span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2" />
                                    <div className="flex justify-between text-lg font-bold text-white">
                                        <span>Total</span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full py-4 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                                >
                                    Proceed to Checkout
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}