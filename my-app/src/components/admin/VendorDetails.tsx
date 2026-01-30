"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  Loader2,
  ArrowRight,
  Users,
  Mail
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get("/api/admin/get-all-approved-vendors");
        if (res.status === 200) {
          setVendors(res.data.vendors);
          setFilteredVendors(res.data.vendors);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Could not load vendors");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // Search Filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = vendors.filter(v =>
      v.shopName?.toLowerCase().includes(term) ||
      v.name?.toLowerCase().includes(term) ||
      v.email?.toLowerCase().includes(term)
    );
    setFilteredVendors(filtered);
  }, [searchTerm, vendors]);

  if (loading) return (
    <div className="min-h-screen bg-[#0B0518] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
      <p className="text-slate-400 animate-pulse text-sm">Loading Vendors...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0518] text-white pb-20 relative">

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Verified Vendors
            </h1>
            <p className="text-slate-400 text-sm mt-2 ml-1">
              Managing <span className="text-white font-bold">{vendors.length}</span> active partners
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by Shop, Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#120c1f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>
        </div>

        {/* --- VENDORS GRID --- */}
        {filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-[#120c1f]/50 border border-white/5 rounded-3xl backdrop-blur-sm">
            <Users size={48} className="text-slate-600 mb-4" />
            <p className="text-slate-400">No vendors found matching your search.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredVendors.map((vendor) => (
              <Link href={`/admin/vendor-details/${vendor._id}`} key={vendor._id} className="block h-full">
                <motion.div
                  variants={cardVariants}
                  className="group h-full bg-[#120c1f]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden hover:border-purple-500/40 hover:bg-[#150d24] transition-all duration-300 shadow-xl cursor-pointer flex flex-col"
                >
                  {/* Gradient Hover Effect */}
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Header: Image & Status */}
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#0B0518] p-1 border border-white/10 overflow-hidden shadow-lg">
                      {vendor.image ? (
                        <Image src={vendor.image} alt={vendor.name} width={64} height={64} className="rounded-xl w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-xl font-bold text-slate-500 rounded-xl">
                          {vendor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-purple-500 group-hover:text-white transition-all -rotate-45 group-hover:rotate-0">
                      <ArrowRight size={16} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors truncate">
                      {vendor.shopName}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">{vendor.name}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 p-2 rounded-lg">
                        <Mail size={12} className="shrink-0 text-purple-400" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 p-2 rounded-lg">
                        <MapPin size={12} className="shrink-0 text-purple-400" />
                        <span className="truncate">{vendor.shopAddress || "No address provided"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs relative z-10">
                    <span className="text-slate-500">Joined {new Date(vendor.createdAt).toLocaleDateString()}</span>
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-bold uppercase tracking-wider text-[10px]">
                      Verified
                    </span>
                  </div>

                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}