import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET all admin users
export async function GET(req: NextRequest) {
  try {
    const users = await prisma.admin_users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        last_login: true,
      },
      orderBy: { created_at: "desc" },
    });
    
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}

// POST create new admin user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.admin_users.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already in use" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await prisma.admin_users.create({
      data: {
        name,
        email,
        password_hash,
        role: role || "admin",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      }
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
