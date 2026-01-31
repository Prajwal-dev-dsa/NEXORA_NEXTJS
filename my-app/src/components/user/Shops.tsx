"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Store, MapPin, ArrowRight, PackageX, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Shops() {
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await axios.get("/api/user/get-all-shops");
                if (res.status === 200) {
                    setShops(res.data.shops);
                }
            } catch (error) {
                console.error("Error fetching shops");
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    // If loading but no shops yet, or empty, handle gracefully within the layout
    if (!loading && shops.length === 0) return null;

    return (
        <section className="w-full py-8 px-4 md:px-8 bg-[#0B0518]">

            {/* --- Section Header --- */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="p-2 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg shadow-purple-500/20">
                    <Store className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Top Verified Stores
                </h2>
            </div>

            {/* --- Content --- */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-64 rounded-3xl bg-[#120c1f]/30 border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : shops.length > 0 ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">

                    {shops.map((shop, i) => (
                        <Link href={`/user/shop-details/${shop._id}`} key={shop._id} className="block h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group h-full relative bg-[#120c1f]/40 hover:bg-[#120c1f]/80 backdrop-blur-sm border border-white/5 hover:border-purple-500/30 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-purple-500/10"
                            >
                                {/* Decorative Header Gradient */}
                                <div className="h-20 w-full bg-linear-to-r from-purple-900/20 to-indigo-900/20 group-hover:from-purple-900/40 group-hover:to-indigo-900/40 transition-colors" />

                                {/* Avatar & Content */}
                                <div className="px-5 pb-8 flex-1 flex flex-col -mt-10">
                                    {/* Shop Image */}
                                    <div className="w-20 h-20 rounded-2xl p-1 bg-[#0B0518] border border-white/10 shadow-xl mb-3">
                                        <div className="w-full h-full rounded-xl overflow-hidden relative bg-white/5 flex items-center justify-center">
                                            {shop.image ? (
                                                <Image src={shop.image} alt={shop.shopName} fill className="object-cover" />
                                            ) : (
                                                <span className="text-2xl font-bold text-slate-600 group-hover:text-purple-400 transition-colors">
                                                    {shop.shopName.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shop Info */}
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors truncate">
                                        {shop.shopName}
                                    </h3>

                                    {/* Verified Badge (Updated) */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                            <CheckCircle2 size={12} className="text-green-400" />
                                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Verified</span>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start gap-2 text-xs text-slate-400 mb-4 flex-1">
                                        <MapPin size={12} className="shrink-0 mt-0.5 text-purple-500/70 group-hover:text-purple-400" />
                                        <span className="line-clamp-2 leading-relaxed">
                                            {shop.shopAddress || "Global Store"}
                                        </span>
                                    </div>

                                    {/* Visit CTA */}
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">
                                            Visit Store
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 transform group-hover:-rotate-45">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-slate-500 bg-[#120c1f]/30 border border-white/5 rounded-3xl"
                >
                    <PackageX size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">No shops found</p>
                </motion.div>
            )}
        </section>
    );
}