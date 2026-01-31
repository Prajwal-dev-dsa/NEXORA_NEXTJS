"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  FileText,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { IUser } from "@/models/user.model";
import { setAllVendorsData } from "@/redux/slices/vendorSlice";
import Image from "next/image";

export default function VendorApproval() {
  const dispatch = useDispatch();

  // 1. Get Data from Redux
  const { allVendorsData } = useSelector((state: RootState) => state.vendor);

  // Filter for only pending vendors
  const pendingVendors = allVendorsData.filter((v) => v.shopVerificationStatus === "pending");

  // 2. Local State
  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [view, setView] = useState<'details' | 'reject'>('details');
  const [loading, setLoading] = useState(false);

  // --- Handlers ---

  const closeDialog = () => {
    setSelectedVendor(null);
    setView('details');
    setRejectReason("");
  };

  const handleAction = async (status: "approved" | "rejected") => {
    if (!selectedVendor?._id) return;

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
        vendorId: selectedVendor._id,
        status,
        ...(status === "rejected" && { rejectReason })
      };

      const res = await axios.post(`/api/admin/update-vendor-status`, payload);

      if (res.status === 200) {
        toast.success(`Vendor ${status} successfully`, { id: toastId });

        // Optimistic Update: Remove vendor from Redux list instantly
        const updatedList = allVendorsData.map((v) =>
          v._id === selectedVendor._id
            ? { ...v, shopVerificationStatus: status, isShopApproved: status === 'approved' }
            : v
        );
        dispatch(setAllVendorsData(updatedList as IUser[]));
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
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <div className="p-3 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            Vendor Approvals</h1>
          <p className="text-slate-400 text-sm mt-1">Review and manage incoming vendor applications</p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)] self-start md:self-auto">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
          </span>
          <span className="text-sm font-semibold text-purple-200 tracking-wide">
            {pendingVendors.length} Pending Request{pendingVendors.length !== 1 && 's'}
          </span>
        </div>
      </div>

      {/* --- List Container (Scrollable) --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[400px] pr-2">
        <AnimatePresence mode="popLayout">
          {pendingVendors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 h-full text-slate-500 gap-4 bg-white/2 rounded-3xl border border-white/5"
            >
              <div className="p-5 bg-white/5 rounded-full border border-white/5 shadow-inner">
                <CheckCircle2 size={40} className="opacity-40" />
              </div>
              <p className="text-lg font-medium">All caught up! No pending requests.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingVendors.map((vendor, index) => (
                <motion.div
                  key={vendor._id?.toString()}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedVendor(vendor)}
                  className="group relative flex flex-col md:flex-row items-start md:items-center gap-5 p-5 rounded-2xl bg-[#120c1f]/40 hover:bg-[#120c1f]/80 border border-white/5 hover:border-purple-500/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/10"
                >
                  {/* Identity */}
                  <div className="flex items-center gap-4 w-full md:w-[35%]">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 p-[2px] shadow-lg">
                      <div className="w-full h-full rounded-full bg-[#0B0518] flex overflow-hidden items-center justify-center">
                        {vendor?.image ? (
                          <Image src={vendor.image} alt={vendor.name} width={52} height={52} className="rounded-full" />
                        ) : (
                          <span className="font-bold text-white text-xl">
                            {vendor.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-lg truncate group-hover:text-purple-300 transition-colors">
                        {vendor.shopName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <User size={12} />
                        {vendor.name}
                      </div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Mail size={14} className="text-purple-400 shrink-0" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Phone size={14} className="text-purple-400 shrink-0" />
                        <span>{vendor.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-200 border border-purple-500/20">
                          GST: {vendor.gstNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate max-w-[200px]">{vendor.shopAddress}</span>
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
        {selectedVendor && (
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
              className="relative w-full max-w-xl bg-[#0B0518] border border-white/10 rounded-4xl shadow-2xl shadow-purple-900/30 overflow-hidden flex flex-col max-h-[90vh]"
            >

              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/10">
                    <Store className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Review Application</h2>
                    <p className="text-xs text-slate-400 font-medium">ID: {selectedVendor._id?.toString().slice(-6)}</p>
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
                      {/* Grid Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Vendor Name</label>
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-white font-medium flex items-center gap-3">
                            <User size={16} className="text-purple-400" />
                            <span className="text-sm truncate">{selectedVendor.name}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contact Phone</label>
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-white font-medium flex items-center gap-3">
                            <Phone size={16} className="text-purple-400" />
                            <span className="text-sm font-mono">{selectedVendor.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Business Card Info */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Business Details</label>
                        <div className="p-5 rounded-2xl bg-linear-to-br from-[#150d24] to-[#0B0518] border border-purple-500/20 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div>
                              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {selectedVendor.shopName}
                              </h3>
                              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                                <Mail size={12} /> {selectedVendor.email}
                              </p>
                            </div>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-500/20 border border-purple-500/30 text-purple-200 text-[10px] font-mono font-bold tracking-wide">
                              <FileText size={10} /> {selectedVendor.gstNumber}
                            </span>
                          </div>

                          <div className="pt-3 border-t border-white/5 flex items-start gap-2 text-sm text-slate-300">
                            <MapPin size={16} className="text-slate-500 mt-0.5 shrink-0" />
                            <p className="leading-relaxed text-xs">{selectedVendor.shopAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 grid grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => handleAction('approved')}
                          disabled={loading}
                          className=" py-3.5 rounded-xl bg-linear-to-r cursor-pointer from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-all"
                        >
                          {loading ? <Loader2 className="animate-spin" /> : <>Approve Application <CheckCircle2 size={18} /></>}
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
                          <h4 className="font-bold text-red-400 text-sm">Action Required</h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            Please explain why the application is being rejected. The vendor will use this feedback to fix their details.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="e.g., GST certificate is invalid, Shop address does not match provided proof..."
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