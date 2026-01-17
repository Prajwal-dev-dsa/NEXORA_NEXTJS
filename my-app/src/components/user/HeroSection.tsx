"use client"

import {
    Smartphone,
    Watch,
    Armchair,
    Shirt,
    Sparkles,
    ArrowRight,
    Dumbbell,
    Footprints,
    Utensils,
    Gamepad2,
    Plane
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

function HeroSection() {
    const router = useRouter();

    // E-commerce specific slides
    const slides = [
        {
            id: 1,
            icon: <Shirt className="size-12 md:size-16 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />,
            title: "Summer Fashion",
            subTitle: "Upgrade your wardrobe with the latest premium trends.",
            btnText: "Shop Collection",
            category: "Fashion",
            bgImg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
            accent: "from-purple-600 to-indigo-600"
        },
        {
            id: 2,
            icon: <Smartphone className="size-12 md:size-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />,
            title: "Next-Gen Tech",
            subTitle: "Flagship smartphones, laptops & accessories.",
            btnText: "Explore Gadgets",
            category: "Electronics",
            bgImg: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop",
            accent: "from-cyan-600 to-blue-600"
        },
        {
            id: 3,
            icon: <Armchair className="size-12 md:size-16 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />,
            title: "Modern Living",
            subTitle: "Minimalist furniture & decor for a royal home.",
            btnText: "View Decor",
            category: "Home & Living",
            bgImg: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
            accent: "from-amber-600 to-orange-600"
        },
        {
            id: 4,
            icon: <Sparkles className="size-12 md:size-16 text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]" />,
            title: "Luxury Beauty",
            subTitle: "Skincare, fragrances & makeup from top brands.",
            btnText: "Glow Up",
            category: "Beauty",
            bgImg: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop",
            accent: "from-pink-600 to-rose-600"
        },
        {
            id: 5,
            icon: <Watch className="size-12 md:size-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />,
            title: "Timeless Accessories",
            subTitle: "Watches, jewelry & bags that define your style.",
            btnText: "Accessorize",
            category: "Accessories",
            bgImg: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop",
            accent: "from-emerald-600 to-teal-600"
        },
        {
            id: 6,
            icon: <Dumbbell className="size-12 md:size-16 text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />,
            title: "Active & Fit",
            subTitle: "High-performance gear for your fitness journey.",
            btnText: "Get Moving",
            category: "Sports",
            bgImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
            accent: "from-red-600 to-orange-600"
        },
        {
            id: 7,
            icon: <Footprints className="size-12 md:size-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />,
            title: "Sneaker Head",
            subTitle: "Limited editions, running shoes & formal wear.",
            btnText: "Step Up",
            category: "Footwear",
            bgImg: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop",
            accent: "from-yellow-500 to-amber-500"
        },
        {
            id: 8,
            icon: <Utensils className="size-12 md:size-16 text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.5)]" />,
            title: "Culinary Arts",
            subTitle: "Premium cookware & appliances for the master chef.",
            btnText: "Cook Now",
            category: "Kitchen",
            bgImg: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
            accent: "from-slate-500 to-gray-500"
        },
        {
            id: 9,
            icon: <Gamepad2 className="size-12 md:size-16 text-violet-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]" />,
            title: "Level Up",
            subTitle: "Consoles, accessories & trending games.",
            btnText: "Play Now",
            category: "Gaming",
            bgImg: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2070&auto=format&fit=crop",
            accent: "from-violet-600 to-purple-600"
        },
        {
            id: 10,
            icon: <Plane className="size-12 md:size-16 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />,
            title: "Travel Ready",
            subTitle: "Luggage, backpacks & essentials for your next trip.",
            btnText: "Pack Up",
            category: "Travel",
            bgImg: "https://images.unsplash.com/photo-1565891741441-64926e441838?q=80&w=2071&auto=format&fit=crop",
            accent: "from-sky-600 to-blue-600"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [slides.length])

    return (
        <section className="w-full pt-28 px-4 md:px-8 bg-[#0B0518] pb-10">
            <div className="relative w-full h-[65vh] md:h-[75vh] rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 group ring-1 ring-white/10">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 cursor-pointer"
                    // onClick={() => router.push(`/user/shop-by-category/${slides[currentSlide]?.category}`)}
                    >
                        {/* Background Image */}
                        <Image
                            src={slides[currentSlide]?.bgImg}
                            alt={slides[currentSlide]?.title}
                            fill
                            priority
                            quality={90}
                            className="object-cover"
                            sizes="100vw"
                        />

                        {/* Dark Royal Linear Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#0B0518] via-[#0B0518]/60 to-transparent" />
                        <div className="absolute inset-0 bg-linear-to-r from-[#0B0518]/80 via-transparent to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">

                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="mb-6 p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
                            >
                                {slides[currentSlide].icon}
                            </motion.div>

                            <motion.h2
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-4xl md:text-7xl font-black text-white mb-4 drop-shadow-lg tracking-tight"
                            >
                                {slides[currentSlide].title}
                            </motion.h2>

                            <motion.p
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-lg md:text-2xl text-slate-200 mb-10 max-w-xs md:max-w-2xl font-light leading-relaxed"
                            >
                                {slides[currentSlide].subTitle}
                            </motion.p>

                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className={`
                                    bg-linear-to-r ${slides[currentSlide].accent}
                                    text-white px-8 py-4 rounded-2xl font-bold text-lg 
                                    flex items-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(124,58,237,0.4)] 
                                    hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all
                                `}
                            >
                                {slides[currentSlide].btnText}
                                <ArrowRight className="size-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentSlide(index);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-500 backdrop-blur-md ${index === currentSlide
                                ? "w-10 bg-linear-to-r from-purple-500 to-indigo-500"
                                : "w-2 bg-white/20 hover:bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HeroSection;