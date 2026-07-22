"use server";
import { prisma } from "@/lib/prisma";

export async function getFooterCategories() {
  try {
    const tourCategories = await prisma.tourCategory.findMany({ 
      select: { id: true, name: true, slug: true }, 
      orderBy: { createdAt: "asc" }
    });
    const resortCategories = await prisma.resortCategory.findMany({ 
      select: { id: true, name: true, slug: true }, 
      orderBy: { createdAt: "asc" }
    });
    return { tourCategories, resortCategories };
  } catch (error) {
    console.error("Failed to fetch footer categories:", error);
    return { tourCategories: [], resortCategories: [] };
  }
}
