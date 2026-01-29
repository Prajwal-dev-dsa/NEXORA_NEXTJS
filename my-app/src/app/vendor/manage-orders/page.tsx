"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    Package,
    Calendar,
    MapPin,
    Loader2,
    ShoppingBag,
    Truck,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react";
import Image from "next/image";
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

export default function VendorOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    // Fetch Vendor Orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("/api/vendor/get-vendor-orders");
                if (res.status === 200) {
                    console.log(res.data.orders)
                    setOrders(res.data.orders);
                }
            } catch (error) {
                console.log(error)
                toast.error("Could not load orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Handle Status Change
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        // Only allow logic for Processing -> Confirmed
        if (newStatus !== "Confirmed") return;

        setUpdatingOrderId(orderId);
        try {
            const res = await axios.post("/api/vendor/update-order-status", {
                orderId: orderId
            });

            if (res.status === 200) {
                toast.success("Order Confirmed Successfully!");

                // Optimistically update the UI locally
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, orderStatus: "Confirmed" } : order
                    )
                );
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Helper to get Status Color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-500/10 border-green-500/20 text-green-400';
            case 'Confirmed': return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
            case 'Processing': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            case 'Shipped': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            case 'Cancelled': return 'bg-red-500/10 border-red-500/20 text-red-400';
            default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0B0518] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
            <p className="text-slate-400 animate-pulse text-sm">Loading orders...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0B0518] text-white pt-8 pb-20 px-4 md:px-8 relative">

            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group cursor-pointer mb-4"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <Package className="text-purple-500" size={24} />
                            </div>
                            Manage Orders
                        </h1>
                    </div>

                    {/* Filter (Visual only for now) */}
                    <div className="flex items-center gap-3 bg-[#120c1f] p-1.5 rounded-xl border border-white/10">
                        <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold shadow-lg">All</button>
                        <button className="px-4 py-2 rounded-lg hover:bg-white/5 text-slate-400 text-sm font-medium transition-colors">Pending</button>
                        <button className="px-4 py-2 rounded-lg hover:bg-white/5 text-slate-400 text-sm font-medium transition-colors">Completed</button>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-32 bg-[#120c1f]/50 border border-white/5 rounded-3xl backdrop-blur-sm"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={32} className="text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No orders received yet</h3>
                        <p className="text-slate-400">When customers place orders, they will appear here.</p>
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
                                <div className="p-5 md:p-6 bg-white/5 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                                    <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Order Date</p>
                                            <div className="flex items-center gap-2 text-white font-medium">
                                                <Calendar size={14} className="text-purple-400" />
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Customer Location</p>
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <MapPin size={14} />
                                                <span className="truncate max-w-[200px]">
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.country}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Total Value</p>
                                            <p className="font-bold text-white text-lg">₹{order.totalAmount}</p>
                                        </div>
                                    </div>

                                    {/* --- STATUS ACTION AREA --- */}
                                    <div className="flex items-center gap-4 bg-black/20 p-2 pr-4 rounded-xl border border-white/5">
                                        <div className="text-right px-2">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Current Status</p>
                                        </div>

                                        {/* Status Dropdown Logic */}
                                        {order.orderStatus === "Processing" ? (
                                            <div className="relative">
                                                {updatingOrderId === order._id && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-[#120c1f] z-10 rounded-lg">
                                                        <Loader2 className="animate-spin text-purple-500" size={16} />
                                                    </div>
                                                )}
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="appearance-none bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-8"
                                                >
                                                    <option value="Processing" className="bg-[#120c1f] text-slate-400">Processing</option>
                                                    <option value="Confirmed" className="bg-[#120c1f] text-green-400 font-bold">Confirm Order</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
                                                    <ArrowLeft size={12} className="-rotate-90" />
                                                </div>
                                            </div>
                                        ) : (
                                            // Read-Only Badge for other statuses
                                            <div className={`px-4 py-2 rounded-lg text-sm font-bold border flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus === 'Confirmed' && <CheckCircle2 size={16} />}
                                                {order.orderStatus === 'Shipped' && <Truck size={16} />}
                                                {order.orderStatus}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* --- ORDER ITEMS --- */}
                                <div className="p-5 md:p-6 space-y-4">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                            <div className="relative w-16 h-16 bg-black/40 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                                {item.product?.image1 ? (
                                                    <Image
                                                        src={item.product.image1}
                                                        alt={item.product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                                        <Package size={16} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white text-sm md:text-base truncate">
                                                    {item.product?.title || "Unknown Product"}
                                                </h3>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                                    <span className="bg-white/5 px-2 py-0.5 rounded text-slate-300">Qty: {item.quantity}</span>
                                                    <span>Category: {item.product?.category}</span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-white">₹{item.price}</p>
                                                <p className="text-xs text-slate-500">per unit</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* --- FOOTER INFO --- */}
                                <div className="px-5 py-3 bg-black/20 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Truck size={12} />
                                        Payment: <span className="text-slate-300 font-medium">{order.paymentMethod}</span>
                                    </div>
                                    <div className="font-mono">
                                        ID: {order._id.slice(-8).toUpperCase()}
                                    </div>
                                </div>

                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}