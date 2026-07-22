"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UploadCloud, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

export function ImageUploader({
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
