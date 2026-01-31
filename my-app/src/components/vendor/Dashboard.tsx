"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Loader2,
  Clock,
  TrendingUp,
  CheckCircle2,
  PieChart as PieIcon
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
  Legend,
  AreaChart,
  Area
} from "recharts";
import { toast } from "sonner";

// --- COLORS ---
const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
const BAR_COLOR = '#8B5CF6';
const LINE_COLOR = '#10B981';

export default function VendorDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/vendor/dashboard-stats");
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
      <p className="text-slate-400 animate-pulse text-sm">Loading Store Data...</p>
    </div>
  );

  const { summary, charts } = data;

  const statCards = [
    { title: "Total Revenue", value: `₹${summary.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    { title: "Total Orders", value: summary.totalOrders, icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Pending Orders", value: summary.pendingOrders, icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { title: "Total Products", value: summary.totalProducts, icon: Package, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Active Listings", value: summary.activeProducts, icon: CheckCircle2, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0518] text-white pb-20 relative overflow-x-hidden">

      {/* Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20">
            <LayoutDashboard className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Vendor Dashboard</h1>
            <p className="text-slate-400 text-sm">Performance overview of your shop</p>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8"
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

        {/* --- CHARTS ROW 1: Revenue Trend (Line Chart) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#120c1f] border border-white/10 rounded-3xl p-6 shadow-2xl mb-8"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-green-400" size={20} /> Revenue Trend
            </h3>
            <p className="text-xs text-slate-400">Daily sales performance</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.lineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={LINE_COLOR} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={LINE_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1625', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke={LINE_COLOR} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* --- CHARTS ROW 2: Products & Status --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* BAR CHART: Top Products */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#120c1f] border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="text-purple-400" size={20} /> Top Selling Products
              </h3>
              <p className="text-xs text-slate-400">Items with the highest sales volume</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1625', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }} cursor={{ fill: '#ffffff05' }} />
                  <Bar dataKey="sales" fill={BAR_COLOR} radius={[6, 6, 0, 0]} barSize={40} activeBar={{ fill: '#A78BFA' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* PIE CHART: Order Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#120c1f] border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PieIcon className="text-blue-400" size={20} /> Order Distribution
              </h3>
              <p className="text-xs text-slate-400">Current status of all orders</p>
            </div>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {charts.pieChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1625', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-slate-300 text-sm ml-1">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center">
                  <span className="text-3xl font-bold text-white block">{summary.totalOrders}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-widest">Total</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}