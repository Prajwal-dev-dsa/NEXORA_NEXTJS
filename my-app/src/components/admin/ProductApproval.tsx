"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Package,
  Clock,
  ShieldCheck,
  Truck,
  DollarSign,
  PackageSearch
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { setAllProductsData } from "@/redux/slices/vendorSlice";

export default function ProductApproval() {
  const dispatch = useDispatch();

  // 1. Get Data from Redux
  const { allProductsData } = useSelector((state: RootState) => state.vendor);

  // Filter for only pending products
  const pendingProducts = allProductsData.filter((p: any) => p.productVerificationStatus === "pending");

  // 2. Local State
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [view, setView] = useState<'details' | 'reject'>('details');
  const [loading, setLoading] = useState(false);

  // --- Handlers ---

  const closeDialog = () => {
    setSelectedProduct(null);
    setView('details');
    setRejectReason("");
  };

  const handleAction = async (status: "approved" | "rejected") => {
    if (!selectedProduct?._id) return;

    // Transition to Reject View if needed
    if (status === "rejected" && view === 'details') {
      setView('reject');
      return;
    }

    // Validation for rejection
    if (status === "rejected" && !rejectReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing request...");

    try {
      const payload = {
        productId: selectedProduct._id,
        status,
        ...(status === "rejected" && { rejectReason })
      };

      const res = await axios.post(`/api/admin/update-product-status`, payload);

      if (res.status === 200) {
        toast.success(`Product ${status} successfully`, { id: toastId });

        // Optimistic Update: Remove product from Redux list instantly
        const updatedList = allProductsData.map((p: any) =>
          p._id === selectedProduct._id
            ? { ...p, productVerificationStatus: status }
            : p
        );
        dispatch(setAllProductsData(updatedList));
        closeDialog();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">

        {/* Heading */}
        <div>
          <h1 className="text-3xl flex items-center gap-3 font-bold text-white">
            <div className="p-3 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <PackageSearch className="text-white w-8 h-8" />
            </div>
            Product Approvals</h1>
          <p className="text-slate-400 text-sm mt-1">Review and manage incoming product requests</p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)] self-start md:self-auto">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
          </span>
          <span className="text-sm font-semibold text-purple-200 tracking-wide">
            {pendingProducts.length} Pending Request{pendingProducts.length !== 1 && 's'}
          </span>
        </div>
      </div>

      {/* --- List Container (Scrollable) --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[400px] pr-2">
        <AnimatePresence mode="popLayout">
          {pendingProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full py-20 text-slate-500 gap-4 bg-white/2 rounded-3xl border border-white/5"
            >
              <div className="p-5 bg-white/5 rounded-full border border-white/5 shadow-inner">
                <CheckCircle2 size={40} className="opacity-40" />
              </div>
              <p className="text-lg font-medium">All caught up! No pending products.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingProducts.map((product: any, index: number) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group relative flex flex-col md:flex-row items-start md:items-center gap-5 p-5 rounded-2xl bg-[#120c1f]/40 hover:bg-[#120c1f]/80 border border-white/5 hover:border-purple-500/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/10"
                >
                  {/* Product Image & Title */}
                  <div className="flex items-center gap-4 w-full md:w-[40%]">
                    <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      {product.image1 ? (
                        <Image src={product.image1} alt={product.title} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-slate-500"><Package size={24} /></div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-lg truncate group-hover:text-purple-300 transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{product.category}</span>
                        <span>•</span>
                        <span className="font-mono text-purple-400">₹{product.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Info & Details */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Store size={14} className="text-purple-400 shrink-0" />
                        <span className="truncate">{product.vendor?.shopName || "Unknown Shop"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <User size={14} className="text-purple-400 shrink-0" />
                        <span>{product.vendor?.name}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Package size={12} className="shrink-0" />
                        <span>Stock: {product.stock}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={12} className="shrink-0" />
                        <span>{new Date(product.requestedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden md:block text-slate-600 group-hover:text-white transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* --- REVIEW MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeDialog}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#0B0518] border border-white/10 rounded-4xl shadow-2xl shadow-purple-900/30 overflow-hidden flex flex-col max-h-[90vh]"
            >

              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/10">
                    <Package className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Review Product</h2>
                    <p className="text-xs text-slate-400 font-medium">ID: {selectedProduct._id.slice(-6)}</p>
                  </div>
                </div>
                <button
                  onClick={closeDialog}
                  className="p-2 bg-white/5 cursor-pointer hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">

                  {/* VIEW 1: DETAILS */}
                  {view === 'details' ? (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Product Header Grid */}
                      <div className="flex gap-5">
                        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                          <Image src={selectedProduct.image1} alt="Main" fill className="object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="text-lg font-bold text-white leading-tight">{selectedProduct.title}</h3>
                          <p className="text-sm text-slate-400 line-clamp-2">{selectedProduct.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">{selectedProduct.category}</span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">Stock: {selectedProduct.stock}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-bold text-white">₹{selectedProduct.price}</p>
                        </div>
                      </div>

                      {/* Image Gallery Row */}
                      <div className="grid grid-cols-4 gap-2">
                        {[selectedProduct.image2, selectedProduct.image3, selectedProduct.image4, selectedProduct.image5].map((img, i) => (
                          img ? (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5">
                              <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                            </div>
                          ) : null
                        ))}
                      </div>

                      {/* Attributes Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Vendor Info</label>
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-white flex flex-col gap-1">
                            <div className="flex items-center gap-2 font-bold text-sm"><Store size={14} className="text-purple-400" /> {selectedProduct.vendor?.shopName}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-400"><User size={12} /> {selectedProduct.vendor?.name}</div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Features</label>
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-white flex flex-col gap-1.5">
                            {selectedProduct.freeDelivery && <div className="flex items-center gap-2 text-xs"><Truck size={12} className="text-green-400" /> Free Delivery</div>}
                            {selectedProduct.cashOnDelivery && <div className="flex items-center gap-2 text-xs"><DollarSign size={12} className="text-green-400" /> Cash On Delivery</div>}
                            <div className="flex items-center gap-2 text-xs"><ShieldCheck size={12} className="text-blue-400" /> {selectedProduct.warranty || "No Warranty"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Sizes & Details */}
                      {(selectedProduct.isProductWearable && selectedProduct.sizes?.length > 0) && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Available Sizes</label>
                          <div className="flex gap-2">
                            {selectedProduct.sizes.map((s: string) => (
                              <span key={s} className="px-3 py-1 rounded bg-[#1a102e] border border-white/10 text-xs font-bold">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-2 grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => handleAction('approved')}
                          disabled={loading}
                          className=" py-3.5 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-500/20 flex cursor-pointer items-center justify-center gap-2 transition-all"
                        >
                          {loading ? <Loader2 className="animate-spin" /> : <>Approve Product <CheckCircle2 size={18} /></>}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => handleAction('rejected')}
                          disabled={loading}
                          className="py-3.5 rounded-xl bg-red-500/10 text-red-400 font-bold border border-red-500/20 hover:bg-red-500/20 cursor-pointer transition-all text-sm"
                        >
                          Reject
                        </motion.button>

                      </div>
                    </motion.div>
                  ) : (

                    /* VIEW 2: REJECT FORM */
                    <motion.div
                      key="reject"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      className="space-y-5"
                    >
                      <button
                        onClick={() => setView('details')}
                        className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-2 font-medium"
                      >
                        <ArrowLeft size={14} /> Back to details
                      </button>

                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start">
                        <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                          <AlertTriangle className="text-red-400" size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-red-400 text-sm">Reason Required</h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            Please explain why this product is being rejected (e.g. copyright violation, poor image quality).
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="e.g., Images are blurry, Description is misleading..."
                          className="w-full h-32 p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none transition-all text-sm leading-relaxed"
                          autoFocus
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleAction('rejected')}
                        disabled={loading || !rejectReason.trim()}
                        className="w-full py-3.5 rounded-xl bg-linear-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : "Confirm Rejection"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}