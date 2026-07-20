"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

export function AdminHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Simple logic to format the page title based on the URL
  const getPageTitle = () => {
    if (pathname === "/admin-dashboard") return "Dashboard";
    if (pathname === "/admin-dashboard/homepage") return "Homepage Manager";
    if (pathname === "/admin-dashboard/tours") return "Tour Packages";
    if (pathname === "/admin-dashboard/resorts") return "Maldives Resorts";
    if (pathname === "/admin-dashboard/experiences") return "Experiences";
    if (pathname === "/admin-dashboard/users") return "User Management";
    return "Admin Console";
  };

  return (
    <header className="h-[80px] bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      
      {/* Page Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          {getPageTitle()}
        </h1>
        <p className="text-xs font-medium text-gray-400 mt-0.5">
          Nomadic Ventures — Admin Console
        </p>
      </div>

      {/* Admin Profile Area */}
      {user && (
        <div className="flex items-center gap-4 bg-gray-50 rounded-full py-1.5 pr-4 pl-1.5 border border-gray-200">
          <div className="w-9 h-9 rounded-full bg-[#030213] text-[#F4B942] flex items-center justify-center font-bold text-sm">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-tight">
              {user.name}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4B942] leading-tight">
              {user.role}
            </span>
          </div>
        </div>
      )}

    </header>
  );
}
