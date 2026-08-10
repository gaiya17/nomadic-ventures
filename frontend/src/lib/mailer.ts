import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD environment variables are not set");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

export interface InquiryEmailData {
  source: "resort" | "tour" | "plan-trip";
  packageName: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  mobileNo: string;
  adults: string;
  children: string;
  infants: string;
  travelDate: string;
  noOfNights: string;
  villaType?: string;
  location?: string;
  destination?: string;
  description?: string;
}

const SOURCE_LABEL: Record<InquiryEmailData["source"], string> = {
  resort: "Maldives Resort Inquiry",
  tour: "Sri Lanka Tour Inquiry",
  "plan-trip": "Plan My Trip Inquiry",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 16px;color:#6b7280;font-size:13px;border-bottom:1px solid #eee;white-space:nowrap;">${escapeHtml(label)}</td>
      <td style="padding:10px 16px;color:#111827;font-size:14px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td>
    </tr>`;
}

function buildHtml(data: InquiryEmailData) {
  const guestParts = [`${data.adults} Adult${data.adults === "1" ? "" : "s"}`];
  if (data.children && data.children !== "0") guestParts.push(`${data.children} Child${data.children === "1" ? "" : "ren"}`);
  if (data.infants && data.infants !== "0") guestParts.push(`${data.infants} Infant${data.infants === "1" ? "" : "s"}`);

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:32px 16px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#07120E;padding:24px 28px;">
        <div style="color:#F4B942;font-size:11px;letter-spacing:0.2em;">NOMADIC VENTURES</div>
        <div style="color:#ffffff;font-size:20px;margin-top:6px;">${escapeHtml(SOURCE_LABEL[data.source])}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", `${data.firstName} ${data.lastName}`)}
        ${row("Email", data.email)}
        ${row("Mobile", data.mobileNo)}
        ${row("Country", data.country)}
        ${row("Guests", guestParts.join(", "))}
        ${row("Package / Resort / Tour", data.packageName)}
        ${row("Villa Type", data.villaType)}
        ${row("Location", data.location)}
        ${row("Destination", data.destination)}
        ${row("Travel Date", data.travelDate)}
        ${row("No. of Nights", data.noOfNights)}
      </table>
      ${
        data.description
          ? `<div style="padding:16px 28px;">
              <div style="color:#6b7280;font-size:12px;margin-bottom:6px;">NOTES FROM CLIENT</div>
              <div style="color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.description)}</div>
            </div>`
          : ""
      }
      <div style="padding:16px 28px 24px;border-top:1px solid #eee;color:#9ca3af;font-size:12px;">
        Reply directly to this email to respond to ${data.firstName}.
      </div>
    </div>
  </div>`;
}

export async function sendInquiryEmail(data: InquiryEmailData) {
  const to = process.env.INQUIRY_TO_EMAIL || "nirmalgayantha55@gmail.com";
  const transport = getTransporter();

  await transport.sendMail({
    from: `"Nomadic Ventures Website" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: data.email,
    subject: `${SOURCE_LABEL[data.source]} — ${data.firstName} ${data.lastName}`,
    html: buildHtml(data),
  });
}
