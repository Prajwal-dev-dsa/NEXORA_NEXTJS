"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  User,
  Store,
  ShieldAlert,
  Truck,
  Smartphone,
  CheckCircle2,
  Loader2,
  Lock
} from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

type Role = 'user' | 'vendor' | 'admin' | 'delivery';

interface RoleOption {
  id: Role;
  label: string;
  icon: React.ElementType;
  description: string;
}

export default function EditRolePhonePage() {
  const { update } = useSession()
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdminExists, setIsAdminExists] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    role: '' as Role | ''
  });

  // Check if Admin exists on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data } = await axios.get('/api/admin/check-if-admin-exists');
        setIsAdminExists(data.isAdminExists);
      } catch (error) {
        console.error("Failed to check admin status");
      } finally {
        setCheckingAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);

  const roles: RoleOption[] = [
    { id: 'user', label: 'Customer', icon: User, description: 'Shop & Explore' },
    { id: 'vendor', label: 'Vendor', icon: Store, description: 'Sell Products' },
    { id: 'delivery', label: 'Delivery Partner', icon: Truck, description: 'Deliver Orders' },
    { id: 'admin', label: 'Admin', icon: ShieldAlert, description: 'Manage Platform' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || !formData.role) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/user/edit-role-phone', formData);
      console.log(res.data)
      await update({
        user: {
          role: formData.role,
          phone: formData.phone
        }
      });
      toast.success("Profile updated successfully!");
      router.refresh();
      router.push('/');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Complete Your Profile"
      subtitle="Tell us a bit more about yourself to get started."
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Phone Input Section */}
        <div className="space-y-2">
          <label className="text-sm mb-2 block font-medium text-slate-700 dark:text-slate-300 ml-1">
            Phone Number
          </label>
          <div className="relative group">
            <Smartphone className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              required
            />
          </div>
        </div>

        {/* Role Selection Section */}
        <div className="space-y-2">
          <label className="text-sm mb-2 block font-medium text-slate-700 dark:text-slate-300 ml-1">
            Choose Your Role
          </label>

          {checkingAdmin ? (
            <div className="h-48 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
              <Loader2 className="animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => {
                const isDisabled = role.id === 'admin' && isAdminExists;
                const isSelected = formData.role === role.id;

                return (
                  <motion.div
                    key={role.id}
                    whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    onClick={() => !isDisabled && setFormData({ ...formData, role: role.id })}
                    className={`
                      relative cursor-pointer rounded-xl p-4 border transition-all duration-300
                      flex flex-col items-center justify-center text-center gap-2
                      ${isDisabled
                        ? 'opacity-50 grayscale bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 cursor-not-allowed'
                        : isSelected
                          ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 ring-1 ring-purple-500'
                          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-slate-50 dark:hover:bg-white/10'
                      }
                    `}
                  >
                    {/* Selected Checkmark Badge */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                          className="absolute top-2 right-2 text-purple-600 dark:text-purple-400"
                        >
                          <CheckCircle2 size={16} fill="currentColor" className="text-white dark:text-[#0B0518]" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Icon */}
                    <div className={`
                      p-2.5 rounded-full transition-colors
                      ${isSelected
                        ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                      }
                    `}>
                      {isDisabled ? <Lock size={20} /> : <role.icon size={20} />}
                    </div>

                    {/* Text */}
                    <div className="space-y-0.5">
                      <p className={`text-sm font-semibold ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-200'}`}>
                        {role.label}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {isDisabled ? 'Already Exists' : role.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.role || !formData.phone}
          className={`w-full flex items-center justify-center bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70 ${loading || !formData.role || !formData.phone ? "cursor-not-allowed" : "cursor-pointer"} disabled:shadow-none mt-4 group`}
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5 text-white" />
          ) : (
            <span className="flex items-center gap-2">
              Continue
              <CheckCircle2 size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </span>
          )}
        </button>

      </form>
    </AuthLayout>
  );
}