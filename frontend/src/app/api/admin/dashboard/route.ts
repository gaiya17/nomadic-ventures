import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch counts sequentially to avoid exhausting the database connection pool (max 15)
    const toursCount = await prisma.tour.count();
    const resortsCount = await prisma.resort.count();
    const experiencesCount = await prisma.experience.count();
    const adminsCount = await prisma.admin_users.count();
    
    const activeTours = await prisma.tour.count({ where: { status: "PUBLISHED" } });
    const activeResorts = await prisma.resort.count({ where: { status: "PUBLISHED" } });
    const activeExperiences = await prisma.experience.count({ where: { status: "PUBLISHED" } });

    const recentTours = await prisma.tour.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { name: true, createdAt: true, status: true }
    });
    
    const recentResorts = await prisma.resort.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { name: true, createdAt: true, status: true }
    });
    
    const recentExperiences = await prisma.experience.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { title: true, createdAt: true, status: true }
    });

    const recent = [
      ...recentTours.map(t => ({ name: t.name, type: "TOUR", date: t.createdAt, status: t.status })),
      ...recentResorts.map(r => ({ name: r.name, type: "RESORT", date: r.createdAt, status: r.status })),
      ...recentExperiences.map(e => ({ name: e.title, type: "EXPERIENCE", date: e.createdAt, status: e.status }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: {
        tours: { total: toursCount, active: activeTours },
        resorts: { total: resortsCount, active: activeResorts },
        experiences: { total: experiencesCount, active: activeExperiences },
        admins: { total: adminsCount }
      },
      recent
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard stats" }, { status: 500 });
  }
}
