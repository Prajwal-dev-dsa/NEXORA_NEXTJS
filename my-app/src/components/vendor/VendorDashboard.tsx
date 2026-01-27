"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  PackageSearch,
  Menu,
  X
} from "lucide-react";

import Dashboard from "./Dashboard";
import ManageOrders from "./ManageOrders";
import YourProducts from "./YourProducts";

export default function VendorDashboard() {
  // State to track the active view
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Configuration for Sidebar Items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "manage-orders", label: "Manage Orders", icon: ShoppingBag },
    { id: "your-products", label: "Your Products", icon: PackageSearch },
  ];

  // Function to render the selected component
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "manage-orders":
        return <ManageOrders />;
      case "your-products":
        return <YourProducts />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0518] text-white flex pt-20">

      {/* --- Mobile Sidebar Toggle --- */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-4 bg-purple-600 rounded-full shadow-lg shadow-purple-500/40 text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : 0 }} // On mobile, we might want to toggle this, but for responsive layout:
        className={`
          fixed md:sticky top-20 left-0 h-[calc(100vh-80px)] w-64 
          bg-[#120c1f]/50 backdrop-blur-xl border-r border-white/10 
          flex flex-col p-4 z-40 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="mb-8 px-2">
          <h2 className="text-xl font-bold bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Vendor Panel
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage your products and orders</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false); // Close sidebar on mobile after click
                }}
                className={`
                  relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group cursor-pointer
                  ${isActive ? "text-white" : "text-slate-400 hover:text-white"}
                `}
              >
                {/* Active Background linear */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Hover Background (Inactive) */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                {/* Icon & Text (Z-Index to sit above background) */}
                <span className="relative z-10">
                  <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-purple-400 transition-colors"} />
                </span>
                <span className="relative z-10 font-medium tracking-wide">
                  {item.label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full z-10 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Status */}
        <div className="mt-auto p-4 rounded-2xl bg-linear-to-br from-purple-900/20 to-indigo-900/20 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">System Operational</span>
          </div>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden min-h-[calc(100vh-80px)]">

        {/* Header for Current Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white capitalize">
            {activeTab.replace("-", " ")}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Overview of your platform activity</p>
        </div>

        {/* Content Animation Wrapper */}
        <div className="w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              {/* This renders the specific component (Dashboard, VendorDetails, etc.) */}
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}