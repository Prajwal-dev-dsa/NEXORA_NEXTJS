"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import InitalizeUser from "@/init/initalizeUser";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    Store,
    MapPin,
    FileText,
    Edit3,
    Camera,
    Save,
    Loader2,
    Building2,
    Calendar,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { setUserData } from "@/redux/slices/userSlice";

export default function ProfilePage() {
    // 1. Initialize User Data
    InitalizeUser();
    const { userData } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    // 2. Local State
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 3. Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        image: null as File | null, // For file upload
        previewImage: "", // For UI preview
        shopName: "",
        shopAddress: "",
        gstNumber: "",
    });

    // Sync state when user data loads
    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || "",
                phone: userData.phone || "",
                image: null,
                previewImage: userData.image || "",
                shopName: userData.shopName || "",
                shopAddress: userData.shopAddress || "",
                gstNumber: userData.gstNumber || "",
            });
        }
    }, [userData]);

    // Handle Text Inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Image Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
                previewImage: URL.createObjectURL(file)
            });
        }
    };

    // --- SAVE HANDLER ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Update Personal Profile (Common for all roles)
            // We use FormData for file upload
            const personalData = new FormData();
            personalData.append("name", formData.name);
            personalData.append("phone", formData.phone);
            if (formData.image) {
                personalData.append("image", formData.image);
            }

            // Call User Update API
            const userRes = await axios.post("/api/user/update-profile", personalData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (userRes.status !== 200) throw new Error("Failed to update profile");

            // 2. Update Vendor Shop Details (Only if Vendor and fields changed)
            if (userData?.role === "vendor") {
                // Check if shop details actually changed to avoid unnecessary API calls or pending status resets
                const shopChanged =
                    formData.shopName !== userData.shopName ||
                    formData.shopAddress !== userData.shopAddress ||
                    formData.gstNumber !== userData.gstNumber;

                if (shopChanged) {
                    const shopRes = await axios.post("/api/vendor/verify-shop-details-again", {
                        shopName: formData.shopName,
                        shopAddress: formData.shopAddress,
                        gstNumber: formData.gstNumber
                    });

                    if (shopRes.status !== 200) throw new Error("Failed to update shop details");
                    toast.success("Shop details submitted for verification!");
                    userRes.data.shopName = shopRes.data.shopName;
                    userRes.data.shopAddress = shopRes.data.shopAddress;
                    userRes.data.gstNumber = shopRes.data.gstNumber;
                    userRes.data.requestedAt = shopRes.data.requestedAt;
                    userRes.data.shopVerificationStatus = shopRes.data.shopVerificationStatus;
                    userRes.data.isShopApproved = shopRes.data.isShopApproved;
                    userRes.data.rejectReason = shopRes.data.rejectReason;
                }
            }

            toast.success("Profile updated successfully!");
            setIsEditing(false);
            dispatch(setUserData(userRes.data));

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || error.response?.data?.error || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    // Loading State
    if (!userData) {
        return (
            <div className="min-h-screen bg-[#0B0518] flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
            </div>
        );
    }

    const isVendor = userData.role === "vendor";

    return (
        <div className="min-h-screen bg-[#0B0518] text-white pt-24 pb-20 px-4 flex flex-col items-center relative overflow-hidden">

            {/* Ambient Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

            {/* --- HEADER IDENTITY SECTION --- */}
            <div className="relative z-10 flex flex-col items-center mb-10 w-full max-w-4xl">

                {/* Avatar Wrapper */}
                <div className="relative group mb-6">
                    {/* Glowing Ring */}
                    <div className="absolute inset-[-4px] rounded-full bg-linear-to-br from-purple-600 via-fuchsia-500 to-indigo-600 blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full relative z-10 p-[3px] bg-[#0B0518]">
                        <div className="w-full h-full rounded-full bg-[#150d24] flex items-center justify-center overflow-hidden relative">
                            {formData.previewImage ? (
                                <Image
                                    src={formData.previewImage}
                                    alt="Profile"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <span className="text-5xl font-bold text-white/20 uppercase select-none">
                                    {userData.name?.charAt(0)}
                                </span>
                            )}

                            {/* Edit Mode Camera Overlay */}
                            {isEditing && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]"
                                >
                                    <Camera size={28} className="text-white drop-shadow-lg mb-1" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Change</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {/* Role Badge */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20">
                        <div className="px-4 py-1.5 rounded-full bg-[#1a102e] border border-purple-500/30 shadow-lg shadow-purple-900/40 flex items-center gap-2 whitespace-nowrap">
                            <div className={`w-2 h-2 rounded-full ${isVendor ? 'bg-amber-400' : 'bg-purple-400'} animate-pulse`} />
                            <span className="text-[11px] font-extrabold tracking-[0.15em] text-white uppercase">
                                {userData.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Name & Quick Info */}
                <div className="text-center space-y-3">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">
                        {userData.name}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-3">
                        <span className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-2 hover:bg-white/10 transition-colors">
                            <Mail size={14} className="text-purple-400" /> {userData.email}
                        </span>
                        {userData.phone && (
                            <span className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-2 hover:bg-white/10 transition-colors">
                                <Phone size={14} className="text-blue-400" /> {userData.phone}
                            </span>
                        )}
                        <span className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-2 hover:bg-white/10 transition-colors">
                            <Calendar size={14} className="text-pink-400" /> Joined {new Date(userData.createdAt!).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Edit Toggle Button */}
                <AnimatePresence>
                    {!isEditing && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(true)}
                            className="mt-8 flex items-center gap-2 px-8 py-3 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 cursor-pointer text-white text-sm font-bold shadow-lg shadow-purple-500/25 transition-all group"
                        >
                            <Edit3 size={16} className="group-hover:rotate-12 transition-transform" />
                            Edit Profile
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>


            {/* --- FORM / DETAILS SECTION --- */}
            <motion.form
                layout
                onSubmit={handleSave}
                className="w-full max-w-4xl space-y-8 relative z-10"
            >

                {/* PERSONAL DETAILS GROUP */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">Personal Information</span>
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Full Name Input */}
                        <div className={`p-1 rounded-2xl border transition-all duration-300 ${isEditing ? 'bg-[#150d24] border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-[#120c1f]/50 border-white/5'}`}>
                            <div className="relative pl-14 pr-4 py-4">
                                <div className={`absolute top-1/2 -translate-y-1/2 left-5 transition-colors ${isEditing ? 'text-purple-400' : 'text-slate-600'}`}>
                                    <User size={22} strokeWidth={1.5} />
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</p>
                                {isEditing ? (
                                    <input
                                        type="text" name="name" value={formData.name} onChange={handleInputChange} required
                                        className="w-full bg-transparent text-lg font-medium text-white focus:outline-none placeholder:text-slate-700"
                                        placeholder="Enter your full name"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-white">{userData.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className={`p-1 rounded-2xl border transition-all duration-300 ${isEditing ? 'bg-[#150d24] border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-[#120c1f]/50 border-white/5'}`}>
                            <div className="relative pl-14 pr-4 py-4">
                                <div className={`absolute top-1/2 -translate-y-1/2 left-5 transition-colors ${isEditing ? 'text-purple-400' : 'text-slate-600'}`}>
                                    <Phone size={22} strokeWidth={1.5} />
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</p>
                                {isEditing ? (
                                    <input
                                        type="text" name="phone" value={formData.phone} maxLength={10} onChange={handleInputChange} required
                                        className="w-full bg-transparent text-lg font-medium text-white focus:outline-none placeholder:text-slate-700"
                                        placeholder="+91 00000 00000"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-white">{userData.phone || <span className="text-slate-600 italic">Not provided</span>}</p>
                                )}
                            </div>
                        </div>

                        {/* Email (Always Read-only) */}
                        <div className="md:col-span-2 p-1 rounded-2xl bg-[#120c1f]/30 border border-white/5 opacity-80 cursor-not-allowed">
                            <div className="relative pl-14 pr-4 py-4">
                                <div className="absolute top-1/2 -translate-y-1/2 left-5 text-slate-600">
                                    <Mail size={22} strokeWidth={1.5} />
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address <span className="text-[9px] lowercase opacity-50 ml-1">(cannot change)</span></p>
                                <p className="text-lg font-medium text-slate-400">{userData.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* VENDOR DETAILS GROUP (Conditional) */}
                {isVendor && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="space-y-4 pt-6"
                    >
                        <div className="flex items-center gap-4 px-2">
                            <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                            <div className="flex items-center gap-2">
                                <Building2 size={14} className="text-purple-400" />
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">Business Profile</span>
                            </div>
                            <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        {/* Approval Status Banner (Only in View Mode) */}
                        {!isEditing && (
                            <div className={`w-full p-4 rounded-xl border flex items-center justify-between ${userData.isShopApproved ? 'bg-green-900/10 border-green-500/20' : 'bg-amber-900/10 border-amber-500/20'}`}>
                                <div className="flex items-center gap-3">
                                    {userData.isShopApproved ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-amber-500" />}
                                    <div>
                                        <p className={`text-sm font-bold ${userData.isShopApproved ? 'text-green-400' : 'text-amber-400'}`}>
                                            {userData.isShopApproved ? "Shop Approved & Verified" : "Verification Pending"}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {userData.isShopApproved
                                                ? "Your business is live and can accept orders."
                                                : "Updates to shop details will require re-verification."}
                                        </p>
                                    </div>
                                </div>
                                {!userData.isShopApproved && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-1 rounded font-bold uppercase">Pending</span>}
                            </div>
                        )}

                        <div className="grid gap-5">
                            {/* Shop Name */}
                            <div className={`p-1 rounded-2xl border transition-all duration-300 ${isEditing ? 'bg-[#150d24] border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-[#120c1f]/50 border-white/5'}`}>
                                <div className="relative pl-14 pr-4 py-4">
                                    <div className={`absolute top-1/2 -translate-y-1/2 left-5 transition-colors ${isEditing ? 'text-purple-400' : 'text-slate-600'}`}>
                                        <Store size={22} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Shop Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text" name="shopName" value={formData.shopName} onChange={handleInputChange} required
                                            className="w-full bg-transparent text-lg font-medium text-white focus:outline-none placeholder:text-slate-700"
                                        />
                                    ) : (
                                        <p className="text-lg font-medium text-white">{userData.shopName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div className={`p-1 rounded-2xl border transition-all duration-300 ${isEditing ? 'bg-[#150d24] border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-[#120c1f]/50 border-white/5'}`}>
                                <div className="relative pl-14 pr-4 py-4">
                                    <div className={`absolute top-1/2 -translate-y-1/2 left-5 transition-colors ${isEditing ? 'text-purple-400' : 'text-slate-600'}`}>
                                        <MapPin size={22} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Registered Address</p>
                                    {isEditing ? (
                                        <input
                                            type="text" name="shopAddress" value={formData.shopAddress} onChange={handleInputChange} required
                                            className="w-full bg-transparent text-lg font-medium text-white focus:outline-none placeholder:text-slate-700"
                                        />
                                    ) : (
                                        <p className="text-lg font-medium text-white truncate">{userData.shopAddress}</p>
                                    )}
                                </div>
                            </div>

                            {/* GST */}
                            <div className={`p-1 rounded-2xl border transition-all duration-300 ${isEditing ? 'bg-[#150d24] border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-[#120c1f]/50 border-white/5'}`}>
                                <div className="relative pl-14 pr-4 py-4">
                                    <div className={`absolute top-1/2 -translate-y-1/2 left-5 transition-colors ${isEditing ? 'text-purple-400' : 'text-slate-600'}`}>
                                        <FileText size={22} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">GST Number</p>
                                    {isEditing ? (
                                        <input
                                            type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} required
                                            className="w-full bg-transparent text-lg font-medium text-white font-mono focus:outline-none uppercase placeholder:text-slate-700"
                                        />
                                    ) : (
                                        <p className="text-lg font-medium text-white font-mono tracking-wide">{userData.gstNumber}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ACTION FOOTER (Sticky on Edit) */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="sticky bottom-6 flex items-center gap-4 pt-6 bg-[#0B0518]/80 backdrop-blur-md pb-4 border-t border-white/5"
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 h-14 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Save Changes <Save size={18} /></>}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    // Reset form to original data on cancel
                                    if (userData) {
                                        setFormData(prev => ({
                                            ...prev,
                                            name: userData.name || "",
                                            phone: userData.phone || "",
                                            image: null,
                                            previewImage: userData.image || "",
                                            shopName: userData.shopName || "",
                                            shopAddress: userData.shopAddress || "",
                                            gstNumber: userData.gstNumber || ""
                                        }));
                                    }
                                }}
                                disabled={loading}
                                className="h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all active:scale-95 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.form>
        </div>
    );
}