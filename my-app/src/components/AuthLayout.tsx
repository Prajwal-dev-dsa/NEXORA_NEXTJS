import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    // The outer div handles the theme background. 
    // 'dark' class is usually on the HTML tag, but for now, the dark styles will apply when dark mode is active.
    // Defaulting to the dark "Royal" background as requested.
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#0B0518] transition-colors duration-500">

      {/* Background Gradients (The "Royal" Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-400/30 dark:bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-1"
      >
        {/* Glass Card */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl p-8">

          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && (
                <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;