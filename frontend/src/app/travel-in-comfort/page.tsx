import { prisma } from "@/lib/prisma";
import { TravelClient } from "./TravelClient";

export default async function Page() {
  const settings = await prisma.siteSettings.findMany({
    where: { key: { in: ["travel_in_comfort_hero_image", "travel_in_comfort_fleet_images"] } }
  });
  
  const heroImage = settings.find(s => s.key === "travel_in_comfort_hero_image")?.value || undefined;
  
  let fleetImages: string[] | undefined = undefined;
  try {
    const fleetImagesStr = settings.find(s => s.key === "travel_in_comfort_fleet_images")?.value;
    if (fleetImagesStr) {
      fleetImages = JSON.parse(fleetImagesStr);
    }
  } catch (e) {
    console.error("Failed to parse fleet images", e);
  }

  return <TravelClient travelComfortHeroImage={heroImage} fleetImages={fleetImages} />;
}
