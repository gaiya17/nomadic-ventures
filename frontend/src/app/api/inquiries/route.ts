import { NextResponse } from "next/server";
import { z } from "zod";
import { sendInquiryEmail } from "@/lib/mailer";
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit";

const namePattern = /^[A-Za-z\s'-]+$/;
const mobilePattern = /^[0-9+\s-]{7,}$/;

const inquirySchema = z.object({
  source: z.enum(["resort", "tour", "plan-trip"]),
  packageName: z.string().min(1).max(200),
  firstName: z.string().min(1).max(100).regex(namePattern),
  lastName: z.string().min(1).max(100).regex(namePattern),
  email: z.string().email().max(200),
  country: z.string().min(1).max(100),
  mobileNo: z.string().min(7).max(30).regex(mobilePattern),
  adults: z.string().min(1).max(10),
  children: z.string().min(1).max(10),
  infants: z.string().min(1).max(10),
  travelDate: z.string().min(1).max(30),
  noOfNights: z.string().min(1).max(10),
  villaType: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
  destination: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  const identifier = `inquiry:${getClientIdentifier(request)}`;
  const { allowed, retryAfterSeconds } = checkRateLimit(identifier);
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: `Too many requests. Please try again in ${retryAfterSeconds} seconds.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid inquiry data" }, { status: 400 });
  }

  try {
    await sendInquiryEmail(parsed.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send inquiry email:", err);
    return NextResponse.json({ success: false, error: "Failed to send inquiry" }, { status: 500 });
  }
}
