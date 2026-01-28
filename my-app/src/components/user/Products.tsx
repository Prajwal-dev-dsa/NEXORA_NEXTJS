"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { Sparkles, PackageX } from "lucide-react";
import ProductCard from "./ProductCard";

function Products() {
    const { allProductsData } = useSelector((state: RootState) => state.vendor);

    // Filter Logic: Must be Approved AND Active
    const displayProducts = allProductsData.filter(
        (p: any) =>
            p.productVerificationStatus === "approved" &&
            p.isActive === true
    );

    return (
        <section className="w-full py-12 px-4 md:px-8 bg-[#0B0518]">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="p-2 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg shadow-purple-500/20">
                    <Sparkles className="text-white w-5 h-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Verified & Trending Products
                </h2>
            </div>

            {/* Grid Layout */}
            {displayProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                    {displayProducts.map((product: any) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-slate-500 bg-[#120c1f]/30 border border-white/5 rounded-3xl"
                >
                    <PackageX size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">No products found</p>
                    <p className="text-sm">Check back later for new arrivals.</p>
                </motion.div>
            )}
        </section>
    );
}

export default Products;