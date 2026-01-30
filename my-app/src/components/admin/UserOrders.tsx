"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Loader2,
  ShoppingBag,
  Truck,
  Clock,
  CheckCircle2,
  Search,
  User,
  Mail,
  DollarSign,
  BarChart3
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/admin/get-all-orders");
        if (res.status === 200) {
          setOrders(res.data.orders);
          setFilteredOrders(res.data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
        toast.error("Could not load system orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Search Filter
  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = orders.filter(order =>
      order._id.toLowerCase().includes(lowerTerm) ||
      order.user?.name?.toLowerCase().includes(lowerTerm) ||
      order.user?.email?.toLowerCase().includes(lowerTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Calculate Stats
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Processing').length;

  // Status Color Helper
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
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
      <p className="text-slate-400 animate-pulse text-sm">Loading System Orders...</p>
    </div>
  );

  return (
    <div className="w-full">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            System Orders
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID, Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#120c1f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        </div>
      </div>

      {/* --- STATS BAR --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#120c1f]/60 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><BarChart3 size={24} /></div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold">Total Orders</p>
            <p className="text-2xl font-bold text-white">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-[#120c1f]/60 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-green-500/10 text-green-400"><DollarSign size={24} /></div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold">Total Revenue</p>
            <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-[#120c1f]/60 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400"><Clock size={24} /></div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold">Pending Processing</p>
            <p className="text-2xl font-bold text-white">{pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* --- ORDERS LIST --- */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#120c1f]/50 border border-white/5 rounded-3xl backdrop-blur-sm">
          <ShoppingBag size={48} className="text-slate-600 mb-4" />
          <p className="text-slate-400">No orders found.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              variants={cardVariants}
              className="bg-[#120c1f]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Card Body */}
              <div className="p-5 flex flex-col lg:flex-row gap-6">

                {/* Left: Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus === 'Processing' && <Clock size={12} />}
                        {order.orderStatus === 'Delivered' && <CheckCircle2 size={12} />}
                        {order.orderStatus}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={12} />
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 text-sm">
                    {/* Customer Info */}
                    <div className="flex items-start gap-3 min-w-[200px]">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {order.user?.image ? (
                          <Image src={order.user.image} alt="User" width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <User size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold">{order.user?.name || "Unknown User"}</p>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                          <Mail size={10} />
                          <span className="truncate max-w-[150px]">{order.user?.email || "No Email"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-slate-400 shrink-0">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold uppercase mb-0.5">Shipping To</p>
                        <p className="text-slate-300 leading-snug">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                          <span className="text-slate-500 text-xs">{order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Items & Total */}
                <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6 gap-4">

                  {/* Item Previews (Max 3) */}
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 4).map((item: any, idx: number) => (
                      <div key={idx} className="relative w-10 h-10 rounded-full border-2 border-[#120c1f] overflow-hidden bg-black/50" title={item.product?.title}>
                        {item.product?.image1 ? (
                          <Image src={item.product.image1} alt="Item" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-500">N/A</div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-10 h-10 rounded-full border-2 border-[#120c1f] bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Payment</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        {order.paymentMethod === 'COD' ? <Truck size={12} /> : <div className="w-2 h-2 rounded-full bg-green-500" />}
                        {order.paymentMethod}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total</p>
                      <p className="text-xl font-bold text-white">₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}