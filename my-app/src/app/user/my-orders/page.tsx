"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Calendar,
    MapPin,
    Loader2,
    ShoppingBag,
    Truck,
    Clock,
    CheckCircle2,
    ArrowLeft,
    Printer,
    X,
    FileText,
    PackageX
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
};

export default function MyOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);

    // Fetch Orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("/api/user/order/get-all-orders");
                if (res.status === 200) {
                    setOrders(res.data.orders);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
                toast.error("Could not load your orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Helper to get Status Color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-500/10 border-green-500/20 text-green-400';
            case 'Processing': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            case 'Confirmed': return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
            case 'Shipped': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            case 'Cancelled': return 'bg-red-500/10 border-red-500/20 text-red-400';
            default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0B0518] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
            <p className="text-slate-400 animate-pulse text-sm">Loading your orders...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0B0518] text-white pt-5 pb-20 px-4 md:px-8 relative">

            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">

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
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <Package className="text-purple-500" size={24} />
                    </div>
                    My Orders
                </h1>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 bg-[#120c1f]/50 border border-white/5 rounded-3xl backdrop-blur-sm"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={32} className="text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                        <p className="text-slate-400 mb-8 text-center max-w-sm">Looks like you haven't placed any orders yet. Start exploring our collection!</p>
                        <Link href="/">
                            <button className="px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-purple-600/20">
                                Start Shopping
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                variants={cardVariants}
                                className="group bg-[#120c1f]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-xl"
                            >
                                {/* --- ORDER HEADER --- */}
                                <div className="p-5 md:p-6 bg-white/5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">

                                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Order Placed</p>
                                            <div className="flex items-center gap-2 text-white font-medium">
                                                <Calendar size={14} className="text-purple-400" />
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Total Amount</p>
                                            <p className="font-bold text-white text-lg">₹{order.totalAmount}</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Ship To</p>
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <MapPin size={14} />
                                                <span className="truncate max-w-[150px]">{order.shippingAddress?.city}, {order.shippingAddress?.country}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-1 font-mono">ID: {order._id.slice(-8).toUpperCase()}</p>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus === 'Processing' && <Clock size={12} />}
                                                {order.orderStatus === 'Delivered' && <CheckCircle2 size={12} />}
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* --- ORDER ITEMS --- */}
                                <div className="p-5 md:p-6 space-y-6">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 md:gap-6 items-start">
                                            {/* Product Image */}
                                            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-black/40 rounded-2xl overflow-hidden border border-white/10 shrink-0 group-hover:border-purple-500/30 transition-colors">
                                                {item.product?.image1 ? (
                                                    <Image
                                                        src={item.product.image1}
                                                        alt={item.product.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1">
                                                        <Package size={20} />
                                                        <span className="text-[10px]">N/A</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-white text-base md:text-lg mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                                            {item.product?.title || "Product Unavailable"}
                                                        </h3>
                                                        <p className="text-sm text-slate-400 mb-2">{item.product?.category}</p>
                                                    </div>
                                                    <p className="font-bold text-white">₹{item.price}</p>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                                    <span className="bg-white/5 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                                                    {/* Optional: Add 'Write Review' button here if Delivered */}
                                                    {order.orderStatus === 'Delivered' && item.product?._id && (
                                                        <Link href={`/user/view-product/${item.product._id}`}>
                                                            <button className="text-purple-400 hover:text-purple-300 text-xs font-bold hover:underline">
                                                                Write Review
                                                            </button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* --- ORDER FOOTER --- */}
                                <div className="px-5 md:px-6 py-4 bg-black/20 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs md:text-sm">
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            {order.paymentMethod === 'COD' ? <Truck size={14} /> : <div className="w-3.5 h-3.5 bg-slate-600 rounded-full" />}
                                            <span>Payment: <span className="text-white font-medium">{order.paymentMethod}</span></span>
                                        </div>
                                        <div className="w-px h-3 bg-white/10" />
                                        <span>{order.items.length} Item(s)</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <button
                                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-not-allowed opacity-50"
                                            disabled
                                        >
                                            Track Order
                                        </button>
                                        <button
                                            onClick={() => setSelectedOrderForInvoice(order)}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 text-purple-300 cursor-pointer transition-colors"
                                        >
                                            <FileText size={14} />
                                            View Invoice
                                        </button>
                                    </div>
                                </div>

                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* --- INVOICE MODAL --- */}
            <AnimatePresence>
                {selectedOrderForInvoice && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedOrderForInvoice(null)}
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-[#1a1625] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-linear-to-r from-purple-900/20 to-transparent">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <span className="text-purple-400">Nexora</span> Invoice
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">Order #{selectedOrderForInvoice._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrderForInvoice(null)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                                    <div>
                                        <p className="text-slate-500 font-bold uppercase text-xs mb-2">Billed To</p>
                                        <p className="text-white font-medium mb-1">User Name</p> {/* Replace with dynamic name if available */}
                                        <p className="text-slate-400">{selectedOrderForInvoice.shippingAddress.street}</p>
                                        <p className="text-slate-400">
                                            {selectedOrderForInvoice.shippingAddress.city}, {selectedOrderForInvoice.shippingAddress.state} - {selectedOrderForInvoice.shippingAddress.zipCode}
                                        </p>
                                        <p className="text-slate-400">{selectedOrderForInvoice.shippingAddress.country}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-500 font-bold uppercase text-xs mb-2">Invoice Details</p>
                                        <div className="space-y-1">
                                            <p className="text-slate-400">Date: <span className="text-white">{new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}</span></p>
                                            <p className="text-slate-400">Status: <span className="text-purple-400 font-medium">{selectedOrderForInvoice.paymentStatus}</span></p>
                                            <p className="text-slate-400">Method: <span className="text-white">{selectedOrderForInvoice.paymentMethod}</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden mb-6">
                                    <div className="grid grid-cols-12 bg-white/5 p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <div className="col-span-6">Item</div>
                                        <div className="col-span-2 text-center">Qty</div>
                                        <div className="col-span-2 text-right">Price</div>
                                        <div className="col-span-2 text-right">Total</div>
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {selectedOrderForInvoice.items.map((item: any, idx: number) => (
                                            <div key={idx} className="grid grid-cols-12 p-4 text-sm items-center">
                                                <div className="col-span-6">
                                                    <p className="text-white font-medium truncate pr-2">{item.product?.title || "Item"}</p>
                                                    <p className="text-slate-500 text-xs">{item.product?.category}</p>
                                                </div>
                                                <div className="col-span-2 text-center text-slate-300">{item.quantity}</div>
                                                <div className="col-span-2 text-right text-slate-300">₹{item.price}</div>
                                                <div className="col-span-2 text-right text-white font-medium">₹{item.price * item.quantity}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="flex justify-end">
                                    <div className="w-full max-w-xs space-y-3">
                                        <div className="flex justify-between text-slate-400 text-sm">
                                            <span>Subtotal</span>
                                            <span>₹{selectedOrderForInvoice.totalAmount}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400 text-sm">
                                            <span>Shipping</span>
                                            <span className="text-green-400">Free</span>
                                        </div>
                                        <div className="h-px bg-white/10" />
                                        <div className="flex justify-between text-white font-bold text-lg">
                                            <span>Total</span>
                                            <span>₹{selectedOrderForInvoice.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/10 bg-[#120c1f] flex justify-end gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium">
                                    <Printer size={16} /> Print
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer text-sm font-bold shadow-lg shadow-purple-900/20">
                                    <PackageX size={16} /> Cancel Order
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}