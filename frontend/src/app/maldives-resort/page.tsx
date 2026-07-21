import { prisma } from "@/lib/prisma";
import { MaldivesClient } from "./MaldivesClient";

export default async function Page() {
  const settings = await prisma.siteSettings.findUnique({ where: { key: "maldives_hero_image" } });
  
  return <MaldivesClient maldivesHeroImage={settings?.value || undefined} />;
}
