"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    Store,
    MapPin,
    Phone,
    Mail,
    User,
    Package,
    ShieldCheck,
    Calendar,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    FileText,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function AdminVendorDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const vendorId = params.vendorId;

    const [vendor, setVendor] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("/api/admin/get-vendor-details", { vendorId });
                if (res.status === 200) {
                    setVendor(res.data.vendor);
                    setProducts(res.data.products);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Could not load vendor details");
            } finally {
                setLoading(false);
            }
        };
        if (vendorId) fetchData();
    }, [vendorId]);

    if (loading) return (
        <div className="min-h-screen bg-[#0B0518] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
            <p className="text-slate-400 animate-pulse text-sm">Loading Vendor Profile...</p>
        </div>
    );

    if (!vendor) return (
        <div className="min-h-screen bg-[#0B0518] flex items-center justify-center text-slate-400">
            Vendor not found.
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0B0518] text-white pt-6 pb-20 px-4 md:px-8 relative">

            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* --- NAVIGATION --- */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group cursor-pointer mb-6"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Vendors</span>
                </button>

                {/* --- VENDOR HEADER CARD --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-[#120c1f] border border-white/10 p-6 md:p-10 mb-8 shadow-2xl"
                >


                    <div className="relative flex flex-col md:flex-row md:items-center items-start gap-6">

                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-[#0B0518] p-1 border-4 border-[#120c1f] shadow-xl">
                                <div className="w-full h-full rounded-full overflow-hidden relative bg-white/5">
                                    {vendor.image ? (
                                        <Image src={vendor.image} alt={vendor.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-500">
                                            {vendor.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 p-1.5 bg-green-500 rounded-full border-4 border-[#120c1f]" title="Verified Vendor">
                                <CheckCircle2 size={16} className="text-white" />
                            </div>
                        </div>

                        {/* Name & Shop */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{vendor.shopName}</h1>
                            <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                                <span className="flex items-center gap-1.5"><User size={14} /> {vendor.name}</span>
                                <span className="flex items-center gap-1.5"><Mail size={14} /> {vendor.email}</span>
                                <span className="flex items-center gap-1.5"><Phone size={14} /> {vendor.phone}</span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-3">
                            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                                <p className="text-2xl font-bold text-white">{products.length}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Products</p>
                            </div>
                            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                                <p className="text-2xl font-bold text-purple-400">Approved</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Status</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: BUSINESS DETAILS */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="p-6 rounded-3xl bg-[#120c1f]/80 border border-white/10 backdrop-blur-xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Store size={20} className="text-purple-400" /> Business Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">GST Number</p>
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/5 font-mono text-sm text-purple-200">
                                        <FileText size={14} /> {vendor.gstNumber || "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Shop Address</p>
                                    <div className="flex items-start gap-2 p-3 rounded-xl bg-black/20 border border-white/5 text-sm text-slate-300">
                                        <MapPin size={16} className="mt-0.5 shrink-0" />
                                        {vendor.shopAddress}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Joined</p>
                                        <div className="flex items-center gap-2 text-sm text-white">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(vendor.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Role</p>
                                        <div className="flex items-center gap-2 text-sm text-white capitalize">
                                            <ShieldCheck size={14} className="text-green-400" />
                                            {vendor.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: PRODUCTS GRID */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Package className="text-purple-400" /> Catalog
                            </h3>
                        </div>

                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-[#120c1f]/50 border border-white/5 rounded-3xl">
                                <Package size={48} className="text-slate-600 mb-4" />
                                <p className="text-slate-400">This vendor hasn't added any products yet.</p>
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        variants={itemVariants}
                                        className="group bg-[#120c1f] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
                                    >
                                        <div className="flex gap-4 p-4">
                                            {/* Image */}
                                            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-black/40 border border-white/5">
                                                {product.image1 ? (
                                                    <Image src={product.image1} alt={product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600"><Package size={20} /></div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="text-white font-bold text-sm truncate">{product.title}</h4>
                                                    <p className="text-xs text-slate-400">{product.category}</p>
                                                </div>

                                                <div className="flex items-end justify-between mt-2">
                                                    <p className="text-lg font-bold text-white">₹{product.price}</p>
                                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${product.productVerificationStatus === 'approved' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                            product.productVerificationStatus === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                                'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                        }`}>
                                                        {product.productVerificationStatus}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Stats */}
                                        <div className="px-4 py-2 bg-white/2 border-t border-white/5 flex justify-between text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                                            <span>Stock: {product.stock}</span>
                                            <span>{product.isActive ? "Active" : "Inactive"}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}