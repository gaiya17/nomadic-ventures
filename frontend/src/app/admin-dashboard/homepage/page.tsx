"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UploadCloud, Image as ImageIcon, Save, Check, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { PageLoader } from "@/components/PageLoader";

function ImageUploader({
  label,
  value,
  onChange,
  folder = "general",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (files: File[]) => {
    if (!files.length) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("images", files[0]);
      const res = await axios.post(`/api/admin/upload?folder=${folder}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success && res.data.urls?.length) {
        onChange(res.data.urls[0]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop,
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-[#030213] mb-4">{label}</h3>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden mb-4 border border-gray-100">
          <img src={value} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => onChange("")}
              className="px-4 py-2 bg-white text-red-500 text-xs font-semibold rounded-lg shadow-xl"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed border-gray-200 rounded-xl p-8 text-center transition bg-gray-50/50 ${
            isUploading ? "opacity-50 cursor-wait" : "cursor-pointer hover:border-[#C1A87D]"
          }`}
        >
          <input {...getInputProps()} disabled={isUploading} />
          {isUploading ? (
            <Loader2 className="mx-auto text-gray-400 mb-2 animate-spin" size={28} />
          ) : (
            <UploadCloud className="mx-auto text-gray-400 mb-2" size={28} />
          )}
          <p className="text-xs text-[#030213] font-medium">
            {isUploading ? "Uploading..." : "Click or drag image to upload"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function HomepageManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("homepage");

  // Settings State
  const [homepageHero, setHomepageHero] = useState("");
  const [transportHero, setTransportHero] = useState("");
  
  const [maldivesHero, setMaldivesHero] = useState("");

  const [travelComfortHero, setTravelComfortHero] = useState("");
  const [travelFleetImages, setTravelFleetImages] = useState(["", "", "", ""]);

  const [whyNomadic, setWhyNomadic] = useState(["", "", ""]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/admin/settings");
      const config = res.data;
      
      if (config.homepage_hero_image) setHomepageHero(config.homepage_hero_image);
      if (config.transport_hero_image) setTransportHero(config.transport_hero_image);
      if (config.maldives_hero_image) {
        setMaldivesHero(config.maldives_hero_image);
      }
      if (config.travel_in_comfort_hero_image) setTravelComfortHero(config.travel_in_comfort_hero_image);
      if (config.travel_in_comfort_fleet_images) setTravelFleetImages(JSON.parse(config.travel_in_comfort_fleet_images));
      if (config.why_nomadic_images) setWhyNomadic(JSON.parse(config.why_nomadic_images));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        homepage_hero_image: homepageHero,
        transport_hero_image: transportHero,
        maldives_hero_image: maldivesHero,
        travel_in_comfort_hero_image: travelComfortHero,
        travel_in_comfort_fleet_images: JSON.stringify(travelFleetImages),
        why_nomadic_images: JSON.stringify(whyNomadic),
      };
      await axios.put("/api/admin/settings", payload);
      toast.success("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  const tabs = [
    { id: "homepage", label: "Homepage" },
    { id: "maldives", label: "Maldives" },
    { id: "travel", label: "Travel in Comfort" },
    { id: "why", label: "Why Nomadic" },
  ];

  return (
    <div className="p-8 pb-32">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#030213] mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              Homepage Manager
            </h1>
            <p className="text-gray-500 text-sm">
              Manage the hero images and visual content across your main landing pages.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#030213] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-[#F4B942] text-black shadow-md"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "homepage" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#030213]">Homepage Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader 
                label="Main Hero Background" 
                value={homepageHero} 
                onChange={setHomepageHero} 
                folder="homepage" 
              />
              <ImageUploader 
                label="Transport Section Image" 
                value={transportHero} 
                onChange={setTransportHero} 
                folder="homepage" 
              />
            </div>
          </div>
        )}

        {activeTab === "maldives" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#030213]">Maldives Page Hero Image</h2>
            <div className="max-w-xl">
              <ImageUploader 
                label="Main Hero Background" 
                value={maldivesHero} 
                onChange={setMaldivesHero} 
                folder="maldives" 
              />
            </div>
          </div>
        )}

        {activeTab === "travel" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#030213]">Travel in Comfort Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ImageUploader 
                label="Main Hero Background" 
                value={travelComfortHero} 
                onChange={setTravelComfortHero} 
                folder="travel" 
              />
            </div>

            <h2 className="text-lg font-bold text-[#030213] pt-4 border-t border-gray-100">Luxury Fleet Display Images</h2>
            <p className="text-sm text-gray-500 mb-4">Manage the 4 vehicle images displayed in the Premium Selection section.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Luxury Van (Vito)", idx: 0 },
                { label: "Luxury Sedan", idx: 1 },
                { label: "Premium SUV", idx: 2 },
                { label: "Luxury MPV", idx: 3 },
              ].map((item) => (
                <ImageUploader 
                  key={item.idx}
                  label={item.label} 
                  value={travelFleetImages[item.idx]} 
                  onChange={(url) => {
                    const n = [...travelFleetImages];
                    n[item.idx] = url;
                    setTravelFleetImages(n);
                  }} 
                  folder="travel" 
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "why" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#030213]">Why Nomadic Philosophy Images</h2>
            <p className="text-sm text-gray-500 mb-4">These images appear in the 3 alternating content blocks.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUploader 
                label="Chapter 1: Every Traveler is Different" 
                value={whyNomadic[0]} 
                onChange={(url) => {
                  const n = [...whyNomadic];
                  n[0] = url;
                  setWhyNomadic(n);
                }} 
                folder="why" 
              />
              <ImageUploader 
                label="Chapter 2: Global Perspective" 
                value={whyNomadic[1]} 
                onChange={(url) => {
                  const n = [...whyNomadic];
                  n[1] = url;
                  setWhyNomadic(n);
                }} 
                folder="why" 
              />
              <ImageUploader 
                label="Chapter 3: Travel With Confidence" 
                value={whyNomadic[2]} 
                onChange={(url) => {
                  const n = [...whyNomadic];
                  n[2] = url;
                  setWhyNomadic(n);
                }} 
                folder="why" 
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
