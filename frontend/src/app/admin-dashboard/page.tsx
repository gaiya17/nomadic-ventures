"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "motion/react";
import { 
  Map, 
  Palmtree, 
  Image as ImageIcon, 
  Users, 
  Plus, 
  RefreshCcw,
  Building,
  Clock
} from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [resortCount, setResortCount] = useState(0);

  useEffect(() => {
    axios.get("/api/admin/resorts")
      .then((res) => {
        if (res.data.success) {
          setResortCount(res.data.resorts.length);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#030213] rounded-2xl p-8 text-white relative overflow-hidden flex items-center justify-between shadow-xl"
      >
        <div className="relative z-10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 mb-2">
            {today}
          </p>
          <h2 className="text-3xl font-bold mb-2">
            Good Morning, <span className="text-[#F4B942]">{user?.name}</span> 👋
          </h2>
          <p className="text-sm text-gray-400 max-w-lg">
            Welcome to the Nomadic Ventures admin console. Here is the latest overview of your travel catalog and platform metrics.
          </p>
        </div>
        
        <button className="relative z-10 flex items-center gap-2 bg-[#F4B942] hover:bg-[#e0a83b] transition-colors px-6 py-3 rounded-xl font-semibold text-black text-sm shadow-lg shadow-[#F4B942]/20">
          <RefreshCcw size={16} />
          Sync Data
        </button>

        {/* Decorative Background Elements */}
        <div className="absolute right-0 top-0 w-[40%] h-full bg-gradient-to-l from-[#F4B942]/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "TOUR PACKAGES", count: 15, active: 15, icon: Map, color: "text-blue-500", bg: "bg-blue-50" },
          { title: "MALDIVES RESORTS", count: resortCount, active: resortCount, icon: Building, color: "text-purple-500", bg: "bg-purple-50" },
          { title: "EXPERIENCES", count: 8, active: null, icon: ImageIcon, color: "text-emerald-500", bg: "bg-emerald-50" },
          { title: "ADMINISTRATORS", count: 2, active: null, icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              {stat.active && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {stat.active} Active
                </div>
              )}
            </div>
            
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-gray-400 mb-1">{stat.title}</p>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-[#0A1128]">{stat.count}</p>
                <span className="text-gray-300">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recently Added Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#0A1128]">Recently Added</h3>
              <p className="text-xs text-gray-500 mt-1">The newest packages and resorts on your platform</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <Clock size={16} />
            </div>
          </div>

          <div className="space-y-4">
            {[
              { name: "Dhigufaru Island Resort Maldives", type: "RESORT", date: "6/22/2026", icon: Building },
              { name: "Emerald Maldives Resort & Spa", type: "RESORT", date: "6/20/2026", icon: Building },
              { name: "Emerald Faarufushi Resort & Spa", type: "RESORT", date: "5/20/2026", icon: Building },
              { name: "Rebalance & Restore: Your 6-Day Ayurvedic Wellness Journey", type: "TOUR", date: "4/17/2026", icon: Map },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'RESORT' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0A1128]">{item.name}</h4>
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-0.5">
                    {item.type} • {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#0A1128]">Quick Actions</h3>
            <p className="text-xs text-gray-500 mt-1">Jump directly to management</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Add Tour Package", icon: Plus, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Add Resort", icon: Building, color: "text-purple-500", bg: "bg-purple-50" },
              { title: "Manage Experiences", icon: ImageIcon, color: "text-emerald-500", bg: "bg-emerald-50" },
              { title: "Manage Users", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
            ].map((action) => (
              <button 
                key={action.title}
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-center group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon size={20} />
                </div>
                <span className="text-xs font-bold text-[#0A1128] max-w-[80px] leading-tight">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
