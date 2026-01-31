"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Store,
    MapPin,
    Loader2,
    ArrowLeft,
    Search,
    ShieldCheck,
    Mail,
} from "lucide-react";
import Image from "next/image";
import ProductCard from "@/components/user/ProductCard";
import { toast } from "sonner";

export default function ShopDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const shopId = params.id;

    const [shop, setShop] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("/api/user/get-shop-details", { shopId });
                if (res.status === 200) {
                    setShop(res.data.shop);
                    setProducts(res.data.products);
                }
            } catch (error) {
                console.error("Error fetching shop data");
                toast.error("Could not load shop details");
            } finally {
                setLoading(false);
            }
        };
        if (shopId) fetchData();
    }, [shopId]);

    // Filter products
    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-[#0B0518] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-purple-500 w-12 h-12" />
            <p className="text-slate-400 animate-pulse">Entering Store...</p>
        </div>
    );

    if (!shop) return <div className="min-h-screen bg-[#0B0518] flex items-center justify-center text-white">Shop not found</div>;

    return (
        <div className="min-h-screen bg-[#0B0518] text-white pt-6 pb-20">

            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group cursor-pointer mb-6"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Dashboard</span>
                </button>

                {/* --- SHOP BANNER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-3xl overflow-hidden bg-[#120c1f] border border-white/10 shadow-2xl mb-12"
                >
                    {/* Decorative Banner */}
                    <div className="h-20 md:h-24 bg-linear-to-r from-purple-900/60 via-[#1a102e] to-indigo-900/60 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/20 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
                                <ShieldCheck size={12} /> Verified Shop
                            </span>
                        </div>
                    </div>

                    <div className="px-6 md:px-10 pb-8 flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 md:-mt-16 relative z-10">
                        {/* Avatar */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-[#0B0518] p-1.5 border border-white/10 shadow-xl">
                            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-white/5">
                                {shop.image ? (
                                    <Image src={shop.image} alt={shop.shopName} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-600">
                                        {shop.shopName.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{shop.shopName}</h1>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4 text-slate-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-purple-500" />
                                    <span>{shop.shopAddress}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-purple-500" />
                                    <span>{shop.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4">
                            <div className="text-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                <p className="text-2xl font-bold text-white">{products.length}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Items</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- PRODUCTS SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Collection</h2>
                        <p className="text-slate-400 text-sm">Browse exclusive products from {shop.shopName}</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search in this shop..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#120c1f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="py-20 text-center bg-[#120c1f]/50 rounded-3xl border border-white/5">
                        <Store size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">No products found in this shop.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}