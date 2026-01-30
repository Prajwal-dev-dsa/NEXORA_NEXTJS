"use client";

import { motion } from "framer-motion";
import {
    X,
    AlertTriangle,
    RefreshCw,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderFailedPage() {
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason") || "Payment could not be processed.";

    return (
        <div className="min-h-screen bg-[#0B0518] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* --- BACKGROUND AMBIENCE --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
                <ErrorParticleBackground />
            </div>

            {/* --- MAIN CARD --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg"
            >
                {/* Decoration Line */}
                <div className="absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-red-500 to-transparent opacity-50" />

                <div className="bg-[#120c1f]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-red-900/20 text-center">

                    {/* Animated Error Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-24 h-24">
                            {/* Pulse Effect */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 bg-red-500/20 rounded-full"
                            />
                            <div className="relative w-full h-full bg-linear-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                                >
                                    <X size={48} className="text-white stroke-3" />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-4xl font-bold bg-linear-to-r from-red-200 via-red-400 to-orange-400 bg-clip-text text-transparent mb-2"
                    >
                        Order Failed
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400 mb-8"
                    >
                        Oops! Something went wrong while processing your order. No funds have been deducted.
                    </motion.p>

                    {/* Error Details Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 mb-8 text-left flex items-start gap-3"
                    >
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-red-400 uppercase tracking-wider font-bold mb-1">Error Reason</p>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                {reason}
                            </p>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col gap-3"
                    >
                        <Link href="/user/checkout" className="w-full">
                            <button className="w-full py-3.5 rounded-xl bg-white text-[#0B0518] hover:bg-slate-200 font-bold shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer">
                                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                                Try Again
                            </button>
                        </Link>

                        <div className="flex gap-3">
                            <Link href="/user/cart" className="flex-1">
                                <button className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer">
                                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    Back to Cart
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
}

// --- PARTICLE COMPONENT (Chaos Effect) ---
const ErrorParticleBackground = () => {
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5
    }));

    return (
        <>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: `${p.y}vh`, x: `${p.x}vw`, opacity: 0 }}
                    animate={{
                        y: [null, `${p.y - 20}vh`], // Float upwards slightly
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute rounded-full"
                    style={{
                        width: p.size,
                        height: p.size,
                        background: p.id % 2 === 0 ? '#EF4444' : '#7C3AED', // Red or Purple
                        boxShadow: `0 0 ${p.size * 3}px ${p.id % 2 === 0 ? '#EF4444' : '#7C3AED'}`
                    }}
                />
            ))}
        </>
    );
};