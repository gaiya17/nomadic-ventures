import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/admin/experiences/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        locationPlace: body.locationPlace,
        locationCountry: body.locationCountry,
        tagline: body.tagline,
        bestTimeStart: body.bestTimeStart,
        bestTimeEnd: body.bestTimeEnd,
        highlights: body.highlights,
        contentBlocks: body.contentBlocks,
        gallery: body.gallery,
        status: body.status,
      },
    });
    
    return NextResponse.json(experience);
  } catch (error: any) {
    console.error("Error updating experience:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

// DELETE /api/admin/experiences/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.experience.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting experience:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
