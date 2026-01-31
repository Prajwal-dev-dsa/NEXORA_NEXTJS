"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  PackageSearch,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { setAllProductsData } from "@/redux/slices/vendorSlice";

export default function VendorProductsPage() {
  const dispatch = useDispatch();

  // 1. Get Data
  const { userData } = useSelector((state: RootState) => state.user);
  const { allProductsData } = useSelector((state: RootState) => state.vendor);

  // 2. Filter Products for Logged-in Vendor
  // We check if the product's vendor ID matches the current user's ID
  const myProducts = allProductsData.filter(
    (product: any) =>
      (typeof product.vendor === 'string' ? product.vendor : product.vendor?._id) === userData?._id
  );

  // 3. Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Filter based on search
  const filteredProducts = myProducts.filter((p: any) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- TOGGLE HANDLER (API INTEGRATION) ---
  const handleToggleActive = async (product: any) => {
    if (product.productVerificationStatus !== "approved") return;

    // Optimistic Update (Immediate UI feedback)
    const newStatus = !product.isActive;

    // Create updated list for optimistic UI
    const updatedList = allProductsData.map((p: any) =>
      p._id === product._id ? { ...p, isActive: newStatus } : p
    );
    dispatch(setAllProductsData(updatedList));

    try {
      const res = await axios.post("/api/vendor/update-product-status", {
        productId: product._id,
        isActive: newStatus
      });

      if (res.status === 200) {
        toast.success(`Product is now ${newStatus ? 'Active' : 'Inactive'}`);
      }
    } catch (error: any) {
      // Revert on failure
      const revertedList = allProductsData.map((p: any) =>
        p._id === product._id ? { ...p, isActive: !newStatus } : p
      );
      dispatch(setAllProductsData(revertedList));
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    // Fixed: md:px-8 instead of md:px-
    <div className="min-h-screen bg-[#0B0518] text-white pb-10 flex flex-col items-center relative overflow-hidden">

      {/* --- HEADER SECTION --- */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 ">

        {/* --- HEADER --- */}
        {/* Fixed: Removed mb-10 which was breaking layout */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20">
            <PackageSearch className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Your Products</h1>
            <p className="text-slate-400 text-sm">Manage your product listings</p>
          </div>
        </div>

        <div className="relative flex-1 md:w-64 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#120c1f] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto pr-3">
          {/* Add New Button */}
          <Link href="/vendor/add-product">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all text-sm whitespace-nowrap cursor-pointer"
            >
              <Plus size={18} /> Add New
            </motion.button>
          </Link>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 bg-[#120c1f]/30 border border-white/5 rounded-3xl"
            >
              <div className="p-5 bg-white/5 rounded-full mb-4">
                <Package size={40} className="opacity-50" />
              </div>
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Start by adding your first product to the marketplace.</p>
            </motion.div>
          ) : (
            filteredProducts.map((product: any, index: number) => {
              const isApproved = product.productVerificationStatus === "approved";
              const isRejected = product.productVerificationStatus === "rejected";
              const isPending = product.productVerificationStatus === "pending";

              return (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-[#120c1f]/60 backdrop-blur-xl border border-white/5 rounded-4xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-xl"
                >
                  {/* Image Header */}
                  <div className="relative h-48 w-full bg-[#0B0518]">
                    {product.image1 ? (
                      <Image
                        src={product.image1}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Package size={32} />
                      </div>
                    )}

                    {/* Status Badge (Overlay) */}
                    <div className="absolute top-4 left-4">
                      {isApproved && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/20 text-green-400 text-xs font-bold shadow-lg backdrop-blur-md">
                          <CheckCircle2 size={12} /> Live
                        </span>
                      )}
                      {isPending && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold shadow-lg backdrop-blur-md">
                          <Clock size={12} /> In Review
                        </span>
                      )}
                      {isRejected && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold shadow-lg backdrop-blur-md">
                          <AlertCircle size={12} /> Rejected
                        </span>
                      )}
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-mono text-white border border-white/10">
                      Stock: {product.stock}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white truncate pr-4" title={product.title}>
                        {product.title}
                      </h3>
                      <p className="text-lg font-bold text-purple-400">₹{product.price}</p>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 h-8 mb-4">
                      {product.description}
                    </p>

                    {/* Rejected Reason Box */}
                    {isRejected && (
                      <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2 items-start">
                        <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Action Required</p>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            {product.rejectReason || "Issues found with listing details."}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="h-px w-full bg-white/5 mb-4" />

                    {/* Actions Row */}
                    <div className="flex items-center justify-between gap-4">

                      {/* Active Toggle */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</span>
                        <button
                          onClick={() => handleToggleActive(product)}
                          disabled={!isApproved} // Disable if not approved
                          className={`
                            relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1
                            ${!isApproved
                              ? 'bg-slate-800 cursor-not-allowed opacity-50'
                              : product.isActive ? 'bg-purple-600 cursor-pointer' : 'bg-slate-700 cursor-pointer'}
                          `}
                        >
                          <motion.div
                            layout
                            className="w-4 h-4 bg-white rounded-full shadow-md"
                            animate={{ x: product.isActive && isApproved ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>

                      {/* Edit Action */}
                      <div className="flex items-center gap-2">
                        <Link href={`/vendor/update-product/${product._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all group cursor-pointer"
                          >
                            <Edit3 size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                            Edit
                          </motion.button>
                        </Link>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}