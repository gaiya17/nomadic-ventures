"use client";

import React, { useState } from "react";
import axios from "axios";
import { X, Check, UploadCloud, Plus, Trash2, GripVertical } from "lucide-react";
import { useDropzone } from "react-dropzone";

const STEPS = ["BASIC", "DETAILS", "CONTENT", "MEDIA"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function ExperienceWizard({ onClose, onSave, initialData }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => {
    let parsedHighlights: string[] = [];
    let parsedContentBlocks: any[] = [];
    let parsedGallery: string[] = [];

    if (initialData) {
      try {
        if (initialData.highlights) parsedHighlights = JSON.parse(initialData.highlights);
        if (initialData.contentBlocks) parsedContentBlocks = JSON.parse(initialData.contentBlocks);
        if (initialData.gallery) parsedGallery = JSON.parse(initialData.gallery);
      } catch (e) {}
    }

    return {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      locationPlace: initialData?.locationPlace || "",
      locationCountry: initialData?.locationCountry || "Sri Lanka",
      tagline: initialData?.tagline || "",
      bestTimeStart: initialData?.bestTimeStart || "January",
      bestTimeEnd: initialData?.bestTimeEnd || "April",
      highlights: parsedHighlights,
      contentBlocks: parsedContentBlocks,
      gallery: parsedGallery,
      status: initialData?.status || "DRAFT",
    };
  });

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleBasicChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !initialData) {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  // Highlights
  const addHighlight = () => setFormData((p: any) => ({ ...p, highlights: [...p.highlights, ""] }));
  const updateHighlight = (index: number, val: string) => {
    const newH = [...formData.highlights];
    newH[index] = val;
    setFormData((p: any) => ({ ...p, highlights: newH }));
  };
  const removeHighlight = (index: number) => {
    const newH = [...formData.highlights];
    newH.splice(index, 1);
    setFormData((p: any) => ({ ...p, highlights: newH }));
  };

  // Content Blocks
  const addBlock = (type: string) => {
    setFormData((p: any) => ({ ...p, contentBlocks: [...p.contentBlocks, { type, value: "" }] }));
  };
  const updateBlock = (index: number, val: string) => {
    const newB = [...formData.contentBlocks];
    newB[index].value = val;
    setFormData((p: any) => ({ ...p, contentBlocks: newB }));
  };
  const removeBlock = (index: number) => {
    const newB = [...formData.contentBlocks];
    newB.splice(index, 1);
    setFormData((p: any) => ({ ...p, contentBlocks: newB }));
  };

  // Media
  const handleUploadGallery = async (files: File[]) => {
    // In a real app you'd upload these. Here we'll simulate it by creating object URLs
    const urls = files.map(f => URL.createObjectURL(f));
    setFormData((p: any) => ({ ...p, gallery: [...p.gallery, ...urls].slice(0, 4) }));
  };
  const { getRootProps: galleryProps, getInputProps: galleryInput } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: handleUploadGallery,
  });

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        highlights: JSON.stringify(formData.highlights.filter((h: string) => h.trim() !== "")),
        contentBlocks: JSON.stringify(formData.contentBlocks.filter((b: any) => b.value.trim() !== "")),
        gallery: JSON.stringify(formData.gallery),
      };

      if (initialData?.id) {
        await axios.put(`/api/admin/experiences/${initialData.id}`, payload);
      } else {
        await axios.post(`/api/admin/experiences`, payload);
      }
      onSave();
    } catch (e) {
      console.error(e);
      alert("Error saving experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030213]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#030213]">
            {initialData ? "Edit Experience" : "Create New Experience"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex px-8 border-b border-gray-100">
          {STEPS.map((step, i) => (
            <button
              key={step}
              onClick={() => setCurrentStep(i)}
              className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${
                currentStep === i ? "border-[#C1A87D] text-[#C1A87D]" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {step}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          {currentStep === 0 && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Title</label>
                <input name="title" value={formData.title} onChange={handleBasicChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C1A87D] focus:ring-1 focus:ring-[#C1A87D] outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Slug</label>
                <input name="slug" value={formData.slug} onChange={handleBasicChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C1A87D] focus:ring-1 focus:ring-[#C1A87D] outline-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Place</label>
                  <input name="locationPlace" value={formData.locationPlace} onChange={handleBasicChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C1A87D] outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Country</label>
                  <select name="locationCountry" value={formData.locationCountry} onChange={handleBasicChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C1A87D] outline-none transition">
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Maldives">Maldives</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tagline</label>
                <input name="tagline" value={formData.tagline} onChange={handleBasicChange} placeholder="e.g. The Lion Rock — 5th-century fortress in the sky" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C1A87D] outline-none transition" />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-sm font-semibold text-[#030213] mb-4">Best Time to Visit</h3>
                <div className="flex items-center gap-4">
                  <select name="bestTimeStart" value={formData.bestTimeStart} onChange={handleBasicChange} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none">
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span className="text-gray-400">to</span>
                  <select name="bestTimeEnd" value={formData.bestTimeEnd} onChange={handleBasicChange} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none">
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#030213]">Highlights</h3>
                  <button onClick={addHighlight} className="text-xs font-semibold text-[#C1A87D] flex items-center gap-1"><Plus size={14}/> Add</button>
                </div>
                <div className="space-y-3">
                  {formData.highlights.map((h: string, i: number) => (
                    <div key={i} className="flex gap-2">
                      <input value={h} onChange={(e) => updateHighlight(i, e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none" />
                      <button onClick={() => removeHighlight(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={16}/></button>
                    </div>
                  ))}
                  {formData.highlights.length === 0 && <p className="text-sm text-gray-400">No highlights added yet.</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex gap-2 mb-6">
                <button onClick={() => addBlock("paragraph")} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#C1A87D]">Add Paragraph</button>
                <button onClick={() => addBlock("list")} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#C1A87D]">Add List Item</button>
                <button onClick={() => addBlock("quote")} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#C1A87D]">Add Quote</button>
                <button onClick={() => addBlock("tip")} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#C1A87D]">Add Pro-Tip</button>
              </div>

              <div className="space-y-4">
                {formData.contentBlocks.map((b: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group">
                    <div className="mt-2 text-gray-300"><GripVertical size={18}/></div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-[#C1A87D] uppercase tracking-wider mb-2">{b.type}</div>
                      <textarea 
                        value={b.value} 
                        onChange={(e) => updateBlock(i, e.target.value)} 
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm min-h-[100px] outline-none resize-y focus:border-[#C1A87D]"
                        placeholder={`Enter ${b.type} content...`}
                      />
                    </div>
                    <button onClick={() => removeBlock(i)} className="text-red-400 opacity-0 group-hover:opacity-100 transition p-2"><Trash2 size={16}/></button>
                  </div>
                ))}
                {formData.contentBlocks.length === 0 && <p className="text-sm text-gray-400">Add content blocks to build the experience description.</p>}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-[#030213] mb-4">Gallery Images (Exactly 4 recommended)</h3>
              
              <div {...galleryProps()} className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-[#C1A87D] transition bg-white">
                <input {...galleryInput()} />
                <UploadCloud className="mx-auto text-gray-400 mb-4" size={32} />
                <p className="text-sm text-[#030213] font-medium">Click or drag images to upload</p>
                <p className="text-xs text-gray-400 mt-2">Upload up to 4 high-quality photos</p>
              </div>

              {formData.gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {formData.gallery.map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => {
                          const newG = [...formData.gallery];
                          newG.splice(i, 1);
                          setFormData((p: any) => ({ ...p, gallery: newG }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t border-gray-100 flex justify-between bg-white">
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 text-sm font-semibold text-gray-600 disabled:opacity-50"
          >
            Back
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s + 1))}
              className="px-8 py-3 bg-[#030213] text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#C1A87D] text-white text-sm font-semibold rounded-full hover:bg-[#b09668] transition flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : "Save Experience"}
              {!isSubmitting && <Check size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
