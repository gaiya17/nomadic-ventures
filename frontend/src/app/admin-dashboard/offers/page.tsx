"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, BadgePercent, Percent, Package } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { getOfferStatus, getOfferBadgeLabel, computePackageSavings, type OfferStatus, type OfferLike } from "@/lib/offers";

interface Target {
  id: string;
  name: string;
  slug: string;
  price: string | null;
  media?: { url: string }[];
}

interface OfferRecord extends OfferLike {
  resort: Target | null;
  tour: Target | null;
}

interface FormState {
  id?: string;
  targetType: "resort" | "tour";
  targetId: string;
  type: "PERCENTAGE" | "FIXED_PACKAGE";
  title: string;
  discountPercent: string;
  packageNights: string;
  packagePrice: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  targetType: "resort",
  targetId: "",
  type: "PERCENTAGE",
  title: "",
  discountPercent: "",
  packageNights: "",
  packagePrice: "",
  validFrom: "",
  validUntil: "",
  isActive: true,
};

const STATUS_STYLES: Record<OfferStatus, { label: string; className: string }> = {
  live: { label: "Live now", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  scheduled: { label: "Scheduled", className: "bg-blue-50 text-blue-700 border-blue-200" },
  expired: { label: "Expired", className: "bg-gray-50 text-gray-500 border-gray-200" },
  disabled: { label: "Disabled", className: "bg-red-50 text-red-600 border-red-200" },
};

export default function OffersManager() {
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [resorts, setResorts] = useState<Target[]>([]);
  const [tours, setTours] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [offersRes, resortsRes, toursRes] = await Promise.all([
        axios.get("/api/admin/offers"),
        axios.get("/api/admin/resorts"),
        axios.get("/api/admin/tours"),
      ]);
      setOffers(offersRes.data.offers || []);
      setResorts(resortsRes.data.resorts || []);
      setTours(toursRes.data.tours || []);
    } catch (error) {
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const startNew = () => {
    setForm(EMPTY_FORM);
    setIsEditing(true);
  };

  const startEdit = (offer: OfferRecord) => {
    setForm({
      id: offer.id,
      targetType: offer.resort ? "resort" : "tour",
      targetId: offer.resort?.id || offer.tour?.id || "",
      type: offer.type,
      title: offer.title || "",
      discountPercent: offer.discountPercent?.toString() || "",
      packageNights: offer.packageNights?.toString() || "",
      packagePrice: offer.packagePrice?.toString() || "",
      validFrom: offer.validFrom ? String(offer.validFrom).slice(0, 10) : "",
      validUntil: offer.validUntil ? String(offer.validUntil).slice(0, 10) : "",
      isActive: offer.isActive,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!form.id && !form.targetId) {
      toast.error("Select a resort or tour");
      return;
    }
    if (form.type === "PERCENTAGE" && !form.discountPercent) {
      toast.error("Enter a discount percentage");
      return;
    }
    if (form.type === "FIXED_PACKAGE" && (!form.packageNights || !form.packagePrice)) {
      toast.error("Enter nights and package price");
      return;
    }

    const payload: any = {
      type: form.type,
      title: form.title || null,
      discountPercent: form.type === "PERCENTAGE" ? Number(form.discountPercent) : null,
      packageNights: form.type === "FIXED_PACKAGE" ? Number(form.packageNights) : null,
      packagePrice: form.type === "FIXED_PACKAGE" ? Number(form.packagePrice) : null,
      validFrom: form.validFrom || null,
      validUntil: form.validUntil || null,
      isActive: form.isActive,
    };

    try {
      if (form.id) {
        await axios.put(`/api/admin/offers/${form.id}`, payload);
        toast.success("Offer updated");
      } else {
        payload.resortId = form.targetType === "resort" ? form.targetId : null;
        payload.tourId = form.targetType === "tour" ? form.targetId : null;
        await axios.post("/api/admin/offers", payload);
        toast.success("Offer created");
      }
      fetchAll();
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to save offer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this offer? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/admin/offers/${id}`);
      toast.success("Offer deleted");
      fetchAll();
    } catch (error) {
      toast.error("Failed to delete offer");
    }
  };

  const selectedResort = form.targetType === "resort" ? resorts.find((r) => r.id === form.targetId) : null;
  const previewSavings =
    form.type === "FIXED_PACKAGE" && selectedResort
      ? computePackageSavings(selectedResort.price, {
          id: "preview",
          type: "FIXED_PACKAGE",
          packageNights: form.packageNights ? Number(form.packageNights) : null,
          packagePrice: form.packagePrice ? Number(form.packagePrice) : null,
          isActive: true,
          updatedAt: new Date().toISOString(),
        })
      : null;

  if (loading) {
    return <div className="text-gray-500">Loading offers...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#030213] flex items-center gap-2">
            <BadgePercent className="w-6 h-6 text-[#F4B942]" /> Offers Management
          </h1>
          <p className="text-gray-500 mt-1">
            Run percentage discounts on tours, and percentage or fixed-package deals on Maldives resorts.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={startNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#F4B942] text-black font-semibold rounded-lg hover:bg-[#dca63b] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Offer
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">{form.id ? "Edit Offer" : "New Offer"}</h2>

          <div className="space-y-6">
            {/* Target selection — only editable when creating */}
            {!form.id ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applies To *</label>
                <div className="flex gap-2 mb-3">
                  {(["resort", "tour"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          targetType: t,
                          targetId: "",
                          type: t === "tour" ? "PERCENTAGE" : form.type,
                        })
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.targetType === t
                          ? "bg-[#030213] text-white border-[#030213]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {t === "resort" ? "Maldives Resort" : "Sri Lanka Tour"}
                    </button>
                  ))}
                </div>
                <select
                  value={form.targetId}
                  onChange={(e) => setForm({ ...form, targetId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                >
                  <option value="">Select a {form.targetType === "resort" ? "resort" : "tour"}...</option>
                  {(form.targetType === "resort" ? resorts : tours).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applies To</label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
                  {form.targetType === "resort" ? "Maldives Resort" : "Sri Lanka Tour"} —{" "}
                  {(form.targetType === "resort" ? resorts : tours).find((t) => t.id === form.targetId)?.name || "—"}
                </div>
              </div>
            )}

            {/* Offer type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type *</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "PERCENTAGE" })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.type === "PERCENTAGE"
                      ? "bg-[#030213] text-white border-[#030213]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Percent className="w-4 h-4" /> Percentage Off
                </button>
                {form.targetType === "resort" && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "FIXED_PACKAGE" })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.type === "FIXED_PACKAGE"
                        ? "bg-[#030213] text-white border-[#030213]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Package className="w-4 h-4" /> Fixed Package (e.g. 11 Nights $4,300)
                  </button>
                )}
              </div>
              {form.targetType === "tour" && (
                <p className="text-xs text-gray-400 mt-2">Tour offers are percentage-based only.</p>
              )}
            </div>

            {/* Type-specific fields */}
            {form.type === "PERCENTAGE" ? (
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage *</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={form.discountPercent}
                    onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                    placeholder="e.g. 20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nights *</label>
                    <input
                      type="number"
                      min={1}
                      value={form.packageNights}
                      onChange={(e) => setForm({ ...form, packageNights: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                      placeholder="e.g. 11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Package Price ($) *</label>
                    <input
                      type="number"
                      min={1}
                      value={form.packagePrice}
                      onChange={(e) => setForm({ ...form, packagePrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                      placeholder="e.g. 4300"
                    />
                  </div>
                </div>
                {selectedResort && form.packageNights && form.packagePrice && (
                  previewSavings ? (
                    <p className="text-xs text-emerald-600 mt-2">
                      At this resort's current ${selectedResort.price}/night rate, {form.packageNights} nights would normally cost $
                      {previewSavings.regularTotal.toLocaleString()} — this package saves ${previewSavings.savings.toLocaleString()}.
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600 mt-2">
                      This package price isn't cheaper than the resort's current per-night rate × nights — double check the numbers.
                    </p>
                  )
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline (optional)</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                placeholder="e.g. Monsoon Escape (shown on the detail page, not the small badge)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valid From (optional)</label>
                <input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until (optional)</label>
                <input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-5 h-5 text-[#F4B942] rounded border-gray-300 focus:ring-[#F4B942]"
              />
              <span className="text-sm font-medium text-gray-700">Active (uncheck to pause without deleting)</span>
            </label>
          </div>

          <div className="flex items-center gap-4 border-t border-gray-100 pt-6 mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#030213] text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save Offer
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valid Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {offers.map((offer) => {
                const target = offer.resort || offer.tour;
                const status = getOfferStatus(offer);
                const statusStyle = STATUS_STYLES[status];
                const thumb = target?.media?.[0]?.url;
                return (
                  <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {thumb ? (
                          <ImageWithFallback src={thumb} alt={target?.name || ""} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                            {target?.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{target?.name || "Deleted item"}</div>
                          <div className="text-xs text-gray-500">{offer.resort ? "Maldives Resort" : "Sri Lanka Tour"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {getOfferBadgeLabel(offer)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.className}`}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {offer.validFrom ? String(offer.validFrom).slice(0, 10) : "Any time"}
                      {" → "}
                      {offer.validUntil ? String(offer.validUntil).slice(0, 10) : "No end date"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(offer)}
                          className="p-2 text-gray-400 hover:text-[#030213] hover:bg-gray-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {offers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No offers yet. Click "Add Offer" to create one.
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
