"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Check, UploadCloud, Plus, Trash2, Edit2 } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { useDropzone } from "react-dropzone";

const STEPS = ["BASIC", "MEDIA", "ITINERARY", "INCLUSIONS"];

const DEFAULT_INCLUDES = [
  "Accommodation with breakfast",
  "Private air-conditioned transport",
  "English speaking chauffeur guide",
  "Airport transfers",
  "All government taxes"
];

const DEFAULT_EXCLUDES = [
  "International flights",
  "Visa fees",
  "Travel insurance",
  "Early check-in / late check-out",
  "Personal expenses"
];

export default function TourWizard({ onClose, onSave, initialData }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  const [newIncludeText, setNewIncludeText] = useState("");
  const [isAddingInclude, setIsAddingInclude] = useState(false);
  const [newExcludeText, setNewExcludeText] = useState("");
  const [isAddingExclude, setIsAddingExclude] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      let parsedIncludes = DEFAULT_INCLUDES;
      let parsedExcludes = DEFAULT_EXCLUDES;
      let parsedExperiences: string[] = [];

      try {
        if (initialData.includes) parsedIncludes = JSON.parse(initialData.includes);
        if (initialData.excludes) parsedExcludes = JSON.parse(initialData.excludes);
        if (initialData.experiences) parsedExperiences = JSON.parse(initialData.experiences);
      } catch (e) {}

      return {
        basic: {
          categories: initialData.categories?.map((c: any) => c.categoryId) || [],
          name: initialData.name || "",
          description: initialData.description || "",
          guests: initialData.guests || "",
          days: initialData.days || "",
          destinations: initialData.destinations || "",
          price: initialData.price || "",
        },
        experiences: parsedExperiences,
        media: {
          heroImage: initialData.media?.find((m: any) => m.type === 'hero')?.url || null,
          gallery: initialData.media?.filter((m: any) => m.type === 'gallery').map((m: any) => m.url) || [],
        },
        itineraries: initialData.itineraries?.map((it: any) => ({
          title: it.title,
          description: it.description,
        })) || [],
        includesExcludes: {
          includes: parsedIncludes,
          excludes: parsedExcludes,
        }
      };
    }

    return {
      basic: {
        categories: [],
        name: "",
        description: "",
        guests: "",
        days: "",
        destinations: "",
        price: "",
      },
      experiences: [],
      media: {
        heroImage: null,
        gallery: [],
      },
      itineraries: [],
      includesExcludes: {
        includes: [...DEFAULT_INCLUDES],
        excludes: [...DEFAULT_EXCLUDES],
      }
    };
  });

  useEffect(() => {
    axios.get("/api/admin/tours/categories").then((res) => {
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    });
  }, []);

  const updateForm = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const uploadFile = async (file: any) => {
        if (!file || !(file instanceof File)) return file;
        const fd = new FormData();
        fd.append("images", file);
        const res = await axios.post("/api/admin/upload?folder=tours", fd);
        return res.data.urls[0];
      };

      const uploadMultiple = async (files: any[]) => {
        const validFiles = files.filter(f => f instanceof File);
        const existingUrls = files.filter(f => typeof f === 'string');
        
        if (validFiles.length === 0) return existingUrls;
        
        const fd = new FormData();
        validFiles.forEach(f => fd.append("images", f));
        const res = await axios.post("/api/admin/upload?folder=tours", fd);
        
        return [...existingUrls, ...res.data.urls];
      };

      const heroUrl = await uploadFile(formData.media.heroImage);
      const galleryUrls = await uploadMultiple(formData.media.gallery);
      
      const payload = {
        ...formData,
        media: {
          heroImage: heroUrl,
          gallery: galleryUrls,
        }
      };

      if (initialData?.id) {
        await axios.put(`/api/admin/tours/${initialData.id}`, payload);
      } else {
        await axios.post("/api/admin/tours", payload);
      }

      onSave();
    } catch (error) {
      console.error("Failed to save tour", error);
      alert("Failed to save tour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBasic = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                const current = formData.basic.categories;
                const next = current.includes(cat.id)
                  ? current.filter((id: string) => id !== cat.id)
                  : [...current, cat.id];
                updateForm("basic", "categories", next);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                formData.basic.categories.includes(cat.id)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Tour Title</label>
        <input
          type="text"
          value={formData.basic.name}
          onChange={(e) => updateForm("basic", "name", e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-colors text-gray-900"
          placeholder="e.g. Classic Sri Lanka Explorer"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Short Description</label>
        <textarea
          value={formData.basic.description}
          onChange={(e) => updateForm("basic", "description", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none transition-colors resize-none text-gray-900"
          placeholder="A beautiful journey across the island..."
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Guests</label>
          <input
            type="text"
            value={formData.basic.guests}
            onChange={(e) => updateForm("basic", "guests", e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none text-gray-900"
            placeholder="e.g. 1-8 guests"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Days / Nights</label>
          <input
            type="text"
            value={formData.basic.days}
            onChange={(e) => updateForm("basic", "days", e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none text-gray-900"
            placeholder="e.g. 14 Days"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Destinations</label>
          <CreatableSelect
            isMulti
            value={formData.basic.destinations ? formData.basic.destinations.split(',').map((d: string) => d.trim()).filter(Boolean).map((d: string) => ({ label: d, value: d })) : []}
            onChange={(newValue: any) => {
              updateForm("basic", "destinations", newValue.map((v: any) => v.value).join(', '));
            }}
            placeholder="Type and press enter..."
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#F9FAFB',
                borderColor: '#E5E7EB',
                borderRadius: '0.75rem',
                padding: '0.25rem',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#000'
                }
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#E5E7EB',
                borderRadius: '0.5rem',
              }),
              input: (base) => ({
                ...base,
                color: '#111827'
              })
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Experiences (Highlights Strip)</label>
          <CreatableSelect
            isMulti
            value={formData.experiences ? formData.experiences.map((d: string) => ({ label: d, value: d })) : []}
            onChange={(newValue: any) => {
              setFormData((prev: any) => ({ ...prev, experiences: newValue.map((v: any) => v.value) }));
            }}
            placeholder="Type experience and press enter..."
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#F9FAFB',
                borderColor: '#E5E7EB',
                borderRadius: '0.75rem',
                padding: '0.25rem',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#000'
                }
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#E5E7EB',
                borderRadius: '0.5rem',
              }),
              input: (base) => ({
                ...base,
                color: '#111827'
              })
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Price (Optional)</label>
          <input
            type="text"
            value={formData.basic.price}
            onChange={(e) => updateForm("basic", "price", e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none text-gray-900"
            placeholder="e.g. 2500"
          />
        </div>
      </div>
    </div>
  );

  const FileUploader = ({ label, value, onChange, multiple = false }: any) => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: { 'image/*': [] },
      multiple,
      onDrop: (acceptedFiles) => {
        if (multiple) {
          onChange([...(value || []), ...acceptedFiles]);
        } else {
          onChange(acceptedFiles[0]);
        }
      }
    });

    const removeFile = (index: number) => {
      if (multiple) {
        onChange(value.filter((_: any, i: number) => i !== index));
      } else {
        onChange(null);
      }
    };

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-black transition-colors bg-gray-50">
          <input {...getInputProps()} />
          <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">Drag & drop images here, or click to select</p>
        </div>

        {/* Previews */}
        <div className="mt-4 flex flex-wrap gap-4">
          {multiple && value?.map((file: any, i: number) => (
            <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <img src={typeof file === 'string' ? `${file}` : URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
              <button onClick={() => removeFile(i)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {!multiple && value && (
            <div className="relative group w-32 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <img src={typeof value === 'string' ? `${value}` : URL.createObjectURL(value)} alt="preview" className="w-full h-full object-cover" />
              <button onClick={() => removeFile(0)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMedia = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FileUploader
        label="Hero Image (Main Cover)"
        value={formData.media.heroImage}
        onChange={(v: any) => updateForm("media", "heroImage", v)}
      />
      <FileUploader
        label="Gallery Images (3 recommended)"
        value={formData.media.gallery}
        onChange={(v: any) => updateForm("media", "gallery", v)}
        multiple
      />
    </div>
  );

  const renderItinerary = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-gray-900">Day by Day Itinerary</label>
        <button
          onClick={() => setFormData({
            ...formData,
            itineraries: [...formData.itineraries, { title: "", description: "" }]
          })}
          className="flex items-center gap-2 text-sm font-medium text-black bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          <Plus size={16} /> Add Day
        </button>
      </div>

      {formData.itineraries.length === 0 && (
        <div className="text-center py-10 bg-gray-50 border border-gray-200 border-dashed rounded-2xl text-gray-500">
          No itinerary days added yet. Click "Add Day" to start.
        </div>
      )}

      {formData.itineraries.map((it: any, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative group">
          <button
            onClick={() => {
              const newItineraries = formData.itineraries.filter((_: any, i: number) => i !== index);
              setFormData({ ...formData, itineraries: newItineraries });
            }}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={16} />
          </button>
          
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Day {index + 1}</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={it.title}
                onChange={(e) => {
                  const newIt = [...formData.itineraries];
                  newIt[index].title = e.target.value;
                  setFormData({ ...formData, itineraries: newIt });
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none text-sm text-gray-900"
                placeholder="e.g. Arrival in Colombo"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                value={it.description}
                onChange={(e) => {
                  const newIt = [...formData.itineraries];
                  newIt[index].description = e.target.value;
                  setFormData({ ...formData, itineraries: newIt });
                }}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-black outline-none text-sm resize-none text-gray-900"
                placeholder="Details for this day..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderInclusions = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-green-900 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" /> What's Included
            </h4>
            <button
              onClick={() => setIsAddingInclude(true)}
              className="p-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              <Plus size={14} />
            </button>
          </div>
          <ul className="space-y-2">
            {formData.includesExcludes.includes.map((inc: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-800 bg-white p-2 rounded-lg border border-green-50 group">
                <span className="flex-1">{inc}</span>
                <button
                  onClick={() => {
                    const newArr = formData.includesExcludes.includes.filter((_: any, idx: number) => idx !== i);
                    updateForm("includesExcludes", "includes", newArr);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
            {isAddingInclude && (
              <li className="flex items-center gap-2 bg-white p-2 rounded-lg border border-green-200">
                <input
                  autoFocus
                  type="text"
                  value={newIncludeText}
                  onChange={(e) => setNewIncludeText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newIncludeText.trim()) {
                      updateForm("includesExcludes", "includes", [...formData.includesExcludes.includes, newIncludeText.trim()]);
                      setNewIncludeText("");
                      setIsAddingInclude(false);
                    } else if (e.key === 'Escape') {
                      setIsAddingInclude(false);
                      setNewIncludeText("");
                    }
                  }}
                  className="flex-1 text-sm outline-none text-green-900 bg-transparent placeholder-green-300"
                  placeholder="Type and press Enter..."
                />
                <button onClick={() => {
                    if (newIncludeText.trim()) {
                      updateForm("includesExcludes", "includes", [...formData.includesExcludes.includes, newIncludeText.trim()]);
                    }
                    setNewIncludeText("");
                    setIsAddingInclude(false);
                  }} className="text-green-600 hover:text-green-800"><Check size={16} /></button>
                <button onClick={() => { setIsAddingInclude(false); setNewIncludeText(""); }} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
              </li>
            )}
          </ul>
        </div>

        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-red-900 flex items-center gap-2">
              <X className="w-4 h-4 text-red-600" /> What's Not Included
            </h4>
            <button
              onClick={() => setIsAddingExclude(true)}
              className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              <Plus size={14} />
            </button>
          </div>
          <ul className="space-y-2">
            {formData.includesExcludes.excludes.map((exc: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-800 bg-white p-2 rounded-lg border border-red-50 group">
                <span className="flex-1">{exc}</span>
                <button
                  onClick={() => {
                    const newArr = formData.includesExcludes.excludes.filter((_: any, idx: number) => idx !== i);
                    updateForm("includesExcludes", "excludes", newArr);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
            {isAddingExclude && (
              <li className="flex items-center gap-2 bg-white p-2 rounded-lg border border-red-200">
                <input
                  autoFocus
                  type="text"
                  value={newExcludeText}
                  onChange={(e) => setNewExcludeText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newExcludeText.trim()) {
                      updateForm("includesExcludes", "excludes", [...formData.includesExcludes.excludes, newExcludeText.trim()]);
                      setNewExcludeText("");
                      setIsAddingExclude(false);
                    } else if (e.key === 'Escape') {
                      setIsAddingExclude(false);
                      setNewExcludeText("");
                    }
                  }}
                  className="flex-1 text-sm outline-none text-red-900 bg-transparent placeholder-red-300"
                  placeholder="Type and press Enter..."
                />
                <button onClick={() => {
                    if (newExcludeText.trim()) {
                      updateForm("includesExcludes", "excludes", [...formData.includesExcludes.excludes, newExcludeText.trim()]);
                    }
                    setNewExcludeText("");
                    setIsAddingExclude(false);
                  }} className="text-red-600 hover:text-red-800"><Check size={16} /></button>
                <button onClick={() => { setIsAddingExclude(false); setNewExcludeText(""); }} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white w-full max-w-5xl mx-auto rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#030213]">
              {initialData ? "Edit Tour" : "Create New Tour"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50/50 border-r border-gray-100 p-8 hidden md:block">
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-200 -z-10" />
              {STEPS.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                return (
                  <div key={step} className="flex items-center gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                      isActive ? "bg-black text-white shadow-md scale-110" :
                      isCompleted ? "bg-green-500 text-white" : "bg-white border-2 border-gray-200 text-gray-400"
                    }`}>
                      {isCompleted ? <Check size={14} /> : (idx + 1)}
                    </div>
                    <span className={`text-sm font-medium tracking-wide ${isActive ? "text-black" : "text-gray-400"}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
            <div className="max-w-2xl mx-auto">
              {currentStep === 0 && renderBasic()}
              {currentStep === 1 && renderMedia()}
              {currentStep === 2 && renderItinerary()}
              {currentStep === 3 && renderInclusions()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50 transition-all"
          >
            Back
          </button>
          
          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-full text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-70 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : "Publish Tour"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-2.5 rounded-full text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
