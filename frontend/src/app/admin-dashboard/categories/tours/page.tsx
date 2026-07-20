"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, ArrowLeft, Loader2, UploadCloud, X, Edit2 } from "lucide-react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { toast, Toaster } from "sonner";

export default function TourCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    destinations: string[];
    image: File | null;
    previewUrl: string | null;
  }>({
    name: "",
    description: "",
    destinations: ["", "", ""],
    image: null,
    previewUrl: null
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/tours/categories");
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

  const onDrop = (accepted: File[]) => {
    const file = accepted[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  const handleEdit = (cat: any) => {
    let dests = ["", "", ""];
    if (cat.destinations) {
      const parts = cat.destinations.split(",").map((s: string) => s.trim());
      for (let i = 0; i < 3 && i < parts.length; i++) {
        dests[i] = parts[i];
      }
    }
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      destinations: dests,
      image: null,
      previewUrl: cat.image ? `${cat.image}` : null
    });
    setEditingCategoryId(cat.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await axios.delete(`/api/admin/tours/categories/${deletingId}`);
      fetchCategories();
      toast.success("Category deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Upload Image
      let imageUrl = editingCategoryId ? categories.find((c: any) => c.id === editingCategoryId)?.image : null;
      if (formData.image) {
        const fd = new FormData();
        fd.append("images", formData.image);
        const upRes = await axios.post("/api/admin/upload?folder=categories", fd);
        imageUrl = upRes.data.urls[0];
      }

      // 2. Save Category
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const joinedDestinations = formData.destinations.map((d: string) => d.trim()).filter((d: string) => d).join(", ");
      const payload = {
        name: formData.name,
        slug,
        description: formData.description,
        destinations: joinedDestinations,
        image: imageUrl
      };
      
      let res;
      if (editingCategoryId) {
        res = await axios.put(`/api/admin/tours/categories/${editingCategoryId}`, payload);
      } else {
        res = await axios.post("/api/admin/tours/categories", payload);
      }

      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({ name: "", description: "", destinations: ["", "", ""], image: null, previewUrl: null });
        setEditingCategoryId(null);
        fetchCategories();
        toast.success(editingCategoryId ? "Category updated successfully!" : "Category created successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category");
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
              Tour Categories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage tour categories
            </p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setFormData({ name: "", description: "", destinations: ["", "", ""], image: null, previewUrl: null });
            setEditingCategoryId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm"
        >
          <Plus size={16} />
          Create Category
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat: any) => (
            <div key={cat.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="h-48 bg-gray-100 relative group">
                {cat.image ? (
                  <img src={`${cat.image}`} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium">No Image</div>
                )}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(cat)} className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-full shadow-sm transition">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-600 hover:bg-white rounded-full shadow-sm transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#030213] mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{cat.description || "No description provided."}</p>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Destinations</div>
                <div className="text-sm text-gray-800">{cat.destinations || "None defined"}</div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-3xl border border-gray-100">
              No categories found. Create one to get started.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030213]/40 backdrop-blur-sm overflow-y-auto pt-24 pb-12">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-auto">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h2 className="text-lg font-bold text-[#030213]">
                {editingCategoryId ? "Edit Tour Category" : "Create Tour Category"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Category Image</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white ${
                    isDragActive ? "border-black bg-gray-50" : "border-gray-200 hover:border-black"
                  } ${formData.previewUrl ? 'h-48 overflow-hidden relative p-0 border-solid' : 'py-8'}`}
                >
                  <input {...getInputProps()} />
                  {formData.previewUrl ? (
                    <>
                      <img src={formData.previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                        <p className="text-white text-sm font-medium">Click or drag to replace image</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={32} className="text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-[#030213]">
                        Drag & drop an image, or click to select
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Category Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Wildlife Safari"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:bg-white transition"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Short Description</label>
                <textarea
                  required
                  placeholder="A brief overview..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:bg-white transition min-h-[80px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Top Destinations (Max 3)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={20}
                      placeholder={`Destination ${i + 1}`}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:bg-white transition"
                      value={formData.destinations[i]}
                      onChange={(e) => {
                        const newDests = [...formData.destinations];
                        newDests[i] = e.target.value;
                        setFormData({...formData, destinations: newDests});
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
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
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#030213]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#030213] mb-2">Delete Category?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. Are you sure you want to permanently delete this category?</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-3 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
