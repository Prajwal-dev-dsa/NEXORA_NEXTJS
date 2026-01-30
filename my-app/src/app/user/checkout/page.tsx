"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    ArrowLeft,
    MapPin,
    CreditCard,
    CheckCircle2,
    Package,
    ShieldCheck,
    Loader2,
    Banknote,
    ShoppingBag
} from "lucide-react";
import Image from "next/image";
import OrderSuccessPage from "../order-success/page";

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function CheckoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India"
    });

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

    // Fetch Cart Data
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get("/api/user/cart/get-all-products");
                if (res.status === 200) {
                    if (res.data.cart.length === 0) {
                        toast.error("Your cart is empty");
                        router.push("/user/cart");
                        return;
                    }
                    setCartItems(res.data.cart);
                }
            } catch (error) {
                console.error("Failed to fetch cart", error);
                toast.error("Could not load cart details");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [router]);

    // Handle Input Change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Place Order Handler
    const handlePlaceOrder = async () => {
        // Basic Validation
        if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
            toast.error("Please fill in all shipping details");
            return;
        }

        setProcessing(true);

        try {
            if (paymentMethod === "COD") {
                // --- CASH ON DELIVERY FLOW ---
                const res = await axios.post("/api/user/order/cash-on-delivery", {
                    shippingAddress: formData
                });

                if (res.status === 201) {
                    setSuccess(true);
                    toast.success("Order placed successfully!");
                }
            } else {
                // --- ONLINE PAYMENT (STRIPE) FLOW ---
                const res = await axios.post("/api/user/order/online-payment", {
                    shippingAddress: formData
                });

                if (res.status === 200 && res.data.url) {
                    // Redirect to Stripe Checkout
                    window.location.href = res.data.url;
                } else {
                    throw new Error("Invalid response from payment server");
                }
            }
        } catch (error: any) {
            console.error("Order Error:", error);
            toast.error(error.response?.data?.message || "Failed to place order");
            setProcessing(false);
        }
    };

    // Calculate Totals
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;

    if (loading) return (
        <div className="min-h-screen bg-[#0B0518] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-purple-500 w-12 h-12" />
            <p className="text-slate-400 animate-pulse">Preparing Checkout...</p>
        </div>
    );

    if (success) return <OrderSuccessPage />;

    return (
        <div className="min-h-screen bg-[#0B0518] text-white pt-8 pb-20 px-4 md:px-8">

            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group cursor-pointer"
                    >
                        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span>Back to Cart</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Secure Checkout
                    </h1>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >

                    {/* --- LEFT COLUMN: FORMS --- */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Address Card */}
                        <motion.div variants={itemVariants} className="p-6 md:p-8 rounded-3xl bg-[#120c1f]/80 border border-white/10 backdrop-blur-xl shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                                <MapPin className="text-purple-400" />
                                <h2 className="text-xl font-bold">Shipping Address</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        placeholder="123 Galaxy Boulevard"
                                        className="w-full bg-[#0B0518] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Metropolis"
                                        className="w-full bg-[#0B0518] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="Bihar"
                                        className="w-full bg-[#0B0518] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="800001"
                                        className="w-full bg-[#0B0518] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        disabled
                                        className="w-full bg-[#0B0518]/50 border border-white/5 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Method Card */}
                        <motion.div variants={itemVariants} className="p-6 md:p-8 rounded-3xl bg-[#120c1f]/80 border border-white/10 backdrop-blur-xl shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                                <CreditCard className="text-purple-400" />
                                <h2 className="text-xl font-bold">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Cash on Delivery Option */}
                                <div
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${paymentMethod === "COD"
                                        ? "bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-900/20"
                                        : "bg-[#0B0518] border-white/5 hover:border-white/10"
                                        }`}
                                >
                                    <div className={`p-3 rounded-full ${paymentMethod === "COD" ? "bg-purple-500 text-white" : "bg-white/5 text-slate-400"}`}>
                                        <Banknote size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Cash on Delivery</h3>
                                        <p className="text-xs text-slate-400 mt-1">Pay when your order arrives at your doorstep.</p>
                                    </div>
                                    {paymentMethod === "COD" && (
                                        <div className="absolute top-4 right-4 text-purple-500">
                                            <CheckCircle2 size={20} fill="currentColor" className="text-purple-900" />
                                        </div>
                                    )}
                                </div>

                                {/* Online Payment Option (Stripe) */}
                                <div
                                    onClick={() => setPaymentMethod("ONLINE")}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${paymentMethod === "ONLINE"
                                        ? "bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-900/20"
                                        : "bg-[#0B0518] border-white/5 hover:border-white/10"
                                        }`}
                                >
                                    <div className={`p-3 rounded-full ${paymentMethod === "ONLINE" ? "bg-purple-500 text-white" : "bg-white/5 text-slate-400"}`}>
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Online Payment</h3>
                                        <p className="text-xs text-slate-400 mt-1">Secure payment via Stripe.</p>
                                    </div>
                                    {paymentMethod === "ONLINE" && (
                                        <div className="absolute top-4 right-4 text-purple-500">
                                            <CheckCircle2 size={20} fill="currentColor" className="text-purple-900" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* --- RIGHT COLUMN: SUMMARY --- */}
                    <div className="lg:col-span-1">
                        <motion.div
                            variants={itemVariants}
                            className="sticky top-24 p-6 md:p-8 rounded-3xl bg-[#120c1f] border border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingBag className="text-purple-400" />
                                <h2 className="text-xl font-bold">Order Summary</h2>
                            </div>

                            {/* Items Scroll Area */}
                            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-4 mb-6 pr-2">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-3 items-center">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                            <Image src={item.product?.image1} alt="Product" fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{item.product?.title}</p>
                                            <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-purple-300">₹{item.product?.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-white/5 mb-6" />

                            <div className="space-y-3 mb-8">
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
                                    <span>Total Amount</span>
                                    <span className="text-2xl bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                        ₹{total}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-6 text-xs text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                <ShieldCheck size={16} />
                                <span>Secure Checkout with 256-bit Encryption</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={processing}
                                className={`w-full py-4 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 ${processing ? "cursor-not-allowed" : "cursor-pointer"} group`}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <Package size={20} className="group-hover:scale-110 transition-transform" />
                                        {paymentMethod === "COD" ? "Place Order" : "Proceed to Pay"}
                                    </>
                                )}
                            </button>

                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}