"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Star,
    ShoppingCart,
    Truck,
    ShieldCheck,
    RefreshCcw,
    CheckCircle2,
    Camera,
    Loader2
} from "lucide-react";
import Image from "next/image";
import ProductCard from "@/components/user/ProductCard";
import axios from "axios";
import { toast } from "sonner";

export default function ViewProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { allProductsData } = useSelector((state: RootState) => state.vendor);

    const [product, setProduct] = useState<any>(null);
    const [activeImage, setActiveImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    // UI States
    const [addingToCart, setAddingToCart] = useState(false);

    // Review State
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviewImage, setReviewImage] = useState<File | null>(null);
    const [reviewImagePreview, setReviewImagePreview] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize Product Data
    useEffect(() => {
        if (id && allProductsData.length > 0) {
            const foundProduct = allProductsData.find((p: any) => p._id === id);
            if (foundProduct) {
                setProduct(foundProduct);
                setActiveImage(foundProduct.image1);
                if (foundProduct?.sizes?.length! > 0) setSelectedSize(foundProduct?.sizes![0]);

                // Find Related Products
                const related = allProductsData.filter((p: any) =>
                    p.category === foundProduct.category &&
                    p._id !== foundProduct._id &&
                    p.productVerificationStatus === "approved" &&
                    p.isActive === true
                ).slice(0, 4);
                setRelatedProducts(related);
            }
        }
    }, [id, allProductsData]);

    const handleReviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReviewImage(file);
            setReviewImagePreview(URL.createObjectURL(file));
        }
    };

    // --- ADD TO CART HANDLER ---
    const handleAddToCart = async () => {
        if (addingToCart) return;
        setAddingToCart(true);
        try {
            const res = await axios.post("/api/user/cart/add-product", {
                productId: product._id,
                quantity: 1
            });

            if (res.status === 200) {
                toast.success("Added to Cart!");
                router.push("/user/cart");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const formData = new FormData();
            formData.append("productId", product._id);
            formData.append("rating", rating.toString());
            formData.append("comment", comment);
            if (reviewImage) {
                formData.append("image", reviewImage);
            }

            const res = await axios.post("/api/user/add-review", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200) {
                toast.success("Review added successfully!");
                setProduct(res.data);
                setRating(0);
                setComment("");
                setReviewImage(null);
                setReviewImagePreview("");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (!product) return <div className="min-h-screen bg-[#0B0518] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;

    const images = [product.image1, product.image2, product.image3, product.image4, product.image5].filter(Boolean);

    // Calculate Average Rating
    const reviewCount = product.reviews?.length || 0;
    const averageRating = reviewCount > 0
        ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount
        : 0;

    return (
        <div className="min-h-screen bg-[#0B0518] text-white pt-5 pb-20 px-4 md:px-8">

            {/* Background Ambience */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Breadcrumb / Back */}
            <div className="max-w-7xl mx-auto mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm font-medium">Back to Products</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

                {/* --- LEFT: IMAGE GALLERY --- */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square w-full bg-[#120c1f] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                    >
                        <Image
                            src={activeImage}
                            alt={product.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`
                                  relative w-20 h-20 shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition-all
                                  ${activeImage === img ? "border-purple-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}
                                `}
                            >
                                <Image src={img} alt={`View ${idx}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>


                {/* --- RIGHT: PRODUCT DETAILS --- */}
                <div className="space-y-8">

                    {/* Header Info */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 uppercase tracking-wider">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                                <span className="text-amber-400 font-bold text-sm mr-1">{averageRating.toFixed(1)}</span>
                                <Star size={14} fill="currentColor" className="text-amber-400" />
                            </div>
                            <span className="text-slate-400 text-sm border-l border-white/10 pl-3">{reviewCount} Verified Reviews</span>
                        </div>

                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-white">₹{product.price}</span>
                            <span className="text-lg text-slate-500 line-through">₹{product.price + 500}</span>
                            <span className="text-green-400 text-sm font-bold">In Stock</span>
                        </div>
                    </div>

                    <div className="h-px w-full bg-white/5" />

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Description</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            {product.description}
                        </p>
                    </div>

                    {product.isProductWearable && product.sizes?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Select Size</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`
                                          w-12 h-12 rounded-xl flex items-center cursor-pointer justify-center text-sm font-bold border transition-all
                                          ${selectedSize === size
                                                ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30"
                                                : "bg-[#120c1f] border-white/10 text-slate-400 hover:border-white/30 hover:text-white"}
                                        `}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#120c1f] border border-white/5">
                            <RefreshCcw className="text-purple-400" size={24} />
                            <div>
                                <p className="text-xs text-slate-400">Return Policy</p>
                                <p className="text-sm font-bold text-white">{product.replacementDays} Days</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#120c1f] border border-white/5">
                            <ShieldCheck className="text-blue-400" size={24} />
                            <div>
                                <p className="text-xs text-slate-400">Warranty</p>
                                <p className="text-sm font-bold text-white">{product.warranty}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#120c1f] border border-white/5">
                            <Truck className="text-green-400" size={24} />
                            <div>
                                <p className="text-xs text-slate-400">Delivery</p>
                                <p className="text-sm font-bold text-white">{product.freeDelivery ? "Free Shipping" : "Standard"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#120c1f] border border-white/5">
                            <CheckCircle2 className="text-amber-400" size={24} />
                            <div>
                                <p className="text-xs text-slate-400">Payment</p>
                                <p className="text-sm font-bold text-white">{product.cashOnDelivery ? "COD Available" : "Prepaid Only"}</p>
                            </div>
                        </div>
                    </div>

                    {product.detailPoints?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Highlights</h3>
                            <ul className="space-y-2">
                                {product.detailPoints.map((point: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="flex-1 py-4 rounded-2xl bg-white text-[#0B0518] font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-70"
                        >
                            {addingToCart ? <Loader2 size={24} className="animate-spin" /> : <><ShoppingCart size={20} /> Add to Cart</>}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart} // Buy now also goes to cart for simplicity, or could go straight to checkout
                            disabled={addingToCart}
                            className="flex-1 py-4 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-xl shadow-purple-600/30 cursor-pointer transition-all disabled:opacity-70"
                        >
                            Buy Now
                        </motion.button>
                    </div>

                </div>
            </div>

            {/* --- REVIEWS SECTION --- */}
            <div className="max-w-7xl mx-auto mt-24">
                <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-purple-500 pl-4">
                    Customer Reviews
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Add Review Form */}
                    <div className="lg:col-span-1 p-6 rounded-3xl bg-[#120c1f]/50 border border-white/5 h-fit">
                        <h3 className="text-lg font-bold text-white mb-4">Add your Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none cursor-pointer"
                                        >
                                            <Star
                                                size={24}
                                                fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                                                className={(hoverRating || rating) >= star ? "text-amber-400" : "text-slate-600"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-2">Comment (Optional)</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write a review..."
                                    className="w-full p-4 rounded-xl bg-[#0B0518] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none h-32"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-2">Image (Optional)</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                                >
                                    {reviewImagePreview ? (
                                        <div className="relative w-full h-20">
                                            <Image src={reviewImagePreview} alt="Preview" fill className="object-contain" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Camera size={20} />
                                            <span className="text-xs">Choose file</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleReviewImageChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingReview}
                                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmittingReview ? <Loader2 className="animate-spin mx-auto" /> : "Submit Review"}
                            </button>
                        </form>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-2 space-y-4">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review: any, index: number) => (
                                <div key={index} className="p-5 rounded-2xl bg-[#120c1f]/30 border border-white/5 flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center shrink-0">
                                        {review.userImage ? (
                                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                                <Image src={review.userImage} alt="User" fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <span className="font-bold text-white text-sm">
                                                {review.userName?.charAt(0).toUpperCase() || "U"}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{review.userName || "Unknown User"}</h4>
                                                <div className="flex text-amber-400 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        {review.comment && (
                                            <p className="text-slate-300 text-sm mb-3">{review.comment}</p>
                                        )}

                                        {review.image && (
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
                                                <Image src={review.image} alt="Review" fill className="object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                                <Star size={40} className="mb-2 opacity-20" />
                                <p>No reviews yet. Be the first to review!</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* --- RELATED PRODUCTS --- */}
            {relatedProducts.length > 0 && (
                <div className="max-w-7xl mx-auto mt-24">
                    <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-purple-500 pl-4">
                        Related Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}