"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    Star,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Gather all valid images into an array
    const images = [
        product.image1,
        product.image2,
        product.image3,
        product.image4,
    ].filter(Boolean);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleCardClick = () => {
        router.push(`/user/view-product/${product._id}`);
    };

    // Calculate Average Rating
    const averageRating = product.reviews?.length
        ? product.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / product.reviews.length
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
            className="group relative bg-[#120c1f]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
        >
            {/* --- IMAGE SLIDER SECTION --- */}
            <div className="relative h-64 w-full bg-[#0B0518] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[currentImageIndex]}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows (Visible on Hover) */}
                {images.length > 1 && (
                    <>
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-purple-600 cursor-pointer transition-colors z-10"
                        >
                            <ChevronLeft size={16} />
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-purple-600 cursor-pointer transition-colors z-10"
                        >
                            <ChevronRight size={16} />
                        </motion.button>
                    </>
                )}

                {/* Dots Indicator */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "bg-purple-500 w-3" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="p-5 space-y-3">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-white font-bold text-lg truncate pr-2 group-hover:text-purple-400 transition-colors">
                            {product.title}
                        </h3>
                    </div>
                    <p className="text-xs text-slate-400">{product.category}</p>
                </div>

                {/* Rating UI (Real Data) */}
                <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                                className={i < Math.round(averageRating) ? "text-amber-400" : "text-slate-600"}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-slate-500">
                        ({product.reviews?.length || 0} Reviews)
                    </span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 line-through">₹{product.price + 500}</span>
                        <span className="text-xl font-bold text-white">₹{product.price}</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); /* Add to cart logic */ }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0B0518] font-bold text-xs hover:bg-purple-50 cursor-pointer transition-colors shadow-lg"
                    >
                        <ShoppingCart size={16} />
                        Add
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;