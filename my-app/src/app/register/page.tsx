"use client";

import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, ShieldCheck, Truck, ChevronLeft, Mail, Lock, Eye, EyeOff, UserCircle, Loader } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type Role = 'user' | 'vendor' | 'admin' | 'delivery' | null;

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Role Configuration
  const roles = [
    { id: 'user', label: 'User', icon: User, desc: 'Shop for products' },
    { id: 'vendor', label: 'Vendor', icon: Store, desc: 'Sell your items' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Manage Nexora' },
    { id: 'delivery', label: 'Delivery', icon: Truck, desc: 'Deliver orders' },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId as Role);
    setStep('form');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/auth/register`, {
        name,
        email,
        password,
        redirect: false
      })
      console.log(res.data)
      setName('')
      setEmail('')
      setPassword('')
      router.push('/login')
    } catch (error) {
      console.log(`Register handleSubmit Error ${error}`)
    } finally {
      setLoading(false);
    }
  }


  return (
    <AuthLayout
      title={step === 'role' ? "Welcome to Nexora" : "Create Account"}
      subtitle={step === 'role' ? "Choose your profile type to get started" : `Registering as a ${selectedRole}`}
    >
      <AnimatePresence mode="wait">

        {/* STEP 1: ROLE SELECTION */}
        {step === 'role' && (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-2 gap-4"
          >
            {roles.map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.05, borderColor: "rgba(124, 58, 237, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRoleSelect(role.id)}
                className="flex cursor-pointer flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-white/10 transition-all group"
              >
                <div className="p-3 rounded-full bg-purple-100 dark:bg-white/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <role.icon size={24} />
                </div>
                <span className="mt-3 font-semibold text-slate-700 dark:text-slate-200">{role.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{role.desc}</span>
              </motion.button>
            ))}

            <div className="col-span-2 mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 2: REGISTRATION FORM */}
        {step === 'form' && (
          <motion.div
            key="register-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Back Button */}
            <button
              onClick={() => setStep('role')}
              className="flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-purple-600 cursor-pointer dark:hover:text-purple-400 mb-2 transition-colors"
            >
              <ChevronLeft size={14} className="mr-1" /> Back to roles
            </button>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="relative group">
                <UserCircle className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-purple-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Main Action Button */}
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full flex items-center justify-center bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/30 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? <Loader className="animate-spin" /> : 'Create Account'}
            </motion.button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#120c1f] px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            <motion.button
              onClick={async () => await signIn("google", { callbackUrl: "/" })}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-medium py-3 rounded-xl transition-all cursor-pointer"
            >
              <FcGoogle size={20} />
              <span className="text-sm">Google</span>
            </motion.button>

            <div className="text-center mt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}