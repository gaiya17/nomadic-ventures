"use client";
import { usePathname } from "next/navigation";
import { FloatingWidgets } from "./FloatingWidgets";

// Routes where the floating chatbot + WhatsApp should be hidden
const HIDDEN_ROUTES = ["/admin-dashboard"];

export function RouteAwareWidgets() {
  const pathname = usePathname();

  // Hide on admin routes (matches /admin-dashboard and any sub-pages)
  const isHidden = HIDDEN_ROUTES.some((route) => pathname?.startsWith(route));

  if (isHidden) return null;

  return <FloatingWidgets />;
}
