"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Store,
  MapPin,
  FileText,
  Loader2,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import AuthLayout from '@/components/AuthLayout';

export default function FillShopDetails() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    shopName: '',
    shopAddress: '',
    gstNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.shopName || !formData.shopAddress || !formData.gstNumber) {
      toast.error("Please fill in all fields required for your business.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/vendor/fill-shop-details', formData);
      console.log(res.data);
      if (res.status === 200) {
        toast.success("Shop details submitted successfully!");
        router.push('/');
        router.refresh();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to submit details. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Complete Your Shop Details"
      subtitle="Enter your business information to activate your vendor account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Shop Name Input */}
        <div className="space-y-1.5">
          <div className="relative group">
            <Store className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Shop Name"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
              required
            />
          </div>
        </div>

        {/* Business Address Input */}
        <div className="space-y-1.5">
          <div className="relative group">
            <MapPin className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
            <input
              type="text"
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleChange}
              placeholder="Business Address"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
              required
            />
          </div>
        </div>

        {/* GST Number Input */}
        <div className="space-y-1.5">
          <div className="relative group">
            <FileText className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="GST Number"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner uppercase"
              required
            />
            {/* Optional visual cue for GST format */}
            <div className="absolute right-3 top-3.5">
              <Building2 size={18} className="text-slate-500/30" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 ml-1">
            * This helps us verify your business legitimacy.
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`
            w-full flex items-center justify-center gap-2 
            bg-linear-to-r from-purple-600 to-violet-600 
            hover:from-purple-500 hover:to-violet-500 
            text-white font-bold py-3.5 rounded-xl 
            shadow-lg shadow-purple-500/30 transition-all 
            disabled:opacity-70 mt-4
            ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              Submit Details
              <CheckCircle2 size={18} className="opacity-80" />
            </>
          )}
        </motion.button>

      </form>
    </AuthLayout>
  );
}