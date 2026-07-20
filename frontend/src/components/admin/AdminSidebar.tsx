"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Home, 
  Map, 
  Palmtree, 
  Compass, 
  Users, 
  LogOut,
  Settings,
  Tags
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Homepage Manager", href: "/admin-dashboard/homepage", icon: Home },
    { name: "Categories", href: "/admin-dashboard/categories", icon: Tags },
    { name: "Tours", href: "/admin-dashboard/tours", icon: Map },
    { name: "Maldives Resorts", href: "/admin-dashboard/resorts", icon: Palmtree },
    { name: "Experiences", href: "/admin-dashboard/experiences", icon: Compass },
    { name: "User Management", href: "/admin-dashboard/users", icon: Users },
  ];

  return (
    <div className="w-[280px] bg-[#030213] h-screen fixed left-0 top-0 text-gray-300 flex flex-col shadow-2xl z-50">
      
      {/* Logo Area */}
      <div className="h-[80px] flex items-center px-8 border-b border-white/5">
        <Link href="/admin-dashboard" className="flex flex-col">
          <span className="text-xl font-bold text-white tracking-widest" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            NOMADIC
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#F4B942]">Admin Console</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-4">
          Main Menu
        </div>
        
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive 
                  ? "bg-[#F4B942] text-black shadow-lg shadow-[#F4B942]/20" 
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} className={isActive ? "text-black" : "text-gray-400"} />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* System Status & Bottom Actions */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">
            System Status
          </div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-400">Database</span>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Stable
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Server</span>
            <div className="flex items-center gap-2 text-blue-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Online
            </div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-gray-400 hover:text-red-400"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

    </div>
  );
}
