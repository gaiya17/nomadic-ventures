"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit, ArrowLeft, Loader2, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "sonner";

export default function ResortCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    whatDefines: [""]
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/resorts/categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", whatDefines: [""] });
    setIsModalOpen(true);
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      whatDefines: cat.whatDefines ? cat.whatDefines.split(",").map((d: string) => d.trim()) : [""]
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await axios.delete(`/api/admin/resorts/categories/${deleteConfirmId}`);
      if (res.data.success) {
        toast.success("Collection deleted successfully!");
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete collection");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const joinedDefines = formData.whatDefines.filter(d => d.trim() !== "").join(", ");
      const payload = { ...formData, slug, whatDefines: joinedDefines };
      
      let res;
      if (editingId) {
        res = await axios.put(`/api/admin/resorts/categories/${editingId}`, payload);
      } else {
        res = await axios.post("/api/admin/resorts/categories", payload);
      }

      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({ name: "", description: "", whatDefines: [""] });
        setEditingId(null);
        fetchCategories();
        toast.success(`Collection ${editingId ? "updated" : "created"} successfully!`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${editingId ? "update" : "create"} collection`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full p-8 font-sans bg-[#F9F9F9]">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard/categories" className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-[#030213] tracking-tight">
              Maldives Collections
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage resort categories and their definitions
            </p>
          </div>
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm"
        >
          <Plus size={16} />
          Create Collection
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Collection Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition group">
                  <td className="px-6 py-5">
                    <div className="font-semibold text-[#030213]">{cat.name}</div>
                    <div className="text-xs text-gray-400 mt-1">/{cat.slug}</div>
                  </td>
                  <td className="px-6 py-5 w-1/2">
                    <p className="text-sm text-gray-600 line-clamp-2 break-words max-w-xl">{cat.description || "No description provided."}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(cat)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => confirmDelete(cat.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No categories found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030213]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#030213] mb-2">Delete Collection?</h3>
            <p className="text-sm text-gray-500 mb-8">
              Are you sure you want to delete this collection? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030213]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#030213]">{editingId ? "Edit Collection" : "Create Collection"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Category Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Honeymoon & Romantic"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:bg-white transition"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Short Description</label>
                  <textarea
                    required
                    placeholder="A brief overview of this collection..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:bg-white transition min-h-[80px]"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">What Defines The Collection</label>
                  <div className="space-y-3">
                    {formData.whatDefines.map((def, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          required
                          type="text"
                          placeholder="e.g. Private Pools"
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:bg-white transition"
                          value={def}
                          onChange={(e) => {
                            const newDefs = [...formData.whatDefines];
                            newDefs[i] = e.target.value;
                            setFormData({...formData, whatDefines: newDefs});
                          }}
                        />
                        {formData.whatDefines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newDefs = formData.whatDefines.filter((_, index) => index !== i);
                              setFormData({...formData, whatDefines: newDefs});
                            }}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, whatDefines: [...formData.whatDefines, ""]})}
                      className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-gray-600 transition mt-2"
                    >
                      <Plus size={16} />
                      Add Definition
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editingId ? "Save Changes" : "Create Collection")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


