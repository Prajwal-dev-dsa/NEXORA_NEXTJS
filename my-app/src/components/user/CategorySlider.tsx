"use client";

import {
    Shirt,
    Smartphone,
    Armchair,
    Sparkles,
    Watch,
    Footprints,
    Gamepad2,
    Headphones,
    Laptop,
    Camera,
    Dumbbell,
    Baby,
    Dog,
    Gift,
    Book,
    Briefcase,
    Utensils,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    LucideIcon
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Category {
    id: number;
    name: string;
    icon: LucideIcon;
    color: string; // Used for hover glow effects
}

function CategorySlider() {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [showLeftIcon, setShowLeftIcon] = useState<boolean>(false);
    const [showRightIcon, setShowRightIcon] = useState<boolean>(false);

    // E-commerce Categories
    const categories: Category[] = [
        { id: 1, name: "Fashion", icon: Shirt, color: "group-hover:text-purple-400 group-hover:border-purple-500/50 group-hover:shadow-purple-500/20" },
        { id: 2, name: "Mobiles", icon: Smartphone, color: "group-hover:text-cyan-400 group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/20" },
        { id: 3, name: "Home Decor", icon: Armchair, color: "group-hover:text-amber-400 group-hover:border-amber-500/50 group-hover:shadow-amber-500/20" },
        { id: 4, name: "Beauty", icon: Sparkles, color: "group-hover:text-pink-400 group-hover:border-pink-500/50 group-hover:shadow-pink-500/20" },
        { id: 5, name: "Footwear", icon: Footprints, color: "group-hover:text-orange-400 group-hover:border-orange-500/50 group-hover:shadow-orange-500/20" },
        { id: 6, name: "Watches", icon: Watch, color: "group-hover:text-emerald-400 group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/20" },
        { id: 7, name: "Gaming", icon: Gamepad2, color: "group-hover:text-red-400 group-hover:border-red-500/50 group-hover:shadow-red-500/20" },
        { id: 8, name: "Audio", icon: Headphones, color: "group-hover:text-blue-400 group-hover:border-blue-500/50 group-hover:shadow-blue-500/20" },
        { id: 9, name: "Laptops", icon: Laptop, color: "group-hover:text-indigo-400 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/20" },
        { id: 10, name: "Cameras", icon: Camera, color: "group-hover:text-yellow-400 group-hover:border-yellow-500/50 group-hover:shadow-yellow-500/20" },
        { id: 11, name: "Sports", icon: Dumbbell, color: "group-hover:text-lime-400 group-hover:border-lime-500/50 group-hover:shadow-lime-500/20" },
        { id: 12, name: "Baby Care", icon: Baby, color: "group-hover:text-rose-400 group-hover:border-rose-500/50 group-hover:shadow-rose-500/20" },
        { id: 13, name: "Pet Supplies", icon: Dog, color: "group-hover:text-stone-400 group-hover:border-stone-500/50 group-hover:shadow-stone-500/20" },
        { id: 14, name: "Kitchen", icon: Utensils, color: "group-hover:text-teal-400 group-hover:border-teal-500/50 group-hover:shadow-teal-500/20" },
        { id: 15, name: "Books", icon: Book, color: "group-hover:text-slate-400 group-hover:border-slate-500/50 group-hover:shadow-slate-500/20" },
        { id: 16, name: "Bags", icon: Briefcase, color: "group-hover:text-violet-400 group-hover:border-violet-500/50 group-hover:shadow-violet-500/20" },
        { id: 17, name: "Gifting", icon: Gift, color: "group-hover:text-fuchsia-400 group-hover:border-fuchsia-500/50 group-hover:shadow-fuchsia-500/20" },
    ];

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current
        setShowLeftIcon(scrollLeft > 0)
        setShowRightIcon(scrollLeft + clientWidth <= scrollWidth - 10)
    }

    useEffect(() => {
        const ref = scrollRef.current;
        ref?.addEventListener("scroll", checkScroll);
        // Initial check
        checkScroll();
        return () => ref?.removeEventListener("scroll", checkScroll)
    })

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

                if (isAtEnd) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section className="w-full py-8 px-4 md:px-8 bg-[#0B0518]">

            {/* Header Section */}
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="p-2 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg shadow-purple-500/20">
                    <ShoppingBag className="text-white size-5 md:size-6" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Shop by Category
                </h2>
            </div>

            {/* Slider Container */}
            <div
                className="relative group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Left Arrow Button */}
                {showLeftIcon && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 1)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-purple-600/80 backdrop-blur-md shadow-lg border border-white/10 rounded-full p-3 hidden md:flex items-center justify-center text-white -ml-5"
                    >
                        <ChevronLeft className="size-6" />
                    </motion.button>
                )}

                {/* Scrollable List */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2 -mx-2 touch-pan-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category, index) => (
                        <motion.div
                            // onClick={() => router.push(`/user/shop-by-category/${category.name}`)}
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={`
                                group relative min-w-[130px] md:min-w-[160px] h-[160px] md:h-[180px] 
                                flex flex-col items-center justify-center p-4 rounded-3xl cursor-pointer 
                                bg-white/5 border border-white/5 backdrop-blur-sm
                                hover:border-transparent hover:shadow-2xl transition-all duration-300
                                ${category.color.replace('text-', 'shadow-')}
                            `}
                        >
                            {/* Icon Container */}
                            <div className={`
                                mb-4 p-4 rounded-full bg-white/5 border border-white/5 
                                group-hover:bg-white/10 transition-colors duration-300
                            `}>
                                <category.icon
                                    className={`
                                        size-8 md:size-9 text-slate-400 
                                        transition-colors duration-300 
                                        ${category.color.split(' ')[0]} // Apply text color on hover
                                    `}
                                    strokeWidth={1.5}
                                />
                            </div>

                            {/* Text */}
                            <span className="text-sm md:text-base font-medium text-slate-300 group-hover:text-white transition-colors">
                                {category.name}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Right Arrow Button */}
                {showRightIcon && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 1)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-purple-600/80 backdrop-blur-md shadow-lg border border-white/10 rounded-full p-3 hidden md:flex items-center justify-center text-white -mr-5"
                    >
                        <ChevronRight className="size-6" />
                    </motion.button>
                )}

            </div>
        </section>
    );
}

export default CategorySlider;