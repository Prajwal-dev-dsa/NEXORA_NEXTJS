"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Loader2,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { toast } from "sonner";

// --- COLORS FOR CHARTS ---
const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']; // Green, Blue, Amber, Red
const BAR_COLOR = '#8B5CF6'; // Purple

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard-stats");
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0B0518] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-purple-500 w-12 h-12" />
      <p className="text-slate-400 animate-pulse text-sm">Initializing Dashboard...</p>
    </div>
  );

  const { summary, charts } = data;

  // Stat Cards Configuration
  const statCards = [
    { title: "Total Vendors", value: summary.totalVendors, icon: Store, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Pending Vendors", value: summary.pendingVendors, icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { title: "Total Products", value: summary.totalProducts, icon: Package, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Pending Products", value: summary.pendingProducts, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { title: "Total Orders", value: summary.totalOrders, icon: ShoppingBag, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Total Earnings", value: `₹${summary.totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0518] text-white pb-20 relative overflow-x-hidden">

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Overview of platform performance</p>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          {statCards.map((card, index) => (
            <div key={index} className={`p-5 rounded-2xl bg-[#120c1f] border ${card.border} flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-transform duration-300 shadow-lg`}>
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                  <card.icon size={18} />
                </div>
              </div>
              <span className="text-2xl font-bold text-white">{card.value}</span>
            </div>
          ))}
        </motion.div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* BAR CHART: Vendor-wise Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2 bg-[#120c1f] border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-purple-400" size={20} /> Vendor-wise Orders
              </h3>
              <p className="text-xs text-slate-400">Top 5 performing shops by order volume</p>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.vendorData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1625', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar
                    dataKey="orders"
                    fill={BAR_COLOR}
                    radius={[6, 6, 0, 0]}
                    barSize={50}
                    activeBar={{ fill: '#A78BFA' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* PIE CHART: Order Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-1 bg-[#120c1f] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="text-blue-400" size={20} /> Order Status
              </h3>
              <p className="text-xs text-slate-400">Distribution of current order statuses</p>
            </div>

            <div className="flex-1 min-h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {charts.statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1625', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-300 text-sm ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center">
                  <span className="text-3xl font-bold text-white block">{summary.totalOrders}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-widest">Orders</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}