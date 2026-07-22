"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Check, UploadCloud, Plus, Trash2 } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { useDropzone } from "react-dropzone";

const STEPS = [
  "BASIC",
  "RATINGS",
  "MEDIA",
  "VILLAS",
  "RESTAURANTS",
  "EXTRAS",
];

const tryParse = (val, fallback = []) => {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return [val];
  }
};

export default function ResortWizard({ onClose, onSave, initialData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data states
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        basic: {
          categories: initialData.categories?.map(c => c.categoryId) || [],
          name: initialData.name || "",
          description: initialData.description || "",
          location: initialData.location || "",
          transferMethod: initialData.transferMethod || "",
          duration: initialData.duration || "",
          price: initialData.price || "",
        },
        ratings: {
          stars: initialData.stars || 5,
        },
        media: {
          heroImage: initialData.media?.find(m => m.type === 'hero')?.url || null,
          cardImage: initialData.media?.find(m => m.type === 'card')?.url || null,
          gallery: initialData.media?.filter(m => m.type === 'gallery').map(m => m.url) || [],
        },
        villas: initialData.villas?.map(v => ({
          title: v.title,
          bedType: v.bedType,
          description: v.description,
          roomSize: v.roomSize,
          capacities: tryParse(v.capacities),
          features: tryParse(v.features),
          images: tryParse(v.images),
        })) || [],
        restaurants: initialData.restaurants?.map(r => ({
          name: r.name,
          description: r.description,
          image: r.image,
          timings: tryParse(r.timings),
        })) || [],
        extras: {
          facilities: initialData.facilities?.map(f => f.facilityName) || [],
        },
      };
    }

    return {
      basic: {
        categories: [],
        name: "",
        description: "",
        location: "",
        transferMethod: "",
        duration: "",
        price: "",
      },
      ratings: {
        stars: 5,
      },
      media: {
        heroImage: null,
        cardImage: null,
        gallery: [],
      },
      villas: [],
      restaurants: [],
      extras: {
        facilities: [],
      },
    };
  });

  useEffect(() => {
    // Fetch available categories
    axios.get("/api/admin/resorts/categories").then((res) => {
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    });
  }, []);

  const updateForm = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const canContinue = () => {
    if (currentStep === 0) {
      const b = formData.basic;
      return Boolean(b.name.trim() && b.description.trim() && b.location.trim() && b.transferMethod.trim() && b.duration && b.price);
    }
    if (currentStep === 1) {
      return Boolean(formData.ratings.stars > 0);
    }
    if (currentStep === 3) {
      if (formData.villas.length > 0) {
        return formData.villas.every((v: any) => v.title.trim() && v.description.trim() && v.bedType.trim() && v.roomSize && (v.capacities?.length > 0) && (v.features?.length > 0));
      }
    }
    return true;
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
      // 1. Upload Images
      const uploadPromises = [];
      const imageMap = { hero: null, card: null, gallery: [], villas: [], restaurants: [] };
      
      const uploadFile = async (file) => {
        if (!file || !(file instanceof File)) return file; // If it's already a URL or empty
        const fd = new FormData();
        fd.append("images", file);
        const res = await axios.post("/api/admin/upload?folder=resorts", fd);
        return res.data.urls[0];
      };

      const uploadMultiple = async (files) => {
        const validFiles = files.filter(f => f instanceof File);
        const existingUrls = files.filter(f => typeof f === 'string');
        
        if (validFiles.length === 0) return existingUrls;
        
        const fd = new FormData();
        validFiles.forEach(f => fd.append("images", f));
        const res = await axios.post("/api/admin/upload?folder=resorts", fd);
        
        return [...existingUrls, ...res.data.urls];
      };

      // Upload Media
      const heroUrl = await uploadFile(formData.media.heroImage);
      const cardUrl = await uploadFile(formData.media.cardImage);
      const galleryUrls = await uploadMultiple(formData.media.gallery);
      
      // Upload Villas Media
      const processedVillas = await Promise.all(
        formData.villas.map(async (villa) => {
          let uploadedImages = [];
          if (villa.images && villa.images.length > 0) {
            uploadedImages = await uploadMultiple(villa.images);
          }
          return {
            ...villa,
            images: uploadedImages
          };
        })
      );
      
      // Upload Restaurants Media
      const processedRestaurants = await Promise.all(
        formData.restaurants.map(async (rest) => {
          let uploadedImage = null;
          if (rest.image && rest.image instanceof File) {
            uploadedImage = await uploadFile(rest.image);
          }
          return {
            ...rest,
            image: uploadedImage
          };
        })
      );
      
      // Prepare Payload
      const payload = {
        ...formData,
        villas: processedVillas,
        restaurants: processedRestaurants,
        media: {
          heroImage: heroUrl,
          cardImage: cardUrl,
          gallery: galleryUrls,
        }
      };

      // Submit
      const endpoint = initialData 
        ? `/api/admin/resorts/${initialData.id}` 
        : "/api/admin/resorts";
      
      const method = initialData ? "put" : "post";
      
      const response = await axios[method](endpoint, payload);
      if (response.data.success) {
        onSave();
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to save resort package.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#030213]/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#030213]">Build Resort Package</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step}>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors ${
                  idx === currentStep
                    ? "bg-black text-white"
                    : idx < currentStep
                    ? "bg-green-50 text-green-700"
                    : "bg-transparent text-gray-400"
                }`}
              >
                {idx < currentStep && <Check size={14} />}
                {step}
              </div>
              {idx < STEPS.length - 1 && (
                <div className="w-8 h-px bg-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 hide-scrollbar">
          {currentStep === 0 && (
            <StepBasic
              data={formData.basic}
              update={(f, v) => updateForm("basic", f, v)}
              categories={categories}
            />
          )}
          {currentStep === 1 && (
            <StepRatings
              data={formData.ratings}
              update={(f, v) => updateForm("ratings", f, v)}
            />
          )}
          {currentStep === 2 && (
            <StepMedia
              data={formData.media}
              update={(f, v) => updateForm("media", f, v)}
            />
          )}
          {currentStep === 3 && (
            <StepVillas
              villas={formData.villas}
              setVillas={(v) => setFormData((p) => ({ ...p, villas: v }))}
            />
          )}
          {currentStep === 4 && (
            <StepRestaurants
              restaurants={formData.restaurants}
              setRestaurants={(r) => setFormData((p) => ({ ...p, restaurants: r }))}
            />
          )}
          {currentStep === 5 && (
            <StepExtras
              data={formData.extras}
              update={(f, v) => updateForm("extras", f, v)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-white">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-2.5 rounded-full font-medium text-gray-500 hover:text-black hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Back
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className="px-8 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !canContinue()}
              className="px-8 py-2.5 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition shadow-[0_4px_12px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving Package..." : "Publish Resort"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents for Steps
// ─────────────────────────────────────────────────────────────────────────────

function StepBasic({ data, update, categories }) {
  const [transferOptions, setTransferOptions] = useState([
    { value: "Seaplane (45 mins)", label: "Seaplane (45 mins)" },
    { value: "Speedboat (20 mins)", label: "Speedboat (20 mins)" },
    { value: "Domestic Flight + Speedboat", label: "Domestic Flight + Speedboat" },
  ]);

  const [isAddingTransfer, setIsAddingTransfer] = useState(false);
  const [newTransferInput, setNewTransferInput] = useState("");

  const confirmAddTransfer = () => {
    if (newTransferInput.trim()) {
      const val = newTransferInput.trim();
      if (!transferOptions.some(o => o.value === val)) {
        setTransferOptions(prev => [...prev, { value: val, label: val }]);
      }
      update("transferMethod", val);
    }
    setIsAddingTransfer(false);
    setNewTransferInput("");
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">Categories</label>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 border border-gray-200 rounded-full hover:border-black transition">
              <input
                type="checkbox"
                className="accent-black w-4 h-4"
                checked={data.categories.includes(cat.id)}
                onChange={(e) => {
                  if (e.target.checked) update("categories", [...data.categories, cat.id]);
                  else update("categories", data.categories.filter((c) => c !== cat.id));
                }}
              />
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Resort Title</label>
          <input
            type="text"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:ring-1 focus:ring-black transition"
            placeholder="e.g. Soneva Jani"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">About This Resort</label>
          <textarea
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:ring-1 focus:ring-black transition min-h-[120px]"
            placeholder="A short descriptive paragraph..."
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Location</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              placeholder="e.g. Baa Atoll, Maldives"
              value={data.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </div>
          <div>
              <label className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">
                Transfer Method
                {!isAddingTransfer && (
                  <button type="button" onClick={() => setIsAddingTransfer(true)} className="p-0.5 bg-gray-100 hover:bg-black hover:text-white rounded text-gray-400 transition-colors" title="Click to create new">
                    <Plus size={12} strokeWidth={3} />
                  </button>
                )}
              </label>
              {isAddingTransfer ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. Helicopter (30 mins)"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-[#030213] outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                    value={newTransferInput}
                    onChange={(e) => setNewTransferInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), confirmAddTransfer())}
                  />
                  <button type="button" onClick={confirmAddTransfer} className="px-3 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
                    Add
                  </button>
                  <button type="button" onClick={() => { setIsAddingTransfer(false); setNewTransferInput(""); }} className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition">
                    Cancel
                  </button>
                </div>
              ) : (
                <CreatableSelect
                  isClearable
                  options={transferOptions}
                  value={data.transferMethod ? { label: data.transferMethod, value: data.transferMethod } : null}
                  onChange={(selected) => update("transferMethod", selected ? selected.value : "")}
                  placeholder="Select or type to add new..."
                  formatCreateLabel={(val) => `+ Add "${val}"`}
                  className="text-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "0.75rem",
                      padding: "2px",
                      borderColor: "#E5E7EB",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#000" }
                    }),
                    singleValue: (base) => ({ ...base, color: "#030213" }),
                    input: (base) => ({ ...base, color: "#030213" }),
                    option: (base, state) => ({ ...base, color: state.isFocused ? "#fff" : "#030213", backgroundColor: state.isFocused ? "#030213" : "#fff" })
                  }}
                />
              )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Transfer Duration (mins)</label>
            <input
              type="number"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              placeholder="e.g. 45"
              value={data.duration}
              onChange={(e) => update("duration", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Starting Price ($)</label>
            <input
              type="number"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#030213] outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              placeholder="e.g. 4500"
              value={data.price}
              onChange={(e) => update("price", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepRatings({ data, update }) {
  return (
    <div className="max-w-xl mx-auto space-y-8 text-center pt-10">
      <h3 className="text-xl font-bold text-[#030213]">Resort Star Rating</h3>
      <p className="text-gray-500 text-sm">Select the official star rating for this resort.</p>
      
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => update("stars", star)}
            className={`p-4 rounded-full transition-transform ${
              star <= data.stars ? "text-orange-400 scale-110" : "text-gray-300 grayscale hover:grayscale-0"
            }`}
          >
            <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepMedia({ data, update }) {
  const onDropHero = (accepted) => update("heroImage", accepted[0]);
  const onDropGallery = (accepted) => {
    const newFiles = [...data.gallery, ...accepted].slice(0, 3);
    update("gallery", newFiles);
  };

  const removeHero = (e) => {
    e.stopPropagation();
    update("heroImage", null);
  };

  const removeGalleryImage = (e, index) => {
    e.stopPropagation();
    update("gallery", data.gallery.filter((_, i) => i !== index));
  };

  const DropzoneArea = ({ onDrop, label, file, multiple = false, maxFiles = 0, onRemoveSingle, onRemoveMulti }: { onDrop: any, label: any, file: any, multiple?: boolean, maxFiles?: number, onRemoveSingle?: any, onRemoveMulti?: any }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
      onDrop, 
      multiple,
      maxFiles: maxFiles > 0 ? maxFiles : undefined 
    });

    const renderPreview = () => {
      if (!file) return null;
      if (multiple && Array.isArray(file) && file.length > 0) {
        return (
          <div className="flex gap-3 mt-4 overflow-x-auto w-full px-4 justify-center">
            {file.map((f, i) => {
              const isString = typeof f === 'string';
              if (!(f instanceof File) && !isString) return null;
              const src = isString ? (f.startsWith('http') ? f : `${f}`) : URL.createObjectURL(f);
              return (
                <div key={i} className="relative flex-shrink-0 group">
                  <img src={src} className="h-24 w-36 object-cover rounded-lg border shadow-sm" />
                  <button type="button" onClick={(e) => onRemoveMulti(e, i)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md">
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        );
      } else if (!multiple && file) {
        const isString = typeof file === 'string';
        if (!(file instanceof File) && !isString) return null;
        const src = isString ? (file.startsWith('http') ? file : `${file}`) : URL.createObjectURL(file);
        return (
          <div className="relative inline-block mt-4 group">
            <img src={src} className="h-28 w-auto object-cover rounded-xl shadow-sm border" />
            <button type="button" onClick={onRemoveSingle} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md">
              <X size={14} />
            </button>
          </div>
        );
      }
      return null;
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase">{label}</label>
          {multiple && <span className="text-xs text-gray-400 font-medium tracking-wide">Max 3 images</span>}
        </div>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white ${
            isDragActive ? "border-black bg-gray-50" : "border-gray-200 hover:border-black"
          }`}
        >
          <input {...getInputProps()} />
          {!file || (multiple && file.length === 0) ? (
            <>
              <UploadCloud size={32} className="text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">
                {multiple ? "Drag & drop up to 3 files, or click to select" : "Drag & drop an image, or click to select"}
              </p>
            </>
          ) : (
            <>
              {file && !multiple && <p className="text-xs text-green-600 font-semibold">1 file selected</p>}
              {multiple && file.length > 0 && <p className="text-xs text-green-600 font-semibold">{file.length} file{file.length > 1 ? 's' : ''} selected</p>}
            </>
          )}
          
          <div onClick={e => e.stopPropagation()}>{renderPreview()}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <DropzoneArea onDrop={onDropHero} label="Hero Image (Wide Header)" file={data.heroImage} onRemoveSingle={removeHero} />
      <DropzoneArea onDrop={onDropGallery} label="Gallery Images" file={data.gallery} multiple maxFiles={3} onRemoveMulti={removeGalleryImage} />
    </div>
  );
}

