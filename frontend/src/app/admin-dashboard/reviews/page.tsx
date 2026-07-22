"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Star, Check, X } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface Review {
  id: string;
  name: string;
  quote: string;
  trip: string | null;
  avatar: string | null;
  source: string;
  rating: number;
  isFeatured: boolean;
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReview, setCurrentReview] = useState<Partial<Review>>({
    name: "",
    quote: "",
    trip: "",
    avatar: "",
    source: "Google",
    rating: 5,
    isFeatured: false,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/admin/reviews");
      setReviews(res.data);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentReview.name || !currentReview.quote) {
      toast.error("Name and Quote are required");
      return;
    }

    try {
      if (currentReview.id) {
        await axios.put(`/api/admin/reviews/${currentReview.id}`, currentReview);
        toast.success("Review updated");
      } else {
        await axios.post("/api/admin/reviews", currentReview);
        toast.success("Review added");
      }
      fetchReviews();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`/api/admin/reviews/${id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading reviews...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#030213]">Reviews Management</h1>
          <p className="text-gray-500 mt-1">Manage traveler testimonials shown on the homepage.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setCurrentReview({
                name: "",
                quote: "",
                trip: "",
                avatar: "",
                source: "Google",
                rating: 5,
                isFeatured: false,
              });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#F4B942] text-black font-semibold rounded-lg hover:bg-[#dca63b] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">{currentReview.id ? "Edit Review" : "New Review"}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Traveler Name *</label>
              <input
                type="text"
                value={currentReview.name || ""}
                onChange={(e) => setCurrentReview({ ...currentReview, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Name</label>
              <input
                type="text"
                value={currentReview.trip || ""}
                onChange={(e) => setCurrentReview({ ...currentReview, trip: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                placeholder="e.g. Essence of Sri Lanka"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quote *</label>
              <textarea
                value={currentReview.quote || ""}
                onChange={(e) => setCurrentReview({ ...currentReview, quote: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942] h-28"
                placeholder="The actual review text..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Platform</label>
              <select
                value={currentReview.source || "Google"}
                onChange={(e) => setCurrentReview({ ...currentReview, source: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
              >
                <option value="Google">Google</option>
                <option value="TripAdvisor">TripAdvisor</option>
                <option value="Trustpilot">Trustpilot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                max="5"
                min="1"
                value={currentReview.rating || 5}
                onChange={(e) => setCurrentReview({ ...currentReview, rating: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Traveler Avatar</label>
              <div className="max-w-xs">
                <ImageUploader
                  folder="reviews"
                  label="Upload Avatar"
                  value={currentReview.avatar || ""}
                  onChange={(url) => setCurrentReview({ ...currentReview, avatar: url })}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentReview.isFeatured || false}
                  onChange={(e) => setCurrentReview({ ...currentReview, isFeatured: e.target.checked })}
                  className="w-5 h-5 text-[#F4B942] rounded border-gray-300 focus:ring-[#F4B942]"
                />
                <span className="text-sm font-medium text-gray-700">Set as Featured Review (Prominently displayed on left side)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#030213] text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save Review
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Traveler</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source & Rating</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {review.avatar ? (
                        <ImageWithFallback src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                          {review.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{review.name}</div>
                        <div className="text-xs text-gray-500">{review.trip || "No trip specified"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-700">{review.source}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#F4B942] text-[#F4B942]" />
                        <span className="text-xs text-gray-500">{review.rating}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {review.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3" /> Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                        <X className="w-3 h-3" /> Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentReview(review);
                          setIsEditing(true);
                        }}
                        className="p-2 text-gray-400 hover:text-[#030213] hover:bg-gray-100 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No reviews found. Click "Add Review" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
