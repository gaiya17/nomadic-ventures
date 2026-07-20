"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Edit2, Trash2, MapPin } from "lucide-react";
import ExperienceWizard from "@/components/admin/ExperienceWizard";

export default function ExperiencesManager() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const [search, setSearch] = useState("");

  const fetchExperiences = async () => {
    try {
      const res = await axios.get("/api/admin/experiences");
      setExperiences(res.data);
    } catch (error) {
      console.error("Failed to fetch experiences", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSaved = () => {
    setIsWizardOpen(false);
    setEditTarget(null);
    fetchExperiences();
  };

  const confirmDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/experiences/${id}`);
      fetchExperiences();
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete experience", error);
      alert("Failed to delete experience.");
    }
  };

  const filteredExperiences = experiences.filter((exp: any) =>
    exp.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full p-8 font-sans bg-[#F9F9F9]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#030213] tracking-tight">
            Experiences
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your unique experiences and destinations
          </p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      <div className="flex items-center mb-6 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 w-full max-w-md">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search experiences..."
            className="bg-transparent border-none outline-none text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C1A87D]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Best Time</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredExperiences.map((exp: any) => (
                <tr key={exp.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {(() => {
                        let imgUrl = "";
                        try {
                          const g = JSON.parse(exp.gallery);
                          if (g && g.length > 0) imgUrl = g[0];
                        } catch(e) {}
                        return imgUrl ? (
                          <img src={imgUrl} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <MapPin size={16} />
                          </div>
                        );
                      })()}
                      <div>
                        <p className="font-semibold text-[#030213] text-sm">{exp.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{exp.tagline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{exp.locationPlace} • {exp.locationCountry}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {exp.bestTimeStart} - {exp.bestTimeEnd}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditTarget(exp);
                          setIsWizardOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-[#C1A87D] hover:bg-[#C1A87D]/10 rounded-xl transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(exp)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExperiences.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No experiences found. Create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isWizardOpen && (
        <ExperienceWizard
          initialData={editTarget}
          onClose={() => {
            setIsWizardOpen(false);
            setEditTarget(null);
          }}
          onSave={handleSaved}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#030213]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#030213] mb-2">Delete Experience</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{deleteTarget.title}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteTarget.id)}
                className="flex-1 py-3 text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