function StepVillas({ villas, setVillas }) {
  const [bedOptions, setBedOptions] = useState([
    { value: "1 King Bed", label: "1 King Bed" },
    { value: "2 Twin Beds", label: "2 Twin Beds" },
  ]);
  const [addingBedTypeIdx, setAddingBedTypeIdx] = useState(null);
  const [newBedTypeInput, setNewBedTypeInput] = useState("");

  const addVilla = () => {
    setVillas([...villas, { title: "", bedType: "", description: "", roomSize: "", capacities: [], features: [], images: [] }]);
  };

  const updateVilla = (index, field, value) => {
    const updated = [...villas];
    updated[index][field] = value;
    setVillas(updated);
  };

  const removeVilla = (index) => {
    setVillas(villas.filter((_, i) => i !== index));
  };

  const confirmAddBedType = (idx) => {
    if (newBedTypeInput.trim()) {
      const val = newBedTypeInput.trim();
      if (!bedOptions.some(o => o.value === val)) {
        setBedOptions(prev => [...prev, { value: val, label: val }]);
      }
      updateVilla(idx, "bedType", val);
    }
    setAddingBedTypeIdx(null);
    setNewBedTypeInput("");
  };

  const handleDropImages = (idx, acceptedFiles) => {
    const existing = villas[idx].images || [];
    const newFiles = [...existing, ...acceptedFiles].slice(0, 5); // Max 5 images per villa
    updateVilla(idx, "images", newFiles);
  };

  const removeImage = (idx, imgIdx, e) => {
    e.stopPropagation();
    const existing = villas[idx].images || [];
    updateVilla(idx, "images", existing.filter((_, i) => i !== imgIdx));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#030213]">Resort Villas</h3>
          <p className="text-sm text-gray-500">Add all available villas and their specifications</p>
        </div>
        <button onClick={addVilla} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition">
          <Plus size={16} /> Add Villa
        </button>
      </div>

      {villas.map((villa, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 relative shadow-sm">
          <button onClick={() => removeVilla(idx)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <Trash2 size={16} />
          </button>
          
          <h4 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wide border-b border-gray-100 pb-2">Villa {idx + 1}</h4>
          
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Villa Title</label>
              <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#030213] outline-none focus:border-black transition" placeholder="e.g. Water Retreat" value={villa.title} onChange={(e) => updateVilla(idx, "title", e.target.value)} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">
                Bed Type
                {addingBedTypeIdx !== idx && (
                  <button type="button" onClick={() => { setAddingBedTypeIdx(idx); setNewBedTypeInput(""); }} className="p-0.5 bg-gray-100 hover:bg-black hover:text-white rounded text-gray-400 transition-colors" title="Click to create new">
                    <Plus size={12} strokeWidth={3} />
                  </button>
                )}
              </label>
              {addingBedTypeIdx === idx ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. 1 King + 2 Queens"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#030213] outline-none focus:border-black transition"
                    value={newBedTypeInput}
                    onChange={(e) => setNewBedTypeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), confirmAddBedType(idx))}
                  />
                  <button type="button" onClick={() => confirmAddBedType(idx)} className="px-3 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition">
                    Add
                  </button>
                  <button type="button" onClick={() => setAddingBedTypeIdx(null)} className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition">
                    Cancel
                  </button>
                </div>
              ) : (
                <CreatableSelect
                  isClearable
                  options={bedOptions}
                  value={villa.bedType ? {label: villa.bedType, value: villa.bedType} : null}
                  onChange={(s) => updateVilla(idx, "bedType", s ? s.value : "")}
                  placeholder="Select or type to add new..."
                  formatCreateLabel={(val) => `+ Add "${val}"`}
                  className="text-sm"
                  styles={{
                    control: (base) => ({ ...base, borderRadius: "0.75rem", padding: "2px", borderColor: "#E5E7EB", boxShadow: "none", "&:hover": { borderColor: "#000" } }),
                    singleValue: (base) => ({ ...base, color: "#030213" }),
                    input: (base) => ({ ...base, color: "#030213" }),
                    option: (base, state) => ({ ...base, color: state.isFocused ? "#fff" : "#030213", backgroundColor: state.isFocused ? "#030213" : "#fff" })
                  }}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Room Size</label>
              <div className="relative">
                <input type="number" min="0" className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-2.5 text-sm text-[#030213] outline-none focus:border-black transition" placeholder="e.g. 380" value={villa.roomSize} onChange={(e) => updateVilla(idx, "roomSize", e.target.value)} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">sqm</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Capacities</label>
              <CreatableSelect
                isMulti
                placeholder="Type and press enter..."
                value={(villa.capacities || []).map((c: any) => ({ label: c, value: c }))}
                onChange={(selected) => updateVilla(idx, "capacities", selected.map((s: any) => s.value))}
                styles={{
                  control: (base) => ({ ...base, borderRadius: "0.75rem", padding: "2px", borderColor: "#E5E7EB", boxShadow: "none", "&:hover": { borderColor: "#000" } }),
                }}
              />
            </div>
          </div>
          
          <div className="mb-5">
            <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Short Description</label>
            <textarea className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#030213] outline-none focus:border-black transition" placeholder="Details..." value={villa.description} onChange={(e) => updateVilla(idx, "description", e.target.value)} />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Features</label>
            <CreatableSelect
              isMulti
              placeholder="Type and press enter to add features..."
              value={(villa.features || []).map((f: any) => ({ label: f, value: f }))}
              onChange={(selected) => updateVilla(idx, "features", selected.map((s: any) => s.value))}
              styles={{
                control: (base) => ({ ...base, borderRadius: "0.75rem", padding: "2px", borderColor: "#E5E7EB", boxShadow: "none", "&:hover": { borderColor: "#000" } }),
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Villa Images (Max 5)</label>
            <VillaImageDropzone images={villa.images} onDrop={(accepted) => handleDropImages(idx, accepted)} onRemove={(e, imgIdx) => removeImage(idx, imgIdx, e)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function VillaImageDropzone({ images = [], onDrop, onRemove }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, maxFiles: 5 });
  
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 ${
        isDragActive ? "border-black bg-gray-100" : "border-gray-200 hover:border-black"
      }`}
    >
      <input {...getInputProps()} />
      {images.length === 0 ? (
        <>
          <UploadCloud size={24} className="text-gray-400 mb-2" />
          <p className="text-xs font-medium text-gray-500">Drag & drop villa images</p>
        </>
      ) : (
        <div className="flex gap-2 mt-2 flex-wrap justify-center w-full" onClick={e => e.stopPropagation()}>
          {images.map((f: any, i: number) => {
            const isString = typeof f === 'string';
            if (!(f instanceof File) && !isString) return null;
            const src = isString ? (f.startsWith('http') ? f : `${f}`) : URL.createObjectURL(f);
            return (
              <div key={i} className="relative group">
                <img src={src} className="h-16 w-24 object-cover rounded-md border shadow-sm" />
                <button type="button" onClick={(e) => onRemove(e, i)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md">
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StepRestaurants({ restaurants, setRestaurants }) {
  const addRestaurant = () => {
    setRestaurants([...restaurants, { name: "", description: "", image: null, timings: [] }]);
  };

  const updateRestaurant = (index, field, value) => {
    const updated = [...restaurants];
    updated[index][field] = value;
    setRestaurants(updated);
  };

  const removeRestaurant = (index) => {
    setRestaurants(restaurants.filter((_, i) => i !== index));
  };

  const addTiming = (idx) => {
    const existing = restaurants[idx].timings || [];
    updateRestaurant(idx, "timings", [...existing, { type: "Breakfast", startTime: "", endTime: "" }]);
  };

  const updateTiming = (restIdx, timingIdx, field, value) => {
    const existing = [...(restaurants[restIdx].timings || [])];
    existing[timingIdx][field] = value;
    updateRestaurant(restIdx, "timings", existing);
  };

  const removeTiming = (restIdx, timingIdx) => {
    const existing = restaurants[restIdx].timings || [];
    updateRestaurant(restIdx, "timings", existing.filter((_, i) => i !== timingIdx));
  };

  const handleDropImage = (idx, acceptedFiles) => {
    updateRestaurant(idx, "image", acceptedFiles[0]);
  };

  const removeImage = (idx, e) => {
    e.stopPropagation();
    updateRestaurant(idx, "image", null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#030213]">Restaurants & Dining</h3>
          <p className="text-sm text-gray-500">Add restaurants and their dining schedules</p>
        </div>
        <button onClick={addRestaurant} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition">
          <Plus size={16} /> Add Restaurant
        </button>
      </div>

      {restaurants.map((rest, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 relative shadow-sm">
          <button onClick={() => removeRestaurant(idx)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <Trash2 size={16} />
          </button>
          
          <h4 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wide border-b border-gray-100 pb-2">Restaurant {idx + 1}</h4>
          
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="col-span-3 space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Restaurant Name</label>
                <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#030213] outline-none focus:border-black transition" placeholder="e.g. The Crab Shack" value={rest.name} onChange={(e) => updateRestaurant(idx, "name", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Description</label>
                <textarea className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#030213] outline-none focus:border-black transition min-h-[90px]" placeholder="Cuisine details..." value={rest.description} onChange={(e) => updateRestaurant(idx, "description", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Image</label>
              <RestaurantImageDropzone image={rest.image} onDrop={(accepted) => handleDropImage(idx, accepted)} onRemove={(e) => removeImage(idx, e)} />
            </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-3">
               <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase">Dining Timings</label>
               <button onClick={() => addTiming(idx)} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                 <Plus size={12} strokeWidth={3} /> Add Timing
               </button>
             </div>
             {(!rest.timings || rest.timings.length === 0) ? (
               <p className="text-sm text-gray-400 italic bg-gray-50 p-5 rounded-xl text-center border border-dashed border-gray-200">No timings added. Click "Add Timing" to define schedules.</p>
             ) : (
               <div className="space-y-3">
                 {rest.timings.map((timing, tIdx) => (
                   <div key={tIdx} className="flex items-center gap-3 bg-gray-50 p-2 pl-3 rounded-xl border border-gray-100">
                     <select className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#030213] font-medium outline-none focus:border-black transition w-[130px]" value={timing.type} onChange={(e) => updateTiming(idx, tIdx, "type", e.target.value)}>
                       <option>Breakfast</option>
                       <option>Lunch</option>
                       <option>Dinner</option>
                       <option>All Day</option>
                       <option>Bar</option>
                     </select>
                     <div className="flex items-center gap-3 flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1 focus-within:border-black transition">
                       <input type="time" className="w-full text-sm text-[#030213] outline-none bg-transparent py-1.5" value={timing.startTime || ""} onChange={(e) => updateTiming(idx, tIdx, "startTime", e.target.value)} />
                       <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">to</span>
                       <input type="time" className="w-full text-sm text-[#030213] outline-none bg-transparent py-1.5" value={timing.endTime || ""} onChange={(e) => updateTiming(idx, tIdx, "endTime", e.target.value)} />
                     </div>
                     <button onClick={() => removeTiming(idx, tIdx)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                       <X size={16} />
                     </button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      ))}
    </div>
  );
}

function RestaurantImageDropzone({ image, onDrop, onRemove }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });
  
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl h-[175px] flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 ${
        isDragActive ? "border-black bg-gray-100" : "border-gray-200 hover:border-black"
      }`}
    >
      <input {...getInputProps()} />
      {!image ? (
        <>
          <UploadCloud size={28} className="text-gray-400 mb-3" />
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center px-4 leading-relaxed">Upload<br/>Image</p>
        </>
      ) : (
        <div className="relative w-full h-full p-2 group" onClick={e => e.stopPropagation()}>
          {image instanceof File ? (
            <img src={URL.createObjectURL(image)} className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-100" />
          ) : (
            <img src={image.startsWith('http') ? image : `${image}`} className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-100" />
          )}
          <button type="button" onClick={onRemove} className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

function StepExtras({ data, update }) {
  const [newFacility, setNewFacility] = useState("");

  const addFacility = () => {
    if (newFacility.trim() !== "") {
      const existing = data.facilities || [];
      if (!existing.includes(newFacility.trim())) {
        update("facilities", [...existing, newFacility.trim()]);
      }
      setNewFacility("");
    }
  };

  const removeFacility = (idx) => {
    const existing = data.facilities || [];
    update("facilities", existing.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h3 className="text-lg font-bold text-[#030213]">Extras & Facilities</h3>
      <p className="text-sm text-gray-500">Add common resort facilities</p>
      
      <div>
        <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">Facilities</label>
        
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#030213] outline-none focus:border-black transition" 
            placeholder="e.g. PADI Dive Centre, Overwater Spa..." 
            value={newFacility} 
            onChange={(e) => setNewFacility(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
          />
          <button 
            type="button" 
            onClick={addFacility} 
            className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition"
          >
            Add
          </button>
        </div>

        {data.facilities && data.facilities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.facilities.map((fac, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-100 text-[#030213] border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium">
                {fac}
                <button 
                  type="button" 
                  onClick={() => removeFacility(idx)} 
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic bg-gray-50 p-5 rounded-xl text-center border border-dashed border-gray-200">No facilities added yet.</p>
        )}
      </div>
    </div>
  );
}
