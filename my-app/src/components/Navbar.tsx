"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  PackagePlus,
  ShoppingBasket,
  Settings
} from 'lucide-react';
import { signOut } from 'next-auth/react';

// Define the User Interface based on your data
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone: string;
  role: 'user' | 'admin' | 'vendor' | 'deliveryGuy';
}

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { userData } = useSelector((state: RootState) => state.user);

  // Calculate Cart Count
  const cartCount = userData?.cart?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Configuration Based on Role ---

  const getNavLinks = () => {
    if (user.role === 'deliveryGuy') return [];

    if (user.role === 'admin' || user.role === 'vendor') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Products', href: '/products' },
        { label: 'Orders', href: '/orders' },
        { label: 'Analytics', href: '/analytics' },
      ];
    }

    return [
      { label: 'Home', href: '/' },
      { label: 'Categories', href: '/categories' },
      { label: 'Shops', href: '/shops' },
      { label: 'Orders', href: '/orders' },
    ];
  };

  const getProfileMenu = () => {
    switch (user.role) {
      case 'admin':
        return [
          { label: 'My Profile', icon: UserIcon, href: '/profile' },
          { label: 'View Products', icon: ShoppingBasket, href: '/products' },
          { label: 'Manage Orders', icon: LayoutDashboard, href: '/orders' },
        ];
      case 'vendor':
        return [
          { label: 'My Profile', icon: UserIcon, href: '/profile' },
          { label: 'Add Product', icon: PackagePlus, href: '/vendor/add-product' },
          { label: 'Manage Orders', icon: LayoutDashboard, href: '/vendor/manage-orders' },
          { label: 'View Products', icon: ShoppingBasket, href: '/products' },
        ];
      case 'user':
        return [
          { label: 'My Profile', icon: UserIcon, href: '/profile' },
          { label: 'My Orders', icon: ShoppingBag, href: '/user/my-orders' },
          { label: 'Settings', icon: Settings, href: '/settings' },
        ];
      case 'deliveryGuy':
        return [
          { label: 'My Profile', icon: UserIcon, href: '/profile' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();
  const profileMenuItems = getProfileMenu();

  return (
    <>
      {/* --- Main Navbar Container --- */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 border-b border-white/10 bg-[#0B0518]/80 backdrop-blur-xl shadow-lg shadow-purple-900/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* 1. Logo */}
          <Link href="/" className="group">
            <span className="text-2xl md:text-3xl font-bold bg-linear-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-tight group-hover:opacity-80 transition-opacity">
              Nexora
            </span>
          </Link>

          {/* 2. Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-purple-500 to-violet-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* 3. Right Actions */}
          <div className="flex items-center gap-3 md:gap-5">

            {/* Search Icon */}
            {user.role !== 'deliveryGuy' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer rounded-full transition-colors"
              >
                <Search size={20} />
              </motion.button>
            )}

            {/* Cart Icon with Dynamic Count */}
            {user.role === 'user' && (
              <Link href="/user/cart">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-full cursor-pointer transition-colors"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-purple-600 text-[10px] font-bold text-white rounded-full border-2 border-[#0B0518] shadow-lg shadow-purple-500/50"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-1 md:pr-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group cursor-pointer"
              >
                {/* Avatar with Next.js Image */}
                <div className="relative w-8 h-8 rounded-full bg-linear-to-tr from-purple-500 to-violet-500 p-px">
                  <div className="w-full h-full rounded-full bg-[#0B0518] flex items-center justify-center overflow-hidden relative">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                {/* Name Label */}
                <span className="hidden md:block text-sm font-medium text-slate-200 group-hover:text-white max-w-[100px] truncate transition-colors">
                  {user.name.split(' ')[0]}
                </span>
              </motion.button>

              {/* Popup Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-[#120c1f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-60"
                  >
                    <div className="p-4 border-b border-white/5 bg-linear-to-b from-white/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          <div className="w-full h-full rounded-full bg-[#0B0518] flex items-center justify-center overflow-hidden relative">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            ) : (
                              <span className="text-xs font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-purple-300 capitalize flex items-center gap-1">
                            {user.role === 'deliveryGuy' ? 'Delivery Partner' : user.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      {profileMenuItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors group"
                        >
                          <item.icon size={16} className="text-purple-400 group-hover:text-purple-300" />
                          {item.label}
                          <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                        </Link>
                      ))}

                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors  ml-[1.5px] cursor-pointer"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* --- Mobile Menu Drawer --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 md:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#0B0518] border-l border-white/10 p-6 flex flex-col shadow-2xl shadow-purple-900/20"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
                  >
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors font-medium"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}