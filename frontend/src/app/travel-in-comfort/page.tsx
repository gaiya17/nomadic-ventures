import { prisma } from "@/lib/prisma";
import { TravelClient } from "./TravelClient";

export default async function Page() {
  const settings = await prisma.siteSettings.findUnique({ where: { key: "travel_in_comfort_hero_image" } });
  
  return <TravelClient travelComfortHeroImage={settings?.value || undefined} />;
}
