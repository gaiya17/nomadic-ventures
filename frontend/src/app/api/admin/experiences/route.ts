import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/experiences
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

// POST /api/admin/experiences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const experience = await prisma.experience.create({
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
        status: body.status || "DRAFT",
      },
    });
    return NextResponse.json(experience);
  } catch (error: any) {
    console.error("Error creating experience:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
