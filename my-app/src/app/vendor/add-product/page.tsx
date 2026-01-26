"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
    UploadCloud,
    X,
    Plus,
    Check,
    ChevronDown,
    Loader2,
    Shirt,
    Smartphone,
    Armchair,
    Sparkles,
    Footprints,
    Watch,
    Gamepad2,
    Headphones,
    Laptop,
    Camera,
    Dumbbell,
    Baby,
    Dog,
    Utensils,
    Book,
    Briefcase,
    Gift,
    ArrowLeft
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- CATEGORY DATA ---
const categories = [
    { id: 1, name: "Fashion", icon: Shirt },
    { id: 2, name: "Mobiles", icon: Smartphone },
    { id: 3, name: "Home Decor", icon: Armchair },
    { id: 4, name: "Beauty", icon: Sparkles },
    { id: 5, name: "Footwear", icon: Footprints },
    { id: 6, name: "Watches", icon: Watch },
    { id: 7, name: "Gaming", icon: Gamepad2 },
    { id: 8, name: "Audio", icon: Headphones },
    { id: 9, name: "Laptops", icon: Laptop },
    { id: 10, name: "Cameras", icon: Camera },
    { id: 11, name: "Sports", icon: Dumbbell },
    { id: 12, name: "Baby Care", icon: Baby },
    { id: 13, name: "Pet Supplies", icon: Dog },
    { id: 14, name: "Kitchen", icon: Utensils },
    { id: 15, name: "Books", icon: Book },
    { id: 16, name: "Bags", icon: Briefcase },
    { id: 17, name: "Gifting", icon: Gift },
];

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [currentPoint, setCurrentPoint] = useState("");

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        isProductWearable: false,
        sizes: [] as string[],
        replacementDays: "",
        warranty: "",
        freeDelivery: false,
        cashOnDelivery: false,
        detailPoints: [] as string[],
        images: [null, null, null, null, null] as (File | null)[],
        previews: ["", "", "", "", ""] as string[],
    });

    // --- HANDLERS ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: !prev[name] }));
    };

    const toggleSize = (size: string) => {
        setFormData((prev) => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImages = [...formData.images];
            const newPreviews = [...formData.previews];
            newImages[index] = file;
            newPreviews[index] = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, images: newImages, previews: newPreviews }));
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        const newPreviews = [...formData.previews];
        newImages[index] = null;
        newPreviews[index] = "";
        setFormData((prev) => ({ ...prev, images: newImages, previews: newPreviews }));
    };

    const addDetailPoint = () => {
        if (!currentPoint.trim()) return;
        setFormData((prev) => ({
            ...prev,
            detailPoints: [...prev.detailPoints, currentPoint.trim()],
        }));
        setCurrentPoint("");
    };

    const removeDetailPoint = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            detailPoints: prev.detailPoints.filter((_, i) => i !== index),
        }));
    };

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.title || !formData.description || !formData.price || !formData.category) {
            toast.error("Please fill in all required fields.");
            return;
        }
        if (formData.images.some((img) => img === null)) {
            toast.error("Please upload all 5 product images.");
            return;
        }
        if (formData.isProductWearable && formData.sizes.length === 0) {
            toast.error("Please select at least one size for wearable products.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Creating product...");

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("stock", formData.stock);
            data.append("category", formData.category);
            data.append("isProductWearable", String(formData.isProductWearable));
            data.append("replacementDays", formData.replacementDays || "0");
            data.append("warranty", formData.warranty || "No Warranty");
            data.append("freeDelivery", String(formData.freeDelivery));
            data.append("cashOnDelivery", String(formData.cashOnDelivery));

            // Arrays need special handling in FormData
            formData.sizes.forEach((size) => data.append("sizes", size));
            formData.detailPoints.forEach((point) => data.append("detailPoints", point));

            // Images
            formData.images.forEach((img, i) => {
                if (img) data.append(`image${i + 1}`, img);
            });

            const res = await axios.post("/api/vendor/add-product", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 201) {
                toast.success("Product added successfully!", { id: toastId });
                router.push("/");
            }
        } catch (error: any) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to add product", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0518] text-white pt-5 pb-20 px-4 flex justify-center">

            {/* Background Ambient */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl relative z-10"
            >
                {/* --- BACK BUTTON --- */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group cursor-pointer"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back</span>
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Add New Product
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Fill in the details to list your item on the marketplace.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* --- SECTION 1: BASIC INFO --- */}
                    <div className="p-6 md:p-8 rounded-4xl bg-[#120c1f]/60 backdrop-blur-xl border border-white/5 shadow-2xl space-y-6">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Basic Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1">Product Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Classic Leather Jacket"
                                    className="w-full px-4 py-3.5 bg-[#0B0518]/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 text-sm"
                                />
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 1999"
                                    className="w-full px-4 py-3.5 bg-[#0B0518]/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 text-sm"
                                />
                            </div>

                            {/* Stock */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 50"
                                    className="w-full px-4 py-3.5 bg-[#0B0518]/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 text-sm"
                                />
                            </div>

                            {/* Category Select */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1">Category</label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 bg-[#0B0518]/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-slate-300 text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select a Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name} className="bg-[#0B0518] text-white">
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-300 ml-1">Product Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your product features, material, and benefits..."
                                className="w-full px-4 py-3.5 bg-[#0B0518]/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 text-sm h-32 resize-none"
                            />
                        </div>
                    </div>


                    {/* --- SECTION 2: ATTRIBUTES (Wearable Checkbox) --- */}
                    <div className="p-6 md:p-8 rounded-4xl bg-[#120c1f]/60 backdrop-blur-xl border border-white/5 shadow-2xl space-y-6">

                        <div
                            onClick={() => handleCheckboxChange("isProductWearable")}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.isProductWearable ? 'bg-purple-600 border-purple-600' : 'border-slate-500 group-hover:border-purple-400'}`}>
                                {formData.isProductWearable && <Check size={14} className="text-white" />}
                            </div>
                            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">This is a wearable / clothing product</span>
                        </div>

                        <AnimatePresence>
                            {formData.isProductWearable && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-2 pb-4">
                                        <label className="text-xs font-medium text-slate-300 ml-1 block mb-3">Select Available Sizes</label>
                                        <div className="flex flex-wrap gap-3">
                                            {CLOTHING_SIZES.map((size) => {
                                                const isSelected = formData.sizes.includes(size);
                                                return (
                                                    <button
                                                        key={size}
                                                        type="button"
                                                        onClick={() => toggleSize(size)}
                                                        className={`
                              px-4 py-2 rounded-lg text-xs font-bold transition-all border
                              ${isSelected
                                                                ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30'
                                                                : 'bg-[#0B0518]/50 border-white/10 text-slate-400 hover:border-purple-500/50 hover:text-white'}
                            `}
                                                    >
                                                        {size}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="h-px bg-white/5 w-full" />

                        {/* Additional Policies */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1">Replacement Period (Days)</label>
                                <input
                                    type="number"
                                    name="replacementDays"
                                    value={formData.replacementDays}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 7"
                                    className="w-full px-4 py-3.5 bg-[#0B0518]/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-300 ml-1">Warranty Info</label>
                                <input
                                    type="text"
                                    name="warranty"
                                    value={formData.warranty}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 1 Year Manufacturer Warranty"
                                    className="w-full px-4 py-3.5 bg-[#0B0518]/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-6 pt-2">
                            <div
                                onClick={() => handleCheckboxChange("freeDelivery")}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.freeDelivery ? 'bg-purple-600 border-purple-600' : 'border-slate-500 group-hover:border-purple-400'}`}>
                                    {formData.freeDelivery && <Check size={14} className="text-white" />}
                                </div>
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Free Delivery</span>
                            </div>

                            <div
                                onClick={() => handleCheckboxChange("cashOnDelivery")}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.cashOnDelivery ? 'bg-purple-600 border-purple-600' : 'border-slate-500 group-hover:border-purple-400'}`}>
                                    {formData.cashOnDelivery && <Check size={14} className="text-white" />}
                                </div>
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Cash on Delivery</span>
                            </div>
                        </div>
                    </div>


                    {/* --- SECTION 3: IMAGES --- */}
                    <div className="p-6 md:p-8 rounded-4xl bg-[#120c1f]/60 backdrop-blur-xl border border-white/5 shadow-2xl space-y-6">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Product Images (5 Required)</h2>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[0, 1, 2, 3, 4].map((index) => (
                                <div key={index} className="relative group">
                                    <div className={`
                    aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden
                    ${formData.previews[index]
                                            ? 'border-purple-500/50 bg-[#0B0518]'
                                            : 'border-white/10 bg-[#0B0518]/30 hover:border-purple-500/30 hover:bg-[#0B0518]/60'}
                  `}>
                                        {formData.previews[index] ? (
                                            <>
                                                <Image
                                                    src={formData.previews[index]}
                                                    alt={`Upload ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                                        className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                                <UploadCloud size={24} className="text-slate-500 mb-2 group-hover:text-purple-400 transition-colors" />
                                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Image {index + 1}</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleImageUpload(e, index)}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* --- SECTION 4: DETAIL POINTS --- */}
                    <div className="p-6 md:p-8 rounded-4xl bg-[#120c1f]/60 backdrop-blur-xl border border-white/5 shadow-2xl space-y-6">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Highlights / Features</h2>

                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={currentPoint}
                                onChange={(e) => setCurrentPoint(e.target.value)}
                                placeholder="e.g. 100% Cotton Material"
                                className="flex-1 px-4 py-3.5 bg-[#0B0518]/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDetailPoint())}
                            />
                            <button
                                type="button"
                                onClick={addDetailPoint}
                                className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-600/20"
                            >
                                Add
                            </button>
                        </div>

                        <div className="space-y-2">
                            <AnimatePresence>
                                {formData.detailPoints.map((point, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                            <span className="text-sm text-slate-300">{point}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDetailPoint(index)}
                                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {formData.detailPoints.length === 0 && (
                                <p className="text-xs text-slate-600 italic pl-1">No highlight points added yet.</p>
                            )}
                        </div>
                    </div>


                    {/* --- SUBMIT BUTTON --- */}
                    <div className="pt-4 pb-10">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-xl shadow-purple-600/30 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Add Product <Plus size={20} /></>}
                        </motion.button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}