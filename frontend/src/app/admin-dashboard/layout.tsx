"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { requireAuth, isLoading, user } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Show a full-screen loader while checking auth
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030213]">
        <div className="w-8 h-8 border-4 border-[#F4B942] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <AdminSidebar />
      
      {/* 
        Main Content Area 
        Margin left to offset the fixed 280px sidebar 
      */}
      <div className="flex-1 ml-[280px] flex flex-col min-h-screen">
        <AdminHeader />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
