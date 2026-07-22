"use client";
import { useEffect, useState } from "react";
import { getFooterCategories } from "@/actions/categories";
import { FooterClient } from "./FooterClient";

export function Footer() {
  const [data, setData] = useState<{
    tourCategories: { id?: string; name: string; slug: string }[];
    resortCategories: { id?: string; name: string; slug: string }[];
  }>({ tourCategories: [], resortCategories: [] });

  useEffect(() => {
    getFooterCategories().then(setData);
  }, []);

  return (
    <FooterClient 
      tourCategories={data.tourCategories} 
      resortCategories={data.resortCategories} 
    />
  );
}
