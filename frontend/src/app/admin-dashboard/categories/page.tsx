"use client";

import React from "react";
import Link from "next/link";
import { Palmtree, Map, ChevronRight } from "lucide-react";

export default function CategoryManagerHub() {
  return (
    <div className="w-full h-full p-8 font-sans bg-[#F9F9F9]">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#030213] tracking-tight">
          Category Manager
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Select a domain to manage its categories and collections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        
        {/* Sri Lanka Tours Card */}
        <Link href="/admin-dashboard/categories/tours" className="group block">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <Map size={120} />
            </div>
            
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Map size={28} />
            </div>
            
            <h2 className="text-2xl font-bold text-[#030213] mb-3">
              Tours
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[80%]">
              Manage tour categories, update descriptions, assign primary destinations, and upload high-quality category imagery for the tours pages.
            </p>
            
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 group-hover:gap-4 transition-all">
              Manage Tour Categories <ChevronRight size={16} />
            </div>
          </div>
        </Link>

        {/* Maldives Resorts Card */}
        <Link href="/admin-dashboard/categories/resorts" className="group block">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <Palmtree size={120} />
            </div>
            
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Palmtree size={28} />
            </div>
            
            <h2 className="text-2xl font-bold text-[#030213] mb-3">
              Maldives Resorts
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[80%]">
              Manage resort collections, edit short descriptions, and define what makes each collection unique for the Maldives properties.
            </p>
            
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:gap-4 transition-all">
              Manage Resort Categories <ChevronRight size={16} />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
