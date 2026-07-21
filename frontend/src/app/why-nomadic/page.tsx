import { prisma } from "@/lib/prisma";
import { WhyNomadicClient } from "./WhyNomadicClient";

export default async function Page() {
  const settings = await prisma.siteSettings.findUnique({ where: { key: "why_nomadic_images" } });
  
  let whyNomadicImages = undefined;
  if (settings?.value) {
    try {
      whyNomadicImages = JSON.parse(settings.value);
    } catch (e) {}
  }

  return <WhyNomadicClient whyNomadicImages={whyNomadicImages} />;
}
