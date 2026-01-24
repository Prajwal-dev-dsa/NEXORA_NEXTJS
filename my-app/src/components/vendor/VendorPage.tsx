"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { IUser } from "@/models/user.model";
import VendorDashboard from "./VendorDashboard";
import {
  ShieldAlert,
  Hourglass,
  Store,
  MapPin,
  FileText,
  Loader2,
  CheckCircle2,
  Building2,
  Edit3,
  ArrowLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import AuthLayout from "../AuthLayout";

const VendorPage = ({ user }: { user: IUser }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    shopName: user.shopName || '',
    shopAddress: user.shopAddress || '',
    gstNumber: user.gstNumber || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopName || !formData.shopAddress || !formData.gstNumber) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/vendor/verify-shop-details-again', formData);
      if (res.status === 200) {
        toast.success("Details submitted successfully!");
        setIsEditing(false);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // 1. APPROVED STATE -> DASHBOARD
  // ------------------------------------------------------------------
  if (user.shopVerificationStatus === "approved") {
    return <VendorDashboard />;
  }

  // ------------------------------------------------------------------
  // 2. PENDING (ALREADY SUBMITTED) -> WAITING ROOM UI
  // ------------------------------------------------------------------
  // If status is pending AND shopName exists, they are waiting.
  const isWaiting = user.shopVerificationStatus === "pending" && user.shopName;

  if (isWaiting) {
    return (
      <div className="min-h-screen bg-[#0B0518] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-900/20"
        >
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Spinning Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-[-8px] border-2 border-dashed border-purple-500/30 rounded-full"
              />
              <div className="w-20 h-20 bg-linear-to-tr from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                <Hourglass className="text-white w-8 h-8 animate-pulse" />
              </div>
              {/* Floating particles */}
              <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full animate-ping" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Under Review
            </h2>

            <p className="text-slate-400 leading-relaxed">
              We are currently verifying your shop details. This process usually takes <span className="text-white font-medium">24-48 hours</span>.
            </p>

            {/* Status Steps */}
            <div className="mt-8 space-y-3 bg-black/20 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span className="text-sm text-slate-300">Account Created</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span className="text-sm text-slate-300">Details Submitted</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <span className="text-sm text-white font-medium">Verification in Progress</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.refresh()}
            className="w-full mt-6 text-sm cursor-pointer text-purple-400 hover:text-purple-300 transition-colors"
          >
            Refresh Status
          </button>
        </motion.div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 3. REJECTED STATE -> SHOW REJECTION CARD
  // ------------------------------------------------------------------
  const isRejected = user.shopVerificationStatus === "rejected";

  if (isRejected && !isEditing) {
    return (
      <div className="min-h-screen bg-[#0B0518] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-2xl shadow-black/50"
        >
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 bg-linear-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 rotate-3">
                <ShieldAlert className="text-white w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-3 mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Action Required
            </h1>
            <p className="text-slate-400">
              We reviewed your shop details, but unfortunately, we couldn't approve your request at this time.
            </p>
          </div>

          {/* Rejection Reason Box */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-8"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 w-5 h-5 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Reason for Rejection
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {user.rejectReason || "Specific details were not provided. Please review your submission for accuracy."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="w-full group bg-white text-[#0B0518] hover:bg-slate-200 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit3 size={18} />
            Verify Again
            <ChevronRight size={18} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </motion.button>

          <p className="text-center text-xs text-slate-500 mt-6">
            Update your information to resubmit your application.
          </p>
        </motion.div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 4. FORM STATE -> (Editing Rejected Application)
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0B0518] flex items-center justify-center p-4">
      <AuthLayout
        title={isRejected ? "Fix Your Details" : "Complete Shop Details"}
        subtitle={isRejected ? "Correct the errors below to re-apply." : "Enter business info to activate your account."}
      >
        {/* Back Button if Editing */}
        {isRejected && (
          <button
            onClick={() => setIsEditing(false)}
            className="absolute cursor-pointer top-6 left-6 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-1.5">
            <div className="relative group">
              <Store className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Shop Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative group">
              <MapPin className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type="text" name="shopAddress" value={formData.shopAddress} onChange={handleChange} placeholder="Business Address"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative group">
              <FileText className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner uppercase"
                required
              />
              <div className="absolute right-3 top-3.5"><Building2 size={18} className="text-slate-500/30" /></div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70 mt-4 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <>{isRejected ? "Resubmit Application" : "Submit Details"} <CheckCircle2 size={18} className="opacity-80" /></>
            )}
          </motion.button>
        </form>
      </AuthLayout>
    </div>
  );
};

export default VendorPage;