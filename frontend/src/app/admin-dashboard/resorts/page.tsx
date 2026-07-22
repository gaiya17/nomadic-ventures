"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Filter, Edit2, Trash2 } from "lucide-react";
import ResortWizard from "@/components/admin/ResortWizard";

export default function ResortsManager() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Filter state
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const dynamicCategories = [
    "All",
    ...Array.from(
      new Set(
        resorts
          .flatMap((r) => r.categories.map((c: any) => c.category?.name))
          .filter(Boolean)
      )
    ),
  ];

  const fetchResorts = async () => {
    try {
      const res = await axios.get("/api/admin/resorts");
      if (res.data.success) {
        setResorts(res.data.resorts);
      }
    } catch (error) {
      console.error("Failed to fetch resorts", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResorts();
  }, []);

  const handleResortSaved = () => {
    setIsWizardOpen(false);
    setEditTarget(null);
    fetchResorts();
  };

  const confirmDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/admin/resorts/${id}`);
      if (res.data.success) {
        fetchResorts();
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error("Failed to delete resort", error);
      alert("Failed to delete resort. Check console for details.");
    }
  };

  const filteredResorts = resorts.filter((resort: any) => {
    const matchesCategory = activeCategory === "All" || resort.categories.some(
      (c: any) => c.category.name === activeCategory
    );
    const matchesSearch = resort.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (resort.location && resort.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full h-full p-8 font-sans bg-[#F9F9F9]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#030213] tracking-tight">
            Maldives Resorts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage luxury resorts and villas
          </p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add Resort
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center overflow-x-auto hide-scrollbar gap-2 px-2">
          {dynamicCategories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search resorts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:border-black transition-colors w-[220px]"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResorts.map((resort: any) => {
            const displayMedia = resort.media.find((m: any) => m.type === "card") || resort.media.find((m: any) => m.type === "hero") || resort.media.find((m: any) => m.type === "gallery") || resort.media[0];
            const imageUrl = displayMedia
              ? `${displayMedia.url}`
              : "https://via.placeholder.com/600x400?text=No+Image";

            const primaryCategory =
              resort.categories[0]?.category?.name || "UNCLASSIFIED";

            return (
              <div
                key={resort.id}
                className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col group relative"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={resort.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-semibold rounded-full tracking-wider uppercase">
                      {primaryCategory}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                    <span className="text-sm font-semibold">
                      ${resort.price || 0}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      {[...Array(resort.stars)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-orange-400 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                      {resort.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#030213] mb-1">
                    {resort.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {resort.location || "Unknown Location"}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button onClick={() => setEditTarget(resort)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteTarget(resort)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isWizardOpen && (
        <ResortWizard
          onClose={() => setIsWizardOpen(false)}
          onSave={handleResortSaved}
          initialData={editTarget}
        />
      )}

      {editTarget && (
        <ResortWizard
          onClose={() => setEditTarget(null)}
          onSave={handleResortSaved}
          initialData={editTarget}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030213]/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#030213] mb-2">Delete Resort?</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-semibold text-gray-800">"{deleteTarget.name}"</span>? All associated uploaded images will be removed from the server. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 w-full">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-5 py-3 bg-gray-50 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-100 transition border border-gray-200">
                Cancel
              </button>
              <button onClick={() => confirmDelete(deleteTarget.id)} className="flex-1 px-5 py-3 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition shadow-[0_4px_12px_rgba(239,68,68,0.25)]">
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
