"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Filter, Edit2, Trash2, Map } from "lucide-react";
import TourWizard from "@/components/admin/TourWizard";

export default function ToursManager() {
  const [tours, setTours] = useState<any[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Filter state
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  const fetchTours = async () => {
    try {
      const res = await axios.get("/api/admin/tours");
      if (res.data.success) {
        setTours(res.data.tours);
      }
    } catch (error) {
      console.error("Failed to fetch tours", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/tours/categories");
      if (res.data.success) {
        setCategories(["All", ...res.data.categories.map((c: any) => c.name)]);
      }
    } catch (error) {
      console.error("Failed to fetch tour categories", error);
    }
  };

  useEffect(() => {
    fetchTours();
    fetchCategories();
  }, []);

  const handleTourSaved = () => {
    setIsWizardOpen(false);
    setEditTarget(null);
    fetchTours();
  };

  const confirmDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/admin/tours/${id}`);
      if (res.data.success) {
        fetchTours();
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error("Failed to delete tour", error);
      alert("Failed to delete tour. Check console for details.");
    }
  };

  const filteredTours = tours.filter((tour: any) => {
    if (activeCategory === "All") return true;
    return tour.categories.some(
      (c: any) => c.category.name === activeCategory
    );
  });

  return (
    <div className="w-full h-full p-8 font-sans bg-[#F9F9F9]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#030213] tracking-tight">
            Tours
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage journeys and experiences
          </p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add Tour
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center overflow-x-auto hide-scrollbar gap-2 px-2">
          {categories.map((cat) => (
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
              placeholder="Search tours..."
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
          {filteredTours.map((tour: any) => {
            const displayMedia = tour.media.find((m: any) => m.type === "card") || tour.media.find((m: any) => m.type === "hero") || tour.media.find((m: any) => m.type === "gallery") || tour.media[0];
            const imageUrl = displayMedia
              ? `${displayMedia.url}`
              : "https://via.placeholder.com/600x400?text=No+Image";

            const primaryCategory =
              tour.categories[0]?.category?.name || "UNCLASSIFIED";

            return (
              <div
                key={tour.id}
                className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col group relative"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-semibold rounded-full tracking-wider uppercase">
                      {primaryCategory}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                      {tour.status}
                    </span>
                    <span className="text-sm font-semibold">
                      {tour.price ? `$${tour.price}` : 'On Request'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#030213] mb-1">
                    {tour.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
                    <Map size={14} />
                    {tour.destinations || "Multiple Destinations"}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditTarget(tour);
                          setIsWizardOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(tour)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isWizardOpen && (
        <TourWizard
          onClose={() => {
            setIsWizardOpen(false);
            setEditTarget(null);
          }}
          onSave={handleTourSaved}
          initialData={editTarget}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Tour?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-black">{deleteTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteTarget.id)}
                className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
