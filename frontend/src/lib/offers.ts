export type OfferType = "PERCENTAGE" | "FIXED_PACKAGE";

export interface OfferLike {
  id: string;
  type: OfferType;
  title?: string | null;
  discountPercent?: number | null;
  packageNights?: number | null;
  packagePrice?: number | null;
  validFrom?: string | Date | null;
  validUntil?: string | Date | null;
  isActive: boolean;
  updatedAt: string | Date;
}

export type OfferStatus = "live" | "scheduled" | "expired" | "disabled";

/**
 * Picks which offer (if any) should be shown publicly right now, out of a
 * resort/tour's full offer history. When multiple offers are simultaneously
 * live, the one expiring soonest wins (most recently updated breaks ties).
 */
export function resolveLiveOffer<T extends OfferLike>(offers: T[] | null | undefined): T | null {
  if (!offers || offers.length === 0) return null;
  const now = Date.now();

  const live = offers.filter((o) => {
    if (!o.isActive) return false;
    if (o.validFrom && new Date(o.validFrom).getTime() > now) return false;
    if (o.validUntil && new Date(o.validUntil).getTime() < now) return false;
    return true;
  });

  if (live.length === 0) return null;

  return [...live].sort((a, b) => {
    const aEnd = a.validUntil ? new Date(a.validUntil).getTime() : Infinity;
    const bEnd = b.validUntil ? new Date(b.validUntil).getTime() : Infinity;
    if (aEnd !== bEnd) return aEnd - bEnd;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  })[0];
}

/** Status shown in the admin Offers table — combines the manual isActive switch with the date window. */
export function getOfferStatus(offer: OfferLike): OfferStatus {
  if (!offer.isActive) return "disabled";
  const now = Date.now();
  if (offer.validFrom && new Date(offer.validFrom).getTime() > now) return "scheduled";
  if (offer.validUntil && new Date(offer.validUntil).getTime() < now) return "expired";
  return "live";
}

/** Short auto-generated badge text, e.g. "20% OFF" or "11N · $4,300" — never derived from free-typed title. */
export function getOfferBadgeLabel(offer: OfferLike): string {
  if (offer.type === "PERCENTAGE") {
    return `${offer.discountPercent}% OFF`;
  }
  const price = offer.packagePrice ?? 0;
  return `${offer.packageNights}N · $${price.toLocaleString()}`;
}

function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(num) ? num : null;
}

/** Discounted price for a PERCENTAGE offer applied to a resort/tour's base "from" price. */
export function computeDiscountedPrice(
  basePrice: string | number | null | undefined,
  offer: OfferLike | null | undefined
): number | null {
  if (!offer || offer.type !== "PERCENTAGE" || !offer.discountPercent) return null;
  const base = toNumber(basePrice);
  if (base === null) return null;
  return Math.round(base * (1 - offer.discountPercent / 100));
}

/** "You save $X" comparison for a FIXED_PACKAGE offer against the resort's per-night rate. Null if not computable or not actually cheaper. */
export function computePackageSavings(
  nightlyPrice: string | number | null | undefined,
  offer: OfferLike | null | undefined
): { regularTotal: number; savings: number } | null {
  if (!offer || offer.type !== "FIXED_PACKAGE" || !offer.packageNights || !offer.packagePrice) return null;
  const nightly = toNumber(nightlyPrice);
  if (nightly === null) return null;
  const regularTotal = nightly * offer.packageNights;
  const savings = regularTotal - offer.packagePrice;
  if (savings <= 0) return null;
  return { regularTotal, savings };
}
